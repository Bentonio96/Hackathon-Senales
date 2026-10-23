import { useState } from "react";
import { ANTOJOS, ENVIO, OTRO_DELIVERY, RECETA, pesos } from "../lib/conversacion";
import { useRevela } from "../lib/movimiento";
import { AvatarAmi } from "./Avatar";
import { Onda } from "./Onda";

type Antojo = (typeof ANTOJOS)[number];
type Linea = { turno: string; que: string; detalle: string; precio: number; antojo?: boolean };

function Sabado({
  titulo,
  lineas,
  destacado = false,
  forma,
}: {
  titulo: string;
  lineas: Linea[];
  destacado?: boolean;
  forma: string;
}) {
  const total = lineas.reduce((s, l) => s + l.precio, 0);
  return (
    <div className={`flex flex-col p-6 sm:p-8 ${forma} ${destacado ? "bg-superficie outline-[3px] outline-accion" : "bg-cielo"}`}>
      <div className="flex items-center gap-3">
        {destacado && <AvatarAmi className="size-10 shrink-0" />}
        <h3 className="text-lead">{titulo}</h3>
      </div>
      <dl className="mt-6 flex-1 space-y-4">
        {lineas.map((l) => (
          <div key={l.turno} className={`rounded-[18px_24px_20px_26px] px-4 py-3 ${l.antojo ? "bg-amarillo" : destacado ? "bg-menta" : "bg-rosado"}`}>
            <dt className="text-chico font-semibold text-tinta-suave">{l.turno}</dt>
            <dd className="mt-0.5 flex items-baseline justify-between gap-4">
              <span>
                <span className="block font-semibold">{l.que}</span>
                <span className="block text-chico">{l.detalle}</span>
              </span>
              <span className="font-bold tabular-nums">{pesos(l.precio)}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 flex items-baseline justify-between gap-4 text-lead font-bold">
        <span>Total</span>
        <span className="tabular-nums">{pesos(total)}</span>
      </p>
    </div>
  );
}

/**
 * La misma comparación que hace Amy el jueves: el sábado de siempre (dos
 * delivery) contra el sábado con Amy (el mismo antojo y una casera con lo que
 * ya tienes). El antojo no se toca; lo que cambia es el almuerzo con caña.
 */
export function TuSabado() {
  const ref = useRevela<HTMLElement>();
  const [antojoId, setAntojoId] = useState<Antojo["id"]>("sushi");
  const antojo = ANTOJOS.find((a) => a.id === antojoId)!;
  const faltan = RECETA.faltan.reduce((s, f) => s + f.precio, 0);

  const comidaAntojo: Linea = {
    turno: "Comida",
    que: `Tu antojo: ${antojo.nombre.toLowerCase()}`,
    detalle: `De ${antojo.local}, con envío`,
    precio: antojo.precio + ENVIO,
    antojo: true,
  };
  const deSiempre: Linea[] = [
    { turno: "Almuerzo", que: "Delivery con caña", detalle: "Lo primero que aparece en la app", precio: OTRO_DELIVERY + ENVIO },
    comidaAntojo,
  ];
  const conAmi: Linea[] = [
    {
      turno: "Almuerzo",
      que: RECETA.nombre,
      detalle: `${RECETA.minutos} min, con lo que ya tienes; falta ${RECETA.faltan.map((f) => f.nombre.toLowerCase()).join(" y ")}`,
      precio: faltan,
    },
    comidaAntojo,
  ];
  const quedan = OTRO_DELIVERY + ENVIO - faltan;

  return (
    <section ref={ref} id="tu-sabado" className="grano bg-menta" aria-labelledby="titulo-sabado">
      <Onda volteada className="text-cielo" />
      <div className="envoltura py-20 md:py-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="titulo-sabado" className="revela max-w-[18ch] text-titulo">
              El mismo sábado, sin culpa y con plata
            </h2>
            <p className="revela mt-5 max-w-[44ch] text-lead" style={{ ["--i" as string]: 1 }}>
              Tu antojo no se toca. Solo cambia el almuerzo con caña.
            </p>
          </div>
          <fieldset className="revela" style={{ ["--i" as string]: 2 }}>
            <legend className="font-semibold">¿Qué se te antoja?</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {ANTOJOS.map((a) => (
                <label key={a.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="antojo"
                    value={a.id}
                    checked={antojoId === a.id}
                    onChange={() => setAntojoId(a.id)}
                    className="peer sr-only"
                  />
                  <span className="inline-flex min-h-11 items-center rounded-full bg-superficie px-5 font-medium transition-[transform,background-color,color] duration-200 ease-(--ease-salto) peer-checked:bg-tinta peer-checked:text-cielo peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accion active:scale-95">
                    {a.nombre}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2" aria-live="polite">
          <div className="revela" style={{ ["--i" as string]: 1 }}>
            <Sabado titulo="Un sábado de siempre" lineas={deSiempre} forma="rounded-[36px_48px_40px_52px]" />
          </div>
          <div className="revela" style={{ ["--i" as string]: 2 }}>
            <Sabado titulo="Un sábado con Amy" lineas={conAmi} destacado forma="rounded-[48px_36px_52px_40px]" />
          </div>
        </div>

        <p className="revela mt-10 text-center font-titulo text-titulo font-bold text-balance" style={{ ["--i" as string]: 3 }}>
          Te quedan {pesos(quedan)} para la semana.
        </p>
        <p className="mt-3 text-center text-chico text-tinta-suave">Precios de ejemplo.</p>
      </div>
      <Onda className="text-rosado" />
    </section>
  );
}
