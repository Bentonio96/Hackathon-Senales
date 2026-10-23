// Procesa en orden los mensajes de una misma sesión (dentro de una misma instancia),
// para que dos mensajes seguidos no se pisen el historial.
const colas = new Map<string, Promise<unknown>>();

export function enCola<T>(id: string, tarea: () => Promise<T>): Promise<T> {
  const anterior = colas.get(id) ?? Promise.resolve();
  const siguiente = anterior.catch(() => undefined).then(tarea);
  colas.set(id, siguiente);
  siguiente.finally(() => {
    if (colas.get(id) === siguiente) colas.delete(id);
  });
  return siguiente;
}
