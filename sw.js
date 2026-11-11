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
const VERSION = "69cfe998405e";
// [path, sha256 of the file]: unchanged files are copied from the previous cache, not fetched again
const PRECACHE = [["/assets/AssetManifest.bin", "762c91980690048a"], ["/assets/AssetManifest.bin.json", "3efc338580233bb9"], ["/assets/FontManifest.json", "980a542761c5fe42"], ["/assets/NOTICES", "3f1517203a10c76a"], ["/assets/assets/fonts/Manrope-400.ttf", "a13d9b41b0a471ce"], ["/assets/assets/fonts/Manrope-500.ttf", "f433e5d333be1128"], ["/assets/assets/fonts/Manrope-600.ttf", "6bad1a774228464c"], ["/assets/assets/fonts/Manrope-700.ttf", "b9584e099e0e7f1e"], ["/assets/assets/fonts/Manrope-800.ttf", "b8f802f05b322a73"], ["/assets/assets/products/alaska.jpg", "059c950fae60f6b1"], ["/assets/assets/products/bakerolls.jpg", "0b9b70a4527efdd1"], ["/assets/assets/products/bryndzovehalusky.jpg", "4da1cb82bf989152"], ["/assets/assets/products/cajloyd.jpg", "5dfbf040ee895086"], ["/assets/assets/products/cappuccino.jpg", "62860ec31550c494"], ["/assets/assets/products/caprisun.jpg", "5b3ed11404ef3096"], ["/assets/assets/products/carbonara.jpg", "c4d9063fd20066d8"], ["/assets/assets/products/cheesecake.jpg", "2cb88514ca297bce"], ["/assets/assets/products/cheeshamburgares.jpg", "a684145536625b2c"], ["/assets/assets/products/chlieb.jpg", "f7b9b54eb5da78d3"], ["/assets/assets/products/citronadadzban.jpg", "147489e19c378589"], ["/assets/assets/products/cocacola.jpg", "bb762dca04c20897"], ["/assets/assets/products/credits.json", "06e92f0dff3633a2"], ["/assets/assets/products/croissant.jpg", "56353c1f1ccc390b"], ["/assets/assets/products/dessert.jpg", "2dcb7246ec95b602"], ["/assets/assets/products/drutycinky.jpg", "14c6eebef7dcdb02"], ["/assets/assets/products/dzuskrabickovy.jpg", "17c85359477f5f5a"], ["/assets/assets/products/espresso.jpg", "6f29ad649d01fa4e"], ["/assets/assets/products/fanta.jpg", "821e9bf832b846fe"], ["/assets/assets/products/figo.jpg", "35b3a9df68797757"], ["/assets/assets/products/gazdovsketycinky.jpg", "8a486377d387e6cd"], ["/assets/assets/products/halusky.jpg", "4da1cb82bf989152"], ["/assets/assets/products/horalka.jpg", "e44597aabfbefcb8"], ["/assets/assets/products/hranolky.jpg", "d52644c8a4e57eb2"], ["/assets/assets/products/jablkovykolac.jpg", "4638c1120f6b3dea"], ["/assets/assets/products/jupik.jpg", "2802c1cdd2f2ba49"], ["/assets/assets/products/kofola.jpg", "b9ae5873b4d6c460"], ["/assets/assets/products/kubik.jpg", "33c5e1a0fd86d0ef"], ["/assets/assets/products/kubikwater.jpg", "0a7172001d30476d"], ["/assets/assets/products/kukuricnechrumky.jpg", "92cdb51127adcbdf"], ["/assets/assets/products/ladovakava.jpg", "85454b5ed1ada0cf"], ["/assets/assets/products/latte.jpg", "37fbd4f8e30a846a"], ["/assets/assets/products/lentilky.jpg", "7c8798f60ab92b9c"], ["/assets/assets/products/lizanka.jpg", "befe16f6377c6307"], ["/assets/assets/products/mirinda.jpg", "1d3c5fe27df55b55"], ["/assets/assets/products/mlieckodokavy.jpg", "ae3c70467cc5c7cd"], ["/assets/assets/products/palacinky.jpg", "73d8086eba0031aa"], ["/assets/assets/products/papitakeks.jpg", "49859626c895557c"], ["/assets/assets/products/pasta.jpg", "c4d9063fd20066d8"], ["/assets/assets/products/pepsi.jpg", "cb3d66dd6dbb5c47"], ["/assets/assets/products/poharcitronady.jpg", "8acf36e58fe67c71"], ["/assets/assets/products/polievka.jpg", "c2ce45167a516fa3"], ["/assets/assets/products/ponozky.jpg", "b169ecbe33c66628"], ["/assets/assets/products/popcorn.jpg", "6c9836d9a50ffdfd"], ["/assets/assets/products/rajecneochuteny.jpg", "fd95fc49d03aa234"], ["/assets/assets/products/rajecochuteny.jpg", "e68564818a675045"], ["/assets/assets/products/redbull.jpg", "db8582a57a8d6adf"], ["/assets/assets/products/ryza.jpg", "edaf082828a5073a"], ["/assets/assets/products/salat.jpg", "f4bd7f68950ffe7f"], ["/assets/assets/products/spagetycarbonara.jpg", "c4d9063fd20066d8"], ["/assets/assets/products/sprite.jpg", "4947bbc5cfab45b7"], ["/assets/assets/products/strudlicka.jpg", "0fcb15ccef4fa500"], ["/assets/assets/products/tiramisu.jpg", "4ae7540b9fa67b8b"], ["/assets/assets/products/varenezemiaky.jpg", "dd0c0a0985d69961"], ["/assets/assets/products/vstupne15hodiny.jpg", "32953090ec58627c"], ["/assets/assets/products/vstupne1hodina.jpg", "b575b9a880026dbb"], ["/assets/assets/products/vstupneneobmedzene.jpg", "7b56cdd7f8fa93c0"], ["/assets/assets/products/xixo.jpg", "dfd2c91cc95bbe66"], ["/assets/assets/products/zalievanakava.jpg", "85d81af221728a3e"], ["/assets/assets/products/zlatybazantnealko.jpg", "678408b2317f6f9f"], ["/assets/fonts/MaterialIcons-Regular.otf", "124582f4bf70dfb0"], ["/assets/packages/cupertino_icons/assets/CupertinoIcons.ttf", "3d90c370aa4cf00d"], ["/assets/shaders/ink_sparkle.frag", "2dca5ab93d4ec29e"], ["/assets/shaders/stretch_effect.frag", "ab412f07a5b9b50b"], ["/canvaskit/canvaskit.js", "bb559f6080c7d312"], ["/canvaskit/canvaskit.wasm", "fbed517a43e82452"], ["/canvaskit/chromium/canvaskit.js", "6018b12bd8ed37e6"], ["/canvaskit/chromium/canvaskit.wasm", "ae8ff1d858140f7b"], ["/favicon.png", "7ab2525f4b86b65d"], ["/flutter.js", "2beb1ce6b159c715"], ["/flutter_bootstrap.js", "2ffb19ec751b97c9"], ["/icons/Icon-192.png", "3dce99077602f704"], ["/icons/Icon-512.png", "baccb205ae45f0b4"], ["/icons/Icon-maskable-192.png", "d2c842e22a9f4ec9"], ["/icons/Icon-maskable-512.png", "6aee06cdcab6b2ae"], ["/index.html", "4aa6580a0b8d7fc7"], ["/", "4aa6580a0b8d7fc7"], ["/main.dart.js", "76074ce3cdf1abd3"], ["/manifest.json", "5a557e4516d9527f"], ["/sqflite_sw.js", "acfc701d235b0093"], ["/sqlite3.wasm", "13d3f11d05b39ba0"]];
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
