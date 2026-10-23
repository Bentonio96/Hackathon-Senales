import type Anthropic from "@anthropic-ai/sdk";
import { Redis } from "@upstash/redis";

export type Canal = "whatsapp" | "web";

export interface ComidaPlan {
  momento: "almuerzo" | "comida";
  tipo: "antojo_delivery" | "casera";
  nombre: string;
  detalle: string;
  ingredientes_faltantes: { nombre: string; precio: number; precio_de_ejemplo: boolean }[];
  costo_estimado: number;
}

export interface PlanSabado {
  hora_despertar: string;
  comidas: ComidaPlan[];
  guardado_en: string;
}

export interface Sesion {
  id: string;
  canal: Canal;
  // Historial completo y solo de agregar: los bloques de thinking se reenvían tal cual.
  historial: Anthropic.Beta.BetaMessageParam[];
  plan?: PlanSabado;
  turnos: number;
  // Estado interno del acompañamiento (diseño de Esperanza). Nunca se le muestra a Antonia.
  modo?: "normal" | "derivada" | "pausa";
  derivacion_previa?: { nivel: string; fecha: string } | null;
  // Cómo se llama y cómo tratarla gramaticalmente (lo infiere Amy del nombre o de cómo se nombra).
  perfil?: { nombre: string; trato: Trato };
  // Último mensaje que escribió la persona (WhatsApp solo deja escribirle libremente hasta 24 horas después).
  ultimo_mensaje_usuario?: string;
}

export type Trato = "femenino" | "masculino" | "neutro";

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
    : null;

// Sin Redis el estado vive en memoria: sirve para correrlo local, no en Vercel.
const memoria = globalThis as unknown as {
  __amiSesiones?: Map<string, Sesion>;
  __amiUltimoWa?: string;
  __amiUsuariosWa?: Set<string>;
};
memoria.__amiSesiones ??= new Map();
memoria.__amiUsuariosWa ??= new Set();

const clave = (id: string) => `ami:sesion:${id}`;

export async function cargarSesion(id: string, canal: Canal): Promise<Sesion> {
  const guardada = redis ? await redis.get<Sesion>(clave(id)) : memoria.__amiSesiones!.get(id);
  return guardada ?? { id, canal, historial: [], turnos: 0 };
}

export async function guardarSesion(sesion: Sesion): Promise<void> {
  if (redis) {
    await redis.set(clave(sesion.id), sesion, { ex: 60 * 60 * 24 * 14 });
  } else {
    memoria.__amiSesiones!.set(sesion.id, sesion);
  }
}

export async function borrarSesion(id: string): Promise<void> {
  if (redis) await redis.del(clave(id));
  else memoria.__amiSesiones!.delete(id);
}

// El panel de la demo dispara el reloj sobre el último número que escribió por WhatsApp.
export async function recordarUltimoWhatsApp(numero: string): Promise<void> {
  if (redis) {
    await redis.set("ami:ultimo-whatsapp", numero);
    await redis.sadd("ami:usuarios-wa", numero);
  } else {
    memoria.__amiUltimoWa = numero;
    memoria.__amiUsuariosWa!.add(numero);
  }
}

/** Todas las personas que le han escrito a Amy por WhatsApp (para los mensajes programados). */
export async function usuariosWhatsApp(): Promise<string[]> {
  if (redis) return redis.smembers("ami:usuarios-wa");
  return [...memoria.__amiUsuariosWa!];
}

export async function ultimoWhatsApp(): Promise<string | null> {
  if (redis) return redis.get<string>("ami:ultimo-whatsapp");
  return memoria.__amiUltimoWa ?? null;
}

/** true la primera vez que se ve una clave (para ignorar webhooks repetidos). */
export async function primeraVez(clave: string): Promise<boolean> {
  if (redis) return (await redis.set(`ami:visto:${clave}`, 1, { nx: true, ex: 60 * 60 * 24 })) === "OK";
  const vistos = ((memoria as { __amiVistos?: Set<string> }).__amiVistos ??= new Set());
  if (vistos.has(clave)) return false;
  vistos.add(clave);
  return true;
}

/** El phone_number_id de Kapso que llega en cada webhook (sirve para responder sin configurarlo a mano). */
export async function recordarKapsoPhoneNumberId(id: string): Promise<void> {
  if (redis) await redis.set("ami:kapso-phone-number-id", id);
  else (memoria as { __amiKapsoPnid?: string }).__amiKapsoPnid = id;
}

export async function kapsoPhoneNumberId(): Promise<string | null> {
  if (redis) return redis.get<string>("ami:kapso-phone-number-id");
  return (memoria as { __amiKapsoPnid?: string }).__amiKapsoPnid ?? null;
}
