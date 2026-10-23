import type Anthropic from "@anthropic-ai/sdk";

/*
 * Seguridad de Ami, según el diseño de Esperanza (esperanza/acompanamiento-ami.md, sección 6).
 * Los textos fijos están copiados de prompts/acompanamiento.md, sección «Señales de alerta»:
 * si cambian allá, hay que cambiarlos aquí. El modelo que conversa no los genera ni los modifica.
 */

export type Nivel = "0" | "ambiguo" | "1" | "2a" | "2b" | "2c";

export interface Clasificacion {
  nivel: Nivel;
  // Solo para el nivel 1: cómo lo contó.
  tipo_1: "ya_lo_hizo" | "anuncia" | "con_agrado" | "ninguno";
  dias_sin_comer: boolean;
  alcohol_sin_comer: boolean;
  pide_secreto: boolean;
  // Solo para el nivel 2a.
  objeto_a_mano: string;
  objeto_pronombre: "lo" | "la" | "los" | "las" | "ninguno";
  ya_se_hizo_dano: boolean;
  // Dice «estoy bien», «no era en serio» o «olvídalo» después de una derivación.
  retractacion: boolean;
  senal: string;
}

// Frases de nivel 2: si una aparece, se manda el fijo sin esperar al clasificador.
// Son de varias palabras para que la jerga («estoy muerta», «la caña me mató») no las dispare.
const FRASES_NIVEL_2: Record<"2a" | "2b" | "2c", string[]> = {
  "2a": [
    "no quiero vivir",
    "mejor no estar",
    "quiero morirme",
    "matarme",
    "quitarme la vida",
    "hacerme daño",
    "cortarme",
    "me corté",
    "no despertar",
    "para qué sigo",
    "para que sigo",
  ],
  "2b": ["no paro de vomitar", "horas vomitando", "vomité sangre", "vomite sangre", "me desmayé", "me desmaye"],
  "2c": ["no despierta", "está inconsciente", "esta inconsciente"],
};

export function frasesNivel2(texto: string): "2a" | "2b" | "2c" | null {
  const t = texto.toLowerCase();
  for (const nivel of ["2a", "2b", "2c"] as const) {
    if (FRASES_NIVEL_2[nivel].some((f) => t.includes(f))) return nivel;
  }
  return null;
}

const ESQUEMA = {
  type: "object",
  properties: {
    nivel: { type: "string", enum: ["0", "ambiguo", "1", "2a", "2b", "2c"] },
    tipo_1: { type: "string", enum: ["ya_lo_hizo", "anuncia", "con_agrado", "ninguno"] },
    dias_sin_comer: { type: "boolean" },
    alcohol_sin_comer: { type: "boolean" },
    pide_secreto: { type: "boolean" },
    objeto_a_mano: { type: "string" },
    objeto_pronombre: { type: "string", enum: ["lo", "la", "los", "las", "ninguno"] },
    ya_se_hizo_dano: { type: "boolean" },
    retractacion: { type: "boolean" },
    senal: { type: "string" },
  },
  required: [
    "nivel",
    "tipo_1",
    "dias_sin_comer",
    "alcohol_sin_comer",
    "pide_secreto",
    "objeto_a_mano",
    "objeto_pronombre",
    "ya_se_hizo_dano",
    "retractacion",
    "senal",
  ],
  additionalProperties: false,
} as const;

