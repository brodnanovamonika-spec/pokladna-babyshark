/* Pokladňa Baby Shark: offline app shell.
 * The precache list and the version are filled in at build time by tool/build_sw.py
 * (publish_web.ps1 runs it after `flutter build web`). Without that step the
 * worker installs with an empty list and only caches what the page fetched online.
 *
 * Rules: same-origin GET requests only. Navigations are network-first with a short
 * timeout and fall back to the cached index.html, so the register opens with no
 * internet. Everything else (main.dart.js, canvaskit, assets, sqlite3.wasm,
 * sqflite_sw.js) is cache-first. Other origins (the sync API on
 * app.ihriskobabyshark.sk, Supabase) are never touched. */
const VERSION = "bc4ca6d414ac";
// [path, sha256 of the file]: unchanged files are copied from the previous cache, not fetched again
const PRECACHE = [["/assets/AssetManifest.bin", "4ad159647cb0ed47"], ["/assets/AssetManifest.bin.json", "bcfc3c13203379fe"], ["/assets/FontManifest.json", "980a542761c5fe42"], ["/assets/NOTICES", "3f1517203a10c76a"], ["/assets/assets/fonts/Manrope-400.ttf", "a13d9b41b0a471ce"], ["/assets/assets/fonts/Manrope-500.ttf", "f433e5d333be1128"], ["/assets/assets/fonts/Manrope-600.ttf", "6bad1a774228464c"], ["/assets/assets/fonts/Manrope-700.ttf", "b9584e099e0e7f1e"], ["/assets/assets/fonts/Manrope-800.ttf", "b8f802f05b322a73"], ["/assets/assets/products/bakerolls.jpg", "0b96292d2334224e"], ["/assets/assets/products/cajloyd.jpg", "ee4b8757428a1351"], ["/assets/assets/products/cappuccino.jpg", "0017ee642d9bd8e7"], ["/assets/assets/products/caprisun.jpg", "1557dad486b0e8ff"], ["/assets/assets/products/citronadadzban.jpg", "9e0f67f02cbc7d29"], ["/assets/assets/products/cocacola.jpg", "598e1d2f558c6b4f"], ["/assets/assets/products/credits.json", "ba0d7e5894ec90f2"], ["/assets/assets/products/croissant.jpg", "a11e0e7f513810b4"], ["/assets/assets/products/drutycinky.jpg", "39d0ac88886830f3"], ["/assets/assets/products/dzuskrabickovy.jpg", "391a5d984251d109"], ["/assets/assets/products/espresso.jpg", "b3c13e15e960091b"], ["/assets/assets/products/fanta.jpg", "4d60f94df888559f"], ["/assets/assets/products/figo.jpg", "221fcfa0c8fd9798"], ["/assets/assets/products/gazdovsketycinky.jpg", "935da6a95d5011c5"], ["/assets/assets/products/horalka.jpg", "c0595730c740f2bf"], ["/assets/assets/products/jupik.jpg", "3b65aa1ce16f9c0f"], ["/assets/assets/products/kofola.jpg", "64589fabcf23f8fd"], ["/assets/assets/products/kubik.jpg", "29ce23667223e233"], ["/assets/assets/products/kubikwater.jpg", "a378f62872265036"], ["/assets/assets/products/kukuricnechrumky.jpg", "db709d26bd38a219"], ["/assets/assets/products/ladovakava.jpg", "db99dcd11be7b9e6"], ["/assets/assets/products/latte.jpg", "1319ef74d7b029a4"], ["/assets/assets/products/lentilky.jpg", "e393ca640cc4413d"], ["/assets/assets/products/lizanka.jpg", "7416dde7fac2e961"], ["/assets/assets/products/mirinda.jpg", "a681f756e20a0c7f"], ["/assets/assets/products/mlieckodokavy.jpg", "36679c34aef332db"], ["/assets/assets/products/papitakeks.jpg", "44bb167f68a7e725"], ["/assets/assets/products/pepsi.jpg", "2f1ea7b99e6cec7a"], ["/assets/assets/products/poharcitronady.jpg", "d0696b33d0747b69"], ["/assets/assets/products/ponozky.jpg", "53d47d8328c6ba56"], ["/assets/assets/products/rajecneochuteny.jpg", "0f4150f80938d16e"], ["/assets/assets/products/rajecochuteny.jpg", "3b85d31e45987f87"], ["/assets/assets/products/redbull.jpg", "90be2c417cc7f509"], ["/assets/assets/products/sprite.jpg", "783cbcc251858491"], ["/assets/assets/products/strudlicka.jpg", "d49f36a1f1345351"], ["/assets/assets/products/vstupne15hodiny.jpg", "32953090ec58627c"], ["/assets/assets/products/vstupne1hodina.jpg", "b575b9a880026dbb"], ["/assets/assets/products/vstupneneobmedzene.jpg", "7b56cdd7f8fa93c0"], ["/assets/assets/products/xixo.jpg", "491426eb0cd2fddc"], ["/assets/assets/products/zalievanakava.jpg", "a3ca41c3aeaddf1d"], ["/assets/assets/products/zlatybazantnealko.jpg", "7b326f3fd4c24c82"], ["/assets/fonts/MaterialIcons-Regular.otf", "c686072c8e8dfb74"], ["/assets/packages/cupertino_icons/assets/CupertinoIcons.ttf", "3d90c370aa4cf00d"], ["/assets/shaders/ink_sparkle.frag", "2dca5ab93d4ec29e"], ["/assets/shaders/stretch_effect.frag", "ab412f07a5b9b50b"], ["/canvaskit/canvaskit.js", "bb559f6080c7d312"], ["/canvaskit/canvaskit.wasm", "fbed517a43e82452"], ["/canvaskit/chromium/canvaskit.js", "6018b12bd8ed37e6"], ["/canvaskit/chromium/canvaskit.wasm", "ae8ff1d858140f7b"], ["/favicon.png", "7ab2525f4b86b65d"], ["/flutter.js", "2beb1ce6b159c715"], ["/flutter_bootstrap.js", "2ffb19ec751b97c9"], ["/icons/Icon-192.png", "3dce99077602f704"], ["/icons/Icon-512.png", "baccb205ae45f0b4"], ["/icons/Icon-maskable-192.png", "d2c842e22a9f4ec9"], ["/icons/Icon-maskable-512.png", "6aee06cdcab6b2ae"], ["/index.html", "4aa6580a0b8d7fc7"], ["/", "4aa6580a0b8d7fc7"], ["/main.dart.js", "5eab8cff9dc122f5"], ["/manifest.json", "5a557e4516d9527f"], ["/sqflite_sw.js", "acfc701d235b0093"], ["/sqlite3.wasm", "13d3f11d05b39ba0"]];
const CACHE = 'pokladna-' + VERSION;
const MANIFEST_KEY = '/__pokladna_manifest__';
const NAV_TIMEOUT_MS = 3000;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // what the previous version had, keyed by path -> hash
    let old = null, oldHashes = {};
    for (const key of await caches.keys()) {
      if (!key.startsWith('pokladna-') || key === CACHE) continue;
      const c = await caches.open(key);
      const m = await c.match(MANIFEST_KEY);
      if (m) { old = c; oldHashes = await m.json(); break; }
    }
    const hashes = {};
    await Promise.all(PRECACHE.map(async ([path, hash]) => {
      hashes[path] = hash;
      if (old && oldHashes[path] === hash) {
        const prev = await old.match(path);
        if (prev) { await cache.put(path, prev); return; }
      }
      // cache: 'reload' bypasses the HTTP cache, so a new build never precaches stale files
      const res = await fetch(new Request(path, { cache: 'reload' }));
      if (!res.ok) throw new Error('precache ' + path + ' -> ' + res.status);
      await cache.put(path, res);
    }));
    await cache.put(MANIFEST_KEY, new Response(JSON.stringify(hashes), { headers: { 'Content-Type': 'application/json' } }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('pokladna-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
    for (const client of await self.clients.matchAll({ type: 'window' })) {
      client.postMessage({ type: 'pokladna-sw', version: VERSION });
    }
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'pokladna-sw-version') {
    event.source && event.source.postMessage({ type: 'pokladna-sw', version: VERSION });
  }
});

async function networkFirstNavigation(request) {
  const cache = await caches.open(CACHE);
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), NAV_TIMEOUT_MS);
    const res = await fetch(request, { signal: controller.signal });
    clearTimeout(timer);
    if (res && res.ok) {
      await cache.put('/index.html', res.clone());
      return res;
    }
  } catch (_) { /* offline or slow: fall through to the cache */ }
  const cached = await cache.match('/index.html') || await cache.match('/');
  return cached || new Response('Pokladňa je offline a ešte nebola načítaná.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request, { ignoreSearch: true });
  if (hit) return hit;
  try {
    const res = await fetch(request);
    if (res && res.ok && res.type === 'basic') await cache.put(request, res.clone());
    return res;
  } catch (e) {
    return new Response('', { status: 504, statusText: 'offline' });
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/sw.js')) return;
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }
  event.respondWith(cacheFirst(request));
});
