import { useEffect, useRef, useState } from "react";
import { MOMENTOS } from "../lib/conversacion";
import { centrar, hayMovimiento } from "../lib/movimiento";
import { DibujoEscena } from "./Escenas";
import { Telefono } from "./Telefono";

const FONDOS = {
  amarillo: "bg-amarillo",
  celeste: "bg-celeste",
  rosado: "bg-rosado",
  menta: "bg-menta",
} as const;

/** Esquinas irregulares, como las tarjetas de los mockups de Ami. */
const FORMAS = [
  "rounded-[28px_40px_30px_44px]",
  "rounded-[40px_28px_44px_30px]",
  "rounded-[32px_44px_28px_38px]",
];

/**
 * Un finde cualquiera, en escenas. Cada escena es un botón que pone el chat en
 * ese momento. En escritorio el teléfono queda fijo y la escena del centro de
 * la pantalla manda; en celular las escenas son una fila que se desliza.
 */
export function ComoFunciona() {
  const [activo, setActivo] = useState(0);
  const [animar, setAnimar] = useState(false);
  const tarjetas = useRef<(HTMLLIElement | null)[]>([]);
  const fila = useRef<HTMLOListElement>(null);

  useEffect(() => {
    setAnimar(hayMovimiento());
    if (!window.matchMedia("(min-width: 64rem)").matches) return;
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setActivo(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    tarjetas.current.forEach((t) => t && obs.observe(t));
    return () => obs.disconnect();
  }, []);

  function ir(i: number) {
    setActivo(i);
    const t = tarjetas.current[i];
    if (!t) return;
    if (window.matchMedia("(min-width: 64rem)").matches) {
      centrar(t);
    } else if (fila.current) {
      // En celular solo se desliza la fila, la página no se mueve.
      const desfase = t.getBoundingClientRect().left - fila.current.getBoundingClientRect().left - 16;
      fila.current.scrollBy({ left: desfase, behavior: hayMovimiento() ? "smooth" : "auto" });
    }
  }

  const ultimo = activo === MOMENTOS.length - 1;
  const momento = MOMENTOS[activo];

  return (
    <section id="como-funciona" className="relative" aria-labelledby="titulo-como">
      <div className="envoltura pt-20 md:pt-28">
        <h2 id="titulo-como" className="max-w-[16ch] text-titulo">
          Un finde cualquiera, con Ami
        </h2>
        <p className="mt-4 max-w-[40ch] text-lead text-tinta-suave">Toca una escena y mira qué te escribe.</p>
      </div>

      <div className="envoltura grid gap-x-10 pb-24 lg:grid-cols-12 lg:pb-32">
        <ol
          ref={fila}
          className="-mx-(--margen) mt-8 flex snap-x snap-mandatory scroll-px-(--margen) gap-3 overflow-x-auto px-(--margen) pt-1 pb-4 lg:order-1 lg:col-span-6 lg:mx-0 lg:mt-0 lg:block lg:snap-none lg:overflow-visible lg:px-0 lg:pt-[18svh] lg:pb-[30svh]"
          aria-label="Escenas del finde"
        >
          {MOMENTOS.map((m, i) => {
            const sel = i === activo;
            return (
              <li
                key={m.id}
                ref={(el) => {
                  tarjetas.current[i] = el;
                }}
                data-i={i}
                className="w-[15.5rem] shrink-0 snap-start lg:mb-6 lg:w-auto"
              >
                <button
                  type="button"
                  onClick={() => ir(i)}
                  aria-pressed={sel}
                  className={`flex h-full w-full flex-col gap-3 p-5 text-left transition-transform duration-300 ease-(--ease-salto) lg:flex-row lg:items-center lg:gap-6 lg:p-6 ${FONDOS[m.fondo]} ${FORMAS[i % FORMAS.length]} ${
                    sel ? "outline-[3px] outline-accion lg:translate-x-3" : ""
                  }`}
                >
                  <DibujoEscena escena={m.escena} className="h-20 w-auto shrink-0 self-start lg:h-24" />
                  <span>
                    <span className="block text-chico font-semibold text-tinta-suave">
                      {m.dia} {m.hora}
                    </span>
                    <span className="mt-1 block font-titulo text-[1.375rem] leading-tight font-bold tracking-tight lg:text-[1.75rem]">
                      {m.titulo}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="pt-4 lg:sticky lg:top-(--alto-header) lg:order-2 lg:col-span-5 lg:col-start-8 lg:h-[calc(100svh-var(--alto-header))] lg:pt-10">
          <div className="mx-auto mb-3 flex max-w-[23rem] items-center justify-between gap-3">
            <p className="text-chico" aria-live="polite">
              <span className="sr-only">El chat muestra: </span>
              <span className="font-bold">
                {momento.dia} {momento.hora}
              </span>
            </p>
            <button
              type="button"
              onClick={() => ir(ultimo ? 0 : activo + 1)}
              className="min-h-11 rounded-full bg-accion px-4 text-chico font-semibold text-accion-texto transition-transform duration-200 ease-(--ease-salto) active:scale-95"
            >
              {ultimo ? "Volver al jueves" : "Adelantar el reloj"}
            </button>
          </div>
          <div className="h-[30rem] lg:h-auto">
            <Telefono momento={momento} animar={animar} />
          </div>
        </div>
      </div>
    </section>
  );
}
