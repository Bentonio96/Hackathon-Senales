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

// Amy puede llamar varias herramientas a la vez: sin esto, dos escrituras de la misma persona
// leen el mismo estado y la última pisa a la otra. Encadena las escrituras por clave.
const enCurso = new Map<string, Promise<unknown>>();
function enSerie<T>(clave: string, tarea: () => Promise<T>): Promise<T> {
  const anterior = enCurso.get(clave) ?? Promise.resolve();
  const actual = anterior.catch(() => {}).then(tarea);
  enCurso.set(clave, actual);
  actual.finally(() => { if (enCurso.get(clave) === actual) enCurso.delete(clave); }).catch(() => {});
  return actual;
}

// El recetario: las caseras que la persona contó que cocinó. Vive aparte de la sesión y sin
// vencimiento, así que «reiniciar» no lo borra. Solo crece: no se cuenta ni se le muestra un número.
export interface RecetaGuardada {
  nombre: string;
  cuando: string; // el momento con sus palabras, ej. «el sábado con caña»
  guardada_en: string;
}

const claveRecetario = (id: string) => `ami:recetario:${id}`;
const recetariosEnMemoria = () => ((memoria as { __amiRecetarios?: Map<string, RecetaGuardada[]> }).__amiRecetarios ??= new Map());

export async function cargarRecetario(id: string): Promise<RecetaGuardada[]> {
  if (redis) return (await redis.get<RecetaGuardada[]>(claveRecetario(id))) ?? [];
  return recetariosEnMemoria().get(id) ?? [];
}

/** Agrega una receta si no estaba (por nombre). Devuelve false si ya estaba. */
export function agregarAlRecetario(id: string, receta: Omit<RecetaGuardada, "guardada_en">): Promise<boolean> {
  return enSerie(claveRecetario(id), () => agregarSinCola(id, receta));
}

async function agregarSinCola(id: string, receta: Omit<RecetaGuardada, "guardada_en">): Promise<boolean> {
  const recetario = await cargarRecetario(id);
  const normal = (s: string) => s.trim().toLowerCase();
  if (recetario.some((r) => normal(r.nombre) === normal(receta.nombre))) return false;
  recetario.push({ ...receta, guardada_en: new Date().toISOString() });
  if (redis) await redis.set(claveRecetario(id), recetario);
  else recetariosEnMemoria().set(id, recetario);
  return true;
}

// Lo que Amy va sabiendo de la persona, solo lo que ella misma contó (nada de salud, peso ni cuerpo).
// Igual que el recetario: aparte de la sesión y sin vencimiento. Ella puede pedir verlo u olvidarlo.
export const TIPOS_RECUERDO = ["hora_despertar", "antojo_favorito", "app_delivery", "le_gusta", "no_le_gusta", "rutina", "si_pasa_esto", "otro"] as const;
export type TipoRecuerdo = (typeof TIPOS_RECUERDO)[number];
// Estos tienen un solo valor: si cambia, se reemplaza. Los demás se acumulan.
const UNICOS: TipoRecuerdo[] = ["hora_despertar", "antojo_favorito", "app_delivery", "si_pasa_esto"];

export interface Recuerdo {
  tipo: TipoRecuerdo;
  dato: string;
  guardado_en: string;
}

const claveMemoria = (id: string) => `ami:memoria:${id}`;
const memoriasEnMemoria = () => ((memoria as { __amiMemorias?: Map<string, Recuerdo[]> }).__amiMemorias ??= new Map());

export async function cargarMemoria(id: string): Promise<Recuerdo[]> {
  if (redis) return (await redis.get<Recuerdo[]>(claveMemoria(id))) ?? [];
  return memoriasEnMemoria().get(id) ?? [];
}

async function escribirMemoria(id: string, recuerdos: Recuerdo[]): Promise<void> {
  if (redis) await redis.set(claveMemoria(id), recuerdos);
  else memoriasEnMemoria().set(id, recuerdos);
}

export function recordar(id: string, tipo: TipoRecuerdo, dato: string): Promise<void> {
  return enSerie(claveMemoria(id), () => recordarSinCola(id, tipo, dato));
}

async function recordarSinCola(id: string, tipo: TipoRecuerdo, dato: string): Promise<void> {
  const normal = (s: string) => s.trim().toLowerCase();
  let recuerdos = await cargarMemoria(id);
  if (UNICOS.includes(tipo)) recuerdos = recuerdos.filter((r) => r.tipo !== tipo);
  else if (recuerdos.some((r) => r.tipo === tipo && normal(r.dato) === normal(dato))) return;
  recuerdos.push({ tipo, dato, guardado_en: new Date().toISOString() });
  await escribirMemoria(id, recuerdos);
}

/**
 * Lo que ella pide olvidar: un tipo de recuerdo, su recetario o todo. Nada se borra solo:
 * solo cuando ella lo pide.
 */
export function olvidar(id: string, tipo: TipoRecuerdo | "recetario" | "todo"): Promise<void> {
  return enSerie(claveMemoria(id), () => olvidarSinCola(id, tipo));
}

async function olvidarSinCola(id: string, tipo: TipoRecuerdo | "recetario" | "todo"): Promise<void> {
  if (tipo === "recetario" || tipo === "todo") {
    if (redis) await redis.del(claveRecetario(id));
    else recetariosEnMemoria().delete(id);
  }
  if (tipo === "recetario") return;
  const recuerdos = tipo === "todo" ? [] : (await cargarMemoria(id)).filter((r) => r.tipo !== tipo);
  await escribirMemoria(id, recuerdos);
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
