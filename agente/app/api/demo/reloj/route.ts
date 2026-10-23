import { EVENTOS_RELOJ, turnoDeAmi, type MomentoReloj } from "@/lib/ami";
import { enCola } from "@/lib/cola";
import { cargarSesion, guardarSesion, ultimoWhatsApp } from "@/lib/estado";
import { enviarWhatsApp } from "@/lib/twilio";

export const maxDuration = 300;

// "Adelantar el reloj": hace que Ami escriba primero como si fuera jueves, sábado o domingo.
export async function POST(req: Request) {
  const { momento, destino, sesionId } = (await req.json()) as {
    momento?: MomentoReloj;
    destino?: "web" | "whatsapp";
    sesionId?: string;
  };
  if (!momento || !(momento in EVENTOS_RELOJ)) {
    return Response.json({ error: "momento inválido" }, { status: 400 });
  }

  let id: string | null;
  if (destino === "whatsapp") {
    id = await ultimoWhatsApp();
    if (!id) return Response.json({ error: "Nadie ha escrito por WhatsApp todavía" }, { status: 409 });
  } else {
    id = sesionId && /^web:[\w-]{8,64}$/.test(sesionId) ? sesionId : null;
    if (!id) return Response.json({ error: "sesionId inválido" }, { status: 400 });
  }

  const sesionId_ = id;
  try {
    return await enCola(sesionId_, async () => {
      const sesion = await cargarSesion(sesionId_, destino === "whatsapp" ? "whatsapp" : "web");
      let respuestas: string[];
      const nivelPrevio = sesion.derivacion_previa?.nivel;
      if (sesion.modo === "pausa" && momento !== "jueves") {
        // En pausa no se mandan los mensajes programados (diseño de Esperanza).
        return Response.json({ respuestas: [], plan: sesion.plan ?? null, aviso: "Ami está en pausa: no escribe hasta el jueves." });
      } else if (sesion.modo === "derivada" && (momento !== "jueves" || nivelPrevio !== "1")) {
        // Después de una alerta, Ami no vuelve al plan por su cuenta.
        return Response.json({ respuestas: [], plan: sesion.plan ?? null, aviso: "Hubo una alerta: Ami no manda mensajes programados." });
      } else if (sesion.modo === "derivada") {
        // El jueves después de una alerta de nivel 1 no abre con la receta.
        sesion.modo = "normal";
        respuestas = ["¿pudiste hablar con alguien? ¿quieres que sigamos con el finde o prefieres pausar? 🫶"];
        sesion.historial.push({ role: "user", content: [{ type: "text", text: EVENTOS_RELOJ.jueves }] });
        sesion.historial.push({ role: "assistant", content: [{ type: "text", text: respuestas[0] }] });
      } else {
        if (sesion.modo === "pausa") sesion.modo = "normal";
        respuestas = await turnoDeAmi(sesion, { texto: EVENTOS_RELOJ[momento], esReloj: true });
      }
      await guardarSesion(sesion);
      if (destino === "whatsapp") for (const r of respuestas) await enviarWhatsApp(sesionId_, r);
      return Response.json({ respuestas, plan: sesion.plan ?? null });
    });
  } catch (error) {
    console.error("Error al adelantar el reloj:", error);
    return Response.json({ error: "No se pudo adelantar el reloj" }, { status: 502 });
  }
}
