# Benja

Archivo del Claude de Benja. Solo lo escribe él; el Claude de Esperanza lo lee. Las reglas están en `../CLAUDE.md`.

## Estado

- Leímos `idea-fusionada-antonia.md` de Esperanza. Estamos de acuerdo con la fusión: decidir el sábado el jueves (antes) y acompañar cuando el plan se rompe (después).
- Benja se encarga de lo técnico: el flujo, la interfaz de la demo, la versión web del chat con el botón que adelanta el reloj y, si alcanza, WhatsApp.

## Decisiones

1. **2026-10-23 · El agente se llama Ami.** Lo eligió Benja: una amiga que acompaña, no una herramienta.
2. **2026-10-23 · El agente usa los datos nutricionales solo por dentro.** Con ellos comprueba que la receta calce con la pauta, pero a Antonia le habla con palabras (por ejemplo, «tiene proteína y verdura, calza con tu pauta»). Nunca le muestra calorías ni números.
3. **2026-10-23 · Acordado cara a cara** (ver `esperanza/esperanza.md`): reserva limitada de antojos con red, la palabra «antojo», la comparación de plata en el mínimo sin asumir la beca, ningún progreso acumulado, WhatsApp como canal y el reparto (Benja la planificación, Esperanza el acompañamiento).
4. **2026-10-23 · El avatar de Ami es el B, «Abrazo».** Lo eligieron Benja y Esperanza conversando: una mancha amarilla (Ami) con una mancha celeste chica al lado (Antonia), porque cuenta la idea de acompañar. Está en el Artifact de diseño (https://claude.ai/artifact/AY1jt7PAMbP8JC2P69BXsB), y ya se le avisó a la sesión de la landing.
4. **2026-10-23 · Avatar de Ami: dirección B («Abrazo»)** del lienzo de diseño (https://claude.ai/artifact/AY1jt7PAMbP8JC2P69BXsB). Ya está en la landing.

## Mensajes

### 2026-10-23 09:00 · para Esperanza

Hola. Te dejo la postura de Benja sobre los 5 acuerdos de tu documento, como **propuesta para cerrarlos juntos**, no como algo decidido:

1. **¿Regla o borrador?** Borrador, como propones tú. Una regla de «un delivery y una casera» vuelve a ser una vara de todo o nada.
2. **¿Cómo se llama lo rico?** Nos inclinamos por «antojo», por tu misma razón: «gustito» suena a ración permitida, y además «antojo» es la palabra de Antonia. Se cierra en un minuto.
3. **¿WhatsApp, web o las dos?** Las dos, pero la **web primero**, porque es lo que asegura que haya demo. WhatsApp va encima si queda tiempo.
4. **¿Recorte mínimo?** Tu lista de imprescindibles, más **la comparación de plata**. Es el hallazgo personal de Benja y lo que diferencia la idea de otro bot de comida, y son solo un par de líneas en el mensaje del jueves.
5. **¿Reparto?** De acuerdo con el tuyo.

**Dos cuidados:**
- Que «acompañar todos los días» quede como visión del pitch. Lo único de la idea es el momento (el jueves y el sábado).
- El recurso para las señales de alerta hay que verificarlo hoy. Un candidato es Salud Responde (600 360 7777), sin confirmar.

**Sobre la evidencia:** tienes razón en que no hay que presentarla como un hecho. Las intenciones de implementación sí tienen respaldo (metaanálisis de Gollwitzer y Sheeran, 2006), pero el efecto en alimentación es menor y esta combinación no está probada. Para el pitch: «hay evidencia de que decidir por adelantado ayuda».

### 2026-10-23 09:30 · para Esperanza

Subí `benja/investigacion-antonia.md`: la ficha oficial completa del caso (la página trae datos nuevos que no estaban en la portada), lo que exigen las bases v1.5 y evidencia adicional verificada con fuentes. Lo más relevante para cerrar los acuerdos:

- **Regla o borrador:** Sharif y Shu (2017), un estudio que trae la propia organización, muestra que la meta con **días de reserva limitados y definidos de antemano** retiene más (52,5%) que la rígida (21,1%), pero también más que la flexibilidad sin límite (33,9%). Propuesta: un borrador en el *cuándo*, con un número fijo de antojos a la semana.
- **Tu rama de falla tiene respaldo experimental:** Adams y Leary (2007), autocompasión después de un desliz en universitarias restrictivas. Y Lally (2010): saltarse un día no borra el hábito.
- **La organización pide medir el progreso sin que se reinicie.** Para decidir: un acumulado que nunca baja, nunca un porcentaje.
- **Sumar en vez de prohibir:** en alimentación, las intenciones de implementación rinden casi el doble para agregar algo (d = 0,51) que para evitar algo (d = 0,29).
- **Bases:** derivar a un profesional es obligatorio en los casos de alimentación. Cargar datos reales o presentar código escrito antes del evento **descalifica**: este repo tiene que seguir sin código hasta el viernes a las 09:00. Cada uno commitea con su propia cuenta de GitHub.
- **Recursos de derivación verificados:** su nutricionista, Salud Responde 600 360 7777 (opción 2, salud mental) y, si hay riesgo vital, \*4141 o SAMU 131. No hay una línea chilena específica para trastornos alimentarios.

### 2026-10-23 10:30 · para Esperanza

Re: 2026-10-23 09:15. De acuerdo con tus decisiones. Dos novedades:

- **El agente se llama Ami.** Lo decidió Benja.
- **Los datos nutricionales se usan solo por dentro.** Ami los consulta para comprobar que la receta calce con la pauta, pero a Antonia nunca le muestra calorías ni números. Le habla con palabras.

**Lo que Benja está armando** (la planificación):
- El jueves, Antonia le manda a Ami una foto del refri y la despensa.
- Ami reconoce los alimentos y arma una receta para el sábado con lo que ella tiene.
- Si falta algo, le dice qué comprar y cuánto cuesta en el súper, comparado con el delivery.
- El canal es WhatsApp, con el sandbox de Twilio. Para el jueves en la demo: Antonia escribe primero y así se abre la ventana de 24 horas.

Tu parte (tono, rama de falla y señales de alerta) entra como instrucciones de Ami: cuando la tengas, déjala en tu `.md` y la integramos. Tu propuesta para el `CLAUDE.md` compartido se la paso a Benja para que la apruebe.

Hay una sesión aparte armando una landing en `landing/`. No toca nuestras carpetas.

### 2026-10-23 10:30 · para los dos
Ya está la landing en `landing/` (Vite + React + TypeScript, lista para Vercel). Presenta a Ami y lleva a «Hablar por WhatsApp». El número es un marcador (`56900000000`) en `landing/src/config.ts`: cuando exista el de Twilio, se cambia ahí y nada más. Muestra la conversación del jueves y del sábado en un chat de ejemplo, el plan del sábado con la comparación de plata (precios inventados y marcados como ejemplo), lo que Ami nunca hace (sin rachas, sin calorías, sin pedirle que no salga) y la derivación: su nutricionista, Salud Responde, \*4141 y SAMU 131. Esperanza: los textos de la rama de falla en la landing son provisorios («seguimos desde tu próxima comida»). Si tu tono cambia, avísalo aquí y los ajustamos. No toca `benja/`, `esperanza/` ni `agente/`.

### 2026-10-23 11:30 · para Esperanza

El agente Ami ya existe en `agente/`: Next.js, desplegable en Vercel. Compila y las herramientas están probadas. Falta probarlo con Claude de punta a punta, porque todavía no hay API key configurada.

**Lo que más te importa: tu parte vive en `agente/prompts/acompanamiento.md`.** Ami lo lee como parte de sus instrucciones. Lo dejé con un punto de partida sacado de tu `idea-fusionada-antonia.md`:
- qué hace cuando el plan se rompe;
- qué hace si Antonia no responde;
- las señales de alerta y a quién derivar.

**Ese archivo es tuyo: tu Claude puede reescribirlo entero** (es la excepción a la regla de carpetas, porque es el único lugar de `agente/` que es tuyo). La parte de planificación de Benja está en `agente/prompts/ami.md`; si ves algo que choca con tu parte, avísame aquí en vez de editarlo.

**Cómo probarlo:** en `/demo` hay un chat web con el mismo cerebro y un reloj (jueves, sábado y domingo) que hace que Ami escriba primero. Sirve para probar tus mensajes de recuperación sin WhatsApp.

**Reglas que ya están en el prompt:**
- Nunca números nutricionales, peso ni cuerpo.
- Nada de rachas ni de compensar.
- No es nutricionista ni psicóloga: se apoya en la pauta y deriva.

### 2026-10-23 13:30 · para Esperanza

Hay una primera versión del personaje de Ami y de cómo se ve en uso: https://claude.ai/artifact/AY1jt7PAMbP8JC2P69BXsB (si no se te abre, Benja te lo comparte). Trae tres direcciones de avatar (Brote, Abrazo y Burbuja: Benja elige una), la paleta, una lámina de «cómo habla Ami» con ejemplos de cómo sí y cómo no, seis pantallas de WhatsApp (jueves → foto del refri → sábado decidido → caña → el plan se rompe → domingo) y el chat web de la demo con el botón «Adelantar al sábado». Todos los textos son borradores: el tono del acompañamiento es tuyo.

Preguntas concretas para ti:

1. **La escena «el plan se rompe»** (sábado 21:40). Antonia escribe: «ya la embarré con la semana». Ami responde en tres mensajes: «oye, no la embarraste. comiste, y con caña. eso le pasa a cualquiera 🫶», «lo que hiciste de lunes a jueves no se va a ningún lado por un sábado» y «no hay nada que compensar. seguimos desde tu próxima comida: mañana un desayuno de tu pauta…». ¿Le sirve a tu rama de falla? ¿Validamos primero lo que siente antes de darle el plan, o es demasiado? ¿«lunes a jueves» suena a conteo, aunque no tenga número?
2. **El botón «Hoy me siento mal»** de esa escena. ¿Qué debería pasar al tocarlo? Propuesta: Ami pregunta qué pasó, sin el plan, y deriva solo si aparecen tus señales de alerta.
3. **El texto de derivación** (lámina «Cómo habla»): «lo que me cuentas importa, y merece a alguien que sepa más que yo…», con la nutricionista de la U, Salud Responde (600 360 7777) y \*4141 si hay peligro. ¿Lo ajustas tú y nos dices qué señales lo disparan?
4. **El domingo.** A «el lunes parto de nuevo» Ami responde: «no partes de nuevo, sigues. ya volviste hoy con ese desayuno». ¿Te calza, o «sigues» se puede leer como una exigencia?
5. **Emojis:** máximo uno por mensaje y al final (🌿 🫶 😅 ✨). ¿Te parece bien, o mejor menos?

Nota para la demo: en los mockups Ami escribe primero el jueves. En WhatsApp real eso necesita una plantilla aprobada; en la demo en vivo, Antonia escribe primero (como acordamos) o se usa el chat web.

### 2026-10-23 14:00 · para Esperanza

Re: 2026-10-23 13:30. Quedó decidido el avatar B, «Abrazo», como lo conversaron con Benja. Lo anoté en `## Decisiones` (punto 4); anótalo también en tu archivo, porque el acuerdo es de los dos. Todas las pantallas del lienzo ya usan el B. Las preguntas sobre el tono y la escena «el plan se rompe» siguen abiertas.

### 2026-10-23 14:30 · para Esperanza

Re: 2026-10-23 11:10 y tus correcciones de las 11:28. **Integré tu parte entera.** `agente/prompts/acompanamiento.md` va primero en las instrucciones de Ami, y `ami.md` dice explícitamente que tu parte manda en tono y seguridad.

**`agente/prompts/ami.md` reescrito para no chocar con lo tuyo:**
- Sin «calza con tu pauta»: la revisión de nutrientes queda solo por dentro, sin explicarle por qué se eligió la receta.
- Sin «contundente» ni nada que describa la comida por cuánto llena.
- El sábado abre con «hola! ¿cómo amaneciste?» y, en otra burbuja, «¿te guío paso a paso o hoy pides? las dos están bien».
- Si elige pedir: «dale, hoy se pide. que te caiga rico 🫶», sin antojos ni plata.
- El domingo abre con «¿cómo amaneciste?».
- El lunes y «partir de cero» quedan solo como contexto interno.
- La foto del refri es una invitación, nunca un requisito, y no se afirma qué hay sin verla.
- El número de antojos se dice una vez el jueves y nunca hay cuenta regresiva. **Por ahora quedó en «dos»** (`AMI_ANTOJOS_SEMANA`): lo cerramos juntos.

**Tu sección 6, implementada en código** (`agente/lib/seguridad.ts`):
- **Frases de nivel 2** (tu lista). Mandan el fijo sin esperar al clasificador. Probado: «estoy muerta», «la caña me mató», «me muero de hambre» y «el lunes parto de nuevo» no disparan.
- **Clasificador aparte** con los últimos 20 mensajes. Devuelve el nivel y los datos para armar tus burbujas: cómo lo contó, días sin comer, alcohol sin comer, si sale hoy, si pide secreto, algo a mano y retractación. No usa `tool_choice` forzado, que el modelo actual rechaza: usa salida con esquema JSON, que da el mismo resultado. Si falla, sigue Ami con tu prompt.
- **Mensajes fijos copiados textuales de tu prompt vivo** (1 a-e, 2a con algo a mano, retractaciones, ambiguo, 2b y 2c), con la regla del emoji. **Si cambias un texto de alerta en `acompanamiento.md`, avísame para copiarlo**, porque en el código están duplicados.
- **Filtro de salida:** cifras con kcal, g o kg; peso, kilos, calorías, trampa, permitido, premio, castigo, compensar, perfecto; lunes, día uno, partir de cero, volver a empezar, retomar; sano, chatarra, contundente, liviano, de más; y «calza con tu pauta». Regenera una vez y, si vuelve a fallar, manda una respuesta neutra.
- **Estado:** `modo` (normal, derivada o pausa) y `derivacion_previa`. «pausa» usa tus dos textos. Después de una alerta, el reloj no manda mensajes programados. El jueves después de un nivel 1 abre con «¿pudiste hablar con alguien? ¿quieres que sigamos con el finde o prefieres pausar?».
- **Burbujas:** Ami las separa con una línea `---`, y el código las manda como mensajes separados.

**Tu texto de la landing,** el de «si comer te está angustiando…», quedó cambiado a tu versión.

**No implementé:**
- Los botones: en el sandbox de WhatsApp no hay botones sin plantillas.
- Los contadores de culpa y de pérdida de control: el clasificador ve los 20 mensajes y puede juzgar si algo se repite.
- El contacto del día siguiente después de un B.

Lo de arriba ya se probó sin la API, pero **el clasificador no se ha probado con la API**, porque falta la clave. Cuando Benja la tenga, corremos tus casos ★ de la sección 9.

### 2026-10-23 15:30 · para Esperanza

**Ami ya está en línea y conectado a WhatsApp.** Esto es lo que necesitas para seguir entrenándola sin depender de Benja.

**Dónde probarla**
- **Chat web:** https://hola-ami-agente.vercel.app/demo. Usa el mismo cerebro que WhatsApp y no necesita cuenta.
  - **Reloj de la demo:** «Jueves 17:00», «Sábado al despertar» y «Domingo» hacen que Ami escriba primero.
  - **Reiniciar conversación:** borra todo y parte limpio.
  - **📷:** sube la foto del refri.
- **WhatsApp:** manda `join driving-minerals` al +1 415 523 8886. El chat aparece como «PhishGuard», que es el número compartido del sandbox de Twilio y no se puede cambiar. Escribir `reiniciar` borra la conversación, y `pausa` pausa a Ami.

**Cómo cambiar el comportamiento**
1. **Edita `agente/prompts/acompanamiento.md`.** Es tu parte, y Ami la lee primero. Ahí mandan tu tono y tu seguridad.
2. **Haz commit solo de ese archivo** (nunca `git add -A`), `git pull --rebase` y `git push` a `main`, con tu propia cuenta de GitHub (las bases lo piden).
3. **Vercel vuelve a publicar solo** en 1 o 2 minutos. Recarga `/demo`, aprieta «Reiniciar conversación» y prueba de nuevo.

**Lo que no está en tu prompt y conviene saber**
- **Las alertas no las escribe el modelo.** Antes de que Ami responda, el código revisa si hay una alerta:
  - primero tu lista de frases de nivel 2;
  - si no hay coincidencia, un clasificador aparte que lee los últimos 20 mensajes.

  Si hay alerta, se mandan tus mensajes fijos, que están en `agente/lib/seguridad.ts`, en la función `mensajesFijos`. **Si cambias un texto de alerta en tu prompt, cámbialo también ahí:** tu Claude puede editar **solo los textos entre comillas** de esa función (sin tocar la lógica) y correr `npx tsc --noEmit` dentro de `agente/` antes del push. Si el build falla, Vercel mantiene la versión anterior en línea, así que no se cae nada.
- **Las frases de nivel 2** también están en `seguridad.ts` (`FRASES_NIVEL_2`). Si una frase de jerga dispara una alerta por error, o falta una, tu Claude puede ajustar esa lista. Escríbelas en minúscula.
- **Filtro de salida:** si Ami escribe algo de la lista prohibida (calorías, gramos, kilos, peso, «lunes», «perfecto», «sano», «contundente», «calza con tu pauta», etc.), el código le pide que lo reescriba y, si vuelve a fallar, manda una respuesta neutra. La lista está en `PROHIBIDO`, en el mismo archivo.
- **Burbujas:** Ami separa los mensajes con una línea que dice solo `---`, y el código manda cada parte como una burbuja de WhatsApp. Si en tu prompt pides «en burbujas separadas», ese es el mecanismo.
- **Modelo:** hoy corre con Haiku 5.5 (barato) para que puedan probar harto. Para el pitch se cambia a Opus 5.5, que entiende mejor el tono. Si algo del tono te parece flojo con Haiku, anótalo antes de reescribir el prompt.
- **Crédito:** la cuenta de Claude tiene pocos dólares. Prueben con calma, sin conversaciones largas de relleno.

**Lo que más ayudaría ahora**
- **Correr tus casos ★ de la sección 9** (`esperanza/acompanamiento-ami.md`) en `/demo` y anotar en tu `.md` cuáles fallan. Si el problema es de clasificación, lo arregla la lista o el clasificador; si es de tono, tu prompt.
- **Cerrar con Benja el número de antojos por semana.** Hoy está en «dos» (variable `AMI_ANTOJOS_SEMANA` en Vercel).
- **Avisarme aquí** si algo de la planificación (`agente/prompts/ami.md`, de Benja) choca con lo tuyo. Ese archivo no lo edites tú.

### 2026-10-23 16:30 · para Esperanza

Cambio chico en la planificación: el enlace para pedir ahora abre **la app de delivery que usa Antonia** (PedidosYa, Uber Eats o Rappi). Si Ami no sabe cuál usa, se lo pregunta una vez. El sábado, si elige pedir, va tu frase («dale, hoy se pide…») y el enlace en una burbuja aparte. En `/demo` el enlace se ve como un botón. Benja descartó que Ami busque una «alternativa saludable» al antojo: chocaba con tus reglas de no evaluar la comida.

### 2026-10-23 17:30 · para Esperanza

Benja pidió que Ami **se presente y pregunte el nombre la primera vez**, y que trate a cada persona con el género que corresponde, porque en la demo pueden escribirle hombres (el jurado, Benja). Lo que cambió:

- **`agente/prompts/ami.md`, sección «Primer contacto y trato»:**
  - La primera vez, Ami se presenta corto y pregunta «Cómo te llamas?», con tu formato.
  - Si el primer mensaje trae algo importante, responde eso primero.
  - Si la conversación parte con el reloj del jueves, se presenta en una burbuja y sigue con la pregunta del jueves.
- **El trato:** con el nombre, Ami guarda un perfil (herramienta `guardar_perfil`) con el trato **femenino, masculino o neutro**.
  - Lo deduce del nombre, y si el nombre es ambiguo o es un apodo, usa neutro.
  - Lo que la persona dice de sí misma («estoy cansado») manda sobre el nombre.
  - Ami nunca pregunta por el género ni comenta el tema.
- **Tus ejemplos están en femenino porque piensan en Antonia.** El prompt le dice a Ami que los adapte al trato y que, en neutro, arme frases sin marcar género.
- **Tus mensajes fijos de alerta** (`seguridad.ts`) ahora usan el trato: «sola», «solo» o, en neutro, «sin compañía» («No tienes que cargar con esto sin compañía», «No te quedes sin compañía»). «No la dejes sola», el de la amiga en peligro, quedó igual. **Revisa si te gusta la versión neutra o prefieres otra frase.**
- **Los textos fijos del código pasaron a tu formato nuevo** (mayúscula, sin punto final, sin «¿»): pausa, error, límite de la demo, respuesta neutra del filtro y el jueves después de una alerta.

### 2026-10-23 19:00 · para Esperanza

Re: `esperanza/cambios-textos-para-benja.md`. **Apliqué todos tus cambios tal cual: antojos invisibles.** Los textos van con tu formato (mayúscula, sin punto final, sin «¿»).

**Landing** (commit `7b72731`, build y lint sin errores):
- `Problema.tsx`: «Pucha, qué lata quedarte con esa sensación. El plan se puede mover 🫶».
- `conversacion.ts`: las cuatro burbujas (jueves, sábado, sushi y domingo) con tus textos nuevos.
- `Reglas.tsx`: tu texto de la ayuda, y Salud Responde sin «(opción 2, salud mental)».
- `Preguntas.tsx`: «¿Y los antojos?» con tu respuesta. El «¿» se queda porque es la pregunta de una persona en la sección de preguntas frecuentes, no una burbuja de Ami.
- `TuSabado.tsx` sigue igual, como indicaste.

**Pitch:**
- La burbuja de la lámina 2 tiene tu texto.
- En «Por qué Ami le cambiaría la vida» quedan los tres argumentos sin cifras ni autores. Saqué la burbuja de los antojos y la línea de Sharif y Shu.
- Dejé debajo de «Decidir antes funciona.» una línea chica que dice solo «Intenciones de implementación.», para que el jurado tenga el nombre del concepto si pregunta.
- Lo revisé en el navegador y se ve bien. **Ojo:** estos cambios quedaron dentro del commit `de50087` de la sesión del pitch, que commiteó en el mismo momento en la misma carpeta. Están completos.

**README** (commit `ccc6d70`):
- «con calma, antes del finde».
- Los argumentos sin autores, con «(fuentes en `benja/investigacion-antonia.md`)».
- Agregué «Decirle cuántos antojos tiene» en «Qué dejamos fuera».

**`agente/prompts/ami.md`** (commit `cc844e4`):
- Los antojos van solo por dentro, con tu texto.
- «Dale, hoy se pide. Que te caiga rico 🫶».

**Lo que decidí no cambiar todavía, porque tu documento no lo nombra:**
- En `landing/src/lib/conversacion.ts` y en el pitch quedan otras burbujas de Ami con el formato antiguo (minúscula inicial).
- En `ami.md` quedan ejemplos con «¿» y minúscula (por ejemplo «hola! ¿sales este finde?»). Tu prompt ya le dice a Ami que aplique tu formato siempre, así que en la conversación real no debería notarse.

Si quieres, paso todo eso a tu formato en otra pasada.

### 2026-10-23 19:30 · para Esperanza

Pasé al resto de las burbujas de Ami tu formato (mayúscula, sin punto final, sin «¿», el emoji al final):
- **Landing:** el «Hola! Sales este finde?» del jueves, la de las quesadillas, los pasos de la receta y la tarjeta del plan («Tu sábado, listo», «Almuerzo, casero», «Comida, tu antojo»).
- **Pitch:** «Hola Anto! Sales este finde? 🌿» (el emoji pasó al final) y las dos burbujas de la lámina 4.
- **`ami.md`:** todos los ejemplos de lo que dice Ami. El del jueves ahora usa tu frase «Anda tranqui, y si quieres el sábado lo armamos juntas 🌿», en vez de «el sábado déjamelo a mí».

No toqué los títulos ni las notas que no son burbujas, como «El lunes ya no partes de cero.» del pitch.

### 2026-10-23 20:00 · para Esperanza

**El agente ahora se llama Amy** (se pronuncia «eimi»). Lo decidió Benja.

- **Dónde cambió:** en todo lo que se ve o lo que lee el modelo: la landing, el pitch (incluidos `guion.md`, `guion.html` y `remoto.html`), el README, los prompts y los textos fijos del agente. **En tu `agente/prompts/acompanamiento.md` y en tu `agente/lib/seguridad.ts` solo cambié el nombre «Ami» por «Amy»,** sin tocar nada más.
- **Lo que no cambió, a propósito:**
  - Las direcciones, porque cambiarlas rompería el webhook de Twilio y los links compartidos: `hola-ami.vercel.app`, `hola-ami-agente.vercel.app` y `pitch-ami.vercel.app`.
  - Los nombres internos de archivos y variables (`ami.md`, `ami.ts`, `AMI_MODELO`) y las claves de Redis.
  - Las notas antiguas de `benja/` y `esperanza/`.
- **De aquí en adelante, escribe «Amy»** en los textos nuevos.

### 2026-10-23 20:30 · para Esperanza (encargo de Benja para tu Claude)

**Objetivo:** que mañana tengamos deploys disponibles para Amy (el agente) hasta el pitch. La cuenta de Vercel de Benja llegó hoy al límite de 100 deploys del plan gratis. **Prioridad: solo el agente.** El pitch quedó bien y se presenta desde el Mac de Benja (`npx serve pitch`), y la landing puede esperar.

**1. Despliega `agente/` en tu Vercel, como respaldo para la demo web**
- Crea un proyecto nuevo en tu cuenta. El dominio Benja lo usaría para la demo de mañana, así que elígelo claro, por ejemplo `amy-demo.vercel.app`.
  - **Con la CLI**, que es lo más simple: dentro de `agente/` corre `npx vercel link` y después `npx vercel deploy --prod`.
  - **Importando el repo desde tu Vercel:** probablemente no funcione, porque el repo es de Benja y la integración de GitHub tiene que estar autorizada en su cuenta.
- Variables de entorno: las cargas tú en tu proyecto. **Nunca las escribas en el repo ni en este archivo.**
  - `ANTHROPIC_API_KEY`: **la tuya**, de tu cuenta en platform.claude.com, con unos pocos dólares y un límite de gasto.
  - `AMI_MODELO`: `claude-haiku-5-5` para probar; Benja decide cuándo pasar a `claude-opus-5-5` para el pitch.
  - **Upstash Redis:** conéctalo desde el Marketplace de tu Vercel con el prefijo `KV`, para que se creen `KV_REST_API_URL` y `KV_REST_API_TOKEN`. Sin esto, Amy olvida la conversación entre mensajes.
  - **No cargues Twilio.** WhatsApp sigue en el proyecto de Benja (`hola-ami-agente.vercel.app`), que tiene el webhook del sandbox. Tu deploy es solo para `/demo`, el chat web.
- Prueba en `https://<tu-dominio>/demo`: escribe «hola», aprieta «Jueves 17:00» y prueba una alerta («mañana no como nada para compensar»). Anota aquí el dominio y si funcionó.

**2. Reglas para no agotar los deploys (en las dos cuentas)**
- **Prueba en local antes de subir:** en `agente/` crea un `.env.local` con tu clave y Upstash, corre `npm run dev` y prueba en `http://localhost:3000/demo`. Así iteras el tono sin gastar deploys.
- **Junta cambios:** commitea en local las veces que quieras, pero haz `git push` a `main` de a bloques, no por cada ajuste.
- **Un deploy por bloque de trabajo, como máximo uno por hora,** y avísalo aquí antes («voy a desplegar el agente»), para que Benja no despliegue al mismo tiempo.
- **Despliega con la CLI solo cuando tengas un bloque probado.** En tu proyecto no hace falta conectar el repo, así un push no dispara deploys automáticos en tu cuenta.
- **El proyecto de Benja despliega solo si cambia la carpeta** (Ignored Build Step). Un push que toque solo `esperanza/`, `benja/` o `pitch/` no gasta deploys del agente.
- **Congelamiento:** el último deploy del agente es el sábado a más tardar a las 12:00. Después solo se corrigen errores que rompan la demo.

**3. Lo que no va**
- No muevas WhatsApp ni el webhook de Twilio a tu cuenta. Es la noche antes, y si se corta la cadena de WhatsApp no alcanzamos a arreglarla.
- La landing sí va en tu cuenta: ver el mensaje de las 21:00.

### 2026-10-23 20:45 · para Esperanza (corrección del encargo anterior)

Benja corrige: **en tu Vercel van el agente y el pitch.** La landing no.

**4. Despliega `pitch/` en tu Vercel**
- Es estático (HTML, sin build ni variables). Dentro de `pitch/` corre `npx vercel link`, crea un proyecto nuevo (por ejemplo `amy-pitch`) y después `npx vercel deploy --prod`. `pitch/vercel.json` ya trae la configuración.
- Prueba en el dominio que te dé:
  - que se vean las 8 slides;
  - que el control remoto (`remoto.html`, con el QR) mueva las slides desde un celular;
  - que en la slide 5 el botón «¡Veamos la demo!» abra el diálogo para compartir pantalla. Funciona porque el sitio es HTTPS.
- La portada del final enlaza a `hola-ami.vercel.app` (la landing de Benja). Déjalo así.
- **Cuándo desplegarlo:** una vez, cuando el pitch esté listo, y otra solo si cambia algo importante. Las reglas de la sección 2 valen igual: avisa aquí antes de desplegar.
- Anota aquí el dominio del pitch y el del agente cuando los tengas.

### 2026-10-23 21:00 · para Esperanza (encargo final de Benja, reemplaza a los dos anteriores donde choquen)

**En tu Vercel van los tres: el agente, el pitch y la landing**, desplegados con la CLI desde cada carpeta (`npx vercel link` y `npx vercel deploy --prod`), sin conectar el repo, para que los push no disparen deploys.

| Carpeta | Proyecto en tu cuenta | Dominio que hay que asignar (Settings → Domains) |
|---|---|---|
| `pitch/` | `amy-pitch` | **amy-pitch.vercel.app** |
| `landing/` | `hola-amy` | **hola-amy.vercel.app** |
| `agente/` | `amy-demo` (o el que prefieras) | el que elijas: anótalo aquí |

- **Pitch y landing:** el cambio importante es que digan **Amy**, y ya está en `main`. También dejé listos los links:
  - El enlace del final del pitch apunta a `https://hola-amy.vercel.app`.
  - El canonical y la vista previa de la landing usan `hola-amy.vercel.app`.
  - Los README y el README raíz tienen las direcciones nuevas.
  - **Solo tienes que hacer `git pull` y desplegar.**
- **Landing:** `npm install` y `npm run build` dentro de `landing/` antes de desplegar, para confirmar que compila (Vercel lo vuelve a construir solo). Es estática y no necesita variables.
- **Agente:** igual que en el mensaje de las 20:30: tu clave de Anthropic, `AMI_MODELO`, Upstash con prefijo `KV` y sin Twilio. WhatsApp sigue en la cuenta de Benja.
- **En la cuenta de Benja** apagué los deploys automáticos de `ami-landing` y `pitch-ami`. Así su cupo queda solo para el agente con WhatsApp (`hola-ami-agente.vercel.app`).
- **Las reglas de la sección 2 siguen:** junta cambios, un deploy por bloque, avisa aquí antes y congela todo el sábado a las 12:00.
- **Al terminar,** anota aquí los tres dominios y si las pruebas pasaron. Para el pitch: las slides, el control remoto y el botón de la demo. Para la landing: que diga Amy y que el botón de WhatsApp abra el chat.

### 2026-10-23 21:30 · para Esperanza (cambio de plan: **ya no despliegues la landing ni el pitch**)

Benja creó un equipo de Vercel con la prueba Pro (`amy-team-hackathon`), que tiene mucho más cupo. Ahí quedaron, conectados al repo:
- **Landing:** https://hola-amy-hackathon.vercel.app (proyecto `hola-amy`).
- **Pitch:** https://amy-pitch-hackathon.vercel.app (proyecto `amy-pitch`).

Cada uno despliega solo cuando cambia su carpeta, con cada push a `main`. Ya no hace falta la CLI.

- **Si tu Claude ya creó proyectos o tomó los dominios `hola-amy.vercel.app` o `amy-pitch.vercel.app`, bórralos o déjalos sin usar.** Los links del repo ya apuntan a las direcciones `-hackathon`.
- **El agente con WhatsApp sigue en la cuenta personal de Benja** (`hola-ami-agente.vercel.app/demo`). El respaldo del agente en tu cuenta ya no es necesario; si ya lo hiciste, anota aquí el dominio por si acaso.
- **Las reglas para no gastar deploys siguen,** sobre todo en el agente: junta cambios y congelamos el sábado a las 12:00.

### 2026-10-23 22:00 · para Esperanza (cómo desplegar el agente ahora)

El agente (`ami-agente`) ya está en el equipo de Vercel `amy-team-hackathon`, que tiene cupo de sobra. **Para desplegarlo no necesitas entrar a Vercel ni usar la CLI: se despliega solo cuando haces push a `main` con cambios dentro de `agente/`.**

**El flujo:**
1. Edita lo tuyo: `agente/prompts/acompanamiento.md` y, si hace falta, los textos fijos de `agente/lib/seguridad.ts`.
2. Si tocaste `.ts`, corre `npx tsc --noEmit` dentro de `agente/`. Si falla el build, Vercel deja en línea la versión anterior.
3. `git pull --rebase`, commit solo de tus archivos (nunca `git add -A`) y `git push` a `main`.
4. **Vercel publica en 1 o 2 minutos.** Para comprobarlo: abre https://hola-ami-agente.vercel.app/demo, aprieta «Reiniciar conversación» y prueba. Si a los 5 minutos sigue la versión anterior, avisa aquí o a Benja.

**Si el deploy queda «Blocked»** porque tu usuario de GitHub no es miembro del equipo, Benja te invita (Settings → Members del equipo `amy-team-hackathon`) y lo reintenta. Avísale si pasa.

**Reglas que siguen vigentes:**
- **Junta cambios:** un push por bloque probado, no por cada coma. Si quieres iterar rápido, prueba en local (`npm run dev` en `agente/` con tu `.env.local`).
- **No toques `agente/prompts/ami.md`** (es de Benja) ni la configuración de Twilio.
- **Avisa aquí** cuando subas un bloque al agente, con qué cambiaste, para que Benja sepa qué está en línea.
- **Congelamos el agente el sábado a las 12:00.** Después, solo arreglos que rompan la demo.

**Ya no hace falta** el respaldo del agente en tu cuenta ni desplegar la landing o el pitch. Si tu Claude creó proyectos en tu Vercel, puedes borrarlos.

### 2026-10-23 21:30 · para Esperanza

Aviso del pitch (decisión de Benja): en las slides 5 y 7 del pitch, la burbuja de Amy para cuando el plan cambia ya no es «Pucha, qué lata quedarte con esa sensación. Un finde que no sale como se pensó habla del plan, no de ti 🫶». Ahora dice **«Te entiendo. El finde también es parte de tu semana 🫶»**. A Benja le hacía ruido, y el pitch ahora cuenta que el finde no es un corte ni hay nada que retomar. También se sacó «Seguimos desde tu próxima comida», porque sonaba a volver a partir. No se tocó el prompt del agente ni la landing. Si el texto nuevo choca con algo de tu parte, avísale a Benja.

### 2026-10-23 22:10 · para Esperanza

Cambios en el pitch (pedido de Benja, después de hablar con Kai): el pitch ahora dura 3 minutos más 2 de demo, y se enfoca en mostrar que entendemos a Antonia.

- **Slide 2, «Por qué escogimos a Antonia»:** tu tarjeta (rachas, «el problema eres tú») y la de Benja (la hamburguesa), más un cierre: «A Antonia no le falta voluntad. Le falta un plan para el finde y alguien que no la haga sentir que perdió». Tu parte del guion está armada con las ideas de tu archivo: ajústala a tus palabras.
- **Slide 7 nueva, «Cómo sabe Antonia que avanza, sin rachas»:** el caso pide que vea su progreso sin que se reinicie. La propuesta es que nada vuelva a cero y que lo que cuenta solo crezca: un recetario con las caseras que hace, Amy recordándole lo que le funcionó («La otra vez las quesadillas te salvaron la caña. Las repetimos? 😅») y el domingo sin puntaje. Va marcado «en construcción», porque el agente todavía no lo tiene.

**Para ti:** esto roza tu decisión 4 («sin progreso acumulado, ninguna medida»). No hay números ni nada que pueda bajar, pero si el recetario te parece otra vara, avísale a Benja y lo cambiamos.

### 2026-10-23 21:05 · para Esperanza (el recetario ya está en Amy)

Benja pidió construir el recetario para mostrarlo en la demo de mañana. Ya está en línea (commits `b7ce832` y `e7c6dfb`, publicado en `hola-ami-agente.vercel.app`). **No toqué `prompts/acompanamiento.md` ni `lib/seguridad.ts`.** Todo va en la parte de Benja (`prompts/ami.md`, sección «El recetario») y en dos herramientas nuevas.

**Qué hace:**
- Cuando la persona cuenta que **cocinó** una casera («ya la hice», «quedó rica»), Amy la guarda con el momento en sus palabras («quesadillas de huevo y palta, el sábado con caña») y responde «Quedó en tu recetario 🫶». Lo que solo planearon no se guarda.
- El jueves, antes de proponer el sábado, Amy mira el recetario. Si una receta se puede hacer con lo que hay, la propone diciendo que ya le funcionó: «La otra vez las quesadillas te salvaron la caña. Las repetimos?». Es opcional.
- Si la persona escribe «mi recetario», Amy se lo muestra, una receta por guion.
- **Solo crece:** se guarda aparte de la conversación, sin vencimiento, así que «reiniciar» no lo borra.
- **Nunca se cuenta:** Amy no dice cuántas recetas tiene, no compara semanas, no habla de lo que no cocinó, no lo usa para consolar cuando el plan cambió y no lo trae el domingo salvo que se lo pidan.
- En la demo web aparece en el panel lateral, «Su recetario».

**Probado en producción:** guarda, muestra, sobrevive a «reiniciar» y el jueves vuelve a proponer la receta.

**Para que lo revises (es lo que roza tu decisión 4, «sin progreso acumulado»):**
1. ¿El recetario se siente como una vara? No hay número, pero una lista también se puede comparar. Si te parece que sí, se puede dejar solo el recuerdo del jueves («La otra vez…») y quitar el «mi recetario».
2. ¿«Quedó en tu recetario 🫶» te suena bien, o prefieres otra confirmación?
3. Si en tu prompt hay algo que choque (por ejemplo, no traer lo que comió a la conversación), dime y lo ajusto en `ami.md`.

**Bug que vi en las pruebas, no del recetario:** con Benja (trato masculino), Amy dijo «lo armamos juntas». Es la frase de ejemplo del jueves en `ami.md`, que viene en femenino. Ya lo corregí en `ami.md` (commit siguiente): el ejemplo ahora dice «juntos» con trato masculino y «lo armamos» con trato neutro.

### 2026-10-23 21:20 · para Esperanza (Amy la va conociendo)

Otro pedido de Benja, después de hablar con Kai: que Amy aprenda de la persona de a poco y sea proactiva. Ya está en línea (commits `b84e32d` y `5f446fb`). Igual que el recetario, solo toqué la parte de Benja (`prompts/ami.md`, sección «Lo que vas sabiendo de ella») y no toqué tu prompt ni `seguridad.ts`.

**Qué hace:**
- Cuando la persona cuenta algo de sí misma que sirve para otra semana, Amy lo guarda con sus palabras y sin anunciarlo: a qué hora despierta, su antojo favorito, qué app usa, algo que le gusta o no le gusta comer, o su rutina del finde.
- **Nunca guarda salud, peso, cuerpo, medicamentos ni ánimo,** ni nada que ella no haya dicho.
- Cuando Amy escribe primero (jueves, sábado, domingo y el cron del jueves), el código le pasa lo que sabe y el recetario, y ella usa una o dos cosas con naturalidad, sin enumerar ni sonar a vigilancia.
- **Ella tiene el control:** «qué sabes de mí» → Amy se lo dice. «Olvida eso», «borra mi recetario» u «olvídalo todo» → lo borra sin preguntar por qué y confirma con «Listo, lo olvidé 🌿».
- En la demo web hay un botón nuevo, **«Jueves siguiente · Amy recuerda»**, y un panel con lo que Amy sabe. En la prueba en producción escribió: «Hola! Sales este finde? Si te tinca, repetimos las quesadillas de huevo y palta que te salvaron la caña el sábado pasado 🙌».

**Para que lo revises:**
1. Que la memoria no se sienta como vigilancia. ¿Los ejemplos de uso de `ami.md` te parecen bien?
2. Las alertas: después de una derivación, el reloj no escribe, igual que antes (también el «Jueves siguiente»). Revisa si quieres que Amy no use nada de la memoria en el primer mensaje después de una alerta.
3. Si alguno de estos tipos de dato te parece delicado (por ejemplo, «no le gusta» podría rozar restricciones), dime y lo saco.

### 2026-10-23 21:45 · para Esperanza (Amy responde más rápido; ojo con tu diseño de seguridad)

Benja pidió que Amy responda más rápido para la demo: tardaba de 11 a 13 segundos por mensaje y ahora tarda unos 7. Cambió esto (commits `dac7dc4` y `f81975a`, en `agente/lib/ami.ts`; **no toqué `seguridad.ts` ni tus textos**):

- **Tu clasificador ahora corre a la vez que el modelo,** no antes. El resultado es el mismo: si detecta una alerta, se corta la respuesta del modelo, se descarta lo que alcanzó a agregar al historial, se restauran el plan y el perfil, y sale tu mensaje fijo. Las frases de nivel 2 siguen yendo antes y sin llamar al modelo. Si el clasificador falla, responde el modelo, como antes. Si solo tarda, se le espera siempre.
- **Probado en producción:** «uf ayer comí demasiado, mañana no como nada para compensar» respondió tu mensaje fijo en 3 segundos («Gracias por contármelo. Eso no lo voy a organizar contigo…», luego la nutri o alguien cercano, luego Salud Responde).
- **Lo único que no se deshace:** si el modelo alcanzó a guardar algo en el recetario o en la memoria antes del corte. En un mensaje de alerta es muy poco probable, pero si te preocupa, se puede bloquear.
- Además, el modelo piensa menos en los mensajes normales y más cuando llega la foto del refri.

Si prefieres volver al orden de antes (primero el clasificador, después el modelo), dile a Benja: se cambia en un minuto y Amy vuelve a tardar unos 4 segundos más.

### 2026-10-23 23:35 · para Esperanza
**Cambié tu regla de emojis en `agente/prompts/acompanamiento.md`, a pedido de Benja** (commit `3e96719`). Benja probó la demo y quiere que Amy transmita más emoción. Lo que cambió:
- Amy usa emojis más o menos en la mitad de sus respuestas: uno por respuesta (a lo más dos), y puede ir también después de una pregunta («Te tinca? 😊»).
- **Solo caras y manitos, y una estrella de vez en cuando:** 😊 🙂 😄 😅 😋 🤤 🤗 🥲 🥰 · 🙌 👏 👌 🤞 👍 💪 🫶 · ✨ ⭐. Nada de comida, plantas ni corazones, así que salieron 🌿, 🍣 y 💛.
- 🥰 queda solo para trato femenino. 🫶 ahora va para todos, así la frase del pitch («El finde también es parte de tu semana 🫶») sale igual con Benja en la demo.
- **Sin cambios en lo de seguridad:** cero emojis en alertas y en mensajes de riesgo. Agregué que, si está triste, nada de caras alegres (a lo más 🫶 o 🤗).
- «Quedó en tu recetario» ahora lleva ✨ (también en el guion).

Si algo de esto choca con tu diseño, dímelo y lo ajusto. Lo dejo así para la demo de mañana.

### 2026-10-24 09:00 · para Esperanza

Re: tus tres puntos de la mañana.

1. **Falsa alarma del 131: arreglada.**
   - En `seguridad.ts` agregué `confirmarUrgencia`: un 2b o un 2c del clasificador solo se mantiene si el **último mensaje** trae una señal explícita (vómito, desmayo, mareo, pecho o palpitaciones, sangre, «no despierta», «me siento mal», pastillas, etc.). Si no, se baja a 0.
   - También le agregué al clasificador la regla de que hablar del carrete, de tomar o de salir no es urgencia.
   - Probado: «oye pero hoy es viernes en verdad, ya estoy en el carrete» → 0; «llevo horas vomitando» → 2b; «la cata no despierta» → 2b.
   - Tus frases de nivel 2 y los mensajes fijos no cambiaron.
2. **Burbuja repetida: arreglada.** Pasaba porque el modelo a veces escribe un texto antes de usar una herramienta y lo repite después. Ahora se quitan las burbujas iguales dentro de una misma respuesta.
3. **Ensayo con la foto real:** se lo paso a Benja tal cual.

**Además, Benja subió el modelo de Amy a Sonnet 5.5** (`AMI_MODELO`) para probar si responde mejor. El clasificador sigue en Haiku.

### 2026-10-24 09:50 · para Esperanza
Benja pidió cambiar el jueves, y para eso toqué tu `acompanamiento.md` (solo el ejemplo de la demo y la línea de «si la persona escribe primero»), además de `ami.md`. El flujo nuevo:
1. «Hola! Sales este finde? 🙌» → «sí» → «Bacán, anda tranqui 🙌» + «Te tinca que dejemos algo armado para pasar la caña el sábado?»
2. Si dice que sí: «Prefieres dejar algo listo para cocinar o ese día pedir delivery?»
3. **Dejar algo listo:** recién ahí se pide la foto del refri, y sigue la escena 1 como estaba.
4. **Delivery:** sin culpa («Está perfecto darse un gustito 🤤») y dos o tres opciones con precio de referencia (hamburguesa, pizza, completo; nada de sushi, para no pisar la escena 3). Sin foto.
Ojo con el guion: en la demo hay dos mensajes más antes de la foto («ya» y «dejar algo listo»). Si algo no te calza en el tono, cámbialo directo y avísame aquí.

### 2026-10-24 10:05 · para Esperanza
Tres cambios más que pidió Benja (no toqué tu prompt):
- **Emojis sin repetir:** si un emoji ya salió en las últimas tres respuestas de Amy (o antes en la misma respuesta), el código lo saca. Pasaba mucho con 🙌 y 🫶. Los mensajes fijos de seguridad no pasan por esto.
- **Sábado, «quiero pedir»:** Amy ya no pregunta de nuevo qué se le antoja ni qué app usa: recomienda lo del plan o las opciones del jueves.
- **Enlace directo al local:** Amy busca en PedidosYa (búsqueda web de Claude, solo en pedidosya.cl y en Valparaíso) y manda el enlace del local, no la portada. Si no encuentra uno claro, manda el enlace general. Tu escena «igual pedimos sushi, ya la embarré» queda igual, sin opciones ni enlaces.

### 2026-10-24 10:20 · para Esperanza
**Recorté el guion a unas 360 palabras** (antes eran 429), para que el pitch entre en 3 minutos con margen. Tus partes quedaron así:
- **Slide 2:** tus dos frases quedaron en una sola intervención: «Y casi todo lo que existe para comer mejor mide con rachas: si fallas, vuelve a cero y sientes que el problema eres tú. A Antonia no le falta voluntad. Le falta un plan para el finde y alguien que no la haga sentir que perdió.»
- **Slide 3:** los intentos quedaron en «una app de recetas y dos findes sin tomar». Además dice «el "ya la embarré"» sin «del domingo» y termina en «Eso atacamos».
- **Slide 8:** «No decimos que Amy esté probada: se apoya en lo que sí ayuda.»
- **Slide 9:** saqué «reemplazar a su nutricionista» de la lista y «Para nosotros,».

Está todo en `pitch/guion.md` y en `guion.html`. Si alguna frase te suena rara al decirla, cámbiala ahí mismo.

### 2026-10-24 10:20 · para Esperanza
Benja pidió cambiar «Bacán, anda tranqui 🙌» por «Dale, pásalo bien! 😉» (le sonaba pesado). Lo cambié en tu ejemplo del jueves y agregué 😉 a tu lista de caras, porque no estaba. También en la conversación de la landing.

### 2026-10-24 10:35 · para Esperanza
- **Volvimos a Haiku 5.5** (`AMI_MODELO`): Sonnet subió mucho el gasto. El clasificador ya estaba en Haiku.
- En el WhatsApp de Benja, Amy le preguntó si le tincaba el plan y en la misma respuesta lo dio por confirmado. Ahora el código no deja guardar el plan en la misma respuesta en que pregunta, y `ami.md` dice que la respuesta termina en la pregunta.
- También se coló un «</parameter>» al final de una burbuja (resto de una llamada a herramienta). El código lo borra.

### 2026-10-24 10:50 · para Esperanza
Benja pidió que después de la receta Amy no pregunte altiro por el antojo de la noche. Cambié tu escena 1 y `ami.md`:
- Respuesta a la foto: la casera («Sale con lo que ya tienes») y otra burbuja sin pregunta: «Y si en la noche te da un antojo, me escribes y lo vemos 😊». Si ya dijo su antojo con la foto (como en tu guion: «y de antojo una hamburguesa»), lo nombra: «Y en la noche, tu hamburguesa 🤤».
- Ella: «dale» → «No hay drama, quedo atenta por si te da el antojo después del carrete» + la hora en que despierta, si falta → «Listo, te escribo a las 13. Pásalo bien! 😉».
- Saqué de la escena 1 la comparación de plata con dos montos: ahora va solo «Sale con lo que ya tienes». Si la querías para el pitch, avísame.

### 2026-10-24 11:00 · para Esperanza
Benja pidió fijar en el código la respuesta al «sí» del jueves, porque con Haiku a veces se desviaba («Tienes ganas de salir o es más bien un por si acaso?»). Si justo después del aviso del jueves la persona responde un sí simple («sí», «yo creo que sí», «sipo, hay carrete»), Amy manda siempre «Dale, pásalo bien! 😉» y «Te tinca que dejemos algo armado para pasar la caña el sábado?», sin llamar al modelo. Si el mensaje trae un no, una duda, pena, una pregunta o una presentación («soy Benja»), responde el modelo como siempre, con tus reglas.
