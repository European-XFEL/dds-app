<script lang="ts">
	import type { PageProps } from './$types';
	import { MoleculeSharedCard, MoleculeCard } from '$components/sample';
	import { appState } from '../../../lib/state.svelte';

	let { sample } = $state(appState);

	let { data }: PageProps = $props();
</script>

<div class="grid gap-4 md:grid-rows-1">
	<div>
		<MoleculeSharedCard solvents={data.solvents} bind:sample />
	</div>
	<div class="grid gap-4 md:grid-cols-2">
		<MoleculeCard
			title="Ground Molecule"
			molecules={data.molecules}
			bind:molecule={sample.groundMolecule}
		/>
		<MoleculeCard
			title="Excited Molecule"
			molecules={data.molecules}
			bind:molecule={sample.excitedMolecule}
		/>
	</div>
</div>
