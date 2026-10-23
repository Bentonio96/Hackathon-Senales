import Anthropic, { toFile } from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Sesion } from "./estado";
import { ejecutarHerramienta, herramientas } from "./herramientas";
import { clasificacionPorFrase, clasificar, frasesNivel2, mensajesFijos, violaFiltro } from "./seguridad";

const client = new Anthropic();
// Haiku 5.5 para probar barato; en el deploy del pitch se pone AMI_MODELO=claude-opus-5-5.
const MODELO = process.env.AMI_MODELO || "claude-haiku-5-5";
// El clasificador de alertas corre en cada mensaje: por defecto el modelo barato.
const MODELO_CLASIFICADOR = process.env.AMI_MODELO_CLASIFICADOR || "claude-haiku-5-5";
// El respaldo automático por rechazo existe en Opus, no en Haiku.
const CON_RESPALDO = MODELO.startsWith("claude-opus");
const ANTOJOS_SEMANA = process.env.AMI_ANTOJOS_SEMANA || "dos";
const MAX_VUELTAS_HERRAMIENTAS = 8;
const MAX_TURNOS_POR_SESION = 120;
const SEPARADOR_BURBUJAS = /^\s*---\s*$/m;

// El system prompt no cambia entre turnos para que el caché de prompts funcione.
const SYSTEM = [
  readFileSync(path.join(process.cwd(), "prompts", "acompanamiento.md"), "utf8"),
  readFileSync(path.join(process.cwd(), "prompts", "ami.md"), "utf8").replaceAll("{{ANTOJOS_SEMANA}}", ANTOJOS_SEMANA),
  "# La pauta de Antonia\n\n" + readFileSync(path.join(process.cwd(), "data", "pauta-ejemplo.md"), "utf8"),
].join("\n\n---\n\n");

export type Entrada = { texto?: string; imagen?: { datos: Buffer; tipo: string }; esReloj?: boolean };

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
  domingo: "[RELOJ DE LA DEMO] Ahora es domingo en la mañana. Escríbele tú primero para preguntarle cómo amaneció.",
} as const;

export type MomentoReloj = keyof typeof EVENTOS_RELOJ;

/** Agrega al historial un intercambio cuyo lado de Amy es fijo (no lo generó el modelo). */
function registrarFijo(sesion: Sesion, contenido: Anthropic.Beta.BetaContentBlockParam[], burbujas: string[]) {
  sesion.historial.push({ role: "user", content: contenido });
  sesion.historial.push({ role: "assistant", content: [{ type: "text", text: burbujas.join("\n---\n") }] });
}

/** Corre el modelo que conversa, con herramientas, sobre el historial actual. Devuelve sus textos. */
async function correrModelo(sesion: Sesion): Promise<string[]> {
  const textos: string[] = [];
  for (let vuelta = 0; vuelta < MAX_VUELTAS_HERRAMIENTAS; vuelta++) {
    const respuesta = await client.beta.messages.create({
      model: MODELO,
      max_tokens: 16000,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      tools: herramientas,
      messages: sesion.historial,
      output_config: { effort: "medium" },
      ...(CON_RESPALDO ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
    });

    if (respuesta.stop_reason === "refusal") {
      const texto = "Uy, eso no te lo sé responder bien. Si es algo de salud, tu nutri o Salud Responde (600 360 7777) te pueden orientar";
      sesion.historial.push({ role: "assistant", content: [{ type: "text", text: texto }] });
      textos.push(texto);
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

const enBurbujas = (textos: string[]) =>
  textos.flatMap((t) => t.split(SEPARADOR_BURBUJAS)).map((b) => b.trim()).filter(Boolean);

/**
 * Corre un turno de Amy y devuelve las burbujas para Antonia.
 * Orden (diseño de Esperanza): detección de alertas antes del modelo, filtro de salida después.
 */
export async function turnoDeAmi(sesion: Sesion, entrada: Entrada): Promise<string[]> {
  if (sesion.turnos >= MAX_TURNOS_POR_SESION) {
    return ["Por hoy llegamos al límite de mensajes de la demo. Escríbeme más rato 🌿"];
  }
  sesion.turnos += 1;
  const texto = entrada.texto?.trim() ?? "";
  const contenido = await aContenido(entrada);
  const previa = sesion.derivacion_previa?.nivel ?? null;

  if (!entrada.esReloj && texto.toLowerCase() === "pausa") {
    sesion.modo = "pausa";
    const burbujas = [
      previa
        ? "Dale, quedo en pausa. Si lo necesitas, el *4141 atiende a toda hora y tu nutricionista o la psicóloga de la u te pueden acompañar"
        : "Dale, quedo en pausa esta semana. El jueves te pregunto por el finde 🌿",
    ];
    registrarFijo(sesion, contenido, burbujas);
    return burbujas;
  }

  // 1. Detección: frases de nivel 2 primero; si no, el clasificador con los últimos 20 mensajes.
  if (!entrada.esReloj && texto) {
    const porFrase = frasesNivel2(texto);
    let clasificacion = porFrase ? clasificacionPorFrase(porFrase, texto) : null;
    if (!clasificacion) {
      try {
        clasificacion = await clasificar(client, MODELO_CLASIFICADOR, sesion.historial, texto, previa);
      } catch (error) {
        // Si el clasificador falla, sigue el modelo que conversa, que tiene las mismas reglas en su prompt.
        console.error("Clasificador falló:", error);
      }
    }
    if (clasificacion && clasificacion.nivel !== "0") {
      const burbujas = mensajesFijos(clasificacion, previa, sesion.perfil?.trato ?? "neutro");
      if (burbujas.length > 0) {
        if (clasificacion.nivel !== "ambiguo") {
          sesion.modo = "derivada";
          sesion.derivacion_previa = { nivel: clasificacion.nivel, fecha: new Date().toISOString() };
        }
        console.info("Alerta detectada:", clasificacion.nivel, clasificacion.senal);
        registrarFijo(sesion, contenido, burbujas);
        return burbujas;
      }
    }
  }

  // 2. El modelo que conversa.
  sesion.historial.push({ role: "user", content: contenido });
  let burbujas = enBurbujas(await correrModelo(sesion));

  // 3. Filtro de salida: si aparece algo prohibido, se regenera una vez; si vuelve, respuesta neutra.
  const violacion = violaFiltro(burbujas.join("\n"));
  if (violacion) {
    console.warn("Filtro de salida:", violacion);
    sesion.historial.push({
      role: "user",
      content: [
        {
          type: "text",
          text: `[REVISIÓN INTERNA, no es de Antonia] Tu último mensaje usó «${violacion}», que Amy no dice. Antonia no lo vio. Escribe de nuevo ese mensaje sin eso, siguiendo las reglas del acompañamiento.`,
        },
      ],
    });
    burbujas = enBurbujas(await correrModelo(sesion));
    if (violaFiltro(burbujas.join("\n"))) {
      burbujas = ["Perdón, se me enredó la respuesta. Me cuentas de nuevo? 🌿"];
    }
  }
  return burbujas;
}
