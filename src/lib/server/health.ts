import { sql } from 'drizzle-orm';

import { env } from '$env/dynamic/private';

import { db } from './db';
import type { BackendHealth, Capabilities, DbHealth, Health } from './types';

const HEALTH_TTL_MS = 10_000;
const BACKEND_TIMEOUT_MS = 300;
let healthCache: { value: Health; expiresAt: number } | null = null;
let healthInFlight: Promise<Health> | null = null;

const DB_CONFIGURED = Boolean(env?.DB_HOST && env?.DB_USER && env?.DB_PASSWORD);
const BACKEND_CONFIGURED = Boolean(env?.BACKEND_URL);

function normalizeErrorDetail(err: unknown): string {
  if (err instanceof Error) {
    return err.message || err.name;
  }
  return String(err);
}

async function checkDbHealth(): Promise<DbHealth> {
  if (!DB_CONFIGURED) {
    return {
      configured: false,
      healthy: false,
      reason: 'NOT_CONFIGURED',
      detail: 'Database connection not configured',
    };
  }

  try {
    const res = await db.execute(sql`SELECT 1`);
    const hasRows = Array.isArray(res) ? res.length > 0 : Boolean(res);
    return hasRows
      ? { configured: true, healthy: true }
      : { configured: true, healthy: false, reason: 'NO_ROWS' };
  } catch (err) {
    console.error('Database health check failed', err);
    return {
      configured: true,
      healthy: false,
      reason: 'ERROR',
      detail: normalizeErrorDetail(err),
    };
  }
}

async function checkBackendHealth(
  fetcher: typeof fetch,
): Promise<BackendHealth> {
  if (!BACKEND_CONFIGURED) {
    return { configured: false, healthy: false, reason: 'NOT_CONFIGURED' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);

  try {
    const res = await fetcher(`${env.BACKEND_URL}/healthz`, {
      signal: controller.signal,
    });
    if (res.ok) {
      return { configured: true, healthy: true };
    }
    return {
      configured: true,
      healthy: false,
      reason: 'STATUS',
      detail: String(res.status),
    };
  } catch (err) {
    console.error('Backend health check failed', err);
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { configured: true, healthy: false, reason: 'TIMEOUT' };
    }
    return {
      configured: true,
      healthy: false,
      reason: 'UNREACHABLE',
      detail: normalizeErrorDetail(err),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function computeHealthFlags(fetcher: typeof fetch): Promise<Health> {
  const [db, backend] = await Promise.all([
    checkDbHealth(),
    checkBackendHealth(fetcher),
  ]);
  return { db, backend };
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
    upload: {
      available: health.db.healthy,
      reason: 'Database connection unavailable',
    },
    feedback: {
      available: health.db.healthy,
      reason: 'Database connection unavailable',
    },
    simulation: {
      available: health.backend.healthy,
      reason: 'Backend service unavailable',
    },
  };
}
