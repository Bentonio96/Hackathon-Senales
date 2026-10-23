import { useRevela } from "../lib/movimiento";
import { Onda } from "./Onda";

const ANTES = [
  { dia: "Lun", texto: "Pauta al pie de la letra" },
  { dia: "Mar", texto: "Pauta" },
  { dia: "Mié", texto: "Pauta" },
  { dia: "Jue", texto: "Cuatro de cuatro" },
  { dia: "Vie", texto: "«Ya la embarré»" },
  { dia: "Sáb", texto: "«Qué más da»: dos delivery" },
  { dia: "Dom", texto: "«El lunes parto de nuevo»" },
];

const AHORA = [
  { dia: "Lun", texto: "Tu pauta" },
  { dia: "Mar", texto: "Tu pauta" },
  { dia: "Mié", texto: "Tu pauta" },
  { dia: "Jue", texto: "Dejas listo el sábado" },
  { dia: "Vie", texto: "Carrete, en el plan" },
  { dia: "Sáb", texto: "Un antojo y algo casero" },
  { dia: "Dom", texto: "Sigues donde quedaste" },
];

function Semana({ titulo, dias, cierre, rota }: { titulo: string; dias: typeof ANTES; cierre: string; rota: boolean }) {
  return (
    <div className="revela" style={{ ["--i" as string]: rota ? 1 : 2 }}>
      <h3 className="text-lead">{titulo}</h3>
      <ol className="mt-4 grid gap-1.5 sm:grid-cols-7 sm:gap-2">
        {dias.map((d, i) => {
          const finde = i >= 4;
          const fondo = rota && finde ? "bg-cielo" : "bg-superficie";
          return (
            <li
              key={d.dia}
              className={`flex items-baseline gap-3 rounded-full px-4 py-2 sm:min-h-40 sm:flex-col sm:items-start sm:justify-between sm:rounded-t-[1.6rem] sm:rounded-b-md sm:px-2.5 sm:pt-3 sm:pb-2 ${fondo}`}
            >
              <span className="w-9 shrink-0 text-chico font-bold sm:w-auto">{d.dia}</span>
              <span className="text-chico leading-tight sm:text-[0.8125rem] md:text-chico">{d.texto}</span>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-chico font-medium">{cierre}</p>
    </div>
  );
}

export function Problema() {
  const ref = useRevela<HTMLElement>();
  return (
    <section ref={ref} className="grano bg-amarillo" aria-labelledby="titulo-problema">
      <div className="envoltura grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 id="titulo-problema" className="revela text-titulo">
            «Ya la embarré con la semana.»
          </h2>
          <div className="revela mt-7 max-w-[46ch] space-y-4" style={{ ["--i" as string]: 1 }}>
            <p className="font-medium">
              De lunes a jueves te va perfecto. El viernes sales, el sábado amaneces con caña y pides delivery dos
              veces. El domingo te prometes partir de nuevo el lunes.
            </p>
            <p>
              El problema no es el carrete. Es la vara: si la semana tiene que ser perfecta, un completo a las tres de
              la mañana basta para sentir que perdiste todo, y el lunes vuelves a cero.
            </p>
            <p>
              Por eso{" "}
              <strong className="font-bold">el fin de semana entra al plan</strong>, decidido el jueves, cuando
              todavía piensas claro. No es una falla que haya que compensar.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-10 lg:col-span-7 lg:col-start-6">
          <Semana titulo="La semana con vara perfecta" dias={ANTES} cierre="Y el lunes, de vuelta a cero." rota />
          <Semana titulo="La semana con el finde en el plan" dias={AHORA} cierre="Y el lunes sigues, no empiezas." rota={false} />
        </div>
      </div>
      <Onda className="text-cielo" />
    </section>
  );
}
