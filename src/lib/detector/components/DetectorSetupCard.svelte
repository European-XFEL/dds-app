<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import * as Card from '$shadcn/ui/card/index.js';

  import DetectorSetup from './ui/DetectorSetup.svelte';

  let {
    distance = $bindable(),
    beamCenter = $bindable(),
  }: ComponentProps<typeof DetectorSetup> = $props();
</script>

<Card.Root>
  <Card.Content>
    <DetectorSetup bind:distance bind:beamCenter />
  </Card.Content>
</Card.Root>
