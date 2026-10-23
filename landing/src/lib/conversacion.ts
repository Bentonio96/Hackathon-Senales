/**
 * La conversación de ejemplo del mockup. Todo es inventado: el refri, los
 * locales y los precios. Nunca calorías ni nada sobre el cuerpo.
 */

export type Mensaje =
  | { de: "ella" | "yo"; texto: string }
  | { de: "yo"; foto: true }
  | { de: "ella"; plan: true }
  | { de: "ella"; texto: string; botones: string[] }
  | { de: "ella"; pasos: string[] };

export type Momento = {
  id: string;
  hora: string;
  dia: string;
  titulo: string;
  detalle: string;
  mensajes: Mensaje[];
};

export const MOMENTOS: Momento[] = [
  {
    id: "jueves",
    dia: "Jueves",
    hora: "17:05",
    titulo: "El jueves te pregunta si sales.",
    detalle: "A las cinco, cuando vas saliendo de la U y todavía tienes la cabeza fresca.",
    mensajes: [
      { de: "ella", texto: "Hola. ¿Vas saliendo de la U? Pregunta rápida: ¿sales este finde?" },
      { de: "yo", texto: "Sí, el viernes hay carrete donde la Coni" },
      {
        de: "ella",
        texto: "Buena, que lo pasen increíble. Dejemos listo el sábado ahora, que estás lúcida.",
      },
    ],
  },
  {
    id: "refri",
    dia: "Jueves",
    hora: "17:09",
    titulo: "Le mandas una foto de tu refri.",
    detalle: "Y una de la despensa. Con eso ve qué tienes, sin que anotes nada.",
    mensajes: [
      { de: "ella", texto: "¿Me mandas una foto del refri y otra de la despensa?" },
      { de: "yo", foto: true },
      {
        de: "ella",
        texto: "Veo huevos, queso, media cebolla, tortillas y papas. Con eso sale algo rico.",
      },
    ],
  },
  {
    id: "plan",
    dia: "Jueves",
    hora: "17:11",
    titulo: "Te deja decidido el sábado.",
    detalle:
      "Un antojo planificado y una receta casera de 10 minutos, con lo que te falta y cuánto cuesta en el súper.",
    mensajes: [
      { de: "ella", plan: true },
      { de: "yo", texto: "Me tinca. ¿Y si la pizza va en la comida y no al almuerzo?" },
      { de: "ella", texto: "Hecho, lo cambié. El plan es tuyo: lo movemos cuando quieras." },
    ],
  },
  {
    id: "sabado",
    dia: "Sábado",
    hora: "11:20",
    titulo: "El sábado te despierta con el plan.",
    detalle: "La receta paso a paso o el botón para pedir tu antojo. Llega antes que las ganas de abrir la app.",
    mensajes: [
      {
        de: "ella",
        texto: "Buenos días. El almuerzo ya está decidido: quesadillas en 10 minutos. ¿Te paso los pasos?",
        botones: ["Ver la receta", "Pedir mi antojo"],
      },
      { de: "yo", texto: "Ver la receta" },
      {
        de: "ella",
        pasos: [
          "Bate 2 huevos con sal y revuélvelos con la cebolla picada.",
          "Rellena 2 tortillas con el huevo y el queso.",
          "Dóralas 2 minutos por lado en el sartén.",
          "Tomate y cilantro arriba. Listo.",
        ],
      },
    ],
  },
  {
    id: "rompe",
    dia: "Sábado",
    hora: "15:40",
    titulo: "Si el plan se rompe, sigue contigo.",
    detalle: "Sin sermones ni cuentas que vuelvan a cero: seguimos desde tu próxima comida.",
    mensajes: [
      { de: "yo", texto: "Al final pedimos completos con las chiquillas. Ya la embarré" },
      {
        de: "ella",
        texto: "No hay nada que arreglar: comiste rico con tus amigas. Seguimos desde tu próxima comida.",
      },
      { de: "ella", texto: "La pizza de la noche sigue en pie. Las quesadillas quedan para mañana, si te tinca." },
    ],
  },
];

/** Precios de ejemplo (inventados), en pesos chilenos. */
export const ANTOJOS = [
  { id: "pizza", nombre: "Pizza", local: "Forno Alegre", precio: 11900 },
  { id: "sushi", nombre: "Sushi", local: "Rolls del Puerto", precio: 12990 },
  { id: "hamburguesa", nombre: "Hamburguesa", local: "La Esquina", precio: 9990 },
] as const;

export const ENVIO = 1990;

export const RECETA = {
  nombre: "Quesadillas con huevo",
  minutos: 10,
  tienes: ["Huevos", "Queso", "Tortillas", "Cebolla"],
  faltan: [
    { nombre: "Tomate", precio: 690 },
    { nombre: "Cilantro", precio: 500 },
  ],
};

/** Lo que costaría la segunda comida si también fuera delivery. */
export const OTRO_DELIVERY = 10990;

/** Formato fijo (no toLocaleString): el prerender en Node y el navegador dan lo mismo. */
export const pesos = (n: number) => "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
