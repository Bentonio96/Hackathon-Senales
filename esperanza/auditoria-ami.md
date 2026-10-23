# Auditoría de Ami (caso 05, Antonia)

Fecha: 23 de octubre de 2026, 13:45. Base: repo en commit `24f7429`, bases v1.5, landing y demo en línea, y tres mensajes de prueba contra la demo real.

**Veredicto:** Ami es una solución bien pensada y mejor construida que la mayoría de los prototipos de hackatón, con un riesgo alto de que el jurado no vea nada de eso: hoy la demo no sostiene una conversación entre instancias, el pitch cita como prueba estudios que son pistas, y la landing y el pitch dicen cosas que el producto ya no hace.

## 1. Ajuste a las bases

| Cláusula | Estado | Comprobado |
|---|---|---|
| Sin datos reales, en especial de salud | Cumple. Pauta, precios de delivery y conversaciones inventados, y el README lo dice | Sí |
| Alimentación: sin bajar de peso, calorías como castigo ni compensar con ejercicio | Cumple y además lo bloquea en código (`PROHIBIDO` en `seguridad.ts`) | Sí |
| Derivar a un profesional cuando corresponda | Cumple: detector en código y textos fijos con nutri, Salud Responde, *4141 y 131 | Sí, la demo derivó ante «mañana no como nada» |
| README de una página: qué atacan, por qué, qué dejan fuera | Cumple, y es el mejor texto del proyecto | Sí |
| Cada integrante con su cuenta de GitHub | Cumple: 38 commits de Benja, 13 tuyos | Sí |
| Todo el código escrito durante el evento | Cumple en lo visible. Primer commit a las 08:55, antes de las 09:00 | Parcial |
| Demo en vivo obligatoria | Hay demo web y WhatsApp funcionando | Sí |

**Dos riesgos, no incumplimientos:**
- **El commit de las 08:55.** Es solo documentación (notas y un CLAUDE.md), no código, así que no viola la regla. Pero si el jurado revisa el historial, conviene decirlo antes de que pregunten.
- **Precios reales de Jumbo.** La herramienta `buscar_precio_supermercado` consulta jumbo.cl en vivo y cae a precios de ejemplo si falla. El README dice «busca precios reales en Jumbo». No es un dato personal y no viola nada, pero la landing dice «precios de ejemplo» y el README dice «reales». Elijan una versión.

## 2. ¿Resuelve el problema de Antonia?

**Lo que está demostrado.** En la demo, con el mensaje literal de la ficha («ya la embarré con la semana, pedí dos pizzas, el lunes parto de nuevo»), Ami no repitió el lunes, no corrigió, no contó, espejó el humor y preguntó por ella. Ante «mañana no como nada pa compensar», dejó el plan, puso un límite sin juzgar y derivó primero a la nutri o a alguien cercano. Esa es la rama más difícil del caso y hoy funciona.

**Lo que está supuesto.** Que decidir el sábado el jueves rompa el ciclo. Es coherente con la ficha (la organización dice que ninguna de sus herramientas tiene plan para el finde), pero no hay ni habrá en 24 horas evidencia de que Antonia cambie. La prueba de 16 mensajes mide cómo responde Ami, no si una persona cambia. El jurado va a preguntar «¿por qué cambiaría?», y la respuesta honesta es un argumento, no un dato.

**Lo que la ficha pide y la solución cubre a medias:**
- **Nueve ciclos.** Ami no sabe que es el ciclo diez. No tiene memoria entre semanas (Redis guarda 14 días y solo con la clave configurada). El acompañamiento es de un finde, no de un patrón. Es una decisión defendible, pero díganla: «atacamos el próximo sábado, no la historia».
- **La reserva de antojos.** La landing y el pitch dicen «un número fijo a la semana». Tres revisores y tu propia decisión la convirtieron en invisible. Hoy el prompt dice que Ami nunca menciona el número. Hay que alinear landing, pitch y producto, porque un jurado que pregunte «¿cuántos antojos tiene?» recibirá tres respuestas distintas.
- **El domingo.** La ficha ubica el momento clave «el domingo en la noche, con la culpa». Tu prompt dice que Ami no inicia mensajes el domingo, y el reloj de la demo tiene un botón «Domingo 20:00» que la hace escribir. Decidan si Ami escribe el domingo o no.

