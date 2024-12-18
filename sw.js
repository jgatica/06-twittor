// Imports
importScripts('js/sw-utils.js');

// En el STATIC_CACHE se guardan los archivos
// que usualmente no cambian, como los estilos, scripts, documentos HTML, etc.
// de mi aplicación.
const STATIC_CACHE = 'static-v1';

// En el DYNAMIC_CACHE se guardan los archivos que
// se actualizan con frecuencia, como las imágenes, fuentes, etc.
const DYNAMIC_CACHE = 'dynamic-v1';

// En el INMUTABLE_CACHE se guardan los archivos que
// no cambiarán nunca, como las librerías de terceros
const INMUTABLE_CACHE = 'inmutable-v1';

// El APP_SHELL es un array que contiene todos los archivos
// que se necesitan para que la aplicación funcione correctamente
const APP_SHELL = [
  // '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js'
];

const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'css/animate.css',
  'js/libs/jquery.js'
];

// Instalación del Service Worker y guardado de los archivos necesarios en caché
self.addEventListener('install', e => {

  const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL));

  // Guardar en caché los archivos inmutables
  const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));

  // Esperar a que se guarden todos los archivos en caché
  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});


// Creación de un proceso para que cada vez que cambie el Service Worker me elimine los cachés antiguos
self.addEventListener('activate', e => {

  // caches.keys() me devuelve un array con los nombres de los cachés
  const respuesta = caches.keys().then(keys => {
    keys.forEach(key => {

      // Si el caché no es igual al caché estático y contiene la palabra 'static' lo elimino
      if (key !== STATIC_CACHE && key.includes('static')) {
        return caches.delete(key);
      }

      // Si el caché no es igual al caché dinámico y contiene la palabra 'dynamic' lo elimino
      if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(respuesta);
});

//  Implementacion de la estrategia de cache,
//  en este caso `Cache con Network Fallback`.
self.addEventListener('fetch', e => {

    // Verificar si la petición coincide con algún recurso de la caché
    const respuesta = caches.match(e.request).then(res => {

    // Si la respuesta existe en la caché la retorno
    if (res) {
      return res;
    } else {
      // Si la respuesta no existe en la caché la busco en la red
      // y si no existe e.request.url me devuelve el valor undefined
      // console.log(e.request.url);

      // Como la respuesta no existe en la caché la busco en la red
      // es decir necesito hacer un fetch a ese recurso nuevo
      return fetch(e.request).then(newRes => {

        return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, newRes);

      });
    }


  });

  e.respondWith(respuesta);
});
