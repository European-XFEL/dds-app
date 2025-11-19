<script lang="ts">
	import Sample from '$components/ui/sample.svelte';
	import type { SampleChangeDetail, SampleUploadDetail } from '$lib/types/sample';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const sampleDefinitions = $state([
		{ id: 'sample-a', name: 'Sample A' },
		{ id: 'sample-b', name: 'Sample B' }
	]);

	const samples = $state(new Map<string, SampleChangeDetail>());
	const pendingUploads = $state(new Set<string>());

	let knownSamples = $state(
		sampleDefinitions.map((definition) => ({ id: definition.id, name: definition.name }))
	);

	$effect(() => {
		knownSamples = sampleDefinitions.map((definition) => {
			const current = samples.get(definition.id);
			return {
				id: definition.id,
				name: current?.rawSampleName ?? current?.sampleName ?? definition.name
			};
		});
	});

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
				knownSamples={knownSamples}
				onchange={handleSampleChange}
				onupload={handleSampleUpload}
			/>
		{/each}
	</div>
</div>
