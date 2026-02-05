<script lang="ts">
  import type { Molecule } from '../types';

  import * as Card from '$shadcn/ui/card';

  interface Props {
    ground?: Molecule | null;
    excited?: Molecule | null;
  }

  let { ground = null, excited = null }: Props = $props();
</script>

<Card.Root>
  <Card.Header class="pb-4">
    <Card.Title class="text-lg">Selected Molecules</Card.Title>
    <Card.Description
      >Your current ground and excited state selection.</Card.Description
    >
  </Card.Header>
  <Card.Content>
    <div class="flex flex-wrap gap-6">
      <!-- Ground State -->
      <div class="min-w-40 flex-1 space-y-2">
        <div class="flex items-center gap-2">
          <div
            class="h-2 w-2 rounded-full bg-secondary-foreground/60"
            aria-hidden="true"
          ></div>
          <span class="text-sm font-medium text-muted-foreground"
            >Ground State</span
          >
        </div>
        <div
          class="flex h-12 flex-col justify-center border-l-2 pl-4 {ground
            ? 'border-secondary'
            : 'border-border'}"
        >
          {#if ground}
            <p class="leading-tight font-medium">
              {ground.moleculeName}
            </p>
            <p class="text-sm leading-tight text-muted-foreground">
              {ground.filename}
            </p>
          {:else}
            <p class="text-sm text-muted-foreground">No molecule selected</p>
          {/if}
        </div>
      </div>

      <!-- Excited State -->
      <div class="min-w-40 flex-1 space-y-2">
        <div class="flex items-center gap-2">
          <div class="h-2 w-2 rounded-full bg-primary" aria-hidden="true"></div>
          <span class="text-sm font-medium text-muted-foreground"
            >Excited State</span
          >
        </div>
        <div
          class="flex h-12 flex-col justify-center border-l-2 pl-4 {excited
            ? 'border-primary'
            : 'border-border'}"
        >
          {#if excited}
            <p class="leading-tight font-medium">
              {excited.moleculeName}
            </p>
            <p class="text-sm leading-tight text-muted-foreground">
              {excited.filename}
            </p>
          {:else}
            <p class="text-sm text-muted-foreground">No molecule selected</p>
          {/if}
        </div>
      </div>
    </div>
  </Card.Content>
</Card.Root>
