# Ami: el agente

En línea: https://hola-ami-agente.vercel.app/demo (proyecto `ami-agente` en Vercel, raíz `agente/`; cada push a `main` lo vuelve a publicar). Webhook de WhatsApp: `https://hola-ami-agente.vercel.app/api/whatsapp`.

Ami es una amiga por WhatsApp que el jueves deja decidido el sábado de Antonia (un antojo y una comida casera rica, con lo que tiene en el refri) y la acompaña sin juzgar si el plan cambia.

## Cómo funciona

- **Cerebro:** Claude: `claude-haiku-5-5` por defecto para probar barato, y `claude-opus-5-5` para el pitch con `AMI_MODELO=claude-opus-5-5`. Corre un loop de herramientas en `lib/ami.ts`. Las instrucciones están en `prompts/ami.md` (planificación, Benja) y `prompts/acompanamiento.md` (acompañamiento, Esperanza), más la pauta de ejemplo en `data/pauta-ejemplo.md`. Con Opus se activa el respaldo automático de modelo (`fallbacks: "default"`) por si una respuesta es rechazada.
- **Foto del refri:** se sube a la Files API de Anthropic y el historial guarda solo su id.
- **Herramientas** (`lib/herramientas.ts`):
  - `buscar_precio_supermercado`: precio real en jumbo.cl; si falla, la tabla de ejemplo `data/precios-ejemplo.json`.
  - `precio_antojo_delivery`: precio de referencia, de ejemplo.
  - `revisar_nutrientes`: USDA FoodData Central, solo de uso interno. Ami nunca muestra números.
  - `guardar_plan_sabado`: guarda el plan.
- **Seguridad** (`lib/seguridad.ts`, diseño de Esperanza): antes de Ami, una lista de frases de nivel 2 y un clasificador aparte (con los últimos 20 mensajes) deciden si hay una alerta. Si la hay, se mandan los **mensajes fijos** copiados de `prompts/acompanamiento.md` y Ami no se llama. Después de Ami, un **filtro de salida** bloquea números nutricionales y palabras que Ami no usa: regenera una vez y, si vuelve, manda una respuesta neutra. Escribir «pausa» pausa a Ami. Después de una alerta, el reloj no manda mensajes programados.
- **WhatsApp:** `POST /api/whatsapp` es el webhook del sandbox de Twilio. Valida la firma, responde al tiro y procesa con `after()`.
- **Demo web:** `/demo` es un chat de respaldo con el mismo cerebro. Tiene el **reloj** (jueves, sábado, domingo) para que Ami escriba primero, y puede mandar ese mensaje al último WhatsApp.
- **Estado:** Upstash Redis si existen `KV_REST_API_URL` y `KV_REST_API_TOKEN`; si no, en memoria (sirve solo en local).

## Correrlo local

```bash
cp .env.example .env.local   # completa tú las claves
npm install
npm run dev                  # http://localhost:3000/demo
```

Para probar WhatsApp en local, expón el puerto con un túnel y pon `TWILIO_SKIP_VALIDATION=1`.

## Sandbox de WhatsApp (Twilio)

1. En la consola de Twilio: Messaging → Try it out → Send a WhatsApp message.
2. Desde tu celular, manda el código `join <palabra>` al número del sandbox.
3. En *Sandbox settings*, «When a message comes in»: `https://<tu-deploy>/api/whatsapp`, método POST.
4. Pon esa misma URL en `TWILIO_WEBHOOK_URL`.

Escribir `reiniciar` por WhatsApp borra la conversación.

## Límites conocidos

- Sin Redis, en Vercel cada instancia tiene su propia memoria: para la demo en Vercel hay que conectar Upstash.
- El orden de los mensajes se respeta dentro de una misma instancia, no entre instancias.
- `/api/chat` es público: cada sesión tiene un tope de 120 turnos para acotar el gasto.
- Los precios de delivery son de ejemplo. Los del súper son reales cuando la búsqueda en Jumbo funciona.
