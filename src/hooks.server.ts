import type { Handle } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';

import { getCapabilities, getHealth } from '$lib/server/health';

const DEFAULT_ORIGINS = [
  'http://localhost',
  'https://exfldadev01.desy.de',
  'https://european-xfel.github.io',
];

function parseAllowedOrigins(raw: string | undefined): string[] {
  if (!raw) return DEFAULT_ORIGINS;
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

const ORIGINS = parseAllowedOrigins(
  env.ALLOWED_ORIGINS ?? env.PUBLIC_TRUSTED_ORIGINS,
);

// Remote query methods whose results are dynamic (e.g. change after an upload)
// and so must NOT receive the long-lived immutable cache headers below. The
// remote path format is `/_app/remote/<hash>/<method>[/<payload>]`.
const DYNAMIC_REMOTE_METHODS = /\/(listMolecules|listSolvents)(\/|$)/;

export const handle: Handle = async ({ event, resolve }) => {
  const origin = event.request.headers.get('origin') ?? '';
  const isAllowedOrigin = ORIGINS.includes(origin);
  const isRemotePath = event.url.pathname.startsWith('/_app/remote/');
  const isRemoteRequest = event.isRemoteRequest || isRemotePath;

  // Only add locals for non-remote requests
  if (!isRemoteRequest) {
    const [health, capabilities] = await Promise.all([
      getHealth(event.fetch),
      getCapabilities(event.fetch),
    ]);

    event.locals.health = health;
    event.locals.capabilities = capabilities;
  }

  if (event.request.method === 'OPTIONS' && isRemoteRequest) {
    if (!isAllowedOrigin) {
      console.warn(`Blocked CORS preflight request from origin: ${origin}`);
      return new Response(null, { status: 403 });
    }

    const requestedHeaders =
      event.request.headers.get('access-control-request-headers') ??
      'content-type,x-sveltekit-remote';

    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': origin,
        'access-control-allow-methods': 'GET,POST,OPTIONS',
        'access-control-allow-headers': requestedHeaders,
        'access-control-allow-credentials': 'true',
        'access-control-max-age': '600',
        vary: 'Origin',
      },
    });
  }

  const res = await resolve(event);

  if (isRemoteRequest) {
    res.headers.append('vary', 'Origin');

    if (isAllowedOrigin) {
      res.headers.set('access-control-allow-origin', origin);
      res.headers.set('access-control-allow-credentials', 'true');
    } else if (!origin && ['GET', 'HEAD'].includes(event.request.method)) {
      res.headers.set('access-control-allow-origin', '*');
    }
  }

  if (isRemoteRequest && res.ok) {
    if (event.request.method === 'GET') {
      if (!DYNAMIC_REMOTE_METHODS.test(event.url.pathname)) {
        res.headers.set(
          'cache-control',
          'public, max-age=31536000, s-maxage=31536000, immutable',
        );
      }
    }
  }

  return res;
};
