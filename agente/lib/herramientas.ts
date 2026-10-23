import type Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { PlanSabado, Sesion } from "./estado";

interface PreciosEjemplo {
  supermercado: Record<string, number>;
  antojos_delivery: Record<string, number>;
}

const preciosEjemplo: PreciosEjemplo = JSON.parse(
  readFileSync(path.join(process.cwd(), "data", "precios-ejemplo.json"), "utf8"),
);

// Solo abren la app (o su web): no hay API pública para buscar menús ni hacer pedidos.
export const ENLACES_DELIVERY = {
  pedidosya: "https://www.pedidosya.cl",
  ubereats: "https://www.ubereats.com/cl",
  rappi: "https://www.rappi.cl",
} as const;

export const herramientas: Anthropic.Beta.BetaToolUnion[] = [
  {
    name: "buscar_precio_supermercado",
    description:
      "Busca el precio actual de un producto en Jumbo (jumbo.cl). Úsala para cada ingrediente que le falta a Antonia. Devuelve hasta 3 productos con nombre y precio en pesos chilenos. Si la búsqueda en vivo falla, devuelve un precio de ejemplo marcado como tal.",
    input_schema: {
      type: "object",
      properties: {
        producto: {
          type: "string",
          description: "Producto en español, simple y genérico, como lo escribiría alguien en el buscador del súper. Ej: 'pan de hamburguesa', 'queso laminado'.",
        },
      },
      required: ["producto"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "precio_antojo_delivery",
    description:
      "Da un precio de referencia por delivery para un antojo (hamburguesa, pizza, sushi, etc.) y un enlace para pedir. Los precios son de ejemplo: díselo así a Antonia.",
    input_schema: {
      type: "object",
      properties: {
        antojo: { type: "string", description: "El antojo, por ejemplo 'hamburguesa con papas' o 'pizza mediana'." },
        app: {
          type: "string",
          enum: ["pedidosya", "ubereats", "rappi", "no_sabe"],
          description: "La app de delivery que usa Antonia, si la dijo.",
        },
      },
      required: ["antojo", "app"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "revisar_nutrientes",
    description:
      "USO INTERNO. Consulta energía y proteína aproximadas de los ingredientes de una receta (base USDA FoodData Central) para comprobar que la receta casera calce con la pauta. Nunca le muestres estos números a Antonia.",
    input_schema: {
      type: "object",
      properties: {
        ingredientes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              nombre_en_ingles: { type: "string", description: "Nombre del alimento en inglés, lo más específico posible para que la búsqueda acierte. Ej: 'egg whole raw', 'bread white commercial'." },
              gramos: { type: "number", description: "Cantidad aproximada en gramos en la receta." },
            },
            required: ["nombre_en_ingles", "gramos"],
            additionalProperties: false,
          },
        },
      },
      required: ["ingredientes"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "guardar_plan_sabado",
    description:
      "Guarda el plan del sábado cuando Antonia ya eligió. Llámala una vez por plan; si ella lo cambia, llámala de nuevo con el plan completo actualizado.",
    input_schema: {
      type: "object",
      properties: {
        hora_despertar: { type: "string", description: "Hora a la que Antonia cree que despierta el sábado, ej. '15:00'." },
        comidas: {
          type: "array",
          items: {
            type: "object",
            properties: {
              momento: { type: "string", enum: ["almuerzo", "comida"] },
              tipo: { type: "string", enum: ["antojo_delivery", "casera"] },
              nombre: { type: "string" },
              detalle: { type: "string", description: "Para la casera, la receta paso a paso. Para el antojo, qué pedir." },
              ingredientes_faltantes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    nombre: { type: "string" },
                    precio: { type: "number" },
                    precio_de_ejemplo: { type: "boolean" },
                  },
                  required: ["nombre", "precio", "precio_de_ejemplo"],
                  additionalProperties: false,
                },
              },
              costo_estimado: { type: "number" },
            },
            required: ["momento", "tipo", "nombre", "detalle", "ingredientes_faltantes", "costo_estimado"],
            additionalProperties: false,
          },
        },
      },
      required: ["hora_despertar", "comidas"],
      additionalProperties: false,
    },
    strict: true,
  },
];

interface ProductoJumbo {
  nombre: string;
  precio: number;
  url: string;
}

