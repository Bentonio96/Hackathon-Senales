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
}

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
    : null;

// Sin Redis el estado vive en memoria: sirve para correrlo local, no en Vercel.
const memoria = globalThis as unknown as { __amiSesiones?: Map<string, Sesion>; __amiUltimoWa?: string };
memoria.__amiSesiones ??= new Map();

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
  if (redis) await redis.set("ami:ultimo-whatsapp", numero);
  else memoria.__amiUltimoWa = numero;
}

export async function ultimoWhatsApp(): Promise<string | null> {
  if (redis) return redis.get<string>("ami:ultimo-whatsapp");
  return memoria.__amiUltimoWa ?? null;
}