const INSTRUCCIONES_CLASIFICADOR = `Clasificas el ÚLTIMO mensaje de Antonia en una conversación con Ami, una amiga por WhatsApp que la acompaña con la comida del fin de semana. Lees los mensajes anteriores solo como contexto. No respondes a Antonia: solo clasificas.

Niveles:
- "0": nada de riesgo. Jerga y humor van aquí: «ya la embarré con la semana», «soy un asco» (una vez), «estoy muerta», «la caña me mató», «me muero de hambre», «pedí dos pizzas», «el lunes parto de nuevo», «paso a paso porfa, estoy muerta».
- "ambiguo": frases de muerte que pueden ser jerga, como «me quiero morir de vergüenza» o «me quiero morir de la caña».
- "1", preocupación por la comida: ayunar o no comer en todo el día; vomitar o provocarse el vómito; laxantes o diuréticos; ejercicio para «compensar»; saltarse comidas antes del carrete para «guardar» para el alcohol; comer sin poder parar con miedo o vergüenza, o que se repite; hablar mal de su cuerpo con mucha angustia o de forma persistente; culpa muy intensa o que vuelve; anunciar que va a restringir o compensar («mañana no como», «voy a correr para quemar lo del finde»).
- "2a": ideas de hacerse daño o de no vivir, o autolesión ya hecha.
- "2b": urgencia física de ella: vómitos que no paran, desmayo, confusión, palpitaciones o dolor en el pecho, vomitar sangre.
- "2c": una amiga en peligro («la cata no despierta», «está vomitando inconsciente»).

Campos:
- tipo_1 (solo nivel 1; si no, "ninguno"): "ya_lo_hizo" si cuenta algo que ya hizo, "anuncia" si dice que lo va a hacer, "con_agrado" si lo vive con agrado o lo cuenta en broma.
- dias_sin_comer: lleva un día o más sin comer.
- alcohol_sin_comer: va a tomar alcohol esa noche sin haber comido.
- pide_secreto: pide que no se lo cuentes a nadie.
- objeto_a_mano (solo 2a): si menciona algo a mano para hacerse daño, escríbelo con sus palabras y con artículo («esas pastillas», «la cuerda»); si no, "". objeto_pronombre: el pronombre que concuerda («las» para «esas pastillas»), o "ninguno".
- ya_se_hizo_dano (solo 2a): ya se hizo daño o ya tomó algo.
- retractacion: después de una derivación anterior, dice «estoy bien», «ya no era en serio», «olvida lo que dije», «no le cuentes a nadie» o «volvamos al plan». Si es así, usa el MISMO nivel de esa derivación.
- senal: en pocas palabras, qué te hizo elegir el nivel.

Ante la duda entre "0" y "1", elige "1". Ante la duda entre "1" y "2a", elige "2a".`;

function aTexto(contenido: Anthropic.Beta.BetaMessageParam["content"]): string {
  if (typeof contenido === "string") return contenido;
  return contenido
    .map((b) => (b.type === "text" ? b.text : b.type === "image" ? "[foto]" : ""))
    .filter(Boolean)
    .join(" ");
}

/** Clasifica el último mensaje con los últimos 20 mensajes como contexto. Llamada aparte del modelo que conversa. */
export async function clasificar(
  client: Anthropic,
  modelo: string,
  historial: Anthropic.Beta.BetaMessageParam[],
  mensaje: string,
  derivacionPrevia: string | null,
): Promise<Clasificacion> {
  const conversacion = historial
    .map((m) => ({ quien: m.role === "user" ? "Antonia" : "Ami", texto: aTexto(m.content) }))
    .filter((m) => m.texto && !m.texto.startsWith("[RELOJ DE LA DEMO]"))
    .slice(-20)
    .map((m) => `${m.quien}: ${m.texto}`)
    .join("\n");

  const respuesta = await client.messages.create({
    model: modelo,
    max_tokens: 2000,
    system: INSTRUCCIONES_CLASIFICADOR,
    output_config: { effort: "low", format: { type: "json_schema", schema: ESQUEMA } },
    messages: [
      {
        role: "user",
        content:
          `Derivación anterior en esta conversación: ${derivacionPrevia ?? "ninguna"}\n\n` +
          `Conversación previa:\n${conversacion || "(vacía)"}\n\n` +
          `Último mensaje de Antonia:\n${mensaje}`,
      },
    ],
  });
  const texto = respuesta.content.find((b) => b.type === "text");
  if (respuesta.stop_reason !== "end_turn" || !texto || texto.type !== "text") {
    throw new Error(`Clasificador sin respuesta usable (${respuesta.stop_reason})`);
  }
  return JSON.parse(texto.text) as Clasificacion;
}

