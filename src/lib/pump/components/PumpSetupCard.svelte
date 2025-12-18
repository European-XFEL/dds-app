<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import * as Card from '$shadcn/ui/card/index.js';

  import PumpSetup from './PumpSetup.svelte';

  let { pump = $bindable() }: ComponentProps<typeof PumpSetup> = $props();
</script>

<Card.Root>
  <Card.Content>
    <PumpSetup bind:pump />
  </Card.Content>
</Card.Root>
