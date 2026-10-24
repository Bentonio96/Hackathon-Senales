import { NOMBRE, WHATSAPP_URL } from "../config";
import { AvatarAmi } from "./Avatar";
import { IconoChat } from "./Icono";
import { Onda } from "./Onda";

/** El borde costero vuelve al final, en silueta: una fila de casas que sigue de largo. */
const SILUETA = [
  [0, 64, 70],
  [70, 82, 92],
  [152, 70, 78],
  [222, 90, 104],
  [312, 76, 86],
  [388, 88, 110],
  [476, 72, 94],
  [548, 92, 120],
  [640, 70, 84],
  [710, 84, 100],
  [794, 78, 116],
  [872, 90, 96],
  [962, 74, 108],
  [1036, 86, 88],
  [1122, 80, 118],
  [1202, 90, 98],
  [1292, 70, 110],
  [1362, 78, 90],
];

export function Cierre() {
  return (
    <section className="grano relative overflow-hidden bg-amarillo" aria-labelledby="titulo-cierre">
      <Onda volteada className="text-cielo" />
      <div className="envoltura grid gap-10 pt-20 pb-10 md:pt-28 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 id="titulo-cierre" className="text-display font-extrabold">
            Disfruta el finde. El lunes, sigues.
          </h2>
          <p className="mt-6 max-w-[44ch] text-lead">
            Escríbele «Hola {NOMBRE}». El jueves te pregunta si sales y, si quieres, dejan el sábado listo.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="boton mt-9"
          >
            <IconoChat />
            Hablar por WhatsApp
            <span className="sr-only"> (se abre en otra pestaña)</span>
          </a>
        </div>
        <div className="hidden items-center justify-center lg:col-span-4 lg:flex">
          <AvatarAmi className="saludo w-full max-w-[20rem]" />
        </div>
      </div>
      <svg viewBox="0 0 1440 130" preserveAspectRatio="xMidYMax slice" className="block h-24 w-full md:h-32" aria-hidden="true">
        {SILUETA.map(([x, w, h]) => (
          <g key={x}>
            <path d={`M${x} 130 V${130 - h + 16} L${x + w / 2} ${130 - h} L${x + w} ${130 - h + 16} V130 Z`} fill="var(--casa-amarillo)" opacity="0.75" />
            <rect x={x + w / 2 - 8} y={130 - h + 30} width="16" height="18" rx="7" fill="var(--superficie)" />
          </g>
        ))}
      </svg>
    </section>
  );
}

export function Pie() {
  return (
    <footer className="bg-cielo">
      <div className="envoltura grid gap-2 py-7 text-chico sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6">
        <p className="text-tinta-suave">{NOMBRE}, un prototipo hecho en una hackatón.</p>
        <ul className="flex gap-6">
          <li>
            <a href="#como-funciona" className="enlace">Cómo funciona</a>
          </li>
          <li>
            <a href="#preguntas" className="enlace">Preguntas</a>
          </li>
        </ul>
        <p className="text-tinta-suave sm:text-right">Las conversaciones son de ejemplo. 2026</p>
      </div>
    </footer>
  );
}
