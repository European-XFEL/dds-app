/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />
/// <reference types="../.svelte-kit/ambient.d.ts" />
import { build, files, version } from '$service-worker';
import {
  imageCache,
  offlineFallback,
  pageCache,
  staticResourceCache,
} from 'workbox-recipes';
import { registerRoute, setDefaultHandler } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

import { PUBLIC_BASE_PATH, PUBLIC_REMOTE_HOST } from '$env/static/public';

const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

const ASSETS = [...build, ...files];

const CACHE = {
  STATIC: `static-resources: ${version}`,
  PAGES: `pages: ${version}`,
  IMAGES: `images: ${version}`,
  SWR: `swr: ${version}`,
};

type ProxyConfig = {
  enabled: boolean;
  proxyUrl: string | null;
};

const DEFAULT_PROXY_CONFIG: ProxyConfig = {
  enabled: !!PUBLIC_REMOTE_HOST,
  proxyUrl: PUBLIC_REMOTE_HOST ?? null,
};

const SETTINGS_CACHE = 'settings';
const SETTINGS_REQUEST = new Request('/__sw-config__/proxy');

let activeProxyConfig: ProxyConfig = DEFAULT_PROXY_CONFIG;
let proxyRoute: ReturnType<typeof registerRoute> | null = null;
const REMOTE_PROXY_TIMEOUT_MS = 20_000;

// Precache app shell and static assets
self.addEventListener('install', (event) => {
  async function addFilesToCache() {
    const cache = await caches.open(CACHE.STATIC);
    console.log('Caching assets:', ASSETS);
    const result = Promise.all(
      ASSETS.map(async (asset) => {
        try {
          await cache.add(asset);
        } catch (err) {
          console.error(`Failed to cache ${asset}:`, err);
        }
      }),
    );
    return result;
  }
  event.waitUntil(addFilesToCache());
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key === SETTINGS_CACHE) {
        console.log(`Keeping settings cache: ${key}`);
        continue;
      }
      if (key.endsWith(version)) {
        console.log(`Keeping cache: ${key}`);
      } else {
        console.log(`Deleting old cache: ${key}`);
        await caches.delete(key);
      }
    }
  }

  event.waitUntil(
    (async () => {
      await deleteOldCaches();
      activeProxyConfig = await loadProxyConfig();
      await applyProxyConfig(activeProxyConfig, { persist: false });
    })(),
  );
});

function normalizeProxyUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const normalized = new URL(value);
    if (
      normalized.protocol !== 'https:' &&
      normalized.hostname !== 'localhost' &&
      normalized.hostname !== '127.0.0.1' &&
      normalized.hostname !== '::1'
    ) {
      console.warn(
        'Rejecting insecure proxy URL for non-localhost host:',
        value,
      );
      return null;
    }
    return normalized.toString();
  } catch (err) {
    console.warn('Invalid proxy URL provided:', value, err);
    return null;
  }
}

type RemotePathInfo = {
  kind: 'dynamic' | 'prerendered';
  hash: string;
  method: string;
  payload: string | null;
};

function parseRemotePath(pathname: string): RemotePathInfo | null {
  const normalizedPath = pathname.replace(/^\/+|\/+$/g, '');
  const segments = normalizedPath.split('/');

  if (
    segments.length < 4 ||
    segments[0] !== '_app' ||
    segments[1] !== 'remote'
  ) {
    return null;
  }

  const [, , hash, method, ...rest] = segments;
  if (!/^[a-z0-9]+$/i.test(hash) || !method) {
    return null;
  }

  if (rest.length === 0) {
    return {
      kind: 'dynamic',
      hash,
      method,
      payload: null,
    };
  }

  if (rest.length === 1 && rest[0]) {
    return {
      kind: 'prerendered',
      hash,
      method,
      payload: rest[0],
    };
  }

  return null;
}

