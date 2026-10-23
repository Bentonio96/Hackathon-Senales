/**
 * Ami, avatar B («Abrazo»): la mancha amarilla con los ojos cerrados de
 * felicidad y, a su lado, la mancha celeste chica (tú). Elegido por Benja y
 * Esperanza el 2026-10-23. Sus colores son fijos: es el personaje, no la UI.
 */
export function AvatarAmi({ className = "size-10", fondo = true }: { className?: string; fondo?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {fondo && <circle cx="100" cy="100" r="100" fill="#F7E9DF" />}
      <path d="M90 50 C126 46 152 74 150 110 C148 146 122 164 90 160 C58 156 38 132 42 100 C46 70 62 53 90 50 Z" fill="#F6C445" />
      <path d="M152 108 C168 106 180 121 178 138 C176 156 161 165 146 161 C131 157 125 144 129 128 C132 115 140 109 152 108 Z" fill="#7FBFC4" />
      <path d="M73 98 Q79 91 85 98" fill="none" stroke="#1E2321" strokeWidth="4" strokeLinecap="round" />
      <path d="M101 96 Q107 89 113 96" fill="none" stroke="#1E2321" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="68" cy="113" rx="8" ry="4.5" fill="#EF8A6E" opacity=".55" />
      <ellipse cx="120" cy="111" rx="8" ry="4.5" fill="#EF8A6E" opacity=".55" />
      <path d="M83 116 Q93 125 103 115" fill="none" stroke="#1E2321" strokeWidth="4" strokeLinecap="round" />
      <circle cx="145" cy="131" r="3.5" fill="#1E2321" />
      <circle cx="159" cy="130" r="3.5" fill="#1E2321" />
    </svg>
  );
}
