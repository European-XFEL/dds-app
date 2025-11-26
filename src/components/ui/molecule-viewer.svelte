<script lang="ts">
	import { onMount } from 'svelte';
	import type { GLViewer } from '3dmol';
	type ThreeDMolModule = typeof import('3dmol');
	import type { SampleDetails } from '$lib/types';

	let {
		molecule
	}: {
		molecule: SampleDetails['groundMolecule'] | SampleDetails['excitedMolecule'];
	} = $props();

	let container: HTMLDivElement | null = null;
	let viewer: GLViewer | null = null;
	let _3dmol: ThreeDMolModule | null = null;
	let pendingAbort: AbortController | null = null;
	let teardown = false;
	let lastLoadedMoleculeID: string | null = null;
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(() => {
		let cancelled = false;

		const initialise = async () => {
			try {
				loading = true;
				error = null;
				_3dmol = await import('3dmol');
				if (!_3dmol?.GLViewer) throw new Error('3Dmol GLViewer is unavailable');
				if (!container) throw new Error('Viewer container missing');

				viewer = new _3dmol.GLViewer(container, {
					backgroundColor: '#FFFFFF',
					antialias: true
				});

				await loadStructure(molecule.content);
			} catch (err) {
				if (cancelled) return;
				error = err instanceof Error ? err.message : 'Unable to initialise molecule viewer';
			} finally {
				if (!cancelled && !viewer) {
					loading = false;
				}
			}
		};

		void initialise();

		return () => {
			cancelled = true;
			teardown = true;
			pendingAbort?.abort();
			pendingAbort = null;
			viewer = null;
		};
	});

	$effect(() => {
		let id = molecule.id ?? null;
		$inspect({ id });
		if (!viewer || !id || id === lastLoadedMoleculeID) return;
		void loadStructure(molecule.content);
	});

	async function loadStructure(xyz: string) {
		if (!viewer || !_3dmol) return;
		loading = true;
		error = null;

		pendingAbort?.abort();
		const controller = new AbortController();
		pendingAbort = controller;

		try {
			viewer.removeAllModels();
			viewer.addModel(xyz, 'xyz');
			viewer.setStyle({}, { stick: {} });
			// viewer.spin(true);
			viewer.zoomTo();
			viewer.render();
		} catch (err) {
			if (err instanceof DOMException && err.name === 'AbortError') {
				return;
			}
			error = err instanceof Error ? err.message : 'Unable to load molecule data';
		} finally {
			if (pendingAbort === controller) pendingAbort = null;
			if (!teardown) {
				loading = false;
			}
		}
	}
</script>

<div class="viewer-shell" style={`--viewer-height: 240px`}>
	<div bind:this={container} class="viewer" aria-label="3D molecule viewer" role="img"></div>
	{#if loading}
		<p class="status">Loading viewer…</p>
	{:else if error}
		<p class="status error">{error}</p>
	{/if}
</div>

<style>
	.viewer-shell {
		width: 100%;
		min-height: var(--viewer-height, 240px);
		position: relative;
		/* border-radius: 1rem; */
		overflow: hidden;
		/* background: radial-gradient(circle at top, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.0)); */
		box-shadow: 0 20px 45px rgba(255, 255, 255, 0.35);
		padding: 0.75rem;
		box-sizing: border-box;
	}

	.viewer {
		width: 100%;
		height: calc(var(--viewer-height, 240px) - 1.5rem);
		/* border-radius: 0.75rem; */
	}

	.status {
		position: absolute;
		left: 1rem;
		bottom: 1rem;
		margin: 0;
		font-size: 0.9rem;
		color: #cbd5f5;
	}

	.status.error {
		color: #f87171;
	}
</style>