function rewriteRemoteUrl(requestUrl: URL, proxyUrl: string): URL | null {
  const sourcePrefix = `${PUBLIC_BASE_PATH}/_app/remote`;
  if (!requestUrl.pathname.startsWith(sourcePrefix)) return null;

  const targetUrl = new URL(proxyUrl);
  const targetBasePath = targetUrl.pathname.replace(/\/$/, '');

  if (!targetBasePath.endsWith('/_app/remote')) {
    console.warn('Proxy URL must include /_app/remote path:', proxyUrl);
    return null;
  }

  const suffix = requestUrl.pathname.slice(sourcePrefix.length);
  const remotePath = parseRemotePath(`/_app/remote${suffix}`);
  if (!remotePath) return null;

  if (!suffix || suffix.includes('..') || /\/\//.test(suffix)) {
    console.warn('Rejecting unexpected remote suffix:', suffix);
    return null;
  }

  const nextUrl = new URL(targetUrl.toString());

  nextUrl.pathname = `${targetBasePath}/${remotePath.hash}/${remotePath.method}`;
  nextUrl.search = requestUrl.search;

  if (remotePath.kind === 'prerendered' && remotePath.payload) {
    nextUrl.searchParams.set('payload', remotePath.payload);
  }

  return nextUrl;
}

async function tryServeLocalPrerenderedRemote(
  request: Request,
): Promise<Response | null> {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return null;
  }

  const requestUrl = new URL(request.url);
  const remotePath = parseRemotePath(requestUrl.pathname);
  if (!remotePath || remotePath.kind !== 'prerendered') {
    return null;
  }

  const localResponse = await fetch(request);
  if (localResponse.ok) {
    return localResponse;
  }

  return null;
}

async function forwardRemoteRequest(
  request: Request,
  targetUrl: URL,
): Promise<Response> {
  const timeoutController = new AbortController();
  const timeout = setTimeout(
    () => timeoutController.abort('Remote proxy timeout'),
    REMOTE_PROXY_TIMEOUT_MS,
  );

  const headers = new Headers(request.headers);
  headers.set('X-SvelteKit-Remote', 'true');

  const init: RequestInit = {
    method: request.method,
    headers,
    credentials: request.credentials,
    cache: 'no-store',
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    mode: 'cors',
    signal: timeoutController.signal,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const bodyBuffer = await request.clone().arrayBuffer();
    init.body = bodyBuffer.byteLength > 0 ? bodyBuffer : null;
  }

  try {
    return await fetch(targetUrl, init);
  } finally {
    clearTimeout(timeout);
  }
}

async function loadProxyConfig(): Promise<ProxyConfig> {
  const cache = await caches.open(SETTINGS_CACHE);
  const match = await cache.match(SETTINGS_REQUEST);
  if (!match) return DEFAULT_PROXY_CONFIG;

  try {
    const payload = (await match.json()) as Partial<ProxyConfig>;
    const proxyUrl = normalizeProxyUrl(payload.proxyUrl ?? null);
    return {
      enabled: payload.enabled ?? DEFAULT_PROXY_CONFIG.enabled,
      proxyUrl,
    };
  } catch (err) {
    console.warn('Failed to parse proxy config from cache:', err);
    return DEFAULT_PROXY_CONFIG;
  }
}

async function persistProxyConfig(config: ProxyConfig): Promise<void> {
  const cache = await caches.open(SETTINGS_CACHE);
  await cache.put(
    SETTINGS_REQUEST,
    new Response(JSON.stringify(config), {
      headers: { 'Content-Type': 'application/json' },
    }),
  );
}

async function applyProxyConfig(
  config: ProxyConfig,
  { persist }: { persist: boolean },
): Promise<void> {
  activeProxyConfig = config;
  if (persist) {
    await persistProxyConfig(config);
  }
  ensureProxyRoute();
}

