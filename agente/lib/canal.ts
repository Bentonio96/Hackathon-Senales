import { enviarKapso } from "./kapso";
import { enviarWhatsApp } from "./twilio";

/**
 * Manda las respuestas de Amy por el canal de la sesión, según el prefijo del id:
 * «kapso:56912345678» va por Kapso y «whatsapp:+56912345678» por Twilio.
 */
export async function enviarA(id: string, ...textos: string[]): Promise<void> {
  if (id.startsWith("kapso:")) return enviarKapso(id.slice("kapso:".length), ...textos);
  return enviarWhatsApp(id, ...textos);
}
