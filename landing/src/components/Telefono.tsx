import { LazyMotion, MotionConfig, domAnimation, m as motion } from "motion/react";
import { useEffect, useRef } from "react";
import { NOMBRE } from "../config";
import { AvatarAmi } from "./Avatar";
import { RECETA, type Mensaje, type Momento } from "../lib/conversacion";

function Refri() {
  return (
    <svg viewBox="0 0 200 150" className="block w-full rounded-xl" role="img" aria-label="Foto de ejemplo del refri: huevos, queso, cebolla, tortillas y papas">
      <rect width="200" height="150" fill="var(--celeste)" />
      <rect x="14" y="10" width="172" height="130" rx="10" fill="var(--superficie)" />
      <rect x="14" y="56" width="172" height="5" fill="var(--linea)" />
      <rect x="14" y="100" width="172" height="5" fill="var(--linea)" />
      {[34, 50, 66, 82].map((x) => (
        <ellipse key={x} cx={x} cy="44" rx="7" ry="9" fill="var(--amarillo)" stroke="var(--tinta)" strokeOpacity=".25" />
      ))}
      <path d="M112 52 L156 52 L156 30 Z" fill="var(--casa-amarillo)" />
      <circle cx="44" cy="88" r="11" fill="var(--casa-rosado)" />
      <rect x="96" y="76" width="62" height="7" rx="3.5" fill="var(--casa-naranja)" />
      <rect x="99" y="84" width="56" height="7" rx="3.5" fill="var(--casa-naranja)" opacity=".8" />
      {[40, 58, 74].map((x) => (
        <ellipse key={x} cx={x} cy="126" rx="9" ry="7" fill="var(--casa-naranja)" opacity=".75" />
      ))}
      <rect x="110" y="114" width="48" height="18" rx="5" fill="var(--menta)" />
    </svg>
  );
}

function Plan() {
  return (
    <div className="space-y-2">
      <p className="font-titulo font-bold">Tu sábado, listo</p>
      <div className="rounded-[14px_18px_14px_18px] bg-menta px-3 py-2">
        <p className="text-[0.8125rem] font-semibold">Algo rico de tu refri</p>
        <p>
          {RECETA.nombre}, {RECETA.minutos} min, con lo que ya tienes
        </p>
      </div>
      <p className="text-[0.8125rem] text-tinta-suave">Si el sábado prefieres pedir, te mando el enlace</p>
    </div>
  );
}

function Burbuja({ m }: { m: Mensaje }) {
  if (m.de === "nota") {
    return (
      <p className="mx-auto my-6 max-w-[16rem] rounded-[20px_26px_22px_28px] bg-superficie px-4 py-3 text-center text-[0.9375rem] text-tinta-suave">
        {m.texto}
      </p>
    );
  }
  const mia = m.de === "yo";
  return (
    <div
      className={`w-fit max-w-[86%] px-3.5 py-2.5 text-[0.9375rem] leading-snug ${
        mia ? "ml-auto rounded-[18px_4px_18px_18px] bg-burbuja-yo" : "rounded-[4px_18px_18px_18px] bg-burbuja-ella"
      }`}
    >
      {"foto" in m ? (
        <Refri />
      ) : "plan" in m ? (
        <Plan />
      ) : "pasos" in m ? (
        <ol className="list-decimal space-y-1 pl-5">
          {m.pasos.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      ) : (
        <>
          <p>{m.texto}</p>
          {"botones" in m && (
            <div className="mt-2.5 grid gap-1.5" aria-hidden="true">
              {m.botones.map((b) => (
                <span key={b} className="rounded-full bg-chat-fondo py-1.5 text-center text-[0.875rem] font-semibold text-accion">
                  {b}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Maqueta del chat. Al cambiar de momento, los mensajes llegan uno tras otro
 * (solo cuando la persona avanza; el primer render llega quieto para el
 * prerender y para quien no tiene JS).
 */
export function Telefono({ momento, animar }: { momento: Momento; animar: boolean }) {
  const lista = useRef<HTMLDivElement>(null);
  useEffect(() => {
    lista.current?.scrollTo({ top: 0 });
  }, [momento.id]);

  return (
    <div
      data-ui
      className="mx-auto flex h-full w-full lg:h-[min(38rem,72svh)] max-w-[23rem] flex-col overflow-hidden rounded-[2.6rem] border-[10px] border-tinta bg-chat-fondo"
    >
      <div className="flex items-center gap-3 bg-superficie px-4 pt-4 pb-3">
        <AvatarAmi className="size-10 shrink-0" />
        <div className="leading-tight">
          <p className="font-titulo text-lg font-bold">{NOMBRE}</p>
          <p className="text-[0.8125rem] text-tinta-suave">en línea</p>
        </div>
      </div>

      <div ref={lista} className="flex-1 space-y-2 overflow-y-auto px-3 py-4" aria-live="polite">
        <p className="mx-auto mb-3 w-fit rounded-full bg-superficie px-3 py-1 text-[0.8125rem] font-semibold">
          {momento.dia} {momento.hora}
        </p>
        <LazyMotion features={domAnimation} strict>
          <MotionConfig reducedMotion="user">
            {/* key: cada momento monta un chat nuevo, así nunca queda uno a medio salir. */}
            <div key={momento.id} className="space-y-2">
              {momento.mensajes.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={animar ? { opacity: 0, y: 14, scale: 0.97 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: animar ? 0.15 + i * 0.55 : 0, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: msg.de === "yo" ? "100% 100%" : "0% 100%" }}
                >
                  <Burbuja m={msg} />
                </motion.div>
              ))}
            </div>
          </MotionConfig>
        </LazyMotion>
      </div>

      <div className="flex items-center gap-2 bg-superficie px-3 py-3" aria-hidden="true">
        <span className="flex-1 rounded-full bg-chat-fondo px-4 py-2 text-[0.875rem] text-tinta-suave">Escribe un mensaje</span>
      </div>
    </div>
  );
}
