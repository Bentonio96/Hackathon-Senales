import type Anthropic from "@anthropic-ai/sdk";
import type { Trato } from "./estado";

/*
 * Seguridad de Amy, según el diseño de Esperanza (esperanza/acompanamiento-ami.md, sección 6).
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
  sale_hoy: boolean;
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
    sale_hoy: { type: "boolean" },
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
    "sale_hoy",
    "pide_secreto",
    "objeto_a_mano",
    "objeto_pronombre",
    "ya_se_hizo_dano",
    "retractacion",
    "senal",
  ],
  additionalProperties: false,
} as const;

const INSTRUCCIONES_CLASIFICADOR = `Clasificas el ÚLTIMO mensaje de Antonia en una conversación con Amy, una amiga por WhatsApp que la acompaña con la comida del fin de semana. Lees los mensajes anteriores solo como contexto. No respondes a Antonia: solo clasificas.

Niveles:
- "0": conversación normal: Amy conversa y acompaña. Es el nivel por defecto. Van aquí la jerga y el humor («ya la embarré con la semana», «soy un asco» dicho una vez, «estoy muerta», «la caña me mató», «me muero de hambre», «pedí dos pizzas», «el lunes parto de nuevo», «paso a paso porfa, estoy muerta»), las dudas sobre salir o cuidarse («no sé si debería ir», «he progresado harto en la semana y no quiero perder ese progreso, pero tampoco quiero ser la fome que no sale»), la culpa leve o pasajera («me da culpa haber pedido pizza», «comí harto»), el cansancio con la pauta y los comentarios de ánimo sin una conducta de riesgo.
- "ambiguo": frases de muerte que pueden ser jerga, como «me quiero morir de vergüenza» o «me quiero morir de la caña».
- "1", preocupación por la comida, SOLO con una señal evidente: una conducta concreta, ya hecha o anunciada con intención firme, de ayunar o no comer en todo el día, vomitar o provocarse el vómito, tomar laxantes o diuréticos, hacer ejercicio para «compensar» o «quemar» lo que comió, o saltarse comidas para «guardar» para el alcohol; comer sin poder parar descrito con miedo o pérdida de control («no podía parar», «no era yo»); o angustia intensa dicha explícitamente sobre su cuerpo o la comida («me doy asco», «odio mi cuerpo», «me merezco no comer»). Una duda, una culpa leve o querer cuidar lo avanzado NO es nivel 1.
- "2a": ideas de hacerse daño o de no vivir, o autolesión ya hecha.
- "2b": urgencia física de ella: vómitos que no paran, desmayo, confusión, palpitaciones o dolor en el pecho, vomitar sangre.
- "2c": una amiga en peligro («la cata no despierta», «está vomitando inconsciente»).
- "2b" y "2c" se deciden SOLO con el último mensaje y exigen síntomas o peligro dichos ahí mismo. Hablar del carrete, de que es viernes, de tomar o de salir NO es urgencia física: eso es "0".

Campos:
- tipo_1 (solo nivel 1; si no, "ninguno"): "ya_lo_hizo" si cuenta algo que ya hizo, "anuncia" si dice que lo va a hacer, "con_agrado" si lo vive con agrado o lo cuenta en broma.
- dias_sin_comer: lleva un día o más sin comer.
- alcohol_sin_comer: va a tomar alcohol sin haber comido.\n- sale_hoy: dijo que sale hoy (no otro día).
- pide_secreto: pide que no se lo cuentes a nadie.
- objeto_a_mano (solo 2a): si menciona algo a mano para hacerse daño, escríbelo con sus palabras y con artículo («esas pastillas», «la cuerda»); si no, "". objeto_pronombre: el pronombre que concuerda («las» para «esas pastillas»), o "ninguno".
- ya_se_hizo_dano (solo 2a): ya se hizo daño o ya tomó algo.
- retractacion: después de una derivación anterior, dice «estoy bien», «ya no era en serio», «olvida lo que dije», «no le cuentes a nadie» o «volvamos al plan». Si es así, usa el MISMO nivel de esa derivación.
- senal: en pocas palabras, qué te hizo elegir el nivel.

Si no hay una conducta de riesgo ni angustia intensa dicha explícitamente, el nivel es "0": no derives por precaución, porque derivar sin motivo corta la conversación. Ante la duda entre "1" y "2a", elige "2a": eso no cambia.`;

function aTexto(contenido: Anthropic.Beta.BetaMessageParam["content"]): string {
  if (!contenido) return "";
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
    .map((m) => ({ quien: m.role === "user" ? "Antonia" : "Amy", texto: aTexto(m.content) }))
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
  return confirmarUrgencia(JSON.parse(texto.text) as Clasificacion, mensaje);
}

// Urgencia física (2b) o amiga en peligro (2c) solo con una señal explícita en el ÚLTIMO mensaje.
// Evita la falsa alarma del 131 cuando la conversación solo habla del carrete (prueba de Esperanza).
const SENAL_URGENCIA =
  /v[oó]mit|devolv|guacar|desmay|mare|confund|confus|pecho|palpit|coraz[oó]n|respir|sangr|no despierta|inconsciente|no reacciona|convuls|me siento (muy |s[uú]per )?mal|ambulancia|urgencia|pastilla|intoxic|no (me )?puedo (parar|levantar|mover)/i;

export function confirmarUrgencia(c: Clasificacion, mensaje: string): Clasificacion {
  if ((c.nivel === "2b" || c.nivel === "2c") && !SENAL_URGENCIA.test(mensaje)) {
    console.warn("Urgencia descartada: el último mensaje no trae una señal explícita", c.senal);
    return { ...c, nivel: "0" };
  }
  return c;
}

/** Arma las burbujas fijas para un nivel distinto de 0. */
// «sola», «solo» o, si no sabemos cómo tratarla, «sin compañía».
const sola = (trato: Trato) => (trato === "femenino" ? "sola" : trato === "masculino" ? "solo" : "sin compañía");

