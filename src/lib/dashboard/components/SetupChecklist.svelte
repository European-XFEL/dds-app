<script lang="ts">
  import { Atom, Beaker, Check, FlaskConical } from '@lucide/svelte';

  import * as Card from '$lib/shadcn/components/ui/card';
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
  }

  let { hasGroundMolecule, hasExcitedMolecule, hasSolvent }: Props = $props();

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
  ]);

  const completedCount = $derived(items.filter((i) => i.completed).length);
  const allComplete = $derived(completedCount === items.length);
</script>

<Card.Root class="w-full max-w-xl">
  <Card.Header class="flex items-center gap-6">
    <Card.Title class="min-w-fit">Setup Required</Card.Title>
    <Card.Description>
      Complete the following steps to generate scattering signals
    </Card.Description>
    <Card.Action class="self-center">
      <FlaskConical class="h-8 w-8 text-primary" />
    </Card.Action>
  </Card.Header>

  <Card.Content class="space-y-4">
    <div class="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        class="h-full bg-primary transition-all duration-300 ease-out"
        style="width: {(completedCount / items.length) * 100}%"
      ></div>
    </div>

    <p class="text-right text-xs text-muted-foreground">
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
        class="rounded-md bg-primary/10 p-3 text-center text-sm text-primary"
      >
        All set! Your scattering signals should now be displayed.
      </div>
    {:else}
      <p class="text-center text-xs text-muted-foreground">
        Use the configuration panels on the right to complete setup
      </p>
    {/if}
  </Card.Content>
</Card.Root>
