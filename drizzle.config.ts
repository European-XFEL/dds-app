import { defineConfig } from 'drizzle-kit';

import { getDbUrl } from './src/lib/server/db/url.ts';

const DATABASE_URL = getDbUrl();

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: DATABASE_URL },
  verbose: true,
  strict: true,
});
