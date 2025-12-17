<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import * as Card from '$shadcn/ui/card/index.js';

  import ProbeSetup from './components/ProbeSetup.svelte';

  let { probe = $bindable(), short }: ComponentProps<typeof ProbeSetup> = $props();
</script>

<Card.Root>
  <Card.Content>
    <ProbeSetup bind:probe {short} />
  </Card.Content>
</Card.Root>
