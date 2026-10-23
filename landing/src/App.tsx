import { Cierre, Pie } from "./components/Cierre";
import { ComoFunciona } from "./components/ComoFunciona";
import { Barra, Portada } from "./components/Portada";
import { Preguntas } from "./components/Preguntas";
import { Problema } from "./components/Problema";
import { Reglas } from "./components/Reglas";
import { TuSabado } from "./components/TuSabado";

export default function App() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-full bg-tinta px-5 py-3 text-cielo focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <Barra />
      <main id="contenido">
        <Portada />
        <Problema />
        <ComoFunciona />
        <TuSabado />
        <Reglas />
        <Preguntas />
        <Cierre />
      </main>
      <Pie />
    </>
  );
}
