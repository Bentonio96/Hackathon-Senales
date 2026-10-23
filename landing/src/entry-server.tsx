import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

/** Entrada del prerender: el mismo árbol que main.tsx, para que hydrateRoot lo conserve. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
