import { NOMBRE } from "../config";

const PREGUNTAS = [
  { p: "¿Es una dieta?", r: "No. Trabaja con la pauta que ya te dio tu nutricionista." },
  { p: "¿Cuántos antojos tengo?", r: "Un número fijo a la semana, que decides con Ami. Si te pasas, no es falla: seguimos." },
  { p: "¿Cuántos mensajes me manda?", r: "Pocos: el jueves en la tarde y el sábado al despertar." },
  { p: "¿Reemplaza a mi nutricionista?", r: `No. Si algo te preocupa, ${NOMBRE} te va a sugerir hablarlo con tu nutricionista o con otro profesional.` },
];

/** Las preguntas como un chat: tú preguntas en celeste, Ami responde en blanco. */
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
