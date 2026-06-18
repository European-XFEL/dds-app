/**
 * Constructs a PostgreSQL connection URL from environment variables.
 *
 * Required env vars: DB_USER, DB_PASSWORD, DB_HOST, DB_NAME
 * Optional env vars: DB_PORT (defaults to standard PostgreSQL port)
 */

type EnvLike = Record<string, string | undefined>;

/**
 * Build a postgres connection URL from individual environment variables.
 *
 * Accepts an optional env-like object so it can be used from SvelteKit
 * server code (`$env/dynamic/private`), plain Node scripts (`process.env`),
 * and drizzle-kit config without duplication.
 */
export function getDbUrl(env: EnvLike = process.env as EnvLike): string {
  const DB_USER = env['DB_USER'];
  const DB_PASSWORD = env['DB_PASSWORD'];
  const DB_HOST = env['DB_HOST'];
  const DB_NAME = env['DB_NAME'];
  const DB_PORT = env['DB_PORT'];

  if (!DB_USER || !DB_PASSWORD) {
    throw new Error(
      'Missing DB credentials: set DB_USER and DB_PASSWORD environment variables',
    );
  }

  if (!DB_HOST || !DB_NAME) {
    throw new Error(
      'Missing DB host info: set DB_HOST and DB_NAME environment variables',
    );
  }

  const portSegment = DB_PORT ? `:${DB_PORT}` : '';
  return `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}${portSegment}/${DB_NAME}`;
}
