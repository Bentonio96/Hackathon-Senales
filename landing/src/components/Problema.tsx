import { useRevela } from "../lib/movimiento";
import { NOMBRE } from "../config";
import { AvatarAmi } from "./Avatar";
import { Onda } from "./Onda";

/** El problema: un gusto el finde se siente como perder la semana. Y lo que contesta Amy. */
export function Problema() {
  const ref = useRevela<HTMLElement>();
  return (
    <section ref={ref} className="grano bg-amarillo" aria-labelledby="titulo-problema">
      <div className="envoltura grid items-center gap-10 py-20 md:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <h2 id="titulo-problema" className="revela text-titulo">
            Un antojo el sábado no borra tu semana
          </h2>
          <p className="revela mt-6 max-w-[40ch] text-lead" style={{ ["--i" as string]: 1 }}>
            Cuidas lo que comes de lunes a jueves. El finde sales, pides algo rico y sientes que ya la embarraste: que
            se perdió la semana y el lunes toca partir de cero. {NOMBRE} está para que no sea así. El gusto del finde
            también es parte del plan.
          </p>
        </div>
        <div className="revela flex flex-col gap-3 lg:col-span-4 lg:col-start-9" style={{ ["--i" as string]: 2 }}>
          <p className="ml-auto max-w-[90%] rounded-[22px_4px_22px_22px] bg-celeste px-5 py-3">
            ya la embarré con la semana, el lunes parto de nuevo
          </p>
          <div className="flex items-end gap-3">
            <AvatarAmi className="size-14 shrink-0" />
            <p className="rounded-[4px_22px_22px_22px] bg-superficie px-5 py-3">Pucha, qué lata quedarte con esa sensación. El plan se puede mover 🫶</p>
          </div>
        </div>
      </div>
      <Onda className="text-cielo" />
    </section>
  );
}
