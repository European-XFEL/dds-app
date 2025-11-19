<script lang="ts">
	import { setContext } from 'svelte';
	import Sample from '$components/ui/sample.svelte';
	import { createSampleRegistry, sampleRegistryKey } from '$lib/sample-registry';
	import type { SampleChangeDetail, SampleUploadDetail } from '$lib/types/sample';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const registry = createSampleRegistry();
	setContext(sampleRegistryKey, registry);

	const sampleDefinitions = $state([
		{ id: 'sample-a', name: 'Sample A' },
		{ id: 'sample-b', name: 'Sample B' }
	]);

	const samples = $state(new Map<string, SampleChangeDetail>());
	const pendingUploads = $state(new Set<string>());

	function handleSampleChange(detail: SampleChangeDetail) {
		samples.set(detail.sampleId, detail);
	}

	function handleSampleUpload(detail: SampleUploadDetail) {
		pendingUploads.add(detail.sampleId);
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<div class="grid gap-4 md:grid-cols-2">
		{#each sampleDefinitions as sample (sample.id)}
			<Sample
				sampleId={sample.id}
				sample_name={sample.name}
				on:change={(event) => handleSampleChange(event.detail)}
				on:upload={(event) => handleSampleUpload(event.detail)}
			/>
		{/each}
	</div>
</div>
