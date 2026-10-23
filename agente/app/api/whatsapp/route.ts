import { after } from "next/server";
import { turnoDeAmi } from "@/lib/ami";
import { enCola } from "@/lib/cola";
import { borrarSesion, cargarSesion, guardarSesion, recordarUltimoWhatsApp } from "@/lib/estado";
import { descargarMedia, enviarWhatsApp, firmaValida } from "@/lib/twilio";

export const maxDuration = 300;

const TWIML_VACIO = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';

// Webhook del sandbox de WhatsApp de Twilio. Responde al tiro y procesa después,
// porque Claude con una foto puede tardar más que el límite de 15 s de Twilio.
export async function POST(req: Request) {
  const params = Object.fromEntries(new URLSearchParams(await req.text())) as Record<string, string>;
  const url = process.env.TWILIO_WEBHOOK_URL || req.url;
  if (!firmaValida(url, params, req.headers.get("x-twilio-signature"))) {
    return new Response("Firma inválida", { status: 403 });
  }

  const de = params.From;
  const texto = params.Body ?? "";
  const tieneFoto = Number(params.NumMedia ?? 0) > 0 && params.MediaContentType0?.startsWith("image/");

  after(() =>
    enCola(de, async () => {
      try {
        await recordarUltimoWhatsApp(de);
        if (texto.trim().toLowerCase() === "reiniciar") {
          await borrarSesion(de);
          await enviarWhatsApp(de, "Listo, borré esta conversación ✨");
          return;
        }
        const sesion = await cargarSesion(de, "whatsapp");
        const imagen = tieneFoto ? await descargarMedia(params.MediaUrl0) : undefined;
        const respuestas = await turnoDeAmi(sesion, { texto, imagen });
        await guardarSesion(sesion);
        await enviarWhatsApp(de, ...respuestas);
      } catch (error) {
        console.error("Error procesando mensaje de WhatsApp:", error);
        await enviarWhatsApp(de, "Uy, se me enredó algo. Me lo mandas de nuevo? 😅").catch(() => undefined);
      }
    }),
  );

  return new Response(TWIML_VACIO, { headers: { "Content-Type": "text/xml" } });
}
