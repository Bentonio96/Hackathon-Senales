# Amy: que el lunes no sea el día uno

**Hackatón Señales · Caso 05, Antonia** · Benja y Esperanza · 23 y 24 de octubre de 2026

Amy es una amiga por WhatsApp que acompaña a Antonia durante la semana, para que salir el viernes o darse un gusto el finde no la haga sentir que botó su progreso.

**Amy en WhatsApp:** +56 9 2040 3095 (sandbox de Kapso) · [Demo web](https://hola-ami-agente.vercel.app/demo) · [Landing](https://hola-amy-hackathon.vercel.app) · [Pitch](https://amy-pitch-hackathon.vercel.app)

## El problema que decidimos atacar

Antonia cumple su pauta de lunes a jueves. El viernes carretea, el sábado pide delivery dos veces y el domingo se dice «ya la embarré, el lunes parto de nuevo». **No se cae por el carrete, sino por lo que concluye cuando el plan se rompe:** un desliz anula la semana. Las apps de recetas y los contadores sirven de lunes a jueves, pero **ninguna tiene un plan para el fin de semana**.

Benja lo vivió estudiando lejos de su casa: con la plata nadie piensa en todo o nada (gastarse $10.000 no bota la mesada del mes), **pero con la comida sí**.

## Por qué esto y no otra cosa

- **El finde,** porque es donde se cae. La semana ya le funciona.
- **Decidir antes:** el sábado se decide el jueves, no con caña. Decidir por adelantado tiene evidencia sólida, sobre todo para *sumar* algo.
- **Acompañar después:** la autocompasión frena el «qué más da», y saltarse una comida no borra un hábito. Tras un desliz, Amy retoma en la próxima comida y arma con ella un «si pasa esto, hago esto» que le recuerda el jueves siguiente.
- **WhatsApp,** porque ahí vive Antonia. Una app más la abandona en una semana, como ya le pasó.

Fuentes en [`benja/investigacion-antonia.md`](benja/investigacion-antonia.md).

## Cómo funciona

Se conocen en tres mensajes. El jueves Amy le pregunta si sale y dejan el sábado armado: una receta de 10 minutos con lo que hay en su refri (desde una foto) o su antojo, con el enlace a un local en PedidosYa. El sábado le escribe al despertar y el domingo pregunta cómo estuvo el finde. Lo que cocina queda en su recetario, que solo crece.

## Qué dejamos fuera, a propósito

- **Rachas, puntajes o cuotas de antojos:** cualquier número se vuelve una vara para quien piensa en todo o nada.
- **Calorías, peso o compensar.** Los nutrientes se revisan solo por dentro.
- **Pedirle que deje de salir.**
- **Reemplazar a su nutricionista:** Amy respeta su pauta y deriva cuando corresponde (Salud Responde, \*4141, SAMU 131).
- **Pedir sin salir de WhatsApp:** las apps de delivery no tienen API pública.

## Qué hay en el repo

- [`agente/`](agente/): Amy. Next.js en Vercel con Claude, herramientas (foto del refri, Jumbo, PedidosYa, recetario, memoria) y detección de alertas antes de cada respuesta. Prompts: [`ami.md`](agente/prompts/ami.md) (planificación, Benja) y [`acompanamiento.md`](agente/prompts/acompanamiento.md) (acompañamiento y seguridad, Esperanza).
- [`landing/`](landing/) y [`pitch/`](pitch/): la landing y el pitch con el iPhone en vivo.
- [`benja/`](benja/) y [`esperanza/`](esperanza/): notas e investigación; los dos Claude se coordinan por ahí ([`CLAUDE.md`](CLAUDE.md)).

**Correrlo:** `cd agente && cp .env.example .env.local && npm install && npm run dev` → http://localhost:3000/demo. Detalle en [`agente/README.md`](agente/README.md).

Todos los datos de la demo son inventados.
