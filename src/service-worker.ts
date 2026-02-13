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

import { resolve } from '$app/paths';

import { PUBLIC_REMOTE_HOST } from '$env/static/public';

const PROXY_URL = PUBLIC_REMOTE_HOST ? new URL(PUBLIC_REMOTE_HOST) : null;

const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

const ASSETS = [...build, ...files];

const CACHE = {
  STATIC: `static-resources: ${version}`,
  PAGES: `pages: ${version}`,
  IMAGES: `images: ${version}`,
  SWR: `swr: ${version}`,
  PROXY: `swr-proxy: ${version}`,
};

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
      if (key.endsWith(version)) {
        console.log(`Keeping cache: ${key}`);
      } else {
        console.log(`Deleting old cache: ${key}`);
        await caches.delete(key);
      }
    }
  }

  event.waitUntil(deleteOldCaches());

  registerProxyRoute();
});

function registerProxyRoute() {
  if (!PUBLIC_REMOTE_HOST || !PROXY_URL) {
    console.warn(
      'No remote host configured, skipping proxy route registration.',
    );
    return;
  }

  const urlStart = resolve('/_app/remote', {});

  console.log(
    `Registering proxy route to ${PUBLIC_REMOTE_HOST} for ${urlStart}`,
  );

  const proxyStrategy = new StaleWhileRevalidate({
    cacheName: CACHE.PROXY,
  });

  registerRoute(
    ({ url }) => {
      console.log(url.pathname);
      return url.pathname.startsWith(urlStart);
    },
    async ({ event, request, url }) => {
      // if (!await checkShouldProxy()) {
      console.log('[proxy]:', request.method, request.url, PUBLIC_REMOTE_HOST);
      url.host = PROXY_URL.host;
      url.protocol = PROXY_URL.protocol;
      request = new Request(url, request);
      console.log('[proxy]: rewritten URL:', request.url);
      // }

      return proxyStrategy.handle({ request, event });
    },
  );
}

pageCache({
  cacheName: CACHE.PAGES,
  warmCache: [
    '/',
    '/dashboard',
    '/docs',
    '/experiment/samples',
    '/experiment/pump-probe',
    '/experiment/detector',
  ],
});

staticResourceCache({ cacheName: CACHE.STATIC });

imageCache({ cacheName: CACHE.IMAGES });

offlineFallback();

setDefaultHandler(new StaleWhileRevalidate({ cacheName: CACHE.SWR }));

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
