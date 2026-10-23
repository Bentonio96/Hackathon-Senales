import { useEffect, useRef, useState } from "react";
import { MOMENTOS } from "../lib/conversacion";
import { hayMovimiento } from "../lib/movimiento";
import { Telefono } from "./Telefono";

/**
 * Escenario fijo: el teléfono se queda quieto y los pasos pasan al lado (en
 * celular, por debajo). El paso que está al centro de la pantalla decide qué
 * momento muestra el chat; «Adelantar el reloj» lleva al siguiente.
 */
export function ComoFunciona() {
  const [activo, setActivo] = useState(0);
  const [animar, setAnimar] = useState(false);
  const pasos = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    setAnimar(hayMovimiento());
    if (!window.matchMedia("(min-width: 64rem)").matches) return;
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setActivo(Number((e.target as HTMLElement).dataset.i));
        }
      },
      // El paso activo es el que cruza el centro de la pantalla.
      { rootMargin: "-45% 0px -45% 0px" },
    );
    pasos.current.forEach((p) => p && obs.observe(p));
    return () => obs.disconnect();
  }, []);

  function ir(i: number) {
    setActivo(i);
    // Solo en escritorio existe la lista de pasos al lado del teléfono.
    if (pasos.current[i]?.offsetParent) pasos.current[i]?.scrollIntoView({ behavior: hayMovimiento() ? "smooth" : "auto", block: "center" });
  }

  const ultimo = activo === MOMENTOS.length - 1;
  const momento = MOMENTOS[activo];

  return (
    <section id="como-funciona" className="relative" aria-labelledby="titulo-como">
      <div className="envoltura pt-20 md:pt-28">
        <h2 id="titulo-como" className="max-w-[18ch] text-titulo">
          Cómo funciona, del jueves al sábado
        </h2>
      </div>

      <div className="envoltura grid gap-x-8 pb-24 lg:grid-cols-12 lg:pb-32">
        {/* El teléfono: arriba y fijo en celular, a la derecha en escritorio. */}
        <div className="pt-8 lg:sticky lg:top-(--alto-header) lg:order-2 lg:col-span-5 lg:col-start-8 lg:h-[calc(100svh-var(--alto-header))] lg:pt-10">
          {/* En celular no hay escenario fijo: el paso se lee arriba del chat y se avanza con el botón. */}
          <div className="mb-6 min-h-[9.5rem] lg:hidden" aria-live="polite">
            <p className="text-lead font-bold">{momento.titulo}</p>
            <p className="mt-2">{momento.detalle}</p>
          </div>
          <div className="mx-auto mb-3 flex max-w-[23rem] items-center justify-between gap-3">
            <p className="text-chico">
              <span className="sr-only">Momento que muestra el chat: </span>
              <span className="font-bold">
                {momento.dia} {momento.hora}
              </span>
            </p>
            <button
              type="button"
              onClick={() => ir(ultimo ? 0 : activo + 1)}
              className="min-h-11 rounded-full bg-tinta px-4 text-chico font-semibold text-cielo transition-transform duration-200 ease-(--ease-salto) active:scale-95"
            >
              {ultimo ? "Volver al jueves" : "Adelantar el reloj"}
            </button>
          </div>
          <div className="h-[31rem] lg:h-auto">
            <Telefono momento={momento} animar={animar} />
          </div>
        </div>

        <ol className="hidden lg:order-1 lg:col-span-6 lg:block">
          {MOMENTOS.map((m, i) => {
            const sel = i === activo;
            return (
              <li
                key={m.id}
                ref={(el) => {
                  pasos.current[i] = el;
                }}
                data-i={i}
                className="flex min-h-[78svh] flex-col justify-center py-8"
              >
                <button
                  type="button"
                  onClick={() => ir(i)}
                  aria-current={sel ? "step" : undefined}
                  className="group text-left"
                >
                  <span className="text-chico font-semibold text-tinta-suave">
                    {m.dia} {m.hora}
                  </span>
                  <span
                    className="mt-2 block text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-tight font-bold tracking-tight"
                  >
                    <span
                      className={`bg-no-repeat transition-[background-size] duration-500 ease-(--ease-brand) ${
                        sel ? "bg-size-[100%_0.42em]" : "bg-size-[0%_0.42em]"
                      }`}
                      // Marcador de un solo color plano, no un degradado.
                      style={{ /* taste-skill-ignore */ backgroundImage: "linear-gradient(var(--amarillo), var(--amarillo))", backgroundPosition: "0 88%" }}
                    >
                      {m.titulo}
                    </span>
                  </span>
                </button>
                <p className="mt-3 max-w-[42ch]">{m.detalle}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
