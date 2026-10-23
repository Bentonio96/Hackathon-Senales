// Prerender liviano: inyecta el HTML de la página en dist/index.html.
// Corre después de `vite build` + `vite build --ssr` (ver el script "build").
import { readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const { render } = await import(new URL("../dist-server/entry-server.js", import.meta.url).href);

const rutaHtml = join(raiz, "dist", "index.html");
const plantilla = readFileSync(rutaHtml, "utf8");
const marcador = '<div id="root"></div>';
if (!plantilla.includes(marcador)) throw new Error('Falta <div id="root"></div> en dist/index.html');

const app = render();

// Precarga la fuente latina: el h1 (el LCP) la espera.
const fuente = readdirSync(join(raiz, "dist", "assets")).find((f) => /^bricolage-grotesque-latin-opsz-normal-.*\.woff2$/.test(f));
const precarga = fuente ? `<link rel="preload" href="/assets/${fuente}" as="font" type="font/woff2" crossorigin />\n  ` : "";

writeFileSync(rutaHtml, plantilla.replace("</head>", `${precarga}</head>`).replace(marcador, `<div id="root">${app}</div>`));
rmSync(join(raiz, "dist-server"), { recursive: true, force: true });
console.log(`Prerender listo: ${(app.length / 1024).toFixed(1)} KB de HTML`);
