import { turnoDeAmi } from "@/lib/ami";
import { enCola } from "@/lib/cola";
import { borrarSesion, cargarSesion, guardarSesion } from "@/lib/estado";

export const maxDuration = 300;

const TIPOS_IMAGEN = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

// Chat web de respaldo para la demo: usa el mismo cerebro que WhatsApp.
export async function POST(req: Request) {
  const cuerpo = (await req.json()) as {
    sesionId?: string;
    texto?: string;
    imagenBase64?: string;
    imagenTipo?: string;
    reiniciar?: boolean;
  };
  const id = cuerpo.sesionId;
  if (!id || !/^web:[\w-]{8,64}$/.test(id)) {
    return Response.json({ error: "sesionId inválido" }, { status: 400 });
  }
  if (cuerpo.reiniciar) {
    await borrarSesion(id);
    return Response.json({ respuestas: [], plan: null });
  }
  if (cuerpo.imagenBase64 && !TIPOS_IMAGEN.has(cuerpo.imagenTipo ?? "")) {
    return Response.json({ error: "Tipo de imagen no soportado" }, { status: 400 });
  }

  try {
    return await enCola(id, async () => {
      const sesion = await cargarSesion(id, "web");
      const imagen = cuerpo.imagenBase64
        ? { datos: Buffer.from(cuerpo.imagenBase64, "base64"), tipo: cuerpo.imagenTipo! }
        : undefined;
      const respuestas = await turnoDeAmi(sesion, { texto: cuerpo.texto, imagen });
      await guardarSesion(sesion);
      return Response.json({ respuestas, plan: sesion.plan ?? null });
    });
  } catch (error) {
    console.error("Error en el chat web:", error);
    return Response.json({ error: "Amy no pudo responder. Intenta de nuevo." }, { status: 502 });
  }
}
