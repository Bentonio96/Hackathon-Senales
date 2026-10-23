/**
 * Borde de calamina: el perfil ondulado de las casas de Valparaíso, usado como
 * costura entre dos campos de color. `className` da el color (text-*), que es
 * el del campo que viene abajo.
 */
const ANCHO = 1440;
const PASO = 40;

function perfil(alto: number): string {
  let d = `M0 ${alto / 2}`;
  for (let x = 0; x < ANCHO; x += PASO) {
    d += ` Q${x + PASO / 4} 0 ${x + PASO / 2} ${alto / 2} T${x + PASO} ${alto / 2}`;
  }
  return d + ` L${ANCHO} ${alto} L0 ${alto} Z`;
}

const D = perfil(24);

export function Onda({ className = "", volteada = false }: { className?: string; volteada?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${ANCHO} 24`}
      preserveAspectRatio="none"
      className={`block h-4 w-full md:h-6 ${volteada ? "rotate-180" : ""} ${className}`}
    >
      <path d={D} fill="currentColor" />
    </svg>
  );
}
