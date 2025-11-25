<script lang="ts">
	import SharedCard from '$components/ui/sample-shared-card.svelte';
	import MoleculeCard from '$components/ui/molecule-card.svelte';
	import { appState } from '../../../lib/state.svelte';

	let { sample, molecules, solvents } = $state(appState);
</script>

<div class="grid gap-4 md:grid-rows-1">
	<div>
		<SharedCard {solvents} {sample} />
	</div>
	<div class="grid gap-4 md:grid-cols-2">
		<MoleculeCard sample_type="ground" {molecules} bind:molecule={sample.molecule_ground} />
		<MoleculeCard sample_type="excited" {molecules} bind:molecule={sample.molecule_excited} />
	</div>
</div>
