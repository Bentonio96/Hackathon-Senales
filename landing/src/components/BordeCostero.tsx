import { useState } from "react";
import { AvatarAmi } from "./Avatar";

/**
 * La semana como el borde costero de Valparaíso: siete casas en fila, a la
 * misma altura, frente al mar. No hay subida ni cima: el sábado y el domingo
 * son casas como las otras, y a los lados asoman casas sin nombre porque la
 * semana sigue de largo (el domingo pasa al lunes sin salto).
 * Cada casa es un botón: al tocarla dice qué le toca a ese día en el plan.
 */
type Casa = {
  dia: string;
  corto: string;
  x: number;
  base: number;
  ancho: number;
  alto: number;
  color: string;
  techo: "dos-aguas" | "plano" | "media";
  nota: string;
};

const BASE = 318;

const CASAS: Casa[] = [
  { dia: "Lunes", corto: "Lun", x: 57, base: BASE, ancho: 78, alto: 112, color: "var(--casa-celeste)", techo: "dos-aguas", nota: "Tu pauta, como siempre." },
  { dia: "Martes", corto: "Mar", x: 145, base: BASE, ancho: 78, alto: 128, color: "var(--casa-amarillo)", techo: "plano", nota: "Tu pauta, a tu ritmo." },
  { dia: "Miércoles", corto: "Mié", x: 233, base: BASE, ancho: 78, alto: 104, color: "var(--casa-rosado)", techo: "media", nota: "Tu pauta. Un día normal, y está bien." },
  { dia: "Jueves", corto: "Jue", x: 321, base: BASE, ancho: 78, alto: 122, color: "var(--casa-menta)", techo: "dos-aguas", nota: "Dejas listo el sábado, con la cabeza fresca." },
  { dia: "Viernes", corto: "Vie", x: 409, base: BASE, ancho: 78, alto: 116, color: "var(--casa-naranja)", techo: "plano", nota: "Carrete con tus amigas. Es parte del plan." },
  { dia: "Sábado", corto: "Sáb", x: 497, base: BASE, ancho: 78, alto: 126, color: "var(--casa-azul)", techo: "dos-aguas", nota: "Antojo y algo casero. Ya está decidido." },
  { dia: "Domingo", corto: "Dom", x: 585, base: BASE, ancho: 78, alto: 108, color: "var(--casa-rojo)", techo: "media", nota: "Un día tranquilo. Mañana sigues igual que siempre." },
];

/** Casas sin nombre a los lados: la semana sigue antes y después. */
const VECINAS: Casa[] = [
  { dia: "", corto: "", x: -31, base: BASE, ancho: 78, alto: 118, color: "var(--casa-rojo)", techo: "media", nota: "" },
  { dia: "", corto: "", x: 673, base: BASE, ancho: 78, alto: 110, color: "var(--casa-celeste)", techo: "dos-aguas", nota: "" },
];

const ANCHO = 720;
const ALTO = 440;

function Techo({ c }: { c: Casa }) {
  const y = c.base - c.alto;
  const izq = c.x - 6;
  const der = c.x + c.ancho + 6;
  if (c.techo === "dos-aguas") {
    return <path d={`M${izq} ${y + 4} L${c.x + c.ancho / 2} ${y - 30} L${der} ${y + 4} Z`} fill="var(--techo)" />;
  }
  if (c.techo === "media") {
    return <path d={`M${izq} ${y + 4} L${izq} ${y - 8} L${der} ${y - 26} L${der} ${y + 4} Z`} fill="var(--techo)" />;
  }
  return <rect x={izq} y={y - 8} width={c.ancho + 12} height={12} rx={3} fill="var(--techo)" />;
}

function Ventanas({ c, encendida }: { c: Casa; encendida: boolean }) {
  const y = c.base - c.alto;
  const w = 18;
  const filas = c.alto > 115 ? [y + 18, y + 54] : [y + 22];
  const cols = [c.x + 14, c.x + c.ancho - 14 - w];
  return (
    <g>
      {filas.flatMap((fy, i) =>
        cols.map((cx, j) => (
          <rect
            key={`${i}-${j}`}
            x={cx}
            y={fy}
            width={w}
            height={22}
            rx={9}
            fill={encendida && i === 0 && j === 1 ? "var(--accion)" : "var(--ventana)"}
            style={{ transition: "fill 300ms var(--ease-brand)" }}
          />
        )),
      )}
      {/* La puerta */}
      <path
        d={`M${c.x + c.ancho / 2 - 11} ${c.base} v-24 a11 11 0 0 1 22 0 v24 Z`}
        fill="var(--techo)"
        opacity={0.85}
      />
    </g>
  );
}

