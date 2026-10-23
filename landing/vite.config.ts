import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Respeta el puerto asignado por el entorno (tooling local); 5173/4173 por defecto.
const port = Number(process.env.PORT) || undefined;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port },
  preview: { port },
});
