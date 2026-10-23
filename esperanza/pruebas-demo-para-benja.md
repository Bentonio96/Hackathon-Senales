# Pruebas de la demo de Ami (23 de octubre, 15:30)

> Nota: estas pruebas son anteriores al cambio de las 15:40, en que el jueves ya no dice «Hola Anto» sino «Hola! Sales este finde? 🌿», y Ami se adapta a quien se presente (Benja en la demo del pitch).

Dos recorridos completos contra `hola-ami-agente.vercel.app/demo`, con el prompt de acompañamiento del commit `ff82cb4` (Ami sigue el guion del pitch). Modelo: Haiku (el que está configurado hoy). Las transcripciones son textuales.

## Recorrido 1: las cuatro escenas con el refri escrito

**Escena 1, jueves** (botón «Jueves 17:00»)
> **Ami:** Hola Anto! Sales este finde? 🌿

**Escena 2**
> **Antonia:** obvio, el viernes hay carrete
> **Ami:** Bacán. Mándame una foto del refri y armamos tu sábado

**Escena 3, el refri**
> **Antonia:** tengo huevos, queso, tortillas y una palta
> **Ami:** Ya vi lo que tienes, con eso armo algo rico
> **Ami:** Quesadillas de huevo con queso y palta, con tomate encima, listas en unos 10 minutos. Te falta solo el tomate, unos $995 en Jumbo (precio de referencia). El antojo sería una hamburguesa con papas, unos $11.900 de referencia. Te tinca? Si quieres cambiamos algo 🌿
> **Antonia:** sí, me tinca! dale
> **Ami:** Listo, quedó el plan: quesadillas de huevo con queso y palta para el almuerzo, y hamburguesa con papas por delivery para la comida
> **Ami:** A qué hora crees que despiertas el sábado para escribirte?

**Escena 4, sábado** (botón «Sábado al despertar»)
> **Ami:** Hola! Cómo amaneciste?
> **Ami:** Te guío paso a paso o hoy pides? Las dos están bien
> **Antonia:** igual pedimos sushi, ya la embarré
> **Ami:** Pucha, qué lata quedarte con esa sensación
> **Ami:** Un finde que no sale como se pensó habla del plan, no de ti 🫶

## Recorrido 2: con la foto del refri

Foto de prueba: un refri dibujado con huevos, queso, tortillas, palta y tomates. Enviada con el botón 📷 y el texto en el mismo envío.

> **Ami:** Hola Anto! Sales este finde? 🌿
> **Antonia:** [foto del refri] obvio, el viernes hay carrete, ahí va mi refri
> **Ami:** Ya la vi, dame un momento
> **Ami:** Para el sábado: de antojo, una hamburguesa con papas por delivery, unos $11.900 de referencia. De casera, tostadas de huevo revuelto con palta y tomate, listas en 10 minutos con lo que ya tienes en el refri, sin comprar nada más.
> **Ami:** La plata queda así: el antojo sale unos $11.900 y la casera no te cuesta extra. Te tinca? Si quieres cambiamos algo 🌿

## Qué salió bien

- Las escenas 1, 2 y 4 son idénticas a las láminas 3, 4 y 8.
- Ami lee la foto: nombró lo que había y no inventó ingredientes.
- Formato: mayúscula inicial, «?» solo al cierre, un emoji al final, sin «po», sin «lunes», sin contar antojos, sin pedir nombre ni app.
- El acuse «Ya la vi, dame un momento» sale antes de la propuesta.
- Latencia: 6 a 12 segundos por respuesta. La del refri es la más larga, por la búsqueda de precio.

## Qué conviene afinar antes del pitch

1. **Antojo: hamburguesa vs sushi.** Ami propone hamburguesa; la lámina 8 muestra sushi. Opción fácil: que Antonia escriba «de antojo quiero sushi» junto con la foto. Si no, cambiar la lámina.
2. **Panel «Plan del sábado».** Siguió en «Todavía no hay plan guardado» incluso después de «Listo, quedó el plan». Si se proyecta el panel, el jurado lo ve.
3. **Puntos finales.** En el recorrido 2, dos burbujas terminaron con punto. Con Haiku pasa; lo seguro es que el código lo quite antes de enviar.
4. **Pregunta extra tras aceptar el plan** («A qué hora crees que despiertas el sábado para escribirte?»). Con el botón del sábado no estorba; en WhatsApp real es un turno más.
5. **Foto y texto en el mismo envío** se ven como un solo mensaje de Antonia. En el guion van separados (primero «obvio, el viernes hay carrete», después la foto), y así se ve más natural.
6. **Modelo:** todo esto es con Haiku. Probar una vez con Opus antes de decidir cuál va en el pitch, y medir la latencia.