export function BordeCostero() {
  const [activa, setActiva] = useState(5);
  const casa = CASAS[activa];

  return (
    <figure className="relative mx-auto w-full max-w-[44rem]">
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="block h-auto w-full" aria-hidden="true">
        <defs>
          <pattern id="calamina" width="7" height="10" patternUnits="userSpaceOnUse">
            <rect width="3" height="10" fill="var(--techo)" opacity="0.1" />
          </pattern>
          {/* La vista recortada como una mancha, no como un rectángulo. */}
          <clipPath id="vista">
            <path d="M30 110 C 28 40, 150 14, 380 14 C 600 14, 704 40, 708 130 L 712 372 C 712 428, 640 438, 360 436 C 80 434, 8 430, 8 366 Z" />
          </clipPath>
        </defs>

        <g clipPath="url(#vista)">
          <rect width={ANCHO} height={ALTO} fill="var(--vista)" />
          <circle cx="604" cy="78" r="34" fill="var(--casa-amarillo)" opacity="0.75" />

          {/* Los cerros de atrás: lomas parejas, ninguna más alta que otra. */}
          <path
            d={`M0 232 ${Array.from({ length: 4 }, (_, k) => `Q${k * 180 + 90} 190 ${k * 180 + 180} 232`).join(" ")} L720 440 L0 440 Z`}
            fill="var(--cerro-2)"
          />

          {/* El paseo frente al mar, de lado a lado. */}
          <rect x="0" y={BASE} width={ANCHO} height="54" fill="var(--cerro)" />

          {VECINAS.map((c) => (
            <g key={c.x} opacity="0.45">
              <Techo c={c} />
              <rect x={c.x} y={c.base - c.alto} width={c.ancho} height={c.alto} rx={4} fill={c.color} />
              <Ventanas c={c} encendida={false} />
            </g>
          ))}

          {CASAS.map((c, i) => {
            const sel = i === activa;
            return (
              <g key={c.dia} className="casa-entra" style={{ ["--i" as string]: i }}>
                <g
                  style={{
                    transform: sel ? "translateY(-8px)" : "none",
                    transition: "transform 380ms var(--ease-salto)",
                  }}
                >
                  <Techo c={c} />
                  <rect x={c.x} y={c.base - c.alto} width={c.ancho} height={c.alto} rx={4} fill={c.color} />
                  <rect x={c.x} y={c.base - c.alto} width={c.ancho} height={c.alto} rx={4} fill="url(#calamina)" />
                  <Ventanas c={c} encendida={sel} />
                </g>
                <text x={c.x + c.ancho / 2} y={c.base + 34} textAnchor="middle" fontSize="23" fontWeight={sel ? 700 : 500} fill="var(--tinta)">
                  {c.corto}
                </text>
              </g>
            );
          })}

          {/* El mar, con el borde de calamina, y un bote. */}
          <path
            d={`M0 380 ${Array.from({ length: 18 }, (_, k) => `Q${k * 40 + 10} 368 ${k * 40 + 20} 380 T${k * 40 + 40} 380`).join(" ")} L720 440 L0 440 Z`}
            fill="var(--mar)"
          />
          <path d="M470 400h56l-8 12h-40z" fill="var(--superficie)" />
          <path d="M498 400v-26l18 22z" fill="var(--casa-amarillo)" />
        </g>
      </svg>

      {/* Botones reales encima de cada casa: teclado y lector de pantalla. */}
      <div className="absolute inset-0" role="group" aria-label="Tu semana, día por día">
        {CASAS.map((c, i) => (
          <button
            key={c.dia}
            type="button"
            aria-pressed={i === activa}
            aria-label={c.dia}
            onClick={() => setActiva(i)}
            onMouseEnter={() => setActiva(i)}
            onFocus={() => setActiva(i)}
            className="absolute cursor-pointer rounded-xl"
            style={{
              left: `${((c.x - 8) / ANCHO) * 100}%`,
              top: `${((c.base - c.alto - 34) / ALTO) * 100}%`,
              width: `${((c.ancho + 16) / ANCHO) * 100}%`,
              height: `${((c.alto + 78) / ALTO) * 100}%`,
            }}
          />
        ))}
      </div>

      <figcaption
        aria-live="polite"
        className="mt-3 flex items-start gap-3 rounded-[4px_22px_22px_22px] bg-superficie py-3 pr-4 pl-3 text-chico sm:absolute sm:top-[2%] sm:left-[4%] sm:mt-0 sm:max-w-[60%] sm:text-cuerpo"
      >
        <AvatarAmi className="size-10 shrink-0 sm:size-12" />
        <span>
          <span className="block font-bold">{casa.dia}</span>
          {casa.nota}
        </span>
      </figcaption>
    </figure>
  );
}