## 3. Comparación con ganadores internacionales

Comprobé tres referentes con fuente. No encontré ningún ganador comparable en WhatsApp y cambio de hábitos de 2025 o 2026; eso es una ventaja de diferenciación y una falta de referente directo.

| Ganador | Qué tiene | Qué tienen ustedes | Qué les falta |
|---|---|---|---|
| **MedKit**, 1.º en Built with Opus 4.7 (abril de 2026): simulador clínico con un evaluador automático contra guías publicadas; tres facultades y una farmacéutica piloteando ([fuente](https://blockchain.news/news/anthropic-opus-4-7-hackathon-winners)) | Un evaluador objetivo y señales de adopción real | Un detector de alertas en código, que es un evaluador | Una señal externa: ni una nutricionista ni una persona de 23 años probó a Ami |
| **CrossBeam**, 1.º en Built with Opus 4.6: un abogado con un año de código resolvió un problema que vivía a diario ([fuente](https://claude.com/blog/meet-the-winners-of-our-built-with-opus-4-6-claude-code-hackathon)) | El autor es el usuario | Benja vivió el problema, y tú lo viste de cerca | Convertir eso en el centro del pitch, no en una frase de apertura |
| **Hackathon Raptors 2024**, chatbots de salud mental: los jueces premiaron dejar al usuario elegir qué tipo de respuesta quiere y leer emociones complejas ([fuente](https://hackformental.com/2024/)) | Agencia del usuario | Ami devuelve decisiones («eso lo decides tú») | Un gesto visible de agencia en la demo: la pausa existe (`pausa`), pero no se muestra |

El patrón común, según un análisis de 2026 de proyectos ganadores ([fuente](https://reskilll.com/blogs/hackathon-ideas-that-won-2026-judges-actually-pick-examples/), un blog, no criterio oficial): un problema específico para un usuario específico, la IA como multiplicador y no como el producto, y una demo que funciona a la primera. Ustedes cumplen los dos primeros. El tercero es el riesgo de la sección 5.

## 4. Storytelling

**Lo que se sostiene.** La tesis «no se cae por el carrete, se cae por lo que concluye después» es precisa, sale de la ficha y la organización la respalda en «Para ir más hondo». El README la cuenta mejor que la landing y mejor que el pitch. La imagen de la plata es buena como imagen.

**Lo que no se sostiene y un jurado lo va a notar:**

1. **El pitch presenta pistas como pruebas.** La lámina «Por qué Ami le cambiaría la vida» cita cuatro estudios con cifras. Verifiqué dos: Adams y Leary (2007) existe y dice lo que dicen, pero en universitarias con un preload de comida en laboratorio, no en WhatsApp. Sharif y Shu (2017) no lo pude encontrar en una búsqueda; el pitch mismo lo marca como «una pista, no una prueba». Si uno de los jueces pregunta por cualquiera de esas cifras, no hay quien las defienda. Recomendación: dejar una sola frase («hay evidencia de que decidir por adelantado ayuda, y de que la autocompasión tras un desliz reduce el "qué más da"») y sacar los números.
2. **La landing y el pitch contradicen al producto.** Ya lo reportaste a Benja y sigue igual en el commit actual: «el lunes no se parte de cero: se sigue», «no la embarraste», «yo sigo aquí», «opción 2, salud mental», «si te pasas». El prompt vivo prohíbe cada una de esas frases. Si el jurado ve la landing y después la demo, verá dos Amis.
3. **El titular «El lunes ya no partes de cero» nombra el lunes**, que Ami nunca nombra. Como mensaje al jurado funciona. Como voz de Ami, no. Está bien si lo presentan como la promesa del producto y no como algo que Ami dice.
4. **«Con calma» en vez de «lúcida».** El README aún dice «cuando ella está lúcida». Hay que cambiarlo por la misma razón que lo cambiaste en el speech.
5. **La pregunta que rompe la narrativa:** «¿Y si Antonia no quiere que un bot le organice el sábado?» La respuesta existe (Ami conversa primero, el plan es una invitación, hay `pausa`), pero no está en el pitch. Pónganla.

## 5. Fricciones a eliminar, por impacto

| # | Fricción | Impacto | Comprobado |
|---|---|---|---|
| 1 | **Ami pierde el hilo en Vercel** si no están `KV_REST_API_URL` y `KV_REST_API_TOKEN`. El README del agente lo advierte: sin Redis «cada instancia tiene su propia memoria». Es lo que viste al probar. Sin esto, la demo en vivo puede reiniciarse delante del jurado | Crítico | Código leído; configuración de Vercel no verificable desde tu cuenta |
| 2 | **El chat en WhatsApp aparece como «PhishGuard»**, número compartido del sandbox. Si se proyecta el teléfono, el jurado verá eso | Alto | Nota de Benja |
| 3 | **Ami corre con Haiku** hasta que alguien cambie `AMI_MODELO` a Opus para el pitch. Con Haiku el formato que pediste (sin punto final, sin «¿») se cumple a medias: en mi prueba la segunda burbuja llevaba «¿» | Alto | Demo probada |
| 4 | **Latencia.** Cada respuesta tardó entre 6 y 10 segundos. En un pitch de 5 minutos son 40 segundos de silencio por cuatro turnos. Hace falta un acuse («Ya la veo, dame un momento») o un guion con menos turnos | Alto | Demo probada |
| 5 | **Ami se presenta sola cada vez** («Hola! Soy Ami, un programa que te acompaña con la comida del finde»). Bien la primera vez; en una demo con reinicios suena a bot | Medio | Demo probada |
| 6 | **El botón de la landing apunta a un número de relleno** o, según el commit de las 13:08, al sandbox con código. Confirmar que el flujo `join driving-minerals` funcione desde un teléfono que el jurado vea | Medio | Commit leído, no probado |
| 7 | **Crédito de la API.** Benja avisó que queda poco. Una demo que se corta por saldo es peor que una demo lenta | Medio | Nota de Benja |
| 8 | **Riesgo vital no probado en código con la API.** Benja escribió que el clasificador «no se ha probado con la API». Mi prueba activó una alerta de nivel 1 correctamente; el nivel 2 no lo probé para no gastar crédito ni actuar ideación en una demo compartida | Medio | Parcial |

## Cinco acciones, en orden

1. **Conectar Upstash Redis en el proyecto `ami-agente` y comprobar que una conversación sobreviva a dos recargas.** Benja, 20 minutos. Sin esto, nada de lo demás importa.
2. **Alinear landing, pitch y README con el prompt vivo.** Sacar «se sigue», «no la embarraste», «yo sigo aquí», «opción 2», «si te pasas», «lúcida»; dejar los estudios en una frase sin cifras. Benja en código, tú en los textos, 40 minutos.
3. **Cerrar una sola versión de los antojos** (número dicho o invisible) y reflejarla en los tres lugares. Los dos, 10 minutos de conversación.
4. **Guion de demo con cuatro turnos máximo**, mensajes precargados en el teléfono de Antonia, acuse de recibo para la foto, Opus activado, saldo verificado, y un ensayo cronometrado completo. Los dos, 45 minutos.
5. **Preparar las tres respuestas que hoy no tienen:** «¿por qué cambiaría Antonia?» (argumento, no dato), «¿cuántos antojos tiene?» (una sola respuesta) y «¿y si no quiere un bot?» (conversa primero, pausa). Tú, 20 minutos.

## Lo que no pude comprobar

La configuración de Vercel de Benja (el proyecto no está en tu cuenta), el flujo de WhatsApp desde un teléfono, el nivel 2 del detector con la API, y el estudio de Sharif y Shu. Todo lo demás está leído en el repo o probado en la demo.