async function buscarEnJumbo(producto: string): Promise<ProductoJumbo[]> {
  const res = await fetch(`https://www.jumbo.cl/busqueda?ft=${encodeURIComponent(producto)}`, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; AmiHackaton/0.1)" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Jumbo respondió ${res.status}`);
  const html = await res.text();
  // La página de búsqueda trae los resultados como JSON-LD (schema.org ItemList).
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let datos: unknown;
    try {
      datos = JSON.parse(m[1]);
    } catch {
      continue;
    }
    const lista = datos as {
      "@type"?: string;
      itemListElement?: { item?: { name?: string; url?: string; offers?: { price?: number } } }[];
    };
    if (lista["@type"] !== "ItemList" || !lista.itemListElement) continue;
    return lista.itemListElement
      .map((e) => ({ nombre: e.item?.name ?? "", precio: Number(e.item?.offers?.price), url: e.item?.url ?? "" }))
      .filter((p) => p.nombre && Number.isFinite(p.precio) && p.precio > 0)
      .slice(0, 3);
  }
  return [];
}

function precioEjemploMasParecido(tabla: Record<string, number>, consulta: string): [string, number] | null {
  const palabras = consulta.toLowerCase().split(/\s+/).filter((p) => p.length > 2);
  let mejor: [string, number] | null = null;
  let mejorPuntaje = 0;
  for (const [nombre, precio] of Object.entries(tabla)) {
    const puntaje = palabras.filter((p) => nombre.includes(p)).length;
    if (puntaje > mejorPuntaje) {
      mejor = [nombre, precio];
      mejorPuntaje = puntaje;
    }
  }
  return mejor;
}

async function nutrientesFdc(nombre: string, gramos: number) {
  const key = process.env.FDC_API_KEY || "DEMO_KEY";
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(nombre)}&pageSize=1&dataType=Foundation,SR%20Legacy&api_key=${key}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`FDC respondió ${res.status}`);
  const datos = (await res.json()) as {
    foods?: { description: string; foodNutrients: { nutrientName: string; unitName: string; value: number }[] }[];
  };
  const alimento = datos.foods?.[0];
  if (!alimento) return { nombre, encontrado: false };
  const valor = (n: string, unidad: string) =>
    alimento.foodNutrients.find((x) => x.nutrientName.startsWith(n) && x.unitName.toUpperCase() === unidad)?.value;
  const factor = gramos / 100;
  const kcal = valor("Energy", "KCAL");
  const proteina = valor("Protein", "G");
  return {
    nombre,
    coincidencia_usda: alimento.description,
    kcal_aprox: kcal !== undefined ? Math.round(kcal * factor) : null,
    proteina_g_aprox: proteina !== undefined ? Math.round(proteina * factor * 10) / 10 : null,
  };
}

export async function ejecutarHerramienta(nombre: string, entrada: unknown, sesion: Sesion): Promise<string> {
  switch (nombre) {
    case "buscar_precio_supermercado": {
      const { producto } = entrada as { producto: string };
      try {
        const productos = await buscarEnJumbo(producto);
        if (productos.length > 0) {
          return JSON.stringify({ fuente: "jumbo.cl, precio consultado ahora", precio_de_ejemplo: false, productos });
        }
      } catch (error) {
        console.warn("Búsqueda en Jumbo falló:", error);
      }
      const ejemplo = precioEjemploMasParecido(preciosEjemplo.supermercado, producto);
      return JSON.stringify(
        ejemplo
          ? { fuente: "tabla de ejemplo", precio_de_ejemplo: true, productos: [{ nombre: ejemplo[0], precio: ejemplo[1] }] }
          : { fuente: "sin datos", precio_de_ejemplo: true, productos: [], nota: "No hay precio: dile que no lo sabes." },
      );
    }
    case "precio_antojo_delivery": {
      const { antojo, app } = entrada as { antojo: string; app: keyof typeof ENLACES_DELIVERY | "no_sabe" };
      const ejemplo = precioEjemploMasParecido(preciosEjemplo.antojos_delivery, antojo);
      return JSON.stringify({
        precio_de_ejemplo: true,
        referencia: ejemplo ? { nombre: ejemplo[0], precio: ejemplo[1] } : null,
        enlace_para_pedir: app === "no_sabe" ? null : ENLACES_DELIVERY[app],
        ...(app === "no_sabe" ? { nota_app: "Pregúntale qué app usa antes de darle el enlace." } : {}),
        nota: "Precio de referencia, no de un local real.",
      });
    }
    case "revisar_nutrientes": {
      const { ingredientes } = entrada as { ingredientes: { nombre_en_ingles: string; gramos: number }[] };
      const resultados = await Promise.all(
        ingredientes.map((i) =>
          nutrientesFdc(i.nombre_en_ingles, i.gramos).catch((error) => ({ nombre: i.nombre_en_ingles, error: String(error) })),
        ),
      );
      return JSON.stringify({ uso_interno: "No mostrar ningún número a Antonia.", resultados });
    }
    case "guardar_plan_sabado": {
      const plan = entrada as Omit<PlanSabado, "guardado_en">;
      sesion.plan = { ...plan, guardado_en: new Date().toISOString() };
      return JSON.stringify({ guardado: true });
    }
    default:
      throw new Error(`Herramienta desconocida: ${nombre}`);
  }
}
