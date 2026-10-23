/**
 * Lo que se cambia antes de presentar: el nombre del agente (Ami, decidido el
 * 2026-10-23) y su número de WhatsApp.
 * El nombre también está en index.html (title y og): búscalo como "Ami".
 */
export const NOMBRE = "Ami";

/**
 * Número en formato internacional, sin "+" ni espacios. Es el número del sandbox
 * de WhatsApp de Twilio (+1 415 523 8886), donde hoy vive Ami.
 */
export const WHATSAPP_NUMERO = "14155238886";

/**
 * Primer mensaje que queda escrito al abrir el chat. En el sandbox, el primer
 * mensaje tiene que ser el código de unión; después ya se conversa con Ami.
 * Con un número propio de Ami, cambiar por «Hola, quiero dejar listo mi finde».
 */
export const WHATSAPP_TEXTO = "join driving-minerals";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_TEXTO)}`;
