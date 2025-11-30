<script lang="ts">
  import { appState } from '$lib/state.svelte';

  import DetectorCard from '$components/ui/detector/detector-card.svelte';

  let { qRange: q_range, detector } = $state(appState);

  let { short = false } = $props();
</script>

<DetectorCard bind:detector bind:q_range {short} />
