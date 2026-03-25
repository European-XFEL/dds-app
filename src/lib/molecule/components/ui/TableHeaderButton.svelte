<script lang="ts">
  import { ChevronUp } from '@lucide/svelte';
  import ArrowUpDown from '@lucide/svelte/icons/arrow-up-down';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import type { Column } from '@tanstack/table-core';

  import type { ComponentProps } from 'svelte';

  import { Button } from '$lib/shadcn/components/ui/button';

  type Props = ComponentProps<typeof Button> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    column: Column<any, any>;
    text?: string;
  };

  let { column, text, ...restProps }: Props = $props();
</script>

<div class="flex items-center gap-2">
  <Button {...restProps}>
    <span>
      {#if column.getIsSorted() === 'asc'}
        <ChevronDown class="inline-block h-4 w-4" />
      {:else if column.getIsSorted() === 'desc'}
        <ChevronUp class="inline-block h-4 w-4" />
      {:else}
        <ArrowUpDown class="inline-block h-4 w-4" />
      {/if}
    </span>
  </Button>

  <p>
    {text}
  </p>
</div>
