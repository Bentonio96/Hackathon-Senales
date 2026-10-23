import { createHmac, timingSafeEqual } from "node:crypto";

// Kapso: WhatsApp por la API compatible con Meta Cloud API (https://docs.kapso.ai).
const API = "https://api.kapso.ai/meta/whatsapp/v24.0";

function config() {
  const apiKey = process.env.KAPSO_API_KEY;
  const phoneNumberId = process.env.KAPSO_PHONE_NUMBER_ID;
  if (!apiKey || !phoneNumberId) throw new Error("Faltan KAPSO_API_KEY o KAPSO_PHONE_NUMBER_ID");
  return { apiKey, phoneNumberId };
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
  const res = await fetch(url, { headers: { "X-API-Key": config().apiKey }, redirect: "follow" });
  if (!res.ok) throw new Error(`No se pudo descargar la foto de Kapso: ${res.status}`);
  return { datos: Buffer.from(await res.arrayBuffer()), tipo: tipo || res.headers.get("content-type") || "image/jpeg" };
}

// WhatsApp corta los textos en 4096 caracteres.
function partir(texto: string, max = 4000): string[] {
  if (texto.length <= max) return [texto];
  return texto.match(new RegExp(`[\\s\\S]{1,${max}}`, "g")) ?? [];
}

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));
const BURBUJAS_JUNTAS = process.env.AMI_WHATSAPP_BURBUJAS !== "separadas";

/** Manda las burbujas de Amy por Kapso, en orden. `numero` va sin «+», por ejemplo 56912345678. */
export async function enviarKapso(numero: string, ...textos: string[]): Promise<void> {
  const { apiKey, phoneNumberId } = config();
  const grupos = BURBUJAS_JUNTAS ? [textos.filter(Boolean).join("\n\n")] : textos.filter(Boolean);
  const partes = grupos.flatMap((t) => partir(t));
  for (let i = 0; i < partes.length; i++) {
    const res = await fetch(`${API}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: numero, type: "text", text: { body: partes[i] } }),
    });
    if (!res.ok) throw new Error(`Kapso respondió ${res.status}: ${await res.text()}`);
    // Pausa corta para que las burbujas lleguen en orden.
    if (i < partes.length - 1) await esperar(1200);
  }
}
