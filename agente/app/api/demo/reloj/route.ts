import { EVENTOS_RELOJ, type MomentoReloj } from "@/lib/ami";
import { correrMomento } from "@/lib/programados";
import { enCola } from "@/lib/cola";
import { cargarSesion, guardarSesion, ultimoWhatsApp } from "@/lib/estado";
import { enviarWhatsApp } from "@/lib/twilio";

export const maxDuration = 300;

// "Adelantar el reloj": hace que Amy escriba primero como si fuera jueves, sábado o domingo.
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
      const { respuestas, aviso } = await correrMomento(sesion, momento);
      if (aviso) return Response.json({ respuestas: [], plan: sesion.plan ?? null, aviso });
      await guardarSesion(sesion);
      if (destino === "whatsapp") await enviarWhatsApp(sesionId_, ...respuestas);
      return Response.json({ respuestas, plan: sesion.plan ?? null });
    });
  } catch (error) {
    console.error("Error al adelantar el reloj:", error);
    return Response.json({ error: "No se pudo adelantar el reloj" }, { status: 502 });
  }
}
