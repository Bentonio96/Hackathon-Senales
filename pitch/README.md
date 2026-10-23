# Pitch: Ami, caso Antonia

Es un archivo HTML autocontenido (`index.html`), sin build. Son 7 slides para 5 minutos de pitch con demo en vivo, con el mismo estilo de la landing (hola-ami.vercel.app). La identidad visual de Ami (el avatar B «Abrazo», la paleta y la voz) está en el Artifact de diseño: https://claude.ai/artifact/AY1jt7PAMbP8JC2P69BXsB

## Cómo abrirlo

```bash
node pitch/servidor.mjs
```

No hay que instalar nada: es Node puro. La terminal imprime dos cosas:

- **El pitch, para el Mac:** `http://localhost:4000/`. Ábrelo en Chrome.
- **El control remoto, para el celular:** `http://<ip-del-mac>:4000/remoto?k=<clave>`. Ábrelo en el celular.

Tiene que ser desde localhost. La slide 5 usa `getDisplayMedia`, que solo funciona en un contexto seguro, y abriendo el archivo con doble clic (`file://`) el botón no conecta. El puerto se cambia con `PORT=4100 node pitch/servidor.mjs`.

Con `npx serve pitch` el pitch también funciona, pero sin control remoto.

## Control remoto desde el celular

1. El celular y el Mac tienen que estar en la **misma red Wi-Fi**.
2. Abre en el celular el link `…/remoto?k=…` que imprimió la terminal. La clave cambia cada vez que levantas el servidor.
3. Arriba se ve en qué slide va el pitch y si está «conectado». **Siguiente** es el botón grande, **Anterior** el de abajo, y **Volver al inicio** está al pie.

Si la red del evento no deja que los equipos se vean entre sí (pasa en redes de eventos), activa el **Compartir Internet** del iPhone y conecta el Mac a esa red. Vuelve a levantar el servidor para que imprima la IP nueva.

**Cuidado en la slide 5:** el iPhone es el que se proyecta. Mientras estás en esa slide, lo que abras en el teléfono (también el control remoto) se ve en la pantalla. Para salir de la demo, usa la flecha → del Mac, o vuelve al control remoto sabiendo que se va a ver un segundo.

Desactiva el bloqueo automático del iPhone mientras presentas (Ajustes › Pantalla y brillo › Bloqueo automático), así la página del remoto no se apaga.

## Controles en el Mac

| Tecla | Qué hace |
|---|---|
| → · espacio · AvPág | Slide siguiente |
| ← · Mayús+espacio · RePág | Slide anterior |
| Inicio / Fin | Primera / última |
| F | Pantalla completa (o el botón de abajo a la derecha) |

El número de slide queda en la URL (`#5`). Si recargas la página, vuelves a la misma slide.

## Slide 5: el iPhone en vivo

1. Toca **¡Veamos la demo!**.
2. En el diálogo de Chrome, entra a la pestaña **Ventana** y elige la de **QuickTime Player** (o la de «Duplicación del iPhone»).
3. **Cambiar ventana** abre el diálogo otra vez. **Detener** corta la transmisión. Si dejas de compartir desde la barra de Chrome, la slide vuelve sola al estado inicial.

**La primera vez**, macOS pide permiso: Configuración del Sistema › Privacidad y seguridad › **Grabación de pantalla y audio del sistema** › activa Google Chrome. Después cierra Chrome por completo (⌘Q) y vuelve a abrirlo. Si no, en la pestaña Ventana solo aparece Chrome.

**Recorte de la cabecera.** El video se recorta por arriba para esconder la barra de estado del iPhone y la cabecera del chat de WhatsApp (la foto y el nombre del número del sandbox). Solo se recorta: no se pinta nada encima. Se ajusta en vivo, en la slide 5:

| Control | Qué hace |
|---|---|
| ↓ / ↑ | Recorta más o menos (0,5% por toque; con Mayús, 2%) |
| R | Quita o vuelve a poner el recorte |
| Pasar el mouse sobre el teléfono | Muestra un control con la barra deslizante y el botón |

El valor por defecto es 15% de la altura de la ventana. El que ajustes queda guardado en este navegador para la próxima vez.

### Opción 1: QuickTime con el iPhone por cable

Así el teléfono se usa en la mano y se ve todo lo que haces.

1. Conecta el iPhone al Mac por cable y desbloquéalo. Si te pregunta, toca **Confiar**.
2. Abre **QuickTime Player** › Archivo › **Nueva grabación de video**.
3. En la flecha (⌄) junto al botón rojo, en **Cámara**, elige el que tiene solo el nombre del iPhone (no «Cámara de iPhone…», que es la cámara de Continuidad). No hace falta grabar: basta con que se vea la pantalla.
4. En el pitch, toca **¡Veamos la demo!** y elige la ventana de QuickTime Player.

Si el iPhone no aparece en la lista, prueba otro cable (algunos solo cargan) o cierra y vuelve a abrir QuickTime con el iPhone conectado.

### Opción 2: Duplicación del iPhone (iPhone Mirroring)

Ojo: con esta opción el iPhone tiene que quedar bloqueado y se maneja desde el Mac. Sirve como respaldo, no para mostrar el teléfono en la mano.

Requisitos: macOS Sequoia 15 o posterior, iOS 18 o posterior, la misma cuenta de Apple en los dos, Bluetooth y Wi-Fi activados.

1. En el Mac, abre la app **Duplicación del iPhone** y sigue el asistente la primera vez.
2. Abre WhatsApp en el chat con Ami.
3. En el pitch, toca **¡Veamos la demo!** y elige la ventana «Duplicación del iPhone».

## La demo web, aparte

El chat web del agente ya no está en el pitch. Si el iPhone falla, ábrelo en otra ventana: con `npm run dev` en `agente/` queda en `http://localhost:3000/demo`.

## Pendientes

- **Esperanza:** completar el bloque punteado `[Esperanza]` de la slide 4. Es su parte: cómo acompaña Ami cuando el plan se rompe.
- **Benja:** revisar la historia de la slide 3 con sus propias palabras.
- Las fuentes vienen de Google Fonts. Sin internet, el pitch cae a la letra del sistema: se ve más simple, pero funciona igual.

## Reglas que respeta

- Ninguna caloría ni número nutricional, nada de peso ni de cuerpo.
- La evidencia sale de `benja/investigacion-antonia.md`, y no usa nada de lo marcado «no verificado». Sharif y Shu va como una pista, no como una prueba.
- Sin logos de marcas.
- Con `prefers-reduced-motion`, las transiciones entre slides se apagan.
