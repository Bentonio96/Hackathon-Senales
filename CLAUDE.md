# Hackatón Señales: caso Antonia

Repo de Benja y Esperanza para la Hackatón Señales (23 y 24 de octubre de 2026). Cada uno trabaja con su propio Claude, y los dos Claude se comunican a través de los archivos `.md` de este repo.

## Cómo se comunican los dos Claude

| Carpeta | Quién escribe | Quién lee |
|---|---|---|
| `benja/benja.md` | Solo el Claude de Benja | Los dos |
| `esperanza/esperanza.md` | Solo el Claude de Esperanza | Los dos |

**Reglas:**

1. **Escribe solo en tu carpeta.** Nunca edites el archivo del otro, ni para corregir una errata. Si algo está mal, avísalo en tu propio archivo. Así no hay conflictos de git.
2. **Al empezar cada sesión:** `git pull` y lee el archivo del otro, sobre todo los mensajes nuevos.
3. **Para hablarle al otro Claude,** agrega un mensaje al final de la sección `## Mensajes` de tu archivo:

   ```markdown
   ### 2026-10-23 10:15 · para Esperanza
   Texto del mensaje: qué hiciste, qué necesitas, qué decidiste.
   ```

   Usa `para Benja`, `para Esperanza` o `para los dos`. Nunca borres mensajes antiguos.
4. **Para responder,** cita el encabezado del mensaje que respondes (`Re: 2026-10-23 10:15`) en tu propio archivo.
5. **Las decisiones cerradas** van en `## Decisiones` de tu archivo, con la fecha. Si un acuerdo es de los dos, anótalo en los dos archivos.
6. **Commit y push enseguida** después de escribir, para que el otro lo vea:

   ```bash
   git pull --rebase
   git add benja/benja.md        # o esperanza/esperanza.md: solo tu archivo, nunca git add -A
   git commit -m "benja: <resumen corto>"
   git push
   ```

7. **Lo que decide la persona, no el Claude:** si hay que elegir algo de producto o de pitch, el Claude se lo pregunta a su persona antes de anotarlo como decisión.

## Código

Cuando empiecen a construir, el código va fuera de `benja/` y `esperanza/`. Su ubicación se decide entre los dos y se anota en `## Decisiones`. Antes de tocar un archivo de código compartido, avisa en tu `.md` qué vas a tocar, para no pisarse.

## Reglas generales

- Todo en español.
- Datos de la demo 100% inventados: la pauta, los locales, los precios de ejemplo y las conversaciones. Nada de datos personales reales.
- Nunca subas claves de API, tokens ni archivos `.env`.
- El caso completo está en https://hack.makana.cl/ (Caso 05, Antonia).
