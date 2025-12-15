<script lang="ts">
  import * as Card from '$shadcn/ui/card/index.js';

  import { useSimulationState } from '$lib/state.svelte';

  import DetectorInfo from './components/DetectorInfo.svelte';

  const simulation = useSimulationState();

  let { short = false } = $props();
</script>

<Card.Root class="grow">
  <Card.Content class="space-y-6">
    <DetectorInfo detector={simulation.detector} wavelength={simulation.probe.wavelength} {short} />
  </Card.Content>
</Card.Root>
