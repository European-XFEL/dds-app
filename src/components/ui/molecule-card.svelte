<script lang="ts">
	import { Upload } from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import type { SampleDetails } from '$lib/types';

	type Props = {
		sample_type: 'ground' | 'excited';
		molecules: string[];
		molecule: string;
	};

	let {
		sample_type = $bindable<'ground' | 'excited'>('ground'),
		molecules = $bindable<string[]>(),
		molecule = $bindable<string>()
	}: Props = $props();

	const title = $derived(sample_type === 'ground' ? 'Ground State Sample' : 'Excited State Sample');

	const triggerMolecule = $derived(molecules.find((m) => m === molecule) ?? 'Select a molecule');
</script>

<Card.Root class="grid w-full gap-6">
	<Card.Header>
		<Card.Title>{title}</Card.Title>
	</Card.Header>

	<Card.Content class="grid gap-6">
		<div class="flex flex-col gap-2">
			<Label>Sample molecule</Label>
			<div class="flex flex-col items-stretch gap-2 sm:flex-row">
				<Select.Root type="single" bind:value={molecule} name="molecule">
					<Select.Trigger class="w-full justify-between">
						{triggerMolecule}
					</Select.Trigger>
					<Select.Content class="w-(--radix-select-trigger-width)">
						{#each molecules as label}
							<Select.Item value={label} {label}>
								{label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<Button type="button" variant="outline" class="whitespace-nowrap">
					<Upload class="mr-2 h-4 w-4" /> Upload file
				</Button>
			</div>
			<div class="flex items-center space-x-4">
				<!-- Placeholder for 3Dmol.js viewer -->
				<Skeleton class="h-[200px] w-full" />
			</div>
		</div>
	</Card.Content>
</Card.Root>
