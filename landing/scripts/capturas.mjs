// Imagen OG, ícono táctil y capturas del README, con el Chrome instalado.
// Uso: npm run build && npm run preview  (en otra terminal)
//      npm run capturas -- http://localhost:4173
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const base = (process.argv[2] ?? "http://localhost:4173").replace(/\/$/, "");
mkdirSync(join(raiz, "docs"), { recursive: true });

const navegador = await chromium.launch({ channel: "chrome" });

async function foto(ruta, { ancho, alto, tema = "light", escala = 1, hasta, completa = false }) {
  const movil = ancho < 768;
  const ctx = await navegador.newContext({
    viewport: { width: ancho, height: alto },
    deviceScaleFactor: escala,
    colorScheme: tema,
    isMobile: movil,
    hasTouch: movil,
    reducedMotion: "reduce",
  });
  const pagina = await ctx.newPage();
  await pagina.goto(base + "/?reduced=1", { waitUntil: "networkidle" });
  await pagina.evaluate(() => document.fonts.ready);
  if (hasta) {
    await pagina.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + scrollY);
    }, hasta);
  }
  await pagina.waitForTimeout(500);
  await pagina.screenshot({ path: join(raiz, ruta), type: ruta.endsWith(".png") ? "png" : "jpeg", fullPage: completa, ...(ruta.endsWith(".png") ? {} : { quality: 82 }) });
  console.log(ruta);
  await ctx.close();
}

await foto("public/og.png", { ancho: 1200, alto: 630 });
await foto("docs/escritorio-claro.jpg", { ancho: 1440, alto: 900, escala: 1 });
await foto("docs/escritorio-oscuro.jpg", { ancho: 1440, alto: 900, tema: "dark" });
await foto("docs/escritorio-sabado.jpg", { ancho: 1440, alto: 900, hasta: "tu-sabado" });
await foto("docs/movil-claro.jpg", { ancho: 375, alto: 812, escala: 2 });
await foto("docs/movil-como-funciona.jpg", { ancho: 375, alto: 812, escala: 2, hasta: "como-funciona" });

// Ícono táctil: el favicon a 180 px sobre el fondo de la página.
const svg = readFileSync(join(raiz, "public/favicon.svg"), "utf8");
const ctx = await navegador.newContext({ viewport: { width: 180, height: 180 } });
const pagina = await ctx.newPage();
await pagina.setContent(`<body style="margin:0;background:#f4f7f6;display:grid;place-items:center;height:180px">${svg.replace("<svg ", '<svg width="132" height="132" ')}</body>`);
await pagina.screenshot({ path: join(raiz, "public/apple-touch-icon.png") });
console.log("public/apple-touch-icon.png");

await navegador.close();