function ensureProxyRoute(): void {
  if (proxyRoute) return;
  // Base path is the parent path of the service worker
  const urlStart = `${PUBLIC_BASE_PATH}/_app/remote`;

  proxyRoute = registerRoute(
    ({ url }) => {
      if (!activeProxyConfig.enabled || !activeProxyConfig.proxyUrl) {
        return false;
      }
      return url.pathname.startsWith(urlStart);
    },
    async ({ request, url }) => {
      const proxyUrl = normalizeProxyUrl(activeProxyConfig.proxyUrl);
      if (!activeProxyConfig.enabled || !proxyUrl) {
        return fetch(request);
      }

      const localPrerenderedResponse =
        await tryServeLocalPrerenderedRemote(request);
      if (localPrerenderedResponse) {
        return localPrerenderedResponse;
      }

      const nextUrl = rewriteRemoteUrl(url, proxyUrl);
      if (!nextUrl) {
        return new Response('Invalid remote request target.', {
          status: 400,
        });
      }

      console.log('[proxy]:', request.method, request.url, nextUrl.toString());

      try {
        return await forwardRemoteRequest(request, nextUrl);
      } catch (error) {
        console.warn('Remote proxy request failed:', error);
        return new Response(
          JSON.stringify({
            type: 'error',
            status: 503,
            error: 'Remote backend unreachable',
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }
    },
  );
}

pageCache({
  cacheName: CACHE.PAGES,
  warmCache: [
    '/',
    '/dashboard',
    '/docs',
    '/settings',
    '/experiment/samples',
    '/experiment/pump-probe',
    '/experiment/detector',
  ],
});

staticResourceCache({ cacheName: CACHE.STATIC });

imageCache({ cacheName: CACHE.IMAGES });

offlineFallback();

setDefaultHandler(new StaleWhileRevalidate({ cacheName: CACHE.SWR }));

self.addEventListener('message', (event) => {
  event.waitUntil(handleMessageEvent(event));
});

async function handleMessageEvent(
  event: ExtendableMessageEvent,
): Promise<void> {
  const port = event.ports[0];
  if (!port) return;

  const { type, payload } = event.data ?? {};

  if (type === 'GET_PROXY_CONFIG') {
    port.postMessage({
      ok: true,
      data: {
        config: activeProxyConfig,
        registered: activeProxyConfig.enabled && !!activeProxyConfig.proxyUrl,
        defaults: DEFAULT_PROXY_CONFIG,
      },
    });
    return;
  }

  if (type === 'SET_PROXY_CONFIG') {
    const nextConfig: ProxyConfig = {
      enabled: !!payload?.enabled,
      proxyUrl: normalizeProxyUrl(payload?.proxyUrl ?? null),
    };

    if (payload?.proxyUrl && !nextConfig.proxyUrl) {
      port.postMessage({
        ok: false,
        error: 'Invalid proxy URL.',
      });
      return;
    }

    await applyProxyConfig(nextConfig, { persist: true });
    port.postMessage({
      ok: true,
      data: {
        config: activeProxyConfig,
        registered: activeProxyConfig.enabled && !!activeProxyConfig.proxyUrl,
      },
    });
    return;
  }

  if (type === 'RESET_PROXY_CONFIG') {
    await applyProxyConfig(DEFAULT_PROXY_CONFIG, { persist: true });
    port.postMessage({
      ok: true,
      data: {
        config: activeProxyConfig,
        registered: activeProxyConfig.enabled && !!activeProxyConfig.proxyUrl,
      },
    });
    return;
  }

  port.postMessage({ ok: false, error: 'Unknown message type.' });
}

// async function checkRemoteVersion() {
//   const remoteVersion = await fetch(PUBLIC_REMOTE_HOST + '/version')

//   if (!remoteVersion.ok) {
//     console.warn(
//       `Failed to fetch version from remote host ${PUBLIC_REMOTE_HOST}: ${remoteVersion.status} ${remoteVersion.statusText}`,
//     );
//     return false;
//   }
//   const remoteVersionRes = await remoteVersion.text();
//   console.info(`Remote host ${PUBLIC_REMOTE_HOST} is running version ${remoteVersionRes}`);
//   if (remoteVersionRes !== version) {
//     console.warn(
//       `Remote host version does not match static site version ${version}.`,
//     );
//     return false;
//   } else {
//     console.info(`Remote host version matches static site version ${version}.`);
//     return true;
//   }
// }

// async function checkShouldProxy() {
//   if (PUBLIC_TARGET !== 'static' && !PUBLIC_REMOTE_HOST) return false;

//   const remoteHostUrl = new URL(PUBLIC_REMOTE_HOST);

//   if (remoteHostUrl.hostname !== 'localhost' && remoteHostUrl.protocol !== 'https:') {
//     console.warn(
//       `Remote host ${PUBLIC_REMOTE_HOST} is not using HTTPS. Refusing to proxy.`,
//     );
//     return false;
//   }

//   try {
//     if (!await checkRemoteVersion()) return false;
//   } catch (err) {
//     console.warn(
//       `Failed to check remote host version at ${PUBLIC_REMOTE_HOST}:`,
//       err,
//     );
//     return true;
//   }

//   return true;
// }
