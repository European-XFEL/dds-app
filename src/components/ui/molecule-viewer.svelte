<script lang="ts">
	import { onMount } from 'svelte';

	import * as TDmol from '3dmol';

	import type { SampleDetails } from '$lib/types';

	let {
		molecule
	}: {
		molecule: SampleDetails['groundMolecule'] | SampleDetails['excitedMolecule'];
	} = $props();

	let container: HTMLDivElement | null = null;

	let viewer: TDmol.GLViewer | null = null;

	let config = { backgroundColor: 'white', antialias: true };

	onMount(() => {
		viewer = TDmol.createViewer(container, config);
	});

	$effect(() => {
		if (!viewer || !molecule?.content) return;
		let xyz = molecule.content;
		viewer.removeAllModels();
		viewer.addModel(xyz, 'xyz');
		viewer.setStyle({}, { stick: {} });
		viewer.zoomTo();
		viewer.render();
	});
</script>

<div bind:this={container} class="mol-container"></div>

<style>
	.mol-container {
		width: 100%;
		height: 100%;
		position: relative;
	}
</style>
