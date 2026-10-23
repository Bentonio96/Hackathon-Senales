# Cambios de texto para landing, pitch, README y ami.md

Decisión cerrada (23 de octubre, Esperanza y Benja): **antojos invisibles**. El número existe solo por dentro para armar un sábado realista. Ami nunca lo dice, nunca cuenta cuántos quedan y nunca dice «te pasaste». Todo lo de abajo alinea los textos con eso y con el prompt vivo de acompañamiento.

Formato de Ami en toda burbuja: mayúscula al inicio, sin punto final, preguntas con «?» al cierre y sin «¿», sin «po», un emoji como máximo y al final.

## landing

**`src/components/Problema.tsx`, línea 21**
- Hoy: `el lunes no se parte de cero: se sigue 🫶`
- Nuevo: `Pucha, qué lata quedarte con esa sensación. El plan se puede mover 🫶`

**`src/lib/conversacion.ts`, línea 92 (escena del sushi)**
- Hoy: `no la embarraste, comiste rico con tus amigas. seguimos desde tu próxima comida`
- Nuevo: `Pucha, qué lata quedarte con esa sensación. Un finde que no sale como se pensó habla del plan, no de ti 🫶`

**`src/lib/conversacion.ts`, línea 104 (escena del domingo)**
- Hoy: `no hay que partir de nada: mañana sigues con tu pauta, como siempre 🫶`
- Nuevo: `Uf, suena a que te quedaste con una sensación pesada. Gracias por contármelo 🫶`

**`src/lib/conversacion.ts`, escena del jueves (línea 45)**
- Hoy: `anda tranqui, el sábado déjamelo a mí 🫶`
- Nuevo: `Anda tranqui, y si quieres el sábado lo armamos juntas 🌿`
  (es una invitación, no «yo me encargo»)

**`src/lib/conversacion.ts`, escena del sábado (línea 70)**
- Hoy: `buenos días, sobreviviente 😅 tus quesadillas están a 10 minutos`
- Nuevo: `Hola! Cómo amaneciste? Tus quesadillas están a 10 minutos 😅`

**`src/components/Reglas.tsx`, línea 50 (la ayuda)**
- Hoy: `si comer te está angustiando, merece a alguien que sepa más que yo. yo sigo aquí 🫶`
- Nuevo: `Si comer te está angustiando, te tinca contárselo a tu nutri o a alguien cercano? Te pueden acompañar mejor que yo 🫶`

**`src/components/Reglas.tsx`, línea 61**
- Quitar `(opción 2, salud mental)`. Dejar solo `Salud Responde, 600 360 7777`.

**`src/components/Preguntas.tsx`, línea 5**
- Hoy: `¿Cuántos antojos tengo? — Un número fijo a la semana, que decides con Ami. Si te pasas, no es falla: seguimos.`
- Nuevo: `¿Y los antojos? — Entran en el plan desde el jueves. Ami no los cuenta ni te dice cuántos te quedan: si quieres otro, el plan se acomoda.`

**`src/components/TuSabado.tsx`, línea 95**: `Un antojo y una comida casera. Tú eliges cuál va primero.` Se queda: describe el plan de partida, no una cuota.

## pitch (`pitch/index.html`)

**Línea 199**
- Hoy: `el lunes no se parte de cero: se sigue 🫶`
- Nuevo: `Pucha, qué lata quedarte con esa sensación. El plan se puede mover 🫶`

**Lámina «Por qué Ami le cambiaría la vida» (líneas 277 a 290)**: dejar los tres argumentos, sacar todas las cifras y el bloque de Sharif y Shu. Texto propuesto:
- `Decidir antes funciona.` → `Hay evidencia de que planear «si pasa esto, hago esto» ayuda a cumplir una meta. Es lo que hace Ami el jueves.`
- `Un finde no borra tu semana.` → `Saltarse un día no borra un hábito en formación.`
- `Seguimos desde tu próxima comida.` → `Tras un desliz, la autocompasión reduce el «qué más da».`
- **Quitar** la burbuja `tus antojos, pocos y decididos antes` y la línea de Sharif y Shu. Con antojos invisibles, esa lámina contradice al producto.
- Las referencias completas quedan en `benja/investigacion-antonia.md`; en el pitch se dice «la investigación está en el repo».

## README raíz

- Línea 5: `cuando ella está lúcida` → `con calma, antes del finde`.
- Líneas 21 y 22: dejar los argumentos sin paréntesis de autores, o con un solo «(fuentes en `benja/investigacion-antonia.md`)». Hoy el README cita tres estudios que en el pitch no vamos a defender con cifras.
- Agregar en «Qué dejamos fuera»: `Decirle cuántos antojos tiene: cualquier cuota es una vara más con la que «pasarse».`

## `agente/prompts/ami.md` (Benja)

**Línea 50**
- Hoy: `Los antojos de la semana son {{ANTOJOS_SEMANA}}. El número se dice una sola vez, el jueves…`
- Nuevo: `Por dentro, planifica con {{ANTOJOS_SEMANA}} antojos a la semana para que el sábado sea realista. Nunca le digas el número a Antonia, nunca cuentes cuántos lleva ni digas «te pasaste». Si pide otro, el plan se acomoda sin nombrar la diferencia.`

**Línea 60**: `dale, hoy se pide. que te caiga rico 🫶` → `Dale, hoy se pide. Que te caiga rico 🫶`

## Variable de Vercel
`AMI_ANTOJOS_SEMANA` se mantiene en 2. Solo cambia que Ami no lo dice.
