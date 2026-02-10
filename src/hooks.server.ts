import type { Handle } from '@sveltejs/kit';

import { getCapabilities, getHealth } from '$lib/server/health';

export const handle: Handle = async ({ event, resolve }) => {
  const [health, capabilities] = await Promise.all([
    getHealth(event.fetch),
    getCapabilities(event.fetch),
  ]);

  event.locals.health = health;
  event.locals.capabilities = capabilities;

  console.log(event.locals);

  return resolve(event);
};
