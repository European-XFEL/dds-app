import { env } from '$env/dynamic/public';

export const prerender = env?.PUBLIC_PRERENDER_ALL === 'true';
