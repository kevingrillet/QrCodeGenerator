/**
 * Service worker — fonctionnement hors-ligne, sans dépendance ni build dédié.
 *
 * Stratégie :
 *  - navigations : réseau d'abord, repli sur l'app shell en cache (offline) ;
 *  - autres GET de même origine (JS/CSS/icônes, aux noms hashés) : « stale-while-
 *    revalidate » — on sert la version en cache si elle existe et on rafraîchit en
 *    arrière-plan. Les assets hashés sont donc mis en cache au fil des visites.
 *
 * Les chemins sont relatifs au scope du SW, ce qui le rend compatible avec le
 * sous-chemin GitHub Pages (`/<repo>/`) sans coder en dur le nom du dépôt.
 */
const CACHE = 'qrcode-v2.1.0';
const APP_SHELL = ['./', './index.html', './favicon.svg', './manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('./index.html').then((cached) => cached || caches.match('./')),
      ),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            void caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
