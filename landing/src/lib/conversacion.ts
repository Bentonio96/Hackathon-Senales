/**
 * La conversación de ejemplo del mockup, fiel a lo que Amy hace hoy. Todo es
 * inventado: el refri y los locales. Nunca calorías, precios ni nada sobre el cuerpo.
 */

export type Mensaje =
  | { de: "ella" | "yo"; texto: string }
  | { de: "yo"; foto: true }
  | { de: "ella"; plan: true }
  | { de: "ella"; texto: string; botones: string[] }
  | { de: "ella"; pasos: string[] }
  | { de: "nota"; texto: string };

export type Escena = "u" | "refri" | "carrete" | "cana" | "amigas" | "domingo";

export type Momento = {
  id: string;
  hora: string;
  dia: string;
  /** La situación de la vida real, en pocas palabras. */
  titulo: string;
  escena: Escena;
  fondo: "amarillo" | "celeste" | "rosado" | "menta";
  mensajes: Mensaje[];
};

export const MOMENTOS: Momento[] = [
  {
    id: "jueves",
    dia: "Jueves",
    hora: "17:05",
    titulo: "Vas saliendo de la U",
    escena: "u",
    fondo: "amarillo",
    mensajes: [
      { de: "ella", texto: "Hola! Sales este finde?" },
      { de: "yo", texto: "sí, el viernes hay carrete donde la Coni" },
      { de: "ella", texto: "Dale, pásalo bien! 😉 Y si quieres, el sábado lo armamos juntas" },
    ],
  },
  {
    id: "refri",
    dia: "Jueves",
    hora: "17:09",
    titulo: "Le sacas una foto al refri",
    escena: "refri",
    fondo: "celeste",
    mensajes: [
      { de: "yo", foto: true },
      { de: "ella", texto: "Con huevos, queso y tortillas te salen unas quesadillas" },
      { de: "ella", plan: true },
    ],
  },
  {
    id: "carrete",
    dia: "Viernes",
    hora: "02:40",
    titulo: "El completo del carrete",
    escena: "carrete",
    fondo: "rosado",
    mensajes: [{ de: "nota", texto: "El viernes Amy no te escribe. Es tu carrete." }],
  },
  {
    id: "sabado",
    dia: "Sábado",
    hora: "11:20",
    titulo: "Despiertas con caña",
    escena: "cana",
    fondo: "menta",
    mensajes: [
      {
        de: "ella",
        texto: "Hola! Cómo amaneciste? Tus quesadillas están a 10 minutos 😅",
        botones: ["Paso a paso", "Hoy prefiero pedir"],
      },
      { de: "yo", texto: "paso a paso porfa" },
      {
        de: "ella",
        pasos: ["Bate 2 huevos y revuélvelos", "Rellena las tortillas con huevo y queso", "2 minutos por lado y listo"],
      },
    ],
  },
  {
    id: "rompe",
    dia: "Sábado",
    hora: "15:40",
    titulo: "Al final piden sushi con las chiquillas",
    escena: "amigas",
    fondo: "amarillo",
    mensajes: [
      { de: "yo", texto: "igual pedimos sushi. ya la embarré" },
      { de: "ella", texto: "Te entiendo. El finde también es parte de tu semana 🫶" },
    ],
  },
  {
    id: "domingo",
    dia: "Domingo",
    hora: "20:00",
    titulo: "Amy pregunta cómo estuvo el finde",
    escena: "domingo",
    fondo: "celeste",
    mensajes: [
      { de: "ella", texto: "Hola! Cómo estuvo el finde?" },
      { de: "yo", texto: "bien! las quesadillas quedaron ricas" },
      { de: "ella", texto: "Qué bueno! Ya quedaron en tu recetario 🫶" },
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
  nombre: "Quesadillas de huevo",
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
