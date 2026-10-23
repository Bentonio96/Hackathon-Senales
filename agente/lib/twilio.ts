import { createHmac, timingSafeEqual } from "node:crypto";

function credenciales() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("Faltan TWILIO_ACCOUNT_SID o TWILIO_AUTH_TOKEN");
  return { sid, token, basic: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64") };
}

/** Valida la cabecera X-Twilio-Signature (HMAC-SHA1 de la URL más los parámetros ordenados). */
export function firmaValida(url: string, params: Record<string, string>, firma: string | null): boolean {
  if (process.env.TWILIO_SKIP_VALIDATION === "1") return true;
  if (!firma) return false;
  const { token } = credenciales();
  const datos = url + Object.keys(params).sort().map((k) => k + params[k]).join("");
  const esperada = createHmac("sha1", token).update(datos, "utf8").digest("base64");
  const a = Buffer.from(esperada);
  const b = Buffer.from(firma);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Descarga una foto que Antonia mandó por WhatsApp (las URLs de Twilio piden autenticación). */
export async function descargarMedia(url: string): Promise<{ datos: Buffer; tipo: string }> {
  const res = await fetch(url, { headers: { Authorization: credenciales().basic }, redirect: "follow" });
  if (!res.ok) throw new Error(`No se pudo descargar la foto: ${res.status}`);
  return { datos: Buffer.from(await res.arrayBuffer()), tipo: res.headers.get("content-type") ?? "image/jpeg" };
}

// WhatsApp corta en 1600 caracteres: los mensajes largos se parten por párrafos.
function partir(texto: string, max = 1500): string[] {
  const partes: string[] = [];
  let actual = "";
  for (const parrafo of texto.split(/\n{2,}/)) {
    if ((actual + "\n\n" + parrafo).length > max && actual) {
      partes.push(actual);
      actual = parrafo;
    } else {
      actual = actual ? actual + "\n\n" + parrafo : parrafo;
    }
  }
  if (actual) partes.push(actual);
  return partes.flatMap((p) => (p.length > max ? p.match(new RegExp(`[\\s\\S]{1,${max}}`, "g")) ?? [] : [p]));
}

export async function enviarWhatsApp(para: string, texto: string): Promise<void> {
  const { sid, basic } = credenciales();
  const desde = process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886";
  for (const parte of partir(texto)) {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: { Authorization: basic, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ From: desde, To: para, Body: parte }),
    });
    if (!res.ok) throw new Error(`Twilio respondió ${res.status}: ${await res.text()}`);
  }
}
