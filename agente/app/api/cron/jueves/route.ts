import { enCola } from "@/lib/cola";
import { cargarSesion, guardarSesion, usuariosWhatsApp } from "@/lib/estado";
import { correrMomento } from "@/lib/programados";
import { enviarWhatsApp } from "@/lib/twilio";

export const maxDuration = 300;

// WhatsApp solo deja que Amy escriba libremente hasta 24 horas después del último mensaje
// de la persona. Fuera de esa ventana haría falta una plantilla aprobada por Meta.
const VENTANA_MS = 23.5 * 60 * 60 * 1000;

/** Cron de Vercel: el jueves a las 18:00 de Chile, Amy pregunta por el finde (ver vercel.json). */
export async function GET(req: Request) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || req.headers.get("authorization") !== `Bearer ${secreto}`) {
    return new Response("No autorizado", { status: 401 });
  }

  const resultados: { numero: string; estado: string }[] = [];
  for (const numero of await usuariosWhatsApp()) {
    const enmascarado = numero.slice(0, -4).replace(/\d/g, "•") + numero.slice(-4);
    try {
      const estado = await enCola(numero, async () => {
        const sesion = await cargarSesion(numero, "whatsapp");
        const ultimo = sesion.ultimo_mensaje_usuario ? Date.parse(sesion.ultimo_mensaje_usuario) : 0;
        if (Date.now() - ultimo > VENTANA_MS) return "fuera de la ventana de 24 horas";
        const { respuestas, aviso } = await correrMomento(sesion, "jueves");
        await guardarSesion(sesion);
        if (aviso) return aviso;
        await enviarWhatsApp(numero, ...respuestas);
        return "enviado";
      });
      resultados.push({ numero: enmascarado, estado });
    } catch (error) {
      console.error("Cron del jueves falló para", enmascarado, error);
      resultados.push({ numero: enmascarado, estado: "error" });
    }
  }
  console.info("Cron del jueves:", resultados);
  return Response.json({ resultados });
}
