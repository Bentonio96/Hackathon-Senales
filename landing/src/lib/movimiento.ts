import { useEffect, useRef } from "react";

/** ¿Hay que moverse? Falso con prefers-reduced-motion o con ?reduced=1. */
export function hayMovimiento(): boolean {
  if (typeof window === "undefined") return false;
  if (document.documentElement.classList.contains("reducido")) return false;
  return window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
}

/**
 * Marca con `.visible` cada `.revela` dentro del contenedor la primera vez que
 * entra a la pantalla. Sin JS el contenido se ve igual (el desplazamiento
 * inicial solo existe con html.js).
 */
export function useRevela<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    const piezas = raiz.querySelectorAll<HTMLElement>(".revela");
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    piezas.forEach((p) => obs.observe(p));
    return () => obs.disconnect();
  }, []);
  return ref;
}
