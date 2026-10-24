/**
 * Lo que se cambia antes de presentar: el nombre del agente (Amy, decidido el
 * 2026-10-23) y su número de WhatsApp.
 * El nombre también está en index.html (title y og): búscalo como "Amy".
 */
export const NOMBRE = "Amy";

/**
 * Número en formato internacional, sin "+" ni espacios. Es el número del sandbox
 * de WhatsApp de Kapso (+56 9 2040 3095), donde hoy vive Amy. Solo responde a los
 * celulares activados en el sandbox de Kapso (cada uno con su código de activación).
 */
export const WHATSAPP_NUMERO = "56920403095";

/** Primer mensaje que queda escrito al abrir el chat. */
export const WHATSAPP_TEXTO = "Hola Amy, es mi primera vez aquí";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_TEXTO)}`;