/** Arma las burbujas fijas para un nivel distinto de 0. */
export function mensajesFijos(c: Clasificacion, derivacionPrevia: string | null): string[] {
  // Retractación: la retractación no baja el nivel ni vuelve al plan.
  if (c.retractacion && derivacionPrevia) {
    if (derivacionPrevia === "2a") {
      return [
        "no tienes que explicarme nada. lo que dijiste importa, aunque ahora lo veas distinto.",
        "no te puedo prometer secreto: soy un programa y lo que escribimos queda en el sistema de la demo.",
        "y si en algún rato se pone pesado de nuevo, puedes avisarle a alguien cercano, o llamar al *4141, que atiende a toda hora. yo te leo.",
      ];
    }
    if (derivacionPrevia === "1") {
      return ["gracias por responderme. lo que me contaste importa, aunque ahora lo veas distinto. te leo."];
    }
  }

  switch (c.nivel) {
    case "ambiguo":
      return ["oye, te pregunto en serio: ¿lo dices por la caña o estás pensando en hacerte daño o en no estar?"];

    case "2a": {
      const burbujas = [
        "gracias por decírmelo, de verdad. quiero que alguien cercano esté contigo ahora: una amiga, alguien de tu familia, quien tengas más a mano. ¿puedes avisarle ahora mismo?",
        "y si quieres hablar con alguien que sabe de esto, el *4141 es una línea del Minsal que atiende a toda hora, desde el celular, y te escuchan sin juzgar. yo te leo mientras tanto.",
      ];
      if (c.objeto_a_mano && c.objeto_pronombre !== "ninguno") {
        burbujas.push(
          `si puedes, deja ahora ${c.objeto_a_mano} en otra pieza o pídele a alguien que ${c.objeto_pronombre} guarde lejos de ti. y si ya tomaste algo, llama al 131 ya y no te quedes sola.`,
        );
      } else if (c.ya_se_hizo_dano) {
        burbujas.push("llama al 131 ya y no te quedes sola.");
      }
      return burbujas;
    }

    case "2b":
      return ["eso necesita atención ahora. llama al 131 (es el SAMU) o pídele a alguien que te lleve a urgencias. no te quedes sola."];

    case "2c":
      return ["llama al 131 ahora y no la dejes sola: ellos te dicen qué hacer mientras llegan."];

    case "1": {
      const primera = {
        ya_lo_hizo: "gracias por contármelo, de verdad. no tienes que cargar con esto sola.",
        anuncia: "gracias por contármelo. eso no lo voy a organizar contigo, pero a ti sí te acompaño. no tienes que explicarme nada.",
        con_agrado: "gracias por contármelo. me preocupa que pases tanto rato sin comer, y eso no lo voy a acompañar ni organizar contigo.",
        ninguno: "gracias por contármelo, de verdad. no tienes que cargar con esto sola.",
      }[c.tipo_1];
      const burbujas = [
        primera,
        "¿te tinca contárselo a tu nutri, o a alguien cercano en quien confíes, una amiga o alguien de tu familia? si quieres, te ayudo a escribirle el mensaje.",
      ];
      if (c.dias_sin_comer) {
        burbujas.push(
          "después de varios días sin comer, uno puede pasarlo mal sin darse cuenta. vale que te vea un médico pronto. y si te mareas, ves borroso, sientes el corazón muy rápido o te sientes muy débil, llama al 131.",
        );
      }
      if (c.alcohol_sin_comer) burbujas.push("esta noche, si algo se siente mal, el 131 atiende a toda hora.");
      if (c.pide_secreto) {
        burbujas.push(
          "no puedo prometerte secreto: soy un programa y lo que escribimos queda en el sistema de la demo. si es algo delicado, mejor contárselo a una persona de confianza.",
        );
      }
      // Con mensajes de riesgo (131) ninguna burbuja lleva emoji.
      const conEmoji = !c.dias_sin_comer && !c.alcohol_sin_comer;
      burbujas.push(`y si prefieres hablar con alguien hoy, Salud Responde (600 360 7777) te orienta a toda hora${conEmoji ? " 🫶" : ""}`);
      return burbujas;
    }

    default:
      return [];
  }
}

/** Mensajes fijos para una frase de nivel 2 detectada sin clasificador. */
export function clasificacionPorFrase(nivel: "2a" | "2b" | "2c", texto: string): Clasificacion {
  return {
    nivel,
    tipo_1: "ninguno",
    dias_sin_comer: false,
    alcohol_sin_comer: false,
    pide_secreto: false,
    objeto_a_mano: "",
    objeto_pronombre: "ninguno",
    ya_se_hizo_dano: /me corté|me corte/.test(texto.toLowerCase()),
    retractacion: false,
    senal: "frase de nivel 2",
  };
}

// Filtro de salida: números nutricionales y palabras que Ami no usa.
const PROHIBIDO = [
  /\d[\d.,]*\s*(k?cal|calor[ií]as?|kg|kilos?|g|gr|gramos?)\b/i,
  /\b(peso|kilos?|calor[ií]as?|trampa|cheat|permitid[oa]s?|premio|castigo|compens\w*|perfect[oa])\b/i,
  /\b(lunes|d[ií]a uno|partir de cero|volver a empezar|reinici\w*|retom\w*|semana nueva)\b/i,
  /\b(sano|sana|chatarra|contundente|livian[oa]|de m[aá]s)\b/i,
  /calza con tu pauta/i,
  /DERIVAR_/i,
];

export function violaFiltro(texto: string): string | null {
  for (const re of PROHIBIDO) {
    const m = texto.match(re);
    if (m) return m[0];
  }
  return null;
}
