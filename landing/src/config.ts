/**
 * Lo que se cambia antes de presentar: el nombre del agente (Ami, decidido el
 * 2026-10-23) y su número de WhatsApp (aún no existe: es un marcador).
 * El nombre también está en index.html (title y og): búscalo como "Ami".
 */
export const NOMBRE = "Ami";

/** Número en formato internacional, sin "+" ni espacios. Marcador de posición. */
export const WHATSAPP_NUMERO = "56900000000";

/** Primer mensaje que queda escrito al abrir el chat. */
export const WHATSAPP_TEXTO = "Hola, quiero dejar listo mi finde";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_TEXTO)}`;