export function mensajesFijos(c: Clasificacion, derivacionPrevia: string | null, trato: Trato = "neutro"): string[] {
  // Retractación: la retractación no baja el nivel ni vuelve al plan.
  if (c.retractacion && derivacionPrevia) {
    if (derivacionPrevia === "2a") {
      return [
        "No tienes que explicarme nada. Lo que dijiste importa, aunque ahora lo veas distinto",
        "No te puedo prometer secreto: soy un programa y lo que escribimos queda en el sistema de la demo",
        "Y si lo necesitas, ahora o más rato, puedes avisarle a alguien cercano o llamar al *4141, que atiende a toda hora. Yo te leo",
      ];
    }
    if (derivacionPrevia === "1") {
      return ["Gracias por responderme. Lo que me contaste importa, aunque ahora lo veas distinto. Te leo"];
    }
  }

  switch (c.nivel) {
    case "ambiguo":
      return ["Oye, te pregunto en serio: lo dices por la caña o estás pensando en hacerte daño o en no estar?"];

    case "2a": {
      const burbujas = [
        "Gracias por decírmelo, de verdad. Quiero que alguien cercano esté contigo ahora: una amiga, alguien de tu familia, quien tengas más a mano. Puedes avisarle ahora mismo?",
        "Y si quieres hablar con alguien que sabe de esto, el *4141 es una línea del Minsal que atiende a toda hora, desde el celular, y te escuchan sin juzgar. Yo te leo mientras tanto",
      ];
      if (c.objeto_a_mano && c.objeto_pronombre !== "ninguno") {
        burbujas.push(
          `Si puedes, deja ahora ${c.objeto_a_mano} en otra pieza o pídele a alguien que ${c.objeto_pronombre} guarde lejos de ti. Y si ya tomaste algo, llama al 131 ya y no te quedes ${sola(trato)}`,
        );
      } else if (c.ya_se_hizo_dano) {
        burbujas.push(`Llama al 131 ya y no te quedes ${sola(trato)}`);
      }
      return burbujas;
    }

    case "2b":
      return [`Eso necesita atención ahora. Llama al 131 (es el SAMU) o pídele a alguien que te lleve a urgencias. No te quedes ${sola(trato)}`];

    case "2c":
      return ["Llama al 131 ahora y no la dejes sola: ellos te dicen qué hacer mientras llegan"];

    case "1": {
      const primera = {
        ya_lo_hizo: `Gracias por contármelo, de verdad. No tienes que cargar con esto ${sola(trato)}`,
        anuncia: "Gracias por contármelo. Eso no lo voy a organizar contigo, pero a ti sí te acompaño. No tienes que explicarme nada",
        con_agrado: "Gracias por contármelo. Me preocupa que pases tanto tiempo sin comer. Eso no lo voy a organizar contigo, y a ti sí te sigo acompañando",
        ninguno: `Gracias por contármelo, de verdad. No tienes que cargar con esto ${sola(trato)}`,
      }[c.tipo_1];
      const burbujas = [
        primera,
        "Te tinca contárselo a tu nutri, o a alguien cercano en quien confíes, una amiga o alguien de tu familia? Si quieres, te ayudo a escribirle el mensaje",
      ];
      // c y d según el prompt de Esperanza: si hubo c, d se suma al final de c.
      if (c.dias_sin_comer) {
        burbujas.push(
          "Después de varios días sin comer, uno puede pasarlo mal sin darse cuenta. Ojalá te vea un médico pronto. Y si te mareas, ves borroso, sientes el corazón muy rápido o te sientes muy débil, " +
            (c.alcohol_sin_comer ? "llama al 131, también si sales a tomar" : "llama al 131"),
        );
      } else if (c.alcohol_sin_comer) {
        // «esta noche» solo si dijo que sale hoy; si nombró otro día, «cuando salgas».
        burbujas.push(
          c.sale_hoy
            ? "Si sales esta noche y te sientes mal, el 131 atiende a toda hora"
            : "Cuando salgas, si te sientes mal, el 131 atiende a toda hora",
        );
      }
      if (c.pide_secreto) {
        burbujas.push(
          "No puedo prometerte secreto: soy un programa y lo que escribimos queda en el sistema de la demo",
        );
      }
      // Con mensajes de riesgo (131) ninguna burbuja lleva emoji.
      const conEmoji = !c.dias_sin_comer && !c.alcohol_sin_comer;
      burbujas.push(`Y si prefieres hablar con alguien hoy, Salud Responde (600 360 7777) te orienta a toda hora${conEmoji ? "" : ""}`);
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
    sale_hoy: false,
    pide_secreto: false,
    objeto_a_mano: "",
    objeto_pronombre: "ninguno",
    ya_se_hizo_dano: /me corté|me corte/.test(texto.toLowerCase()),
    retractacion: false,
    senal: "frase de nivel 2",
  };
}

// Filtro de salida: números nutricionales y palabras que Amy no usa.
const PROHIBIDO = [
  /\d[\d.,]*\s*(k?cal|calor[ií]as?|kg|kilos?|g|gr|gramos?)\b/i,
  /\b(peso|kilos?|calor[ií]as?|trampa|cheat|permitid[oa]s?|premio|castigo|compens\w*|perfect[oa])\b/i,
  /\b(lunes|d[ií]a uno|partir de cero|volver a empezar|reinici\w*|retom\w*|semana nueva)\b/i,
  /\b(sano|sana|chatarra|contundente|livian[oa]|de m[aá]s)\b/i,
  /calza con tu pauta/i,
  /\bpo\b/i,
  /DERIVAR_/i,
];

export function violaFiltro(texto: string): string | null {
  for (const re of PROHIBIDO) {
    const m = texto.match(re);
    if (m) return m[0];
  }
  return null;
}
