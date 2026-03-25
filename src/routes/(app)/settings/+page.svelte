<script lang="ts">
  import { onMount } from 'svelte';

  import { browser } from '$app/environment';

  import { Badge } from '$shadcn/ui/badge';
  import * as Button from '$shadcn/ui/button';
  import * as Card from '$shadcn/ui/card';
  import { Checkbox } from '$shadcn/ui/checkbox';
  import * as Field from '$shadcn/ui/field';
  import { Input } from '$shadcn/ui/input';

  type ProxyConfig = {
    enabled: boolean;
    proxyUrl: string | null;
  };

  type ProxyConfigSnapshot = {
    config: ProxyConfig;
    defaults?: ProxyConfig;
    registered: boolean;
  };

  type SwResponse =
    | { ok: true; data: ProxyConfigSnapshot }
    | { ok: false; error: string };

  let loading = $state(true);
  let saving = $state(false);
  let error = $state<string | null>(null);

  let supportsServiceWorker = $state(false);
  let hasRegistration = $state(false);
  let hasController = $state(false);

  let config = $state<ProxyConfig>({ enabled: false, proxyUrl: null });
  let defaults = $state<ProxyConfig>({ enabled: false, proxyUrl: null });
  let registered = $state(false);

  let draftEnabled = $state(false);
  let draftProxyUrl = $state('');

  let isDirty = $derived(
    draftEnabled !== config.enabled ||
      draftProxyUrl.trim() !== (config.proxyUrl ?? ''),
  );

  async function sendSwMessage(message: {
    type: 'GET_PROXY_CONFIG' | 'SET_PROXY_CONFIG' | 'RESET_PROXY_CONFIG';
    payload?: ProxyConfig;
  }): Promise<SwResponse> {
    if (!('serviceWorker' in navigator)) {
      return { ok: false, error: 'Service workers are not supported.' };
    }

    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      return { ok: false, error: 'No service worker registration found.' };
    }

    const worker =
      registration.active ?? registration.waiting ?? registration.installing;
    if (!worker) {
      return { ok: false, error: 'Service worker is not ready yet.' };
    }

    return await new Promise((resolve) => {
      const channel = new MessageChannel();
      const timeout = setTimeout(() => {
        resolve({ ok: false, error: 'Service worker did not respond.' });
      }, 5000);

      channel.port1.onmessage = (event) => {
        clearTimeout(timeout);
        resolve(event.data as SwResponse);
      };

      worker.postMessage(message, [channel.port2]);
    });
  }

  async function refreshConfig(): Promise<void> {
    const response = await sendSwMessage({ type: 'GET_PROXY_CONFIG' });
    if (!response.ok) {
      throw new Error(response.error);
    }

    config = response.data.config;
    defaults = response.data.defaults ?? defaults;
    registered = response.data.registered;

    draftEnabled = config.enabled;
    draftProxyUrl = config.proxyUrl ?? '';
  }

  async function applyConfig(): Promise<void> {
    saving = true;
    error = null;

    try {
      const response = await sendSwMessage({
        type: 'SET_PROXY_CONFIG',
        payload: {
          enabled: draftEnabled,
          proxyUrl: draftProxyUrl.trim() || null,
        },
      });

      if (!response.ok) {
        throw new Error(response.error);
      }

      config = response.data.config;
      registered = response.data.registered;
      draftEnabled = config.enabled;
      draftProxyUrl = config.proxyUrl ?? '';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update settings.';
    } finally {
      saving = false;
    }
  }

  async function resetToDefaults(): Promise<void> {
    saving = true;
    error = null;

    try {
      const response = await sendSwMessage({ type: 'RESET_PROXY_CONFIG' });
      if (!response.ok) {
        throw new Error(response.error);
      }

      config = response.data.config;
      registered = response.data.registered;
      draftEnabled = config.enabled;
      draftProxyUrl = config.proxyUrl ?? '';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to reset settings.';
    } finally {
      saving = false;
    }
  }

  onMount(async () => {
    if (!browser) return;

    supportsServiceWorker = 'serviceWorker' in navigator;

    if (!supportsServiceWorker) {
      loading = false;
      return;
    }

    hasRegistration = !!(await navigator.serviceWorker.getRegistration());
    hasController = !!navigator.serviceWorker.controller;

    try {
      if (hasRegistration) {
        await refreshConfig();
      }
    } catch (err) {
      error =
        err instanceof Error ? err.message : 'Failed to load configuration.';
    } finally {
      loading = false;
    }
  });
</script>

