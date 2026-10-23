import { createHmac, timingSafeEqual } from "node:crypto";
import { kapsoPhoneNumberId } from "./estado";

// Kapso: WhatsApp por la API compatible con Meta Cloud API (https://docs.kapso.ai).
const API = "https://api.kapso.ai/meta/whatsapp/v24.0";

function apiKey() {
  const clave = process.env.KAPSO_API_KEY;
  if (!clave) throw new Error("Falta KAPSO_API_KEY");
  return clave;
}

// El phone_number_id se puede fijar en KAPSO_PHONE_NUMBER_ID; si no, se usa el que llegó en el último webhook.
async function phoneNumberId() {
  const id = process.env.KAPSO_PHONE_NUMBER_ID?.trim() || (await kapsoPhoneNumberId());
  if (!id) throw new Error("Falta KAPSO_PHONE_NUMBER_ID (y todavía no llega ningún mensaje por Kapso)");
  return id;
}

/** Valida X-Webhook-Signature: HMAC-SHA256 en hex del cuerpo crudo, con el secreto del webhook. */
export function firmaKapsoValida(cuerpo: string, firma: string | null): boolean {
  const secreto = process.env.KAPSO_WEBHOOK_SECRET;
  if (!secreto || !firma) return false;
  const esperada = createHmac("sha256", secreto).update(cuerpo, "utf8").digest("hex");
  const a = Buffer.from(esperada);
  const b = Buffer.from(firma.trim());
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Descarga una foto que llegó por Kapso (prueba con la API key; si no la pide, igual funciona). */
export async function descargarMediaKapso(url: string, tipo?: string): Promise<{ datos: Buffer; tipo: string }> {
  const res = await fetch(url, { headers: { "X-API-Key": apiKey() }, redirect: "follow" });
  if (!res.ok) throw new Error(`No se pudo descargar la foto de Kapso: ${res.status}`);
  return { datos: Buffer.from(await res.arrayBuffer()), tipo: tipo || res.headers.get("content-type") || "image/jpeg" };
}

// WhatsApp corta los textos en 4096 caracteres.
function partir(texto: string, max = 4000): string[] {
  if (texto.length <= max) return [texto];
  return texto.match(new RegExp(`[\\s\\S]{1,${max}}`, "g")) ?? [];
}

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));
// Kapso tiene cupo de sobra: por defecto cada burbuja va en su propio mensaje (AMI_KAPSO_BURBUJAS=juntas para juntarlas).
const BURBUJAS_JUNTAS = process.env.AMI_KAPSO_BURBUJAS === "juntas";

/** Manda las burbujas de Amy por Kapso, en orden. `numero` va sin «+», por ejemplo 56912345678. */
export async function enviarKapso(numero: string, ...textos: string[]): Promise<void> {
  const clave = apiKey();
  const pnid = await phoneNumberId();
  const grupos = BURBUJAS_JUNTAS ? [textos.filter(Boolean).join("\n\n")] : textos.filter(Boolean);
  const partes = grupos.flatMap((t) => partir(t));
  for (let i = 0; i < partes.length; i++) {
    const res = await fetch(`${API}/${pnid}/messages`, {
      method: "POST",
      headers: { "X-API-Key": clave, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: numero, type: "text", text: { body: partes[i] } }),
    });
    if (!res.ok) throw new Error(`Kapso respondió ${res.status}: ${await res.text()}`);
    // Pausa corta para que las burbujas lleguen en orden.
    if (i < partes.length - 1) await esperar(1200);
  }
}
