# Amy: que el lunes no sea el día uno

**Hackatón Señales · Caso 05, Antonia** · Equipo: Benja y Esperanza · 23 y 24 de octubre de 2026

Amy es una amiga por WhatsApp para Antonia. El jueves, con calma, antes del finde, deja decidido el sábado: un antojo y una comida casera rica hecha con lo que tiene en el refri. Si el plan se rompe, la acompaña sin juzgar, para que el fin de semana deje de sentirse como una caída.

- **Landing:** https://hola-amy-hackathon.vercel.app
- **Diseño de Amy** (avatar, voz y mockups): https://claude.ai/artifact/AY1jt7PAMbP8JC2P69BXsB

## El problema que decidimos atacar

Antonia cumple su pauta de lunes a jueves. El viernes carretea, el sábado despierta con caña y pide delivery dos veces, y el domingo se dice «ya la embarré, el lunes parto de nuevo». Van nueve ciclos.

**Ella no se cae por el carrete. Se cae por lo que concluye cuando el plan se rompe.** Un desliz anula la semana entera, y el lunes «limpia la cuenta». Las apps de recetas, los contadores y la pauta en PDF sirven de lunes a jueves, pero **ninguna tiene un plan para el fin de semana**.

Benja lo vivió: estudió lejos de su ciudad, con la mesada justa, y los fines de semana volvía a ver a sus amigos. Aunque tuviera táperes en el refri, pedía algo rico. El hallazgo que salió de ahí: **con la plata nadie piensa en blanco o negro** (gastarse $10.000 no hace botar la mesada del mes), **pero con la comida sí**.

## Por qué esto y no otra cosa

- **Atacamos el sábado y el domingo,** porque es donde se cae, y no la semana, que ya funciona.
- **Decidir antes:** la decisión del sábado se toma el jueves, no con caña. Hay evidencia de que decidir por adelantado ayuda, sobre todo para *sumar* algo.
- **Acompañar después:** la autocompasión después de un desliz frena el «qué más da». Y saltarse un día no borra un hábito (fuentes en `benja/investigacion-antonia.md`).
- **WhatsApp,** porque ahí ya vive Antonia y ahí se arman sus planes. Una app más la abandona en una semana, como ya le pasó.

El detalle, con todas las fuentes, está en [`benja/investigacion-antonia.md`](benja/investigacion-antonia.md).

## Qué dejamos fuera, a propósito

- **Decirle cuántos antojos tiene:** cualquier cuota es una vara más con la que «pasarse».
- **Rachas, puntajes o medidas de progreso:** cualquier número se vuelve una vara para alguien que piensa en todo o nada.
- **Contar calorías, compensar o hablar de peso.** Amy revisa los nutrientes solo por dentro y nunca muestra un número.
- **Pedirle que deje de salir.**
- **Reemplazar a su nutricionista o a una psicóloga:** Amy se apoya en la pauta y deriva cuando corresponde (Salud Responde, \*4141, 131).
- **Pedir el delivery sin salir de WhatsApp:** las apps no tienen una API pública. Es el siguiente paso, con una alianza.
- **Leer el grupo de WhatsApp de las amigas:** no se puede, así que Amy pregunta primero.

## Qué hay en el repo

| Carpeta | Qué es |
|---|---|
| [`agente/`](agente/) | **Amy.** Next.js en Vercel con Claude y herramientas: lee la foto del refri, busca precios reales en Jumbo, revisa nutrientes por dentro y guarda el plan del sábado. Tiene el webhook de WhatsApp (sandbox de Twilio) y un chat web de respaldo en `/demo`, con un reloj para la demo en vivo. |
| [`landing/`](landing/) | La landing de Amy (Vite, React y TypeScript), en línea en hola-amy-hackathon.vercel.app. |
| [`pitch/`](pitch/) | El pitch en HTML, con una slide que muestra en vivo la pantalla del iPhone. |
| [`benja/`](benja/), [`esperanza/`](esperanza/) | Las notas, decisiones e investigación de cada uno. Los Claude de los dos se coordinan por estos archivos (reglas en [`CLAUDE.md`](CLAUDE.md)). |

Amy tiene dos voces en su prompt:
- [`agente/prompts/ami.md`](agente/prompts/ami.md): la planificación, de Benja.
- [`agente/prompts/acompanamiento.md`](agente/prompts/acompanamiento.md): el acompañamiento y la seguridad, de Esperanza.

## Correrlo

```bash
cd agente
cp .env.example .env.local   # clave de Anthropic y, para WhatsApp, Twilio
npm install
npm run dev                  # http://localhost:3000/demo
```

El paso a paso de WhatsApp y del deploy está en [`agente/README.md`](agente/README.md).

**Datos:** todos los de la demo son inventados: la pauta, las conversaciones, los locales y los precios de delivery. No se usan datos de personas reales.
