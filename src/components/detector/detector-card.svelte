<script lang="ts">
  import DetectorCard from '$components/ui/detector/detector-card.svelte';
  import { appState } from '$lib/state.svelte';

  let { q_vals, detector } = $state(appState);

  let { short = false } = $props();
</script>

<DetectorCard bind:detector bind:q_vals {short} />
