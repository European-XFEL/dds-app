<script lang="ts">
  import { BadgeAlert } from '@lucide/svelte';

  import * as Tooltip from '$shadcn/ui/tooltip/index.js';

  interface Props {
    text: string;
  }

  let { text }: Props = $props();
</script>

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger><BadgeAlert size={16} class="text-amber-500" /></Tooltip.Trigger>
    <Tooltip.Content class="w-fit max-w-xs">
      {text}
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
