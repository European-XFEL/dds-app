<script lang="ts">
  import {
    Atom,
    Beaker,
    Check,
    Circle,
    Droplets,
    FlaskConical,
    Fullscreen,
    Projector,
    Radio,
    Zap,
  } from '@lucide/svelte';

  import { cn } from '$lib/shadcn/utils';

  interface ChecklistItem {
    label: string;
    completed: boolean;
    icon: typeof Check;
  }

  interface Props {
    hasGroundMolecule: boolean;
    hasExcitedMolecule: boolean;
    hasSolvent: boolean;
    hasDetector: boolean;
    hasPump: boolean;
  }

  let {
    hasGroundMolecule,
    hasExcitedMolecule,
    hasSolvent,
    hasDetector,
    hasPump,
  }: Props = $props();

  const items = $derived<ChecklistItem[]>([
    { label: 'Select Solvent', completed: hasSolvent, icon: Beaker },
    {
      label: 'Select Ground Molecule',
      completed: hasGroundMolecule,
      icon: Atom,
    },
    {
      label: 'Select Excited Molecule',
      completed: hasExcitedMolecule,
      icon: Atom,
    },
    {
      label: 'Configure IR Optical Pump and Probe',
      completed: hasPump,
      icon: Projector,
    },
    {
      label: 'Configure Detector',
      completed: hasDetector,
      icon: Fullscreen,
    },
  ]);

  const completedCount = $derived(items.filter((i) => i.completed).length);
  const allComplete = $derived(completedCount === items.length);
</script>

<div class="flex h-full w-full flex-col items-center justify-center p-8">
  <div
    class="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm"
  >
    <div class="mb-6 flex items-center gap-3">
      <div class="rounded-full bg-primary/10 p-2">
        <FlaskConical class="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 class="text-lg font-semibold text-foreground">Setup Required</h3>
        <p class="text-sm text-muted-foreground">
          Complete the following steps to generate scattering signals
        </p>
      </div>
    </div>

    <div class="mb-4 h-2 w-full overflow-hidden rounded-full bg-muted">
      <!-- deno-fmt-ignore -->
      <div
        class="h-full bg-primary transition-all duration-300 ease-out"
        style="width: {(completedCount / items.length) * 100}%"
      ></div>
    </div>

    <p class="mb-4 text-right text-xs text-muted-foreground">
      {completedCount} of {items.length} completed
    </p>

    <ul class="space-y-3">
      {#each items as item (item.label)}
        <li class="flex items-center gap-3">
          <div
            class={cn(
              'flex h-6 w-6 items-center justify-center rounded-full border transition-colors',
              item.completed
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground/30 bg-transparent text-muted-foreground/50',
            )}
          >
            {#if item.completed}
              <Check class="h-3.5 w-3.5" />
            {:else}
              <item.icon class="h-3 w-3" />
            {/if}
          </div>
          <span
            class={cn(
              'text-sm transition-colors',
              item.completed
                ? 'text-muted-foreground line-through'
                : 'text-foreground',
            )}
          >
            {item.label}
          </span>
        </li>
      {/each}
    </ul>

    {#if allComplete}
      <div
        class="mt-6 rounded-md bg-primary/10 p-3 text-center text-sm text-primary"
      >
        All set! Your scattering signals should now be displayed.
      </div>
    {:else}
      <p class="mt-6 text-center text-xs text-muted-foreground">
        Use the configuration panels on the right to complete setup
      </p>
    {/if}
  </div>
</div>
