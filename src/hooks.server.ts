import type { Handle } from '@sveltejs/kit';

import { getCapabilities, getHealth } from '$lib/server/health';

const ORIGINS = [
  'http://localhost',
  'https://exfldadev01.desy.de',
  'https://european-xfel.github.io',
];

export const handle: Handle = async ({ event, resolve }) => {
  // Only add locals for non-remote requests
  if (!event.isRemoteRequest) {
    const [health, capabilities] = await Promise.all([
      getHealth(event.fetch),
      getCapabilities(event.fetch),
    ]);

    event.locals.health = health;
    event.locals.capabilities = capabilities;
  }

  if (event.request.method === 'OPTIONS') {
    if (ORIGINS.includes(event.request.headers.get('origin') ?? '')) {
      event.setHeaders({
        'access-control-allow-origin': event.request.headers.get('origin')!,
        'access-control-allow-methods': '*',
        'access-control-allow-headers': '*',
      });
    } else {
      console.warn(
        `Blocked CORS preflight request from origin: ${event.request.headers.get('origin')}`,
      );
    }
    console.log('Handled OPTIONS request, returning 204 No Content');
    return new Response(null, { status: 204 });
  }

  const res = await resolve(event);

  if (event.isRemoteRequest && res.ok) {
    if (event.request.method === 'GET') {
      if (!event.url.pathname.endsWith('(listMolecules|listSolvents)')) {
        res.headers.set(
          'cache-control',
          'public, max-age=31536000, s-maxage=31536000, immutable',
        );
      }
    }
  }

  return res;
};
