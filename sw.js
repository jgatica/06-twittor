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
  '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js',
];

const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'css/animate.css',
  'js/libs/jquery.js',
];

// Instalación del Service Worker y guardado de los archivos necesarios en caché
self.addEventListener('install', e => {

  const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL));

  // Guardar en caché los archivos inmutables
  const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));

  // Esperar a que se guarden todos los archivos en caché
  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});
