import { useRevela } from "../lib/movimiento";
import { AvatarAmi } from "./Avatar";
import { Onda } from "./Onda";

/** El problema en dos frases: lo que se dice el domingo y lo que contesta Ami. */
export function Problema() {
  const ref = useRevela<HTMLElement>();
  return (
    <section ref={ref} className="grano bg-amarillo" aria-labelledby="titulo-problema">
      <div className="envoltura grid items-center gap-10 py-20 md:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h2 id="titulo-problema" className="revela text-titulo">
            «Ya la embarré, el lunes parto de nuevo.»
          </h2>
          <p className="revela mt-6 max-w-[40ch] text-lead" style={{ ["--i" as string]: 1 }}>
            Un completo a las tres de la mañana no borra tu semana. Con Ami, el finde ya viene en el plan.
          </p>
        </div>
        <div className="revela flex items-end gap-3 lg:col-span-4 lg:col-start-9" style={{ ["--i" as string]: 2 }}>
          <AvatarAmi className="size-16 shrink-0" />
          <p className="rounded-[4px_26px_24px_28px] bg-superficie px-5 py-4 text-lead">el lunes no se parte de cero: se sigue 🫶</p>
        </div>
      </div>
      <Onda className="text-cielo" />
    </section>
  );
}
