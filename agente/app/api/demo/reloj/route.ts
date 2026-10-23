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
      const respuestas = await turnoDeAmi(sesion, { texto: EVENTOS_RELOJ[momento] });
      await guardarSesion(sesion);
      if (destino === "whatsapp") for (const r of respuestas) await enviarWhatsApp(sesionId_, r);
      return Response.json({ respuestas, plan: sesion.plan ?? null });
    });
  } catch (error) {
    console.error("Error al adelantar el reloj:", error);
    return Response.json({ error: "No se pudo adelantar el reloj" }, { status: 502 });
  }
}
