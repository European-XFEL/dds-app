export interface BaseHealth {
  configured: boolean;
  healthy: boolean;
  reason?: string;
  detail?: string;
}

export type DbHealth =
  | (BaseHealth & {
      configured: false;
      healthy: false;
      reason: 'NOT_CONFIGURED';
    })
  | (BaseHealth & { configured: true; healthy: true })
  | (BaseHealth & {
      configured: true;
      healthy: false;
      reason: 'NO_ROWS' | 'ERROR';
      detail?: string;
    });

export type BackendHealth =
  | (BaseHealth & {
      configured: false;
      healthy: false;
      reason: 'NOT_CONFIGURED';
    })
  | (BaseHealth & { configured: true; healthy: true })
  | (BaseHealth & {
      configured: true;
      healthy: false;
      reason: 'STATUS' | 'UNREACHABLE' | 'TIMEOUT' | 'ERROR';
      detail?: string;
    });

export interface Health {
  db: DbHealth;
  backend: BackendHealth;
}

export interface Capability {
  available: boolean;
  reason: string;
}

export type Capabilities = {
  upload: Capability;
  feedback: Capability;
  simulation: Capability;
};
