import { useRevela } from "../lib/movimiento";
import { AvatarAmi } from "./Avatar";
import { Onda } from "./Onda";

const NUNCA = ["Rachas ni cuentas que vuelvan a cero", "Calorías, peso ni nada de tu cuerpo", "Que dejes de salir con tus amigas", "Compensar el lunes"];
const SIEMPRE = ["Seguir desde tu próxima comida", "Respetar la pauta de tu nutricionista"];

const FORMAS = ["rounded-[26px_34px_28px_38px]", "rounded-[34px_26px_38px_28px]"];

export function Reglas() {
  const ref = useRevela<HTMLElement>();
  return (
    <section ref={ref} id="lo-que-nunca" className="grano bg-rosado" aria-labelledby="titulo-reglas">
      <div className="envoltura grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <h2 id="titulo-reglas" className="revela text-titulo">
            Amy nunca
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {NUNCA.map((n, i) => (
              <li
                key={n}
                className={`revela flex items-center gap-3 bg-superficie px-4 py-4 font-semibold ${FORMAS[i % 2]}`}
                style={{ ["--i" as string]: i }}
              >
                <svg viewBox="0 0 24 24" className="size-6 shrink-0" aria-hidden="true">
                  <path d="m7 7 10 10M17 7 7 17" stroke="var(--casa-rojo)" strokeWidth="2.8" strokeLinecap="round" />
                </svg>
                {n}
              </li>
            ))}
          </ul>
          <h3 className="revela mt-10 text-lead">Siempre</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {SIEMPRE.map((s, i) => (
              <li key={s} className={`revela flex items-center gap-3 bg-celeste px-4 py-4 font-semibold ${FORMAS[(i + 1) % 2]}`}>
                <svg viewBox="0 0 24 24" className="size-6 shrink-0" aria-hidden="true">
                  <path d="m5.5 12.5 4 4 9-9.5" fill="none" stroke="var(--accion)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="revela self-end rounded-[36px_28px_40px_30px] bg-celeste p-6 sm:p-8 lg:col-span-5 lg:col-start-8" style={{ ["--i" as string]: 1 }}>
          <div className="flex items-start gap-3">
            <AvatarAmi className="size-12 shrink-0" />
            <p className="rounded-[4px_18px_18px_18px] bg-superficie px-4 py-3">
              Si comer te está angustiando, te tinca contárselo a tu nutri o a alguien cercano? Te pueden acompañar mejor que yo 🫶
            </p>
          </div>
          <ul className="mt-6 grid gap-3 text-chico">
            <li>
              <span className="font-bold">Tu nutricionista</span>, la que te dio la pauta
            </li>
            <li>
              <a href="tel:6003607777" className="enlace font-bold">
                Salud Responde, 600 360 7777
              </a>
            </li>
            <li>
              <a href="tel:*4141" className="enlace font-bold">
                *4141
              </a>{" "}
              si hay riesgo para tu vida, 24 horas ·{" "}
              <a href="tel:131" className="enlace font-bold">
                SAMU 131
              </a>
            </li>
          </ul>
        </div>
      </div>
      <Onda className="text-cielo" />
    </section>
  );
}
