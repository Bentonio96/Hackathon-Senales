// Serves the pitch and relays a phone remote to it. Plain Node, nothing to install:
//   node pitch/servidor.mjs        (PORT=4000 by default)
// The deck (index.html, on this Mac) listens on /eventos; the phone opens /remoto?k=<key>
// on the same Wi-Fi and sends /comando. The key is new on every start and is printed below.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { networkInterfaces } from 'node:os';
import { randomBytes } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT) || 4000;
const DIR = dirname(fileURLToPath(import.meta.url));
const CLAVE = randomBytes(3).toString('hex');
const PAGINAS = { '/': 'index.html', '/index.html': 'index.html', '/remoto': 'remoto.html' };
const ACCIONES = new Set(['anterior', 'siguiente', 'inicio']);

const clientes = new Set();
let estado = null; // last slide the deck reported, shown on the remote

function enviar(evento, datos) {
  const mensaje = `event: ${evento}\ndata: ${JSON.stringify(datos)}\n\n`;
  for (const res of clientes) res.write(mensaje);
}

function esLocal(req) {
  return ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
}

async function leerJson(req) {
  let cuerpo = '';
  for await (const parte of req) {
    cuerpo += parte;
    if (cuerpo.length > 2000) throw new Error('too large');
  }
  return JSON.parse(cuerpo || '{}');
}

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (req.method === 'GET' && url.pathname === '/eventos') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
      res.write('retry: 2000\n\n');
      if (estado) res.write(`event: estado\ndata: ${JSON.stringify(estado)}\n\n`);
      clientes.add(res);
      req.on('close', () => clientes.delete(res));
      return;
    }

    if (req.method === 'POST' && url.pathname === '/comando') {
      const { k, accion } = await leerJson(req);
      if (k !== CLAVE) { res.writeHead(403).end(); return; }
      if (!ACCIONES.has(accion)) { res.writeHead(400).end(); return; }
      enviar('comando', { accion });
      res.writeHead(204).end();
      return;
    }

    // Only the deck, running on this same Mac, reports which slide is showing.
    if (req.method === 'POST' && url.pathname === '/estado') {
      if (!esLocal(req)) { res.writeHead(403).end(); return; }
      const { n, total, titulo } = await leerJson(req);
      estado = { n: Number(n), total: Number(total), titulo: String(titulo || '').slice(0, 80) };
      enviar('estado', estado);
      res.writeHead(204).end();
      return;
    }

    const archivo = PAGINAS[url.pathname];
    if (req.method === 'GET' && archivo) {
      const html = await readFile(join(DIR, archivo));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(html);
      return;
    }

    res.writeHead(404).end();
  } catch {
    if (!res.headersSent) res.writeHead(400);
    res.end();
  }
});

// Keeps the event streams open through proxies and idle Wi-Fi.
setInterval(() => { for (const res of clientes) res.write(': ping\n\n'); }, 20000).unref();

servidor.listen(PORT, '0.0.0.0', () => {
  const ips = Object.values(networkInterfaces()).flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal && !i.address.startsWith('169.254.'))
    .map((i) => i.address);
  console.log(`\nPitch, en este Mac (Chrome):  http://localhost:${PORT}/`);
  console.log('\nControl remoto, en el celular (misma red Wi-Fi):');
  if (ips.length === 0) console.log('  (sin red: conecta el Mac al Wi-Fi o al hotspot del iPhone)');
  for (const ip of ips) console.log(`  http://${ip}:${PORT}/remoto?k=${CLAVE}`);
  console.log('\nCtrl+C para detener.\n');
});
