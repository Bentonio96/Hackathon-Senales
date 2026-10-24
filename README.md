# Amy: que el lunes no sea el día uno

**Hackatón Señales · Caso 05, Antonia** · Equipo: Benja y Esperanza · 23 y 24 de octubre de 2026

Amy es una amiga por WhatsApp que acompaña a Antonia durante la semana, para que salir el viernes o darse un gusto el finde no la haga sentir que botó su progreso. El jueves, con calma, dejan decidido el sábado. Si el plan se rompe, Amy la acompaña sin juzgar y la ayuda a seguir desde su próxima comida, no desde el lunes.

- **Amy en WhatsApp:** +56 9 2040 3095 (sandbox de Kapso). Chat web de respaldo y reloj de la demo: https://hola-ami-agente.vercel.app/demo
- **Landing:** https://hola-amy-hackathon.vercel.app
- **Pitch:** https://amy-pitch-hackathon.vercel.app

## El problema que decidimos atacar

Antonia cumple su pauta de lunes a jueves. El viernes carretea, el sábado despierta con caña y pide delivery dos veces, y el domingo se dice «ya la embarré, el lunes parto de nuevo». Van nueve ciclos.

**No se cae por el carrete. Se cae por lo que concluye cuando el plan se rompe:** un desliz anula la semana y el lunes «limpia la cuenta». Las apps de recetas, los contadores y la pauta en PDF sirven de lunes a jueves, pero **ninguna tiene un plan para el fin de semana**.

Benja lo vivió: estudió lejos de su ciudad, con la mesada justa, y el finde volvía donde sus amigos. Aunque tuviera táperes en el refri, pedía algo rico. De ahí salió la idea central: **con la plata nadie piensa en todo o nada** (gastarse $10.000 no hace botar la mesada del mes), **pero con la comida sí**.

## Por qué esto y no otra cosa

- **Atacamos el finde,** porque es donde se cae. La semana ya le funciona.
- **Decidir antes:** el sábado se decide el jueves, no con caña. Decidir por adelantado («si pasa esto, hago esto») tiene evidencia sólida, sobre todo para *sumar* algo.
- **Acompañar después:** la autocompasión frena el «qué más da», y saltarse una comida no borra un hábito. Después de un desliz, Amy arma con ella un «si pasa esto, hago esto» para la próxima vez y se lo recuerda el jueves siguiente.
- **WhatsApp,** porque ahí ya vive Antonia y ahí se arman sus planes. Una app más la abandona en una semana, como ya le pasó.

Fuentes en [`benja/investigacion-antonia.md`](benja/investigacion-antonia.md).

## Cómo funciona

1. **Se conocen en tres mensajes:** su nombre, su rutina de comida en la semana y para qué está Amy.
2. **El jueves** Amy le pregunta si sale. Si quiere, dejan el sábado armado: con una foto del refri, una receta de 10 minutos con lo que ya tiene; o su antojo por delivery, con el enlace directo a un local en PedidosYa.
3. **El sábado** le escribe cuando despierta. **El domingo en la noche** le pregunta cómo estuvo el finde.
4. **Su progreso solo crece:** las caseras que cocina quedan en su recetario, que nunca se borra, y Amy va recordando lo que le funcionó.

## Qué dejamos fuera, a propósito

- **Rachas, puntajes o cuotas de antojos:** cualquier número se vuelve una vara para alguien que piensa en todo o nada.
- **Calorías, peso o compensar.** Amy revisa los nutrientes solo por dentro y nunca muestra un número.
- **Pedirle que deje de salir.**
- **Reemplazar a su nutricionista o a una psicóloga:** Amy respeta su pauta y deriva cuando corresponde (Salud Responde 600 360 7777, \*4141, SAMU 131).
- **Pedir el delivery sin salir de WhatsApp:** las apps no tienen API pública; Amy manda el enlace del local.
- **Leer el grupo de las amigas:** no se puede, así que Amy pregunta.

## Qué hay en el repo

| Carpeta | Qué es |
|---|---|
| [`agente/`](agente/) | **Amy.** Next.js en Vercel con Claude y herramientas: lee la foto del refri, busca precios en Jumbo y locales en PedidosYa, revisa nutrientes por dentro, guarda el plan, el recetario y lo que va sabiendo de ella. Antes de cada respuesta corre una detección de alertas que deriva con mensajes fijos. WhatsApp por Kapso (Twilio como respaldo). |
| [`landing/`](landing/) | La landing (Vite, React y TypeScript). |
| [`pitch/`](pitch/) | El pitch en HTML, con la pantalla del iPhone en vivo, y el guion. |
| [`benja/`](benja/), [`esperanza/`](esperanza/) | Notas, decisiones e investigación de cada uno. Los dos Claude se coordinan por estos archivos (reglas en [`CLAUDE.md`](CLAUDE.md)). |

Amy tiene dos voces en su prompt: [`agente/prompts/ami.md`](agente/prompts/ami.md) (la planificación, de Benja) y [`agente/prompts/acompanamiento.md`](agente/prompts/acompanamiento.md) (el acompañamiento y la seguridad, de Esperanza).

## Correrlo

```bash
cd agente
cp .env.example .env.local   # clave de Anthropic; para WhatsApp, Kapso o Twilio
npm install
npm run dev                  # http://localhost:3000/demo
```

El paso a paso de WhatsApp y del deploy está en [`agente/README.md`](agente/README.md).

**Datos:** todos los de la demo son inventados: la pauta, las conversaciones y los precios de delivery. No se usan datos de personas reales.
