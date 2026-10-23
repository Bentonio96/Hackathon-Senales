# Pitch: Ami, caso Antonia

Es un archivo HTML autocontenido (`index.html`), sin build. Son 7 slides para 5 minutos de pitch con demo en vivo. La identidad visual de Ami (el avatar B «Abrazo», la paleta y la voz) está en el Artifact de diseño: https://claude.ai/artifact/AY1jt7PAMbP8JC2P69BXsB

## Cómo abrirlo

La slide 5 muestra en vivo la pantalla del iPhone. Para eso usa `getDisplayMedia`, que solo funciona en un contexto seguro. Si abres el archivo con doble clic (`file://`), el botón no conecta. Sírvelo desde localhost:

```bash
npx serve pitch
```

Después abre en Chrome la dirección que imprime (por ejemplo, `http://localhost:3000`). Si la demo web del agente ya está ocupando el puerto 3000, `serve` elige otro y te lo dice.

## Controles

| Tecla | Qué hace |
|---|---|
| → · espacio · AvPág | Slide siguiente |
| ← · Mayús+espacio · RePág | Slide anterior |
| Inicio / Fin | Primera / última |
| F | Pantalla completa (o el botón de abajo a la derecha) |

El número de slide queda en la URL (`#5`). Si recargas la página, vuelves a la misma slide.

## Slide 5: el iPhone en vivo

1. Toca **Conectar iPhone**.
2. En el diálogo de Chrome, entra a la pestaña **Ventana** y elige la de **Duplicación del iPhone** (o la de QuickTime, más abajo).
3. **Cambiar ventana** abre el diálogo otra vez. **Detener** corta la transmisión. Si dejas de compartir desde la barra de Chrome, la slide vuelve sola al estado inicial.
4. Si cancelas el diálogo o algo falla, el mensaje lo explica y el **plan B** se marca en amarillo.

**La primera vez**, macOS pide permiso: Configuración del Sistema › Privacidad y seguridad › **Grabación de pantalla y audio del sistema** › activa Google Chrome y reinícialo.

### Opción 1: Duplicación del iPhone (iPhone Mirroring)

Requisitos: macOS Sequoia 15 o posterior en el Mac, iOS 18 o posterior en el iPhone, la misma cuenta de Apple en los dos, Bluetooth y Wi-Fi activados, y el iPhone bloqueado y cerca.

1. En el Mac, abre la app **Duplicación del iPhone** (está en Aplicaciones, o búscala con Spotlight).
2. La primera vez, sigue el asistente: desbloquea el iPhone cuando lo pida y acepta la conexión.
3. Cuando aparezca la pantalla del iPhone en la ventana, abre WhatsApp en el chat con Ami.
4. En el pitch, toca **Conectar iPhone** y elige la ventana «Duplicación del iPhone».

Mientras se duplica, el iPhone tiene que quedar bloqueado. Si lo desbloqueas, la duplicación se corta.

### Opción 2, de respaldo: QuickTime con el iPhone por cable

1. Conecta el iPhone al Mac por cable y desbloquéalo. Si te pregunta, toca **Confiar**.
2. Abre **QuickTime Player** › Archivo › **Nueva grabación de película**.
3. En la ventana de grabación, toca la flecha junto al botón rojo y elige el **iPhone** como cámara. No hace falta grabar: basta con que se vea la pantalla.
4. En el pitch, toca **Conectar iPhone** y elige la ventana de QuickTime Player.

### Plan B: la demo web

El botón **Abrir la demo web** abre la ruta `/demo` del agente en otra pestaña. La URL está en la constante `DEMO_URL`, al principio del `<script>` de `index.html`, y hoy apunta a `http://localhost:3000/demo` (el `npm run dev` de `agente/`). Cuando haya un deploy, cámbiala ahí.

## Pendientes

- **Esperanza:** completar el bloque punteado `[Esperanza]` de la slide 4. Es su parte: cómo acompaña Ami cuando el plan se rompe.
- **Benja:** revisar la historia de la slide 3 con sus propias palabras.
- Las fuentes vienen de Google Fonts. Sin internet, el pitch cae a la letra del sistema: se ve más simple, pero funciona igual.

## Reglas que respeta

- Ninguna caloría ni número nutricional, nada de peso ni de cuerpo.
- La evidencia sale de `benja/investigacion-antonia.md`, y no usa nada de lo marcado «no verificado». Sharif y Shu va como una pista, no como una prueba.
- Sin logos de marcas.
- Con `prefers-reduced-motion`, las transiciones entre slides se apagan.
