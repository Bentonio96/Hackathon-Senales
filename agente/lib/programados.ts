import { EVENTOS_RELOJ, turnoDeAmi, type MomentoReloj } from "./ami";
import type { Sesion } from "./estado";

/**
 * Lo que Ami escribe por su cuenta en un momento de la semana (jueves, sábado o domingo).
 * Lo usan el reloj de la demo y el cron del jueves. Respeta la pausa y las alertas (diseño de Esperanza).
 */
export async function correrMomento(sesion: Sesion, momento: MomentoReloj): Promise<{ respuestas: string[]; aviso?: string }> {
  const nivelPrevio = sesion.derivacion_previa?.nivel;
  if (sesion.modo === "pausa" && momento !== "jueves") {
    return { respuestas: [], aviso: "Ami está en pausa: no escribe hasta el jueves." };
  }
  if (sesion.modo === "derivada" && (momento !== "jueves" || nivelPrevio !== "1")) {
    return { respuestas: [], aviso: "Hubo una alerta: Ami no manda mensajes programados." };
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
  return { respuestas: await turnoDeAmi(sesion, { texto: EVENTOS_RELOJ[momento], esReloj: true }) };
}
