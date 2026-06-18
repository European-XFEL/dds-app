<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import CardWrapper from '$lib/ui/CardWrapper.svelte';

  import DetectorSetup from './ui/DetectorSetup.svelte';

  let {
    distance = $bindable(),
    beamCenter = $bindable(),
  }: ComponentProps<typeof DetectorSetup> = $props();
</script>

<CardWrapper>
  <DetectorSetup bind:distance bind:beamCenter />
</CardWrapper>
