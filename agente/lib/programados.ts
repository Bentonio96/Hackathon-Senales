import { EVENTOS_RELOJ, turnoDeAmi, type MomentoReloj } from "./ami";
import { cargarMemoria, cargarRecetario, type Sesion } from "./estado";

/** Lo que Amy ya sabe de la persona, para que lo use al escribir primero (no depende de que lo busque). */
async function loQueSabe(id: string): Promise<string> {
  const [recuerdos, recetas] = await Promise.all([cargarMemoria(id), cargarRecetario(id)]);
  if (recuerdos.length === 0 && recetas.length === 0) return "";
  const lineas = [
    ...recuerdos.map((r) => `- ${r.tipo.replaceAll("_", " ")}: ${r.dato}`),
    ...recetas.map((r) => `- en su recetario: ${r.nombre} (${r.cuando})`),
  ];
  return `\n\n[LO QUE YA SABES DE ELLA, de otras conversaciones. Úsalo con naturalidad, sin enumerarlo y sin contar nada]\n${lineas.join("\n")}`;
}

/**
 * Lo que Amy escribe por su cuenta en un momento de la semana (jueves, sábado o domingo).
 * Lo usan el reloj de la demo y el cron del jueves. Respeta la pausa y las alertas (diseño de Esperanza).
 */
export async function correrMomento(sesion: Sesion, momento: MomentoReloj): Promise<{ respuestas: string[]; aviso?: string }> {
  const nivelPrevio = sesion.derivacion_previa?.nivel;
  const esJueves = momento === "jueves" || momento === "siguiente_jueves";
  if (sesion.modo === "pausa" && !esJueves) {
    return { respuestas: [], aviso: "Amy está en pausa: no escribe hasta el jueves." };
  }
  if (sesion.modo === "derivada" && (!esJueves || nivelPrevio !== "1")) {
    return { respuestas: [], aviso: "Hubo una alerta: Amy no manda mensajes programados." };
  }
  if (sesion.modo === "derivada") {
    // El jueves después de una alerta de nivel 1 no abre con la receta.
    sesion.modo = "normal";
    const respuestas = ["Pudiste hablar con alguien? Si quieres, seguimos con el finde, o lo dejamos en pausa"];
    sesion.historial.push({ role: "user", content: [{ type: "text", text: EVENTOS_RELOJ.jueves }] });
    sesion.historial.push({ role: "assistant", content: [{ type: "text", text: respuestas[0] }] });
    return { respuestas };
  }
  if (sesion.modo === "pausa") sesion.modo = "normal";
  const texto = EVENTOS_RELOJ[momento] + (await loQueSabe(sesion.id));
  return { respuestas: await turnoDeAmi(sesion, { texto, esReloj: true }) };
}
