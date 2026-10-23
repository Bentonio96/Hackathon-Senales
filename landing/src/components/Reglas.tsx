import { useRevela } from "../lib/movimiento";
import { Onda } from "./Onda";

const NUNCA = [
  { titulo: "Ni rachas ni cuentas que vuelvan a cero.", texto: "No hay nada que se rompa si un día no sale como pensabas." },
  { titulo: "Ni calorías, ni pesarte, ni hablar de tu cuerpo.", texto: "Habla de comida rica, de tiempo y de plata. Nada más." },
  { titulo: "Ni que dejes de salir con tus amigas.", texto: "El carrete es parte del plan. Solo te pregunta si sales." },
  { titulo: "Ni compensar el lunes.", texto: "Nada de saltarte comidas ni de pagar el finde con ejercicio." },
];

const SIEMPRE = [
  "Sigue desde tu próxima comida, pase lo que pase.",
  "Respeta la pauta de tu nutricionista. No la cambia ni la reemplaza.",
  "Te dice con cariño cuando algo merece hablarlo con una persona.",
];

export function Reglas() {
  const ref = useRevela<HTMLElement>();
  return (
    <section ref={ref} id="lo-que-nunca" className="grano bg-rosado" aria-labelledby="titulo-reglas">
      <div className="envoltura py-20 md:py-28">
        <h2 id="titulo-reglas" className="revela max-w-[20ch] text-titulo">
          Lo que nunca te va a pedir
        </h2>

        <ul className="mt-12 grid gap-x-10 gap-y-9 md:grid-cols-2">
          {NUNCA.map((n, i) => (
            <li key={n.titulo} className="revela flex gap-4" style={{ ["--i" as string]: i }}>
              <svg viewBox="0 0 40 40" className="mt-1 size-9 shrink-0" aria-hidden="true">
                <path d="M20 3c10 0 17 7 17 17s-8 17-17 17S3 29 3 19 10 3 20 3Z" fill="var(--superficie)" />
                <path d="m13 13 14 14M27 13 13 27" stroke="var(--tinta)" strokeWidth="3.2" strokeLinecap="round" />
              </svg>
              <div>
                <h3 className="text-lead">{n.titulo}</h3>
                <p className="mt-1.5 max-w-[40ch]">{n.texto}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="revela lg:col-span-5">
            <h3 className="text-lead">Lo que sí hace</h3>
            <ul className="mt-5 space-y-4">
              {SIEMPRE.map((s) => (
                <li key={s} className="flex gap-3 font-medium">
                  <svg viewBox="0 0 24 24" className="mt-1 size-6 shrink-0" aria-hidden="true">
                    <path d="M12 2c6 0 10 4 10 10s-5 10-10 10S2 18 2 12 6 2 12 2Z" fill="var(--accion)" />
                    <path d="m7.5 12.5 3 3 6-6.5" fill="none" stroke="var(--accion-texto)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="revela rounded-[2.4rem] rounded-tl-[5rem] bg-tinta p-7 text-cielo sm:p-10 lg:col-span-7"
            style={{ ["--i" as string]: 1 }}
          >
            <h3 id="titulo-ayuda" className="text-lead">
              Si comer te está angustiando, no es algo que se arregle con un plan.
            </h3>
            <p className="mt-3 max-w-[52ch]">
              Si sientes culpa todo el tiempo, te saltas comidas para compensar o sientes que pierdes el control seguido,
              habla con alguien. El agente te lo va a decir y te deja estos datos:
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              <li>
                <span className="block font-bold">Tu nutricionista</span>
                La que te dio tu pauta. Es la primera persona a quien contarle.
              </li>
              <li>
                <a href="tel:6003607777" className="enlace block font-bold">
                  Salud Responde, 600 360 7777
                </a>
                Opción 2, salud mental. Del Minsal, gratis.
              </li>
              <li>
                <a href="tel:*4141" className="enlace block font-bold">
                  *4141 desde tu celular
                </a>
                Si hay riesgo para tu vida. Gratis, las 24 horas.
              </li>
              <li>
                <a href="tel:131" className="enlace block font-bold">
                  SAMU, 131
                </a>
                Si es una emergencia.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Onda className="text-cielo" />
    </section>
  );
}
