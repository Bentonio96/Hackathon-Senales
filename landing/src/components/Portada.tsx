import { NOMBRE, WHATSAPP_URL } from "../config";
import { Cerro } from "./Cerro";
import { IconoCasa, IconoChat } from "./Icono";
import { Onda } from "./Onda";

const LINKS = [
  { href: "#como-funciona", texto: "Cómo funciona" },
  { href: "#tu-sabado", texto: "Tu sábado" },
  { href: "#lo-que-nunca", texto: "Lo que nunca hace" },
  { href: "#preguntas", texto: "Preguntas" },
];

export function BotonWhatsApp({ className = "", texto = "Hablar por WhatsApp" }: { className?: string; texto?: string }) {
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={`boton ${className}`}>
      <IconoChat />
      {texto}
      <span className="sr-only"> (se abre en otra pestaña)</span>
    </a>
  );
}

export function Barra() {
  return (
    <header className="sticky top-0 z-30 bg-cielo">
      <div className="envoltura flex h-(--alto-header) items-center justify-between gap-6">
        <a href="#inicio" className="flex items-center gap-2 text-lead font-bold tracking-tight" aria-label={`${NOMBRE}, inicio`}>
          <IconoCasa className="size-7" />
          {NOMBRE}
        </a>
        <nav aria-label="Secciones" className="hidden lg:block">
          <ul className="flex gap-7 text-chico font-medium">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="enlace no-underline hover:underline">
                  {l.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="boton min-h-11 px-4 text-chico"
        >
          <IconoChat className="size-4" />
          <span className="sm:hidden">WhatsApp</span>
          <span className="hidden sm:inline">Hablar por WhatsApp</span>
          <span className="sr-only"> (se abre en otra pestaña)</span>
        </a>
      </div>
    </header>
  );
}

export function Portada() {
  return (
    <section id="inicio" className="relative overflow-hidden" aria-labelledby="titulo-portada">
      <div className="envoltura grid items-center gap-10 pt-8 pb-14 md:pt-14 lg:grid-cols-12 lg:gap-6 lg:pb-20">
        <div className="lg:col-span-6">
          <h1 id="titulo-portada" className="entra text-display font-extrabold" style={{ ["--i" as string]: 0 }}>
            El lunes ya no partes de cero.
          </h1>
          <p className="entra mt-6 max-w-[34ch] text-lead" style={{ ["--i" as string]: 1 }}>
            {NOMBRE} es una amiga en tu WhatsApp. El jueves te deja listo el sábado: tu antojo y una receta casera de
            10 minutos con lo que tienes en el refri.
          </p>
          <div className="entra mt-9 flex flex-wrap items-center gap-x-7 gap-y-4" style={{ ["--i" as string]: 2 }}>
            <BotonWhatsApp />
            <a href="#como-funciona" className="enlace font-medium">
              Ver cómo funciona
            </a>
          </div>
          <p className="entra mt-8 max-w-[44ch] text-chico text-tinta-suave" style={{ ["--i" as string]: 3 }}>
            Sin rachas, sin contar calorías y sin pedirte que dejes de salir. No reemplaza a tu nutricionista.
          </p>
        </div>
        <div className="lg:col-span-6">
          <Cerro />
          <p className="mt-3 text-center text-chico text-tinta-suave">Toca una casa: cada día de tu semana tiene su lugar.</p>
        </div>
      </div>
      <Onda className="text-amarillo" />
    </section>
  );
}
