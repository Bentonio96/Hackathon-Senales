import { NOMBRE } from "../config";

const PREGUNTAS = [
  {
    p: "¿Es una dieta?",
    r: "No. No te da una pauta ni cambia la tuya: trabaja con la que te dio tu nutricionista y se encarga de que el finde también tenga plan.",
  },
  {
    p: "¿Cuenta calorías?",
    r: "Nunca. Ni calorías, ni pesos, ni porcentajes de la semana. Habla de comida rica, de cuánto tiempo toma y de cuánto cuesta.",
  },
  {
    p: "¿Me va a pedir que no salga?",
    r: "No. El carrete es parte del plan. Solo te pregunta si sales, para dejar listo el día siguiente.",
  },
  {
    p: "¿Y si no sigo el plan?",
    r: "No pasa nada. No hay racha que se rompa ni nada que compensar. Te escribe «seguimos desde tu próxima comida», y sigues.",
  },
  {
    p: "¿Cuántos mensajes me manda?",
    r: "Pocos: el jueves en la tarde y el sábado al despertar. Si no contestas, no te persigue. Vuelves cuando quieras.",
  },
  {
    p: "¿Para qué quiere la foto del refri?",
    r: "Para ver qué tienes y proponerte una receta con eso, sin que anotes nada. Si no quieres mandarla, le cuentas qué hay.",
  },
  {
    p: "¿Los precios son reales?",
    r: "En esta versión son de ejemplo. La idea es comparar lo que te falta del súper con lo que costaría el delivery.",
  },
  {
    p: "¿Reemplaza a mi nutricionista?",
    r: `No. ${NOMBRE} te ayuda con el fin de semana. Si algo te preocupa de cómo comes, te va a sugerir hablarlo con tu nutricionista o con otro profesional.`,
  },
  {
    p: "¿Cuánto cuesta?",
    r: "Es un prototipo y hoy es gratis. Solo necesitas WhatsApp.",
  },
];

export function Preguntas() {
  return (
    <section id="preguntas" className="envoltura grid gap-10 py-20 md:py-28 lg:grid-cols-12 lg:gap-8" aria-labelledby="titulo-preguntas">
      <h2 id="titulo-preguntas" className="text-titulo lg:col-span-3">
        Preguntas
      </h2>
      <div className="max-w-[72ch] md:columns-2 md:gap-14 lg:col-span-9">
        {PREGUNTAS.map((q) => (
          <p key={q.p} className="mb-5 break-inside-avoid">
            <strong className="font-bold">{q.p}</strong> {q.r}
          </p>
        ))}
      </div>
    </section>
  );
}
