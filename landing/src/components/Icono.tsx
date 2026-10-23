/** Burbuja de chat propia (no es el logo de ninguna app). */
export function IconoChat({ className = "size-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 3.2c-4.9 0-8.8 3.5-8.8 7.9 0 2.2 1 4.2 2.6 5.6l-.9 3.6 4-1.9c1 .3 2 .5 3.1.5 4.9 0 8.8-3.5 8.8-7.8S16.9 3.2 12 3.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M8.4 11.2h.01M12 11.2h.01M15.6 11.2h.01" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Casita del logotipo: techo a dos aguas y una ventana. */
export function IconoCasa({ className = "size-6" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={className}>
      <path d="M4 14.5 16 5l12 9.5V28H4z" fill="var(--casa-amarillo)" />
      <path d="M2.5 15.2 16 4.6l13.5 10.6" fill="none" stroke="var(--tinta)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="12.5" y="16" width="7" height="7" rx="1.5" fill="var(--tinta)" />
    </svg>
  );
}
