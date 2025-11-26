<script lang="ts">
	import { page } from '$app/state';

	import { MoleculeCard } from '$components/ui/sample';
	import { appState } from '$lib/state.svelte';

	let { sample } = $state(appState);
</script>

<MoleculeCard
	title="Ground Molecule"
	molecules={page.data.molecules}
	bind:molecule={sample.ground}
/>
