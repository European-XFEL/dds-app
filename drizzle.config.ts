import process from 'node:process';

import { defineConfig } from 'drizzle-kit';

const env = process.env;

const DB_USER = env['DB_USER'];
const DB_PASSWORD = env['DB_PASSWORD'];
const DB_HOST = env['DB_HOST'];
const DB_NAME = env['DB_NAME'];

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

const DATABASE_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

console.log('Using database URL:', DATABASE_URL);

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: DATABASE_URL },
  verbose: true,
  strict: true,
});
