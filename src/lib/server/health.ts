import { sql } from 'drizzle-orm';

import { env } from '$env/dynamic/private';

import { db } from './db';
import type { Capabilities, Health } from './types';

const HEALTH_TTL_MS = 10_000;
let healthCache: { value: Health; expiresAt: number } | null = null;
let healthInFlight: Promise<Health> | null = null;

const DB_CONFIGURED = Boolean(env?.DB_HOST && env?.DB_USER && env?.DB_PASSWORD);
const BACKEND_CONFIGURED = Boolean(env?.BACKEND_URL);

async function computeHealthFlags(fetcher: typeof fetch): Promise<Health> {
  const [dbOk, backendOk] = await Promise.all([
    DB_CONFIGURED
      ? db.execute(sql`SELECT 1`).then((result) => result.length > 0)
      : Promise.resolve(false),
    BACKEND_CONFIGURED
      ? fetcher(`${env.BACKEND_URL}/healthz`).then((res) => res.ok)
      : Promise.resolve(false),
  ]);

  return {
    db: { configured: DB_CONFIGURED, healthy: dbOk },
    backend: { configured: BACKEND_CONFIGURED, healthy: backendOk },
  };
}

export async function getHealth(
  fetcher: typeof fetch = fetch,
): Promise<Health> {
  const now = Date.now();
  if (healthCache && healthCache.expiresAt > now) {
    return healthCache.value;
  }

  if (!healthInFlight) {
    healthInFlight = (async () => {
      try {
        const value = await computeHealthFlags(fetcher);
        healthCache = { value, expiresAt: Date.now() + HEALTH_TTL_MS };
        return value;
      } finally {
        healthInFlight = null;
      }
    })();
  }

  return healthInFlight;
}

export async function getCapabilities(
  fetcher: typeof fetch = fetch,
): Promise<Capabilities> {
  const health = await getHealth(fetcher);
  return {
    upload: health.db.healthy,
    feedback: health.db.healthy,
    simulation: health.backend.healthy,
  };
}
