import type { Handle } from '@sveltejs/kit';

import { initDb } from '$lib/server/db';
import { getCapabilities, getHealth } from '$lib/server/health';

// Initialize the database connection at server startup
initDb();

export const handle: Handle = async ({ event, resolve }) => {
  const [health, capabilities] = await Promise.all([
    getHealth(event.fetch),
    getCapabilities(event.fetch),
  ]);

  event.locals.health = health;
  event.locals.capabilities = capabilities;

  return await resolve(event);
};
