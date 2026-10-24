import { NOMBRE } from "../config";

const PREGUNTAS = [
  {
    p: "¿Cómo empiezo?",
    r: `Le escribes «Hola ${NOMBRE}» con el botón. Se conocen en tres mensajes: tu nombre, tu rutina de comida en la semana y cómo te va a acompañar.`,
  },
  { p: "¿Es una dieta?", r: "No. Trabaja con la pauta que ya te dio tu nutricionista. Sin rachas, sin calorías, sin contar." },
  { p: "¿Cuántos mensajes me manda?", r: "Pocos: el jueves, el sábado cuando despiertas y el domingo en la noche." },
  { p: "¿Y si un finde no quiero que me escriba?", r: "Le mandas «pausa» y ese finde no te escribe." },
  { p: "¿Y los antojos?", r: `Entran en el plan desde el jueves. ${NOMBRE} no los cuenta ni te dice cuántos te quedan: si quieres otro, el plan se acomoda.` },
  { p: "¿Reemplaza a mi nutricionista?", r: `No. Si algo te preocupa, ${NOMBRE} te va a sugerir hablarlo con tu nutricionista o con otro profesional.` },
];

/** Las preguntas como un chat: tú preguntas en celeste, Amy responde en blanco. */
export function Preguntas() {
  return (
    <section id="preguntas" className="envoltura grid gap-10 py-20 md:py-28 lg:grid-cols-12 lg:gap-8" aria-labelledby="titulo-preguntas">
      <h2 id="titulo-preguntas" className="text-titulo lg:col-span-3">
        Preguntas
      </h2>
      <dl className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:col-span-9">
        {PREGUNTAS.map((q) => (
          <div key={q.p} className="flex flex-col gap-2">
            <dt className="ml-auto w-fit max-w-[90%] rounded-[18px_4px_18px_18px] bg-celeste px-4 py-2.5 font-semibold">{q.p}</dt>
            <dd className="w-fit max-w-[90%] rounded-[4px_18px_18px_18px] bg-superficie px-4 py-2.5">{q.r}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
