import { after } from "next/server";
import { turnoDeAmi } from "@/lib/ami";
import { enviarA } from "@/lib/canal";
import { enCola } from "@/lib/cola";
import {
  borrarSesion,
  cargarSesion,
  guardarSesion,
  primeraVez,
  recordarKapsoPhoneNumberId,
  recordarUltimoWhatsApp,
} from "@/lib/estado";
import { descargarMediaKapso, firmaKapsoValida, marcarLeidoEscribiendo } from "@/lib/kapso";

export const maxDuration = 300;

interface MensajeKapso {
  id?: string;
  type?: string;
  from?: string;
  text?: { body?: string };
  kapso?: {
    direction?: string;
    content?: string;
    media_url?: string;
    media_data?: { url?: string; content_type?: string };
  };
}

interface EventoKapso {
  message?: MensajeKapso;
  conversation?: { phone_number?: string; phone_number_id?: string };
  phone_number_id?: string;
}

// Webhook de Kapso (evento whatsapp.message.received). Responde al tiro y procesa después.
export async function POST(req: Request) {
  const cuerpo = await req.text();
  if (!firmaKapsoValida(cuerpo, req.headers.get("x-webhook-signature"))) {
    return new Response("Firma inválida", { status: 401 });
  }
  const evento = req.headers.get("x-webhook-event");
  if (evento && evento !== "whatsapp.message.received") return new Response("ok");

  const idempotencia = req.headers.get("x-idempotency-key");
  if (idempotencia && !(await primeraVez(`kapso:${idempotencia}`))) return new Response("ok");

  let datos: EventoKapso | { data?: EventoKapso[] };
  try {
    datos = JSON.parse(cuerpo);
  } catch {
    return new Response("JSON inválido", { status: 400 });
  }
  // El evento puede venir solo o en lote.
  const eventos: EventoKapso[] = "message" in datos ? [datos as EventoKapso] : ((datos as { data?: EventoKapso[] }).data ?? []);

  for (const e of eventos) {
    const pnid = e.phone_number_id ?? e.conversation?.phone_number_id;
    if (pnid) await recordarKapsoPhoneNumberId(pnid);
    const m = e.message;
    if (!m || (m.kapso?.direction && m.kapso.direction !== "inbound")) continue;
    if (m.id && !(await primeraVez(`kapso-msg:${m.id}`))) continue;
    const numero = (m.from ?? e.conversation?.phone_number ?? "").replace(/\D/g, "");
    if (!numero) continue;
    const id = `kapso:${numero}`;
    const texto = m.text?.body ?? (m.type === "text" ? m.kapso?.content : undefined) ?? "";
    const urlFoto = m.type === "image" ? (m.kapso?.media_url ?? m.kapso?.media_data?.url) : undefined;

    after(() =>
      Promise.all([
        // Ticks azules y «escribiendo…» al tiro, a la vez que Amy empieza a pensar.
        m.id ? marcarLeidoEscribiendo(m.id) : undefined,
        enCola(id, async () => {
        try {
          await recordarUltimoWhatsApp(id);
          if (texto.trim().toLowerCase() === "reiniciar") {
            await borrarSesion(id);
            await enviarA(id, "Listo, borré esta conversación ✨");
            return;
          }
          const sesion = await cargarSesion(id, "whatsapp");
          sesion.ultimo_mensaje_usuario = new Date().toISOString();
          const imagen = urlFoto ? await descargarMediaKapso(urlFoto, m.kapso?.media_data?.content_type) : undefined;
          const respuestas = await turnoDeAmi(sesion, { texto, imagen });
          await guardarSesion(sesion);
          await enviarA(id, ...respuestas);
        } catch (error) {
          console.error("Error procesando mensaje de Kapso:", error);
          await enviarA(id, "Uy, se me enredó algo. Me lo mandas de nuevo? 😅").catch(() => undefined);
        }
        }),
      ]),
    );
  }

  return new Response("ok");
}
