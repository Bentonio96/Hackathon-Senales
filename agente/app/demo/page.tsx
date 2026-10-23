"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./demo.module.css";

type Mensaje = { de: "ami" | "antonia" | "sistema"; texto: string; foto?: string };
type Plan = {
  hora_despertar: string;
  comidas: { momento: string; tipo: string; nombre: string; costo_estimado: number }[];
} | null;
type Momento = "jueves" | "sabado" | "domingo";

const ETIQUETAS: Record<Momento, string> = { jueves: "Jueves 17:00", sabado: "Sábado al despertar", domingo: "Domingo 20:00" };

function nuevoId() {
  return "web:" + crypto.randomUUID().replace(/-/g, "").slice(0, 24);
}

// Achica la foto en el navegador antes de mandarla (máx. 1568 px por lado, JPEG).
async function prepararFoto(archivo: File): Promise<{ base64: string; url: string }> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, 1568 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const url = canvas.toDataURL("image/jpeg", 0.85);
  return { base64: url.split(",")[1], url };
}

// Formato estilo WhatsApp: *negrita* y saltos de línea.
function Texto({ texto }: { texto: string }) {
  return (
    <>
      {texto.split("\n").map((linea, i) => (
        <p key={i}>
          {linea.split(/(\*[^*]+\*)/g).map((trozo, j) =>
            trozo.startsWith("*") && trozo.endsWith("*") && trozo.length > 2 ? <strong key={j}>{trozo.slice(1, -1)}</strong> : trozo,
          )}
        </p>
      ))}
    </>
  );
}

const pesos = (n: number) => "$" + Math.round(n).toLocaleString("es-CL");

