<script lang="ts">
	import { Upload } from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { SampleDetails } from '$lib/types';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let {
		title,
		molecules,
		molecule = $bindable()
	}: {
		title: string;
		molecules: { id: string; name: string; content: string }[];
		molecule: SampleDetails['groundMolecule'] | SampleDetails['excitedMolecule'];
	} = $props();

	const triggerMolecule = $derived(
		molecules.find((m) => m.id === molecule.id)?.name ?? 'Select a molecule'
	);
</script>

<Card.Root class="grid w-full gap-6">
	<Card.Header>
		<Card.Title>{title}</Card.Title>
	</Card.Header>

	<Card.Content class="grid gap-6">
		<div class="flex flex-col gap-2">
			<Label>Sample molecule</Label>
			<div class="flex flex-col items-stretch gap-2 sm:flex-row">
				<Select.Root
					name="molecule"
					type="single"
					bind:value={
						() => molecule.id,
						(v) => {
							molecule = molecules.find((m) => m.id === v) ?? molecule;
						}
					}
				>
					<Select.Trigger class="w-full justify-between">
						{triggerMolecule}
					</Select.Trigger>
					<Select.Content class="w-(--radix-select-trigger-width)">
						{#each molecules as { id, name }}
							<Select.Item value={id} label={name}>
								{name}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<Button type="button" variant="outline" class="whitespace-nowrap" disabled>
					<Upload class="mr-2 h-4 w-4" /> Upload file
				</Button>
			</div>
			<div class="h-60 w-full border border-muted/50">
				{#await import('./molecule-viewer.svelte')}
					<Skeleton class="h-full w-full" />
				{:then { default: MoleculeViewer }}
					<MoleculeViewer {molecule} />
				{/await}
			</div>
		</div>
	</Card.Content>
</Card.Root>