<section class="space-y-6">
  <div>
    <h1 class="text-xl font-semibold">Settings</h1>
    <p class="text-sm text-muted-foreground">
      Manage the service worker proxy used to reach remote compute assets.
    </p>
  </div>

  <Card.Root>
    <Card.Header>
      <Card.Title>Service Worker Status</Card.Title>
      <Card.Description
        >Current runtime state of the PWA worker.</Card.Description
      >
    </Card.Header>
    <Card.Content>
      <Field.Set>
        <Field.Group class="grid gap-4 md:grid-cols-2">
          <Field.Field>
            <Field.Label>Support</Field.Label>
            <div class="flex items-center gap-2">
              <Badge
                variant={supportsServiceWorker ? 'secondary' : 'destructive'}
              >
                {supportsServiceWorker ? 'Available' : 'Unavailable'}
              </Badge>
              <span class="text-sm text-muted-foreground">
                {supportsServiceWorker
                  ? 'Browser supports service workers.'
                  : 'Upgrade your browser.'}
              </span>
            </div>
          </Field.Field>

          <Field.Field>
            <Field.Label>Registration</Field.Label>
            <div class="flex items-center gap-2">
              <Badge variant={hasRegistration ? 'secondary' : 'outline'}>
                {hasRegistration ? 'Registered' : 'Not registered'}
              </Badge>
              <span class="text-sm text-muted-foreground">
                {hasRegistration
                  ? 'Service worker scope is active.'
                  : 'No registration found for this scope.'}
              </span>
            </div>
          </Field.Field>

          <Field.Field>
            <Field.Label>Controller</Field.Label>
            <div class="flex items-center gap-2">
              <Badge variant={hasController ? 'secondary' : 'outline'}>
                {hasController ? 'Controlling' : 'Not controlling'}
              </Badge>
              <span class="text-sm text-muted-foreground">
                {hasController
                  ? 'This page is controlled by the worker.'
                  : 'Reload to let the worker take control.'}
              </span>
            </div>
          </Field.Field>

          <Field.Field>
            <Field.Label>Proxy Route</Field.Label>
            <div class="flex items-center gap-2">
              <Badge variant={registered ? 'secondary' : 'outline'}>
                {registered ? 'Registered' : 'Not registered'}
              </Badge>
              <span class="text-sm text-muted-foreground">
                {registered
                  ? 'Remote assets are routed via the proxy.'
                  : 'Proxy route is currently inactive.'}
              </span>
            </div>
          </Field.Field>
        </Field.Group>
      </Field.Set>
    </Card.Content>
  </Card.Root>

  <Card.Root>
    <Card.Header>
      <Card.Title>Proxy Configuration</Card.Title>
      <Card.Description>
        Provide the full remote base URL (including the /_app/remote path).
      </Card.Description>
    </Card.Header>
    <Card.Content>
      {#if loading}
        <div class="text-sm text-muted-foreground">Loading configuration…</div>
      {:else if !supportsServiceWorker}
        <div class="text-sm text-muted-foreground">
          Service workers are not supported in this browser.
        </div>
      {:else if !hasRegistration}
        <div class="text-sm text-muted-foreground">
          No service worker registration found for this scope.
        </div>
      {:else}
        <Field.Set>
          <Field.Legend>Active configuration</Field.Legend>
          <Field.Group class="grid gap-4 md:grid-cols-2">
            <Field.Field>
              <Field.Label>Proxy URL</Field.Label>
              <Input
                value={config.proxyUrl ?? ''}
                readonly
                placeholder="Not set"
              />
            </Field.Field>

            <Field.Field>
              <Field.Label>Proxy Enabled</Field.Label>
              <Input value={config.enabled ? 'Yes' : 'No'} readonly />
            </Field.Field>
          </Field.Group>
        </Field.Set>

        <Field.Set class="mt-6">
          <Field.Legend>Edit configuration</Field.Legend>
          <Field.Description>
            Changes take effect immediately for new requests.
          </Field.Description>
          <Field.Group class="space-y-4">
            <Field.Field orientation="horizontal">
              <Checkbox bind:checked={draftEnabled} />
              <Field.Label>Enable proxy route</Field.Label>
            </Field.Field>

            <Field.Field>
              <Field.Label>Proxy URL</Field.Label>
              <Input
                bind:value={draftProxyUrl}
                placeholder={defaults.proxyUrl ??
                  'https://sim.foo.bar:8080/_app/remote'}
              />
              <Field.Description>
                Example: https://sim.foo.bar:8080/_app/remote
              </Field.Description>
            </Field.Field>
          </Field.Group>
        </Field.Set>

        {#if error}
          <div class="mt-4 text-sm text-destructive">{error}</div>
        {/if}

        <div class="mt-6 flex flex-wrap gap-3">
          <Button.Root disabled={saving || !isDirty} onclick={applyConfig}>
            {saving ? 'Saving…' : 'Apply changes'}
          </Button.Root>
          <Button.Root
            variant="outline"
            disabled={saving}
            onclick={resetToDefaults}
          >
            Reset to defaults
          </Button.Root>
        </div>
      {/if}
    </Card.Content>
  </Card.Root>
</section>
