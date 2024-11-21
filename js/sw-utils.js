// Guardar en caché dinámico
function actualizarCacheDinamico( dynamicCache, req, res ) {
  // Si la respuesta existe en la caché la retorno
  if (res.ok) {

    return caches.open(dynamicCache).then(cache => {
      cache.put(req, res.clone());
      return res.clone();
    });
  } else {
    // Si no viene nada no hay nada que podamos hacer
    // porque ya fallo el cache y fallo la red
    return res;
  }
}