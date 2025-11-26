import { bootstrap } from '$lib/server/db';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
	await bootstrap();
};
