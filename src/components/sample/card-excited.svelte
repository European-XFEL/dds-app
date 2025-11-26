<script lang="ts">
  import { page } from '$app/state';

  import { appState } from '$lib/state.svelte';

  import { MoleculeCard } from '$components/ui/sample';

  let { sample } = $state(appState);
</script>

<MoleculeCard
  title="Excited Molecule"
  molecules={page.data.molecules}
  bind:molecule={sample.excited}
/>