export default function Demo() {
  const [sesionId, setSesionId] = useState<string>("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState("");
  const [foto, setFoto] = useState<{ base64: string; url: string } | null>(null);
  const [pensando, setPensando] = useState(false);
  const [destino, setDestino] = useState<"web" | "whatsapp">("web");
  const [plan, setPlan] = useState<Plan>(null);
  const [error, setError] = useState<string | null>(null);
  const finRef = useRef<HTMLDivElement>(null);
  const archivoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let id: string | null = null;
    try {
      id = localStorage.getItem("ami-sesion");
    } catch {}
    if (!id) {
      id = nuevoId();
      try {
        localStorage.setItem("ami-sesion", id);
      } catch {}
    }
    setSesionId(id);
  }, []);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensajes, pensando]);

  async function llamar(url: string, cuerpo: object) {
    setPensando(true);
    setError(null);
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cuerpo) });
      const datos = (await res.json()) as { respuestas?: string[]; plan?: Plan; error?: string; aviso?: string };
      if (!res.ok) throw new Error(datos.error ?? "Error");
      if (datos.aviso) setMensajes((m) => [...m, { de: "sistema" as const, texto: datos.aviso! }]);
      setMensajes((m) => [...m, ...(datos.respuestas ?? []).map((t) => ({ de: "ami" as const, texto: t }))]);
      if (datos.plan !== undefined) setPlan(datos.plan);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo falló");
    } finally {
      setPensando(false);
    }
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (pensando || (!texto.trim() && !foto)) return;
    setMensajes((m) => [...m, { de: "antonia", texto: texto.trim(), foto: foto?.url }]);
    const cuerpo = { sesionId, texto: texto.trim(), imagenBase64: foto?.base64, imagenTipo: foto ? "image/jpeg" : undefined };
    setTexto("");
    setFoto(null);
    await llamar("/api/chat", cuerpo);
  }

  async function adelantar(momento: Momento) {
    if (pensando) return;
    setMensajes((m) => [...m, { de: "sistema", texto: `⏩ ${ETIQUETAS[momento]}${destino === "whatsapp" ? " · enviado a WhatsApp" : ""}` }]);
    await llamar("/api/demo/reloj", { momento, destino, sesionId });
  }

  async function reiniciar() {
    await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sesionId, reiniciar: true }) });
    const id = nuevoId();
    try {
      localStorage.setItem("ami-sesion", id);
    } catch {}
    setSesionId(id);
    setMensajes([]);
    setPlan(null);
    setError(null);
  }

  return (
    <main className={styles.pagina}>
      <section className={styles.telefono} aria-label="Conversación con Ami">
        <header className={styles.cabecera}>
          <div className={styles.avatar} aria-hidden>A</div>
          <div>
            <h1>Ami</h1>
            <p>{pensando ? "escribiendo…" : "tu amiga del finde"}</p>
          </div>
        </header>

        <div className={styles.chat} aria-live="polite">
          {mensajes.length === 0 && (
            <p className={styles.vacio}>Escríbele a Ami o adelanta el reloj al jueves para que ella parta.</p>
          )}
          {mensajes.map((m, i) => (
            <div key={i} className={`${styles.burbuja} ${styles[m.de]}`}>
              {m.foto && <img src={m.foto} alt="Foto del refri" className={styles.foto} />}
              {m.texto && <Texto texto={m.texto} />}
            </div>
          ))}
          {pensando && <div className={`${styles.burbuja} ${styles.ami} ${styles.puntos}`}><span /><span /><span /></div>}
          <div ref={finRef} />
        </div>

        <form className={styles.entrada} onSubmit={enviar}>
          {foto && (
            <div className={styles.previa}>
              <img src={foto.url} alt="Foto lista para enviar" />
              <button type="button" onClick={() => setFoto(null)} aria-label="Quitar foto">✕</button>
            </div>
          )}
          <button type="button" className={styles.clip} onClick={() => archivoRef.current?.click()} aria-label="Adjuntar foto del refri">
            📷
          </button>
          <input
            ref={archivoRef}
            type="file"
            accept="image/*"
            hidden
            onChange={async (e) => {
              const archivo = e.target.files?.[0];
              if (archivo) setFoto(await prepararFoto(archivo));
              e.target.value = "";
            }}
          />
          <input
            className={styles.campo}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe un mensaje"
            aria-label="Mensaje para Ami"
          />
          <button type="submit" className={styles.enviar} disabled={pensando} aria-label="Enviar">➤</button>
        </form>
      </section>

      <aside className={styles.panel}>
        <h2>Reloj de la demo</h2>
        <p className={styles.ayuda}>Hace que Ami escriba primero, como si fuera ese momento de la semana.</p>
        <div className={styles.botones}>
          {(Object.keys(ETIQUETAS) as Momento[]).map((m) => (
            <button key={m} onClick={() => adelantar(m)} disabled={pensando || !sesionId}>
              ⏩ {ETIQUETAS[m]}
            </button>
          ))}
        </div>

        <fieldset className={styles.destino}>
          <legend>Mandar el mensaje de Ami a</legend>
          <label>
            <input type="radio" checked={destino === "web"} onChange={() => setDestino("web")} /> este chat
          </label>
          <label>
            <input type="radio" checked={destino === "whatsapp"} onChange={() => setDestino("whatsapp")} /> el último WhatsApp
          </label>
        </fieldset>

        <h2>Plan del sábado</h2>
        {plan ? (
          <ul className={styles.plan}>
            <li>Despierta: {plan.hora_despertar}</li>
            {plan.comidas.map((c, i) => (
              <li key={i}>
                <strong>{c.momento}</strong>: {c.nombre} ({c.tipo === "casera" ? "casera" : "antojo"}, {pesos(c.costo_estimado)})
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.ayuda}>Todavía no hay plan guardado.</p>
        )}

        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.reiniciar} onClick={reiniciar}>Reiniciar conversación</button>
        <p className={styles.nota}>Datos de ejemplo. Ami no reemplaza a tu nutricionista.</p>
      </aside>
    </main>
  );
}
