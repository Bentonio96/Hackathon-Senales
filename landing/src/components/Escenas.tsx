import type { JSX } from "react";
import type { Escena } from "../lib/conversacion";

/**
 * Seis escenas de un finde cualquiera, dibujadas a mano en SVG con la paleta
 * de Amy. Son decoración: el texto de cada tarjeta dice lo mismo.
 */
const T = "var(--tinta)";

function U() {
  return (
    <>
      <circle cx="96" cy="26" r="12" fill="var(--casa-naranja)" />
      <path d="M22 44 60 24l38 20z" fill="var(--casa-celeste)" />
      <rect x="26" y="44" width="68" height="34" rx="3" fill="var(--superficie)" />
      {[34, 50, 66, 82].map((x) => (
        <rect key={x} x={x - 3} y="48" width="6" height="26" rx="3" fill="var(--casa-celeste)" />
      ))}
      <path d="M100 78c0-10 6-16 12-16s12 6 12 16z" fill="var(--casa-amarillo)" />
      <circle cx="112" cy="54" r="7" fill="var(--casa-amarillo)" />
      <rect x="104" y="64" width="9" height="12" rx="3" fill="var(--casa-rosado)" />
    </>
  );
}

function Refri() {
  return (
    <>
      <rect x="40" y="10" width="54" height="72" rx="8" fill="var(--superficie)" />
      <path d="M94 12 122 20v54l-28 8z" fill="var(--casa-celeste)" />
      <rect x="44" y="40" width="46" height="3" rx="1.5" fill="var(--linea)" />
      {[50, 60, 70].map((x) => (
        <ellipse key={x} cx={x} cy="33" rx="4" ry="5.5" fill="var(--casa-amarillo)" />
      ))}
      <path d="M76 38h12l-12-8z" fill="var(--casa-naranja)" />
      <circle cx="54" cy="56" r="7" fill="var(--casa-rosado)" />
      <rect x="66" y="52" width="20" height="5" rx="2.5" fill="var(--casa-naranja)" />
      <rect x="20" y="52" width="18" height="28" rx="4" fill={T} />
      <rect x="23" y="56" width="12" height="18" rx="2" fill="var(--casa-celeste)" />
    </>
  );
}

function Carrete() {
  return (
    <>
      <path d="M30 14a14 14 0 1 0 14 18 11 11 0 0 1-14-18z" fill="var(--casa-amarillo)" />
      {[
        [70, 14],
        [100, 24],
        [116, 10],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2.5" fill="var(--casa-amarillo)" />
      ))}
      <rect x="20" y="52" width="100" height="22" rx="11" fill="var(--casa-naranja)" />
      <rect x="26" y="46" width="88" height="12" rx="6" fill="var(--casa-rojo)" />
      <path d="M28 46q6-6 12 0t12 0 12 0 12 0 12 0 12 0 12 0" fill="none" stroke="var(--superficie)" strokeWidth="3" strokeLinecap="round" />
      <rect x="34" y="40" width="70" height="7" rx="3.5" fill="var(--casa-menta)" />
    </>
  );
}

function Cana() {
  return (
    <>
      <rect x="84" y="8" width="34" height="30" rx="5" fill="var(--superficie)" />
      <circle cx="101" cy="23" r="8" fill="var(--casa-amarillo)" />
      <rect x="14" y="52" width="108" height="20" rx="6" fill="var(--casa-celeste)" />
      <rect x="14" y="44" width="30" height="14" rx="7" fill="var(--superficie)" />
      <path d="M40 50c16-12 50-12 80 2v12H40z" fill="var(--casa-rosado)" />
      <rect x="14" y="70" width="6" height="12" rx="2" fill={T} />
      <rect x="116" y="70" width="6" height="12" rx="2" fill={T} />
      <text x="50" y="34" fontSize="13" fontWeight="700" fill={T}>
        z z
      </text>
    </>
  );
}

function Amigas() {
  return (
    <>
      <ellipse cx="70" cy="64" rx="38" ry="12" fill="var(--superficie)" />
      {[54, 70, 86].map((x) => (
        <g key={x}>
          <circle cx={x} cy="61" r="6" fill={T} />
          <circle cx={x} cy="61" r="3" fill="var(--casa-rosado)" />
        </g>
      ))}
      <path d="M14 82c0-18 8-28 16-28s16 10 16 28z" fill="var(--casa-amarillo)" />
      <circle cx="30" cy="42" r="10" fill="var(--casa-amarillo)" />
      <path d="M54 30c0-12 7-18 14-18s14 6 14 18z" fill="var(--casa-celeste)" />
      <path d="M94 82c0-18 8-28 16-28s16 10 16 28z" fill="var(--casa-rosado)" />
      <circle cx="110" cy="42" r="10" fill="var(--casa-rosado)" />
    </>
  );
}

function Domingo() {
  return (
    <>
      <path d="M18 50h104v20a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8z" fill="var(--casa-menta)" />
      <rect x="18" y="34" width="104" height="22" rx="10" fill="var(--casa-menta)" />
      <rect x="10" y="44" width="16" height="30" rx="7" fill="var(--casa-menta)" />
      <rect x="114" y="44" width="16" height="30" rx="7" fill="var(--casa-menta)" />
      <rect x="30" y="40" width="34" height="14" rx="7" fill="var(--superficie)" />
      <path d="M86 18h18v12a9 9 0 0 1-18 0z" fill="var(--superficie)" />
      <path d="M104 21h4a4 4 0 0 1 0 8h-4" fill="none" stroke="var(--superficie)" strokeWidth="3" />
      <path d="M92 8q3 4 0 7M98 8q3 4 0 7" fill="none" stroke={T} strokeOpacity=".4" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

const DIBUJOS: Record<Escena, () => JSX.Element> = {
  u: U,
  refri: Refri,
  carrete: Carrete,
  cana: Cana,
  amigas: Amigas,
  domingo: Domingo,
};

export function DibujoEscena({ escena, className = "" }: { escena: Escena; className?: string }) {
  const Dibujo = DIBUJOS[escena];
  return (
    <svg viewBox="0 0 136 90" className={className} aria-hidden="true">
      <Dibujo />
    </svg>
  );
}
