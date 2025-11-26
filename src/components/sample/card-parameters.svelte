<script lang="ts">
	import { page } from '$app/state';

	import { MoleculeSharedCard } from '$components/ui/sample';
	import { appState } from '$lib/state.svelte';

	let { sample } = $state(appState);
</script>

<MoleculeSharedCard solvents={page.data.solvents} bind:sample />
