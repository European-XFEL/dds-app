import type { ServerInit } from '@sveltejs/kit';

import { bootstrap } from '$lib/server/db';

export const init: ServerInit = async () => {
  await bootstrap();
};
