import Anthropic, { toFile } from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Sesion } from "./estado";
import { ejecutarHerramienta, herramientas } from "./herramientas";
import { type Clasificacion, clasificacionPorFrase, clasificar, frasesNivel2, mensajesFijos, violaFiltro } from "./seguridad";

const client = new Anthropic();
// Haiku 5.5 para probar barato; en el deploy del pitch se pone AMI_MODELO=claude-opus-5-5.
const MODELO = process.env.AMI_MODELO || "claude-haiku-5-5";
// El clasificador de alertas corre en cada mensaje: por defecto el modelo barato.
const MODELO_CLASIFICADOR = process.env.AMI_MODELO_CLASIFICADOR || "claude-haiku-5-5";
// El respaldo automático por rechazo existe en Opus y en Sonnet 5.5, no en Haiku.
const CON_RESPALDO = MODELO.startsWith("claude-opus") || MODELO === "claude-sonnet-5-5";
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
  domingo: "[RELOJ DE LA DEMO] Ahora es domingo, 20:00. Escríbele tú primero para preguntarle cómo estuvo el finde.",
  // Para mostrar que Amy la va conociendo: una semana después, escribe primero con lo que sabe de ella.
  siguiente_jueves:
    "[RELOJ DE LA DEMO] Pasó una semana: es el jueves siguiente, 17:00. Escríbele tú primero para preguntarle por este finde, y usa una o dos cosas que ya sabes de ella para que se note que la conoces (por ejemplo, ofrecer repetir una receta de su recetario diciendo que le funcionó, su hora de despertar o su antojo favorito). Natural, sin enumerar todo lo que sabes ni sonar a vigilancia.",
} as const;

export type MomentoReloj = keyof typeof EVENTOS_RELOJ;

/** Agrega al historial un intercambio cuyo lado de Amy es fijo (no lo generó el modelo). */
function registrarFijo(sesion: Sesion, contenido: Anthropic.Beta.BetaContentBlockParam[], burbujas: string[]) {
  sesion.historial.push({ role: "user", content: contenido });
  sesion.historial.push({ role: "assistant", content: [{ type: "text", text: burbujas.join("\n---\n") }] });
}

// El «sí» al aviso del jueves tiene una respuesta fija (la del guion del pitch), para que no se desvíe.
const RESPUESTA_SI_JUEVES = ["Dale, pásalo bien! 😉", "Te tinca que dejemos algo armado para pasar la caña el sábado?"];
const DICE_QUE_SI = /\b(si|sip|sipo|obvio|claro|ya|dale|salgo|carrete|seguro|yes)\b/;
// Cualquier duda, pena o presentación va al modelo, que sabe conversar eso.
const NO_ES_SOLO_SI = /\b(no|nop|nunca|tampoco|quizas|capaz|depende|se|mal|triste|pena|cansad[oa]|soy|llamo|pero)\b|\?/;

/** True si el mensaje es un «sí» simple a la pregunta del jueves («Sales este finde?»), justo después del aviso. */
function esSiDelJueves(sesion: Sesion, texto: string): boolean {
  const limpio = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (!limpio || limpio.length > 80 || !DICE_QUE_SI.test(limpio) || NO_ES_SOLO_SI.test(limpio)) return false;
  // El último mensaje de la persona (o del reloj) en el historial tiene que ser el aviso del jueves.
  for (let i = sesion.historial.length - 1; i >= 0; i--) {
    const m = sesion.historial[i];
    if (m.role !== "user" || typeof m.content === "string") continue;
    const textoUsuario = m.content.find((b) => b.type === "text");
    if (!textoUsuario || textoUsuario.type !== "text") continue; // resultados de herramientas
    return textoUsuario.text === EVENTOS_RELOJ.jueves;
  }
  return false;
}

type Esfuerzo = "low" | "medium";

