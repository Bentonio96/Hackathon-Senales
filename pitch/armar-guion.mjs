// Copies guion.md into guion.html, so the script page opens as a plain file too.
//   node pitch/armar-guion.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const md = await readFile(join(DIR, 'guion.md'), 'utf8');
const html = await readFile(join(DIR, 'guion.html'), 'utf8');

const bloque = /(<script type="text\/markdown" id="fuente">)[\s\S]*?(<\/script>)/;
if (!bloque.test(html)) throw new Error('guion.html no tiene el bloque <script id="fuente">');

// A literal </script> inside the text would close the tag early.
const seguro = md.replace(/<\/script/gi, '<\\/script');
await writeFile(join(DIR, 'guion.html'), html.replace(bloque, (_, abre, cierra) => `${abre}\n${seguro}\n${cierra}`));
console.log('guion.html actualizado desde guion.md');
