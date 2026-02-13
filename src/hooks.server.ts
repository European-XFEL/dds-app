import type { Handle } from '@sveltejs/kit';

import { getCapabilities, getHealth } from '$lib/server/health';

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
};