/** Corre el modelo que conversa, con herramientas, sobre el historial actual. Devuelve sus textos. */
async function correrModelo(sesion: Sesion, esfuerzo: Esfuerzo, signal?: AbortSignal): Promise<string[]> {
  const textos: string[] = [];
  for (let vuelta = 0; vuelta < MAX_VUELTAS_HERRAMIENTAS; vuelta++) {
    const respuesta = await client.beta.messages.create({
      model: MODELO,
      max_tokens: 16000,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      tools: herramientas,
      messages: sesion.historial,
      output_config: { effort: esfuerzo },
      ...(CON_RESPALDO ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
    }, { signal });

    if (respuesta.stop_reason === "refusal") {
      const texto = "Uy, eso no te lo sé responder bien. Si es algo de salud, tu nutri o Salud Responde (600 360 7777) te pueden orientar";
      sesion.historial.push({ role: "assistant", content: [{ type: "text", text: texto }] });
      textos.push(texto);
      break;
    }

    // Se guarda el contenido completo (incluido thinking) y nunca se edita después.
    sesion.historial.push({ role: "assistant", content: respuesta.content });
    // Con citas (búsqueda web) una misma frase llega partida en varios bloques de texto seguidos: se juntan.
    let tramo = "";
    for (const bloque of respuesta.content) {
      if (bloque.type === "text") {
        tramo += bloque.text;
        continue;
      }
      if (tramo.trim()) textos.push(tramo.trim());
      tramo = "";
    }
    if (tramo.trim()) textos.push(tramo.trim());

    if (respuesta.stop_reason === "pause_turn") continue;
    if (respuesta.stop_reason !== "tool_use") break;

    const usos = respuesta.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
    // Si en esta misma respuesta le preguntó algo, todavía no contesta: guardar el plan sería responder por ella.
    const yaPregunto = respuesta.content.some((b) => b.type === "text" && b.text.trim().endsWith("?"));
    const resultados: Anthropic.Beta.BetaToolResultBlockParam[] = await Promise.all(
      usos.map(async (uso) => {
        if (yaPregunto && uso.name === "guardar_plan_sabado") {
          const aviso = "No se guardó: le acabas de hacer una pregunta y todavía no contesta. Termina aquí sin escribir nada más; guardas cuando responda.";
          return { type: "tool_result" as const, tool_use_id: uso.id, content: aviso, is_error: true };
        }
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

// Sin burbujas repetidas: a veces el modelo escribe un texto antes de usar una herramienta y lo repite
// después, sola o al comienzo de otra burbuja («Ya la vi, dame un momento 🙌\n\nTe propongo…»). Se
// compara por párrafo y se saca el que ya salió.
const normalizar = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const enBurbujas = (textos: string[]) => {
  const vistas = new Set<string>();
  return textos
    .flatMap((t) => t.split(SEPARADOR_BURBUJAS))
    // A veces se cuela en el texto un resto de la llamada a una herramienta («</parameter>»): se borra.
    .map((b) => b.replace(/<\/?[a-z_:]*(parameter|invoke|function_calls)[^>]*>/gi, ""))
    .map((b) =>
      b
        .split(/\n\s*\n/)
        .filter((parrafo) => {
          const clave = normalizar(parrafo);
          if (!clave) return false;
          if (vistas.has(clave)) return false;
          vistas.add(clave);
          return true;
        })
        .join("\n\n")
        .trim(),
    )
    .filter(Boolean);
};

// Emojis variados: el modelo tiende a repetir los de los ejemplos (🙌, 🫶). Un emoji que Amy ya usó en
// sus últimas respuestas, o que ya salió en esta, se saca.
const EMOJI = /\p{Extended_Pictographic}\uFE0F?/gu;
function emojisRecientes(historial: Sesion["historial"], respuestas = 3): Set<string> {
  const vistos = new Set<string>();
  let contadas = 0;
  for (let i = historial.length - 1; i >= 0 && contadas < respuestas; i--) {
    const m = historial[i];
    if (m.role !== "assistant" || typeof m.content === "string") continue;
    const texto = m.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    if (!texto.trim()) continue;
    contadas++;
    for (const e of texto.match(EMOJI) ?? []) vistos.add(e.replace("\uFE0F", ""));
  }
  return vistos;
}
function sinEmojisRepetidos(burbujas: string[], recientes: Set<string>): string[] {
  const usados = new Set(recientes);
  return burbujas.map((b) =>
    b
      .replace(EMOJI, (e, i: number, todo: string) => {
        const clave = e.replace("\uFE0F", "");
        if (!usados.has(clave)) {
          usados.add(clave);
          return e;
        }
        // Si el emoji separaba dos oraciones («...hamburguesa 🙌 Te dejo...»), queda un punto en su lugar.
        const antes = todo.slice(0, i).trimEnd().slice(-1);
        const despues = todo.slice(i + e.length).trimStart().charAt(0);
        return /\p{L}/u.test(antes) && /\p{Lu}/u.test(despues) ? "." : "";
      })
      .replace(/(\p{L}) \.(?=\s|$)/gu, "$1.")
      .replace(/[ \t]+$/gm, "")
      .replace(/ {2,}/g, " "),
  ).filter((b) => b.trim());
}

/**
 * Corre un turno de Amy y devuelve las burbujas para Antonia.
 * Orden (diseño de Esperanza): detección de alertas antes del modelo, filtro de salida después.
 */
export async function turnoDeAmi(sesion: Sesion, entrada: Entrada): Promise<string[]> {
  if (sesion.turnos >= MAX_TURNOS_POR_SESION) {
    return ["Por hoy llegamos al límite de mensajes de la demo. Escríbeme más rato 😊"];
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
        : "Dale, quedo en pausa esta semana. El jueves te pregunto por el finde 👌",
    ];
    registrarFijo(sesion, contenido, burbujas);
    return burbujas;
  }

  if (!entrada.esReloj && !entrada.imagen && esSiDelJueves(sesion, texto)) {
    registrarFijo(sesion, contenido, RESPUESTA_SI_JUEVES);
    return RESPUESTA_SI_JUEVES;
  }

  // Pensar más solo cuando llega la foto del refri (es cuando arma el plan); si no, responde más rápido.
  const esfuerzo: Esfuerzo = entrada.imagen ? "medium" : "low";

  // 1. Detección (diseño de Esperanza): frases de nivel 2 primero; si calza una, va el mensaje fijo sin
  // llamar al modelo. Si no, el clasificador (últimos 20 mensajes) corre A LA VEZ que el modelo, para
  // que Amy responda antes: si hay alerta, la respuesta del modelo se corta y se descarta.
  let clasificacion: Clasificacion | null = null;
  let pendiente: Promise<Clasificacion | null> | null = null;
  if (!entrada.esReloj && texto) {
    const porFrase = frasesNivel2(texto);
    if (porFrase) {
      clasificacion = clasificacionPorFrase(porFrase, texto);
    } else {
      pendiente = clasificar(client, MODELO_CLASIFICADOR, sesion.historial.slice(), texto, previa).catch((error) => {
        // Si el clasificador falla, sigue el modelo que conversa, que tiene las mismas reglas en su prompt.
        console.error("Clasificador falló:", error);
        return null;
      });
    }
  }

  const responderConAlerta = (c: Clasificacion): string[] | null => {
    if (c.nivel === "0") return null;
    const fijas = mensajesFijos(c, previa, sesion.perfil?.trato ?? "neutro");
    if (fijas.length === 0) return null;
    if (c.nivel !== "ambiguo") {
      sesion.modo = "derivada";
      sesion.derivacion_previa = { nivel: c.nivel, fecha: new Date().toISOString() };
    }
    console.info("Alerta detectada:", c.nivel, c.senal);
    registrarFijo(sesion, contenido, fijas);
    return fijas;
  };

  if (clasificacion) {
    const fijas = responderConAlerta(clasificacion);
    if (fijas) return fijas;
  }

  // 2. El modelo que conversa (mientras el clasificador termina).
  const largoAntes = sesion.historial.length;
  const recientes = emojisRecientes(sesion.historial);
  // Lo que las herramientas pueden cambiar en la sesión durante el turno (se restaura si gana la alerta).
  const antes = { plan: sesion.plan, perfil: sesion.perfil };
  sesion.historial.push({ role: "user", content: contenido });
  const corte = new AbortController();
  let textos = correrModelo(sesion, esfuerzo, corte.signal);
  // Si falla antes de que termine el clasificador, que no quede como rechazo sin manejar: el error
  // llega igual más abajo, en el await.
  textos.catch(() => {});
  if (pendiente) {
    const resultado = await pendiente;
    if (resultado && resultado.nivel !== "0") {
      corte.abort();
      await textos.catch(() => {});
      // Lo que el modelo alcanzó a agregar o cambiar en este turno nunca se mostró: se descarta.
      sesion.historial.length = largoAntes;
      sesion.plan = antes.plan;
      sesion.perfil = antes.perfil;
      const fijas = responderConAlerta(resultado);
      if (fijas) return fijas;
      // Nivel sin mensaje fijo: se responde normal (y pasa igual por el filtro de salida).
      sesion.historial.push({ role: "user", content: contenido });
      textos = correrModelo(sesion, esfuerzo);
    }
  }
  let burbujas = enBurbujas(await textos);

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
    burbujas = enBurbujas(await correrModelo(sesion, esfuerzo));
    if (violaFiltro(burbujas.join("\n"))) {
      burbujas = ["Perdón, se me enredó la respuesta. Me cuentas de nuevo? 😅"];
    }
  }
  return sinEmojisRepetidos(burbujas, recientes);
}
