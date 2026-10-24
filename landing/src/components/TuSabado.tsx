import { useRevela } from "../lib/movimiento";
import { AvatarAmi } from "./Avatar";
import { DibujoEscena } from "./Escenas";
import { Onda } from "./Onda";

const OPCIONES = [
  {
    titulo: "Algo rico de tu refri",
    texto: "Una casera de 10 minutos con lo que ya tienes. Amy te guía paso a paso y la receta queda en tu recetario, que solo crece.",
    escena: "refri" as const,
    fondo: "bg-menta",
    forma: "rounded-[36px_48px_40px_52px]",
  },
  {
    titulo: "Tu antojo por delivery",
    texto: "Amy te manda el enlace directo a un local en PedidosYa. Sin culpa: tu antojo también es parte del plan.",
    escena: "amigas" as const,
    fondo: "bg-amarillo",
    forma: "rounded-[48px_36px_52px_40px]",
  },
];

/**
 * Lo que queda decidido el jueves para el sábado: una de dos, las dos valen.
 * Y si el plan cambia, no pasa nada.
 */
export function TuSabado() {
  const ref = useRevela<HTMLElement>();
  return (
    <section ref={ref} id="tu-sabado" className="grano bg-celeste" aria-labelledby="titulo-sabado">
      <Onda volteada className="text-cielo" />
      <div className="envoltura py-20 md:py-28">
        <h2 id="titulo-sabado" className="revela max-w-[18ch] text-titulo">
          El sábado, tú eliges
        </h2>
        <p className="revela mt-5 max-w-[46ch] text-lead" style={{ ["--i" as string]: 1 }}>
          Lo dejan decidido el jueves, cuando estás tranquila. El sábado con caña ya no tienes que pensar.
        </p>

        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {OPCIONES.map((o, i) => (
            <li key={o.titulo} className={`revela flex flex-col gap-4 bg-superficie p-6 sm:p-8 ${o.forma}`} style={{ ["--i" as string]: i + 1 }}>
              <div className={`w-fit rounded-[24px_30px_26px_32px] px-4 py-3 ${o.fondo}`}>
                <DibujoEscena escena={o.escena} className="h-20 w-auto" />
              </div>
              <h3 className="text-lead">{o.titulo}</h3>
              <p className="max-w-[40ch]">{o.texto}</p>
            </li>
          ))}
        </ul>

        <div className="revela mt-10 flex items-end gap-3 md:justify-center" style={{ ["--i" as string]: 3 }}>
          <AvatarAmi className="size-14 shrink-0" />
          <p className="rounded-[4px_22px_22px_22px] bg-superficie px-5 py-3 text-lead">
            Y si el plan cambia, no pasa nada. El finde también es parte de tu semana 🫶
          </p>
        </div>
      </div>
      <Onda className="text-rosado" />
    </section>
  );
}
