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
