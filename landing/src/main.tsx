import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { desplazamiento, hayMovimiento } from "./lib/movimiento";
import "./index.css";

document.documentElement.classList.add("js");

const arbol = (
  <StrictMode>
    <App />
  </StrictMode>
);

const root = document.getElementById("root")!;

// En producción el HTML llega prerenderizado: hidratamos para conservar el DOM.
if (root.hasChildNodes()) {
  hydrateRoot(root, arbol);
} else {
  createRoot(root).render(arbol);
}

// Scroll suave solo si la persona no pidió menos movimiento. Se carga aparte
// para no atrasar la primera pintura.
if (hayMovimiento()) {
  void import("lenis").then(({ default: Lenis }) => {
    desplazamiento.lenis = new Lenis({ autoRaf: true, anchors: { offset: -64 }, lerp: 0.12 });
  });
}
