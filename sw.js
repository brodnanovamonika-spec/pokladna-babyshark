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
const VERSION = "0a74504779d6";
// [path, sha256 of the file]: unchanged files are copied from the previous cache, not fetched again
const PRECACHE = [["/assets/AssetManifest.bin", "32c3ec9e7505e95f"], ["/assets/AssetManifest.bin.json", "14e2492e6107a93b"], ["/assets/FontManifest.json", "980a542761c5fe42"], ["/assets/NOTICES", "3f1517203a10c76a"], ["/assets/assets/fonts/Manrope-400.ttf", "a13d9b41b0a471ce"], ["/assets/assets/fonts/Manrope-500.ttf", "f433e5d333be1128"], ["/assets/assets/fonts/Manrope-600.ttf", "6bad1a774228464c"], ["/assets/assets/fonts/Manrope-700.ttf", "b9584e099e0e7f1e"], ["/assets/assets/fonts/Manrope-800.ttf", "b8f802f05b322a73"], ["/assets/assets/products/alaska.jpg", "4c987746337e44a5"], ["/assets/assets/products/bakerolls.jpg", "e8920be575d58609"], ["/assets/assets/products/cajloyd.jpg", "db7bfcde47ebdfd8"], ["/assets/assets/products/cappuccino.jpg", "0017ee642d9bd8e7"], ["/assets/assets/products/caprisun.jpg", "91d1985537ac48a6"], ["/assets/assets/products/cheesecake.jpg", "2cb88514ca297bce"], ["/assets/assets/products/cheeshamburgares.jpg", "a684145536625b2c"], ["/assets/assets/products/chlieb.jpg", "f7b9b54eb5da78d3"], ["/assets/assets/products/citronadadzban.jpg", "9e0f67f02cbc7d29"], ["/assets/assets/products/cocacola.jpg", "cd3268dbe0d39a08"], ["/assets/assets/products/credits.json", "06e92f0dff3633a2"], ["/assets/assets/products/croissant.jpg", "a11e0e7f513810b4"], ["/assets/assets/products/dessert.jpg", "2dcb7246ec95b602"], ["/assets/assets/products/drutycinky.jpg", "836d74627c9ed505"], ["/assets/assets/products/dzuskrabickovy.jpg", "391a5d984251d109"], ["/assets/assets/products/espresso.jpg", "b3c13e15e960091b"], ["/assets/assets/products/fanta.jpg", "e8056f2b10861443"], ["/assets/assets/products/figo.jpg", "342028f31aba0019"], ["/assets/assets/products/gazdovsketycinky.jpg", "41212827ac3f9330"], ["/assets/assets/products/horalka.jpg", "cf1717cf1d0b465a"], ["/assets/assets/products/hranolky.jpg", "d52644c8a4e57eb2"], ["/assets/assets/products/jupik.jpg", "59d6ca9c1ff152b5"], ["/assets/assets/products/kofola.jpg", "c3b6e3b9444014aa"], ["/assets/assets/products/kubik.jpg", "29ce23667223e233"], ["/assets/assets/products/kubikwater.jpg", "1c4486d0cfb7cab0"], ["/assets/assets/products/kukuricnechrumky.jpg", "9646d2500a7a2137"], ["/assets/assets/products/ladovakava.jpg", "db99dcd11be7b9e6"], ["/assets/assets/products/latte.jpg", "1319ef74d7b029a4"], ["/assets/assets/products/lentilky.jpg", "f226702272a7c87e"], ["/assets/assets/products/lizanka.jpg", "05e1646a7b34f04c"], ["/assets/assets/products/mirinda.jpg", "ca2916910da290de"], ["/assets/assets/products/mlieckodokavy.jpg", "34b378fd14657d3d"], ["/assets/assets/products/papitakeks.jpg", "cf958a03420e671c"], ["/assets/assets/products/pasta.jpg", "3f5d1168d1d85396"], ["/assets/assets/products/pepsi.jpg", "8f0fcb80c6cce401"], ["/assets/assets/products/poharcitronady.jpg", "d0696b33d0747b69"], ["/assets/assets/products/polievka.jpg", "c2ce45167a516fa3"], ["/assets/assets/products/ponozky.jpg", "53d47d8328c6ba56"], ["/assets/assets/products/popcorn.jpg", "2dabac1f91a00231"], ["/assets/assets/products/rajecneochuteny.jpg", "1d21da305885e4cd"], ["/assets/assets/products/rajecochuteny.jpg", "3b85d31e45987f87"], ["/assets/assets/products/redbull.jpg", "db8582a57a8d6adf"], ["/assets/assets/products/ryza.jpg", "edaf082828a5073a"], ["/assets/assets/products/salat.jpg", "f4bd7f68950ffe7f"], ["/assets/assets/products/sprite.jpg", "a7657b5ae89d3bb5"], ["/assets/assets/products/strudlicka.jpg", "d49f36a1f1345351"], ["/assets/assets/products/tiramisu.jpg", "4ae7540b9fa67b8b"], ["/assets/assets/products/varenezemiaky.jpg", "dd0c0a0985d69961"], ["/assets/assets/products/vstupne15hodiny.jpg", "32953090ec58627c"], ["/assets/assets/products/vstupne1hodina.jpg", "b575b9a880026dbb"], ["/assets/assets/products/vstupneneobmedzene.jpg", "7b56cdd7f8fa93c0"], ["/assets/assets/products/xixo.jpg", "93b5e634dba6f7cd"], ["/assets/assets/products/zalievanakava.jpg", "a3ca41c3aeaddf1d"], ["/assets/assets/products/zlatybazantnealko.jpg", "3a7ebff40dfba0ed"], ["/assets/fonts/MaterialIcons-Regular.otf", "e5ed54a6a9134a5b"], ["/assets/packages/cupertino_icons/assets/CupertinoIcons.ttf", "3d90c370aa4cf00d"], ["/assets/shaders/ink_sparkle.frag", "2dca5ab93d4ec29e"], ["/assets/shaders/stretch_effect.frag", "ab412f07a5b9b50b"], ["/canvaskit/canvaskit.js", "bb559f6080c7d312"], ["/canvaskit/canvaskit.wasm", "fbed517a43e82452"], ["/canvaskit/chromium/canvaskit.js", "6018b12bd8ed37e6"], ["/canvaskit/chromium/canvaskit.wasm", "ae8ff1d858140f7b"], ["/favicon.png", "7ab2525f4b86b65d"], ["/flutter.js", "2beb1ce6b159c715"], ["/flutter_bootstrap.js", "2ffb19ec751b97c9"], ["/icons/Icon-192.png", "3dce99077602f704"], ["/icons/Icon-512.png", "baccb205ae45f0b4"], ["/icons/Icon-maskable-192.png", "d2c842e22a9f4ec9"], ["/icons/Icon-maskable-512.png", "6aee06cdcab6b2ae"], ["/index.html", "4aa6580a0b8d7fc7"], ["/", "4aa6580a0b8d7fc7"], ["/main.dart.js", "6b3264bb80aeddad"], ["/manifest.json", "5a557e4516d9527f"], ["/sqflite_sw.js", "acfc701d235b0093"], ["/sqlite3.wasm", "13d3f11d05b39ba0"]];
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
