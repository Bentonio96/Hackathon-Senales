/**
 * La conversación de ejemplo del mockup. Todo es inventado: el refri, los
 * locales y los precios. Nunca calorías ni nada sobre el cuerpo.
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
      { de: "ella", texto: "hola! ¿sales este finde?" },
      { de: "yo", texto: "sí, el viernes hay carrete donde la Coni" },
      { de: "ella", texto: "anda tranqui, el sábado déjamelo a mí 🫶" },
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
      { de: "ella", texto: "con huevos, queso y tortillas te salen unas quesadillas" },
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
    mensajes: [{ de: "nota", texto: "Ami no te escribe de noche. Es tu carrete." }],
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
        texto: "buenos días, sobreviviente 😅 tus quesadillas están a 10 minutos",
        botones: ["Paso a paso", "Hoy prefiero pedir"],
      },
      { de: "yo", texto: "paso a paso porfa" },
      {
        de: "ella",
        pasos: ["bate 2 huevos y revuélvelos", "rellena las tortillas con huevo y queso", "2 minutos por lado y listo"],
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
      { de: "ella", texto: "no la embarraste, comiste rico con tus amigas. seguimos desde tu próxima comida" },
    ],
  },
  {
    id: "domingo",
    dia: "Domingo",
    hora: "20:00",
    titulo: "La culpa del domingo",
    escena: "domingo",
    fondo: "celeste",
    mensajes: [
      { de: "yo", texto: "mañana parto de nuevo" },
      { de: "ella", texto: "no hay que partir de nada: mañana sigues con tu pauta, como siempre 🫶" },
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
