<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import * as Card from '$shadcn/ui/card/index.js';

  import DetectorSetup from './components/DetectorSetup.svelte';

  let { distance = $bindable(), beamCenter = $bindable() }: ComponentProps<typeof DetectorSetup> =
    $props();
</script>

<Card.Root class="flex-1 min-w-sm">
  <Card.Content>
    <DetectorSetup bind:distance bind:beamCenter />
  </Card.Content>
</Card.Root>
