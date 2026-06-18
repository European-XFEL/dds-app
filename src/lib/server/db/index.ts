import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';

import { relations } from './relations.ts';
import * as schema from './schema.ts';
import { getDbUrl } from './url.ts';

export type DB = PostgresJsDatabase<typeof schema, typeof relations>;

let _db: DB | undefined = undefined;

/**
 * Initialize the database connection.
 * Must be called before any access to the exported `db`.
 * Idempotent: calling multiple times returns the same instance.
 */
export function initDb(): DB {
  if (_db) return _db;

  const DATABASE_URL = getDbUrl();
  _db = drizzle(DATABASE_URL, { schema, relations }) as unknown as DB;
  return _db;
}

/**
 * Database instance. Throws if accessed before `initDb()` has been called.
 */
export const db: DB = new Proxy({} as DB, {
  get(_target, prop, receiver) {
    if (!_db) {
      throw new Error(
        'Database not initialized. Call initDb() before accessing db.',
      );
    }
    const value = Reflect.get(_db, prop, receiver);
    // Bind methods so `this` works properly if Drizzle uses it internally
    return typeof value === 'function' ? value.bind(_db) : value;
  },
});

export { schema };
