import { useState } from "react";
import { ANTOJOS, ENVIO, OTRO_DELIVERY, RECETA, pesos } from "../lib/conversacion";
import { useRevela } from "../lib/movimiento";
import { Onda } from "./Onda";

type Turno = "almuerzo" | "comida";

function Opcion<T extends string>({
  nombre,
  etiqueta,
  opciones,
  valor,
  cambiar,
}: {
  nombre: string;
  etiqueta: string;
  opciones: { id: T; texto: string }[];
  valor: T;
  cambiar: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="font-semibold">{etiqueta}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {opciones.map((o) => (
          <label key={o.id} className="cursor-pointer">
            <input
              type="radio"
              name={nombre}
              value={o.id}
              checked={valor === o.id}
              onChange={() => cambiar(o.id)}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-11 items-center rounded-full bg-superficie px-5 font-medium transition-[transform,background-color,color] duration-200 ease-(--ease-salto) peer-checked:bg-tinta peer-checked:text-cielo peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accion active:scale-95">
              {o.texto}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Comida({ turno, casero, antojo }: { turno: string; casero: boolean; antojo: (typeof ANTOJOS)[number] }) {
  const faltan = RECETA.faltan.reduce((s, f) => s + f.precio, 0);
  return (
    <div className={`rounded-[24px_34px_26px_36px] px-5 py-4 transition-colors duration-300 ${casero ? "bg-menta" : "bg-amarillo"}`}>
      <p className="text-chico font-semibold">
        {turno} · {casero ? "casero" : "tu antojo"}
      </p>
      {casero ? (
        <>
          <p className="mt-1 text-lead font-bold">
            {RECETA.nombre}, {RECETA.minutos} min
          </p>
          <p className="mt-2 text-chico">
            Con lo que ya tienes. Te falta {RECETA.faltan.map((f) => f.nombre.toLowerCase()).join(" y ")}: {pesos(faltan)}.
          </p>
        </>
      ) : (
        <>
          <p className="mt-1 text-lead font-bold">
            {antojo.nombre} de {antojo.local}
          </p>
          <p className="mt-2 text-chico">
            {pesos(antojo.precio)} + {pesos(ENVIO)} de envío.
          </p>
        </>
      )}
    </div>
  );
}

export function TuSabado() {
  const ref = useRevela<HTMLElement>();
  const [antojoId, setAntojoId] = useState<(typeof ANTOJOS)[number]["id"]>("pizza");
  const [turno, setTurno] = useState<Turno>("comida");
  const antojo = ANTOJOS.find((a) => a.id === antojoId)!;

  const faltan = RECETA.faltan.reduce((s, f) => s + f.precio, 0);
  const todoDelivery = antojo.precio + ENVIO + OTRO_DELIVERY + ENVIO;
  const conPlan = antojo.precio + ENVIO + faltan;
  const quedan = todoDelivery - conPlan;

  return (
    <section ref={ref} id="tu-sabado" className="grano bg-menta" aria-labelledby="titulo-sabado">
      <Onda volteada className="text-cielo" />
      <div className="envoltura grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 id="titulo-sabado" className="revela text-titulo">
            Tu sábado, decidido el jueves
          </h2>
          <p className="revela mt-6 max-w-[42ch]" style={{ ["--i" as string]: 1 }}>
            Un antojo y una comida casera. Tú eliges cuál va primero.
          </p>
          <div className="revela mt-9 space-y-7" style={{ ["--i" as string]: 2 }}>
            <Opcion
              nombre="antojo"
              etiqueta="¿Qué se te antoja?"
              opciones={ANTOJOS.map((a) => ({ id: a.id, texto: a.nombre }))}
              valor={antojoId}
              cambiar={setAntojoId}
            />
            <Opcion<Turno>
              nombre="turno"
              etiqueta="¿Cuándo va el antojo?"
              opciones={[
                { id: "almuerzo", texto: "Al almuerzo" },
                { id: "comida", texto: "A la comida" },
              ]}
              valor={turno}
              cambiar={setTurno}
            />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="revela rounded-[36px_48px_40px_52px] bg-superficie p-5 sm:p-8" style={{ ["--i" as string]: 1 }} aria-live="polite">
            <p className="font-titulo text-lead font-bold">Tu sábado</p>
            <div className="mt-5 grid gap-3">
              <Comida turno="Almuerzo" casero={turno !== "almuerzo"} antojo={antojo} />
              <Comida turno="Comida" casero={turno !== "comida"} antojo={antojo} />
            </div>

            <div className="mt-8">
              <p className="font-semibold">Cuánto sale</p>
              <dl className="mt-4 space-y-4">
                <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-4">
                  <dt>Todo por delivery</dt>
                  <dd className="font-bold tabular-nums">{pesos(todoDelivery)}</dd>
                  <dd className="col-span-2 mt-2 h-3 rounded-full bg-rosado" aria-hidden="true" />
                </div>
                <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-4">
                  <dt>Con Ami, antojo incluido</dt>
                  <dd className="font-bold tabular-nums">{pesos(conPlan)}</dd>
                  <dd className="col-span-2 mt-2 h-3 rounded-full bg-chat-fondo" aria-hidden="true">
                    <div
                      className="h-full rounded-full bg-accion transition-[width] duration-500 ease-(--ease-brand)"
                      style={{ width: `${(conPlan / todoDelivery) * 100}%` }}
                    />
                  </dd>
                </div>
              </dl>
              <p className="mt-5 text-lead font-bold">Te quedan {pesos(quedan)} para la semana.</p>
              <p className="mt-2 text-chico text-tinta-suave">Precios de ejemplo.</p>
            </div>
          </div>
        </div>
      </div>
      <Onda className="text-rosado" />
    </section>
  );
}
