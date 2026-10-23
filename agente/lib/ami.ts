import Anthropic, { toFile } from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Sesion } from "./estado";
import { ejecutarHerramienta, herramientas } from "./herramientas";

const client = new Anthropic();
const MODELO = "claude-opus-5-5";
const MAX_VUELTAS_HERRAMIENTAS = 8;
const MAX_TURNOS_POR_SESION = 120;

// El system prompt no cambia entre turnos para que el caché de prompts funcione.
const SYSTEM = [
  readFileSync(path.join(process.cwd(), "prompts", "ami.md"), "utf8"),
  readFileSync(path.join(process.cwd(), "prompts", "acompanamiento.md"), "utf8"),
  "# La pauta de Antonia\n\n" + readFileSync(path.join(process.cwd(), "data", "pauta-ejemplo.md"), "utf8"),
].join("\n\n---\n\n");

export type Entrada = { texto?: string; imagen?: { datos: Buffer; tipo: string } };

export async function subirImagen(datos: Buffer, tipo: string): Promise<string> {
  const archivo = await client.files.upload({ file: await toFile(datos, "refri.jpg", { type: tipo }) });
  return archivo.id;
}

async function aContenido(entrada: Entrada): Promise<Anthropic.Beta.BetaContentBlockParam[]> {
  const bloques: Anthropic.Beta.BetaContentBlockParam[] = [];
  if (entrada.imagen) {
    // La foto se sube una vez a la Files API y el historial guarda solo su id.
    const fileId = await subirImagen(entrada.imagen.datos, entrada.imagen.tipo);
    bloques.push({ type: "image", source: { type: "file", file_id: fileId } });
  }
  bloques.push({ type: "text", text: entrada.texto?.trim() || "(Antonia mandó una foto sin texto)" });
  return bloques;
}

export const EVENTOS_RELOJ = {
  jueves:
    "[RELOJ DE LA DEMO] Ahora es jueves, 17:00. Antonia va saliendo de la universidad. Escríbele tú primero para preguntarle si sale este finde.",
  sabado:
    "[RELOJ DE LA DEMO] Ahora es sábado, a la hora en que Antonia dijo que despertaría. Escríbele tú primero según el plan guardado.",
  domingo:
    "[RELOJ DE LA DEMO] Ahora es domingo, 20:00. Escríbele algo corto y normal sobre mañana, sin puntajes ni balances del finde.",
} as const;

export type MomentoReloj = keyof typeof EVENTOS_RELOJ;

/**
 * Corre un turno de Ami: agrega lo que llegó al historial, deja que use herramientas
 * y devuelve los mensajes de texto que hay que mandarle a Antonia.
 */
export async function turnoDeAmi(sesion: Sesion, entrada: Entrada): Promise<string[]> {
  if (sesion.turnos >= MAX_TURNOS_POR_SESION) {
    return ["Por hoy llegamos al límite de mensajes de la demo 🙈. Escríbeme más rato y seguimos."];
  }
  sesion.turnos += 1;
  sesion.historial.push({ role: "user", content: await aContenido(entrada) });

  const textos: string[] = [];
  for (let vuelta = 0; vuelta < MAX_VUELTAS_HERRAMIENTAS; vuelta++) {
    const respuesta = await client.beta.messages.create({
      model: MODELO,
      max_tokens: 16000,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      tools: herramientas,
      messages: sesion.historial,
      output_config: { effort: "medium" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });

    if (respuesta.stop_reason === "refusal") {
      // No se agrega al historial: el turno se cerró sin respuesta utilizable.
      textos.push("Uy, eso no lo puedo responder bien yo 🙏. Si es algo de salud, tu nutricionista o Salud Responde (600 360 7777) te pueden ayudar.");
      sesion.historial.push({ role: "assistant", content: [{ type: "text", text: textos[textos.length - 1] }] });
      break;
    }

    // Se guarda el contenido completo (incluido thinking) y nunca se edita después.
    sesion.historial.push({ role: "assistant", content: respuesta.content });

    for (const bloque of respuesta.content) {
      if (bloque.type === "text" && bloque.text.trim()) textos.push(bloque.text.trim());
    }

    if (respuesta.stop_reason === "pause_turn") continue;
    if (respuesta.stop_reason !== "tool_use") break;

    const usos = respuesta.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
    const resultados: Anthropic.Beta.BetaToolResultBlockParam[] = await Promise.all(
      usos.map(async (uso) => {
        try {
          return { type: "tool_result" as const, tool_use_id: uso.id, content: await ejecutarHerramienta(uso.name, uso.input, sesion) };
        } catch (error) {
          return { type: "tool_result" as const, tool_use_id: uso.id, content: String(error), is_error: true };
        }
      }),
    );
    sesion.historial.push({ role: "user", content: resultados });
  }

  return textos;
}
