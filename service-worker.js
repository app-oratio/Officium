const APP_CACHE = "officium-app-v1";
const CONTENT_CACHE = "officium-content-v1";

const VERSION_URL = "/content/cache-version.txt";
const VERSION_KEY = "/__content_version__";

const CORE_FILES = [
    "/",
    "/index.html",
    "/manifest.json",
    "/css/style.css"
];

const DAILY_FILES = [
    "index.html",
    "odl.html",
    "laudes.html",
    "terca.html",
    "sexta.html",
    "nona.html",
    "vesperas.html",
    "completas.html",
    "info.json"
];

self.addEventListener("install", function(event) {
    self.skipWaiting();
    event.waitUntil(initialSetup());
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        (async function() {

            await self.clients.claim();

            // força atualização das abas abertas
            const clients = await self.clients.matchAll();
            for (const client of clients) {
                client.navigate(client.url);
            }

        })()
    );

    // roda em background (não bloqueia activate)
    updateContent();
});

async function initialSetup() {

    const cache = await caches.open(APP_CACHE);

    for (const file of CORE_FILES) {
        try {
            await cache.add(file);
        } catch (e) {
            console.warn("Erro ao cachear core:", file);
        }
    }

    await updateContent();
}

async function updateContent() {

    const cache = await caches.open(CONTENT_CACHE);

    let remoteVersion = 0;

    try {

        const response = await fetch(VERSION_URL + "?t=" + Date.now(), {
            cache: "no-store"
        });

        const text = await response.text();

        const parsed = parseInt(text.trim());
        if (isNaN(parsed)) {
            console.warn("Versão inválida:", text);
            return;
        }

        remoteVersion = parsed;

    } catch (e) {
        console.error("Erro ao buscar versão:", e);
        return;
    }

    let localVersion = 0;

    const versionResponse = await cache.match(VERSION_KEY);

    if (versionResponse) {
        const text = await versionResponse.text();
        const parsed = parseInt(text);
        if (!isNaN(parsed)) {
            localVersion = parsed;
        }
    }

    if (remoteVersion <= localVersion) {
        return;
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    const promises = [];

    for (let i = -10; i <= 10; i++) {

        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        const base = "/content/" + year + "/" + month + "/" + day + "/";

        for (const file of DAILY_FILES) {

            const url = base + file;

            const p = fetch(url, { cache: "no-store" })
                .then(function(response) {
                    if (response.ok) {
                        return cache.put(url, response.clone());
                    } else {
                        console.warn("Resposta não OK:", url);
                    }
                })
                .catch(function(e) {
                    console.error("Erro ao baixar:", url);
                });

            promises.push(p);
        }
    }

    await Promise.all(promises);

    await cache.put(VERSION_KEY, new Response(String(remoteVersion)));

    await cleanOldContent(cache);

    console.log("Conteúdo atualizado para versão:", remoteVersion);
}

async function cleanOldContent(cache) {

    const requests = await cache.keys();

    const today = new Date();
    today.setHours(0,0,0,0);

    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 10);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 10);

    for (const request of requests) {

        const url = new URL(request.url);

        if (!url.pathname.startsWith("/content/")) {
            continue;
        }

        const parts = url.pathname.split("/");

        if (parts.length < 5) {
            continue;
        }

        const year = parseInt(parts[2]);
        const month = parseInt(parts[3]) - 1;
        const day = parseInt(parts[4]);

        const fileDate = new Date(year, month, day);
        fileDate.setHours(0,0,0,0);

        if (fileDate < minDate || fileDate > maxDate) {
            await cache.delete(request);
        }
    }
}

self.addEventListener("fetch", function(event) {

    const url = new URL(event.request.url);

    const dateParam = url.searchParams.get("date");

    if (dateParam) {

        const requestedDate = new Date(dateParam);
        requestedDate.setHours(0,0,0,0);

        const today = new Date();
        today.setHours(0,0,0,0);

        const minDate = new Date(today);
        minDate.setDate(today.getDate() - 10);

        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 10);

        if (requestedDate < minDate || requestedDate > maxDate) {
            event.respondWith(fetch(event.request));
            return;
        }
    }

    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {

    const appCache = await caches.open(APP_CACHE);
    const contentCache = await caches.open(CONTENT_CACHE);

    let response = await contentCache.match(request, { ignoreSearch: true });

    if (response) {
        return response;
    }

    response = await appCache.match(request, { ignoreSearch: true });

    if (response) {
        return response;
    }

    return fetch(request).catch(async function() {
        return await appCache.match("/index.html");
    });
}
