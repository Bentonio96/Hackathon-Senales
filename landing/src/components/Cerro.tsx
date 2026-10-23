import { useState } from "react";
import { AvatarAmi } from "./Avatar";

/**
 * La semana como un cerro de Valparaíso: siete casas que suben, una por día.
 * El viernes y el sábado son casas como las otras, y el cerro nunca baja.
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

const CASAS: Casa[] = [
  { dia: "Lunes", corto: "Lun", x: 22, base: 506, ancho: 84, alto: 104, color: "var(--casa-celeste)", techo: "dos-aguas", nota: "Tu pauta, como siempre." },
  { dia: "Martes", corto: "Mar", x: 118, base: 486, ancho: 78, alto: 118, color: "var(--casa-amarillo)", techo: "plano", nota: "Tu pauta, a tu ritmo." },
  { dia: "Miércoles", corto: "Mié", x: 208, base: 452, ancho: 86, alto: 110, color: "var(--casa-rosado)", techo: "media", nota: "Tu pauta. Un día normal, y está bien." },
  { dia: "Jueves", corto: "Jue", x: 306, base: 404, ancho: 80, alto: 128, color: "var(--casa-menta)", techo: "dos-aguas", nota: "Dejas listo el sábado, con la cabeza fresca." },
  { dia: "Viernes", corto: "Vie", x: 398, base: 346, ancho: 88, alto: 116, color: "var(--casa-naranja)", techo: "plano", nota: "Carrete con tus amigas. Es parte del plan." },
  { dia: "Sábado", corto: "Sáb", x: 498, base: 282, ancho: 84, alto: 130, color: "var(--casa-azul)", techo: "dos-aguas", nota: "Antojo y algo casero. Ya está decidido." },
  { dia: "Domingo", corto: "Dom", x: 594, base: 222, ancho: 90, alto: 112, color: "var(--casa-rojo)", techo: "media", nota: "Sigues donde quedaste. No hay cuenta que limpiar." },
];

const ANCHO = 720;
const ALTO = 600;

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

export function Cerro() {
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
            <path d="M34 150 C 30 60, 150 22, 380 20 C 600 18, 706 56, 708 190 L 714 520 C 714 588, 640 600, 360 598 C 80 596, 6 590, 8 500 Z" />
          </clipPath>
        </defs>

        <g clipPath="url(#vista)">
          <rect width={ANCHO} height={ALTO} fill="var(--vista)" />
          {/* Sol de día, luna de noche: el mismo círculo cambia con el tema. */}
          <circle cx="560" cy="96" r="40" fill="var(--ventana)" />
          <circle cx="560" cy="96" r="40" fill="var(--casa-amarillo)" opacity="0.7" />

          {/* El cerro de atrás y el de adelante. */}
          <path d="M0 470 C 140 430, 260 330, 400 250 C 520 180, 620 120, 720 96 L720 600 L0 600 Z" fill="var(--cerro-2)" />
          <path d="M0 530 C 150 512, 260 470, 380 400 C 500 330, 600 250, 720 212 L720 600 L0 600 Z" fill="var(--cerro)" />

          {/* La escalera que sube entre las casas. */}
          <path
            d="M72 530 h26 v-14 h26 v-14 h26 v-16 h26 v-16 h26 v-18 h26 v-18 h26 v-20 h26 v-20 h26 v-22 h26 v-22 h26 v-20 h26 v-22 h26 v-20 h26 v-18 h26 v-18"
            fill="none"
            stroke="var(--tinta)"
            strokeOpacity="0.22"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {CASAS.map((c, i) => {
            const sel = i === activa;
            return (
              <g
                key={c.dia}
                className="casa-entra"
                style={{ ["--i" as string]: i }}
              >
                <g
                  style={{
                    transform: sel ? "translateY(-10px)" : "none",
                    transition: "transform 380ms var(--ease-salto)",
                  }}
                >
                  <Techo c={c} />
                  <rect x={c.x} y={c.base - c.alto} width={c.ancho} height={c.alto} rx={4} fill={c.color} />
                  <rect x={c.x} y={c.base - c.alto} width={c.ancho} height={c.alto} rx={4} fill="url(#calamina)" />
                  <Ventanas c={c} encendida={sel} />
                </g>
                <text
                  x={c.x + c.ancho / 2}
                  y={c.base + 30}
                  textAnchor="middle"
                  fontSize="19"
                  fontWeight={sel ? 700 : 500}
                  fill="var(--tinta)"
                >
                  {c.corto}
                </text>
              </g>
            );
          })}

          {/* El mar, con el mismo borde de calamina. */}
          <path
            d={`M0 556 ${Array.from({ length: 19 }, (_, k) => `Q${k * 40 + 10} 544 ${k * 40 + 20} 556 T${k * 40 + 40} 556`).join(" ")} L720 600 L0 600 Z`}
            fill="var(--mar)"
          />
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
              height: `${((c.alto + 72) / ALTO) * 100}%`,
            }}
          />
        ))}
      </div>

      <figcaption
        aria-live="polite"
        className="absolute top-[2%] left-0 flex max-w-[66%] items-start gap-3 rounded-[1.4rem] rounded-bl-md bg-superficie py-3 pr-4 pl-3 text-chico sm:text-cuerpo"
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
