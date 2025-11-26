<script lang="ts">
  import { page } from '$app/state';

  import { appState } from '$lib/state.svelte';

  import { MoleculeSharedCard } from '$components/ui/sample';

  let { sample } = $state(appState);

  let { short = false } = $props();
</script>

<MoleculeSharedCard solvents={page.data.solvents} bind:sample {short} />
