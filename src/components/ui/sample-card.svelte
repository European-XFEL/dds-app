<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Upload } from '@lucide/svelte';

	import type { SampleDetails } from '$lib/types';

	type Props = {
		sample: SampleDetails;
		molecules: string[];
		solvents: string[];
		isUnique?: boolean;
	};

	const { sample = $bindable(), molecules = $bindable(), solvents = $bindable() }: Props = $props();

	const triggerMoleculeGround = $derived(
		molecules.find((m) => m === sample.molecule_ground) ?? 'Select a molecule'
	);

	const triggerMoleculeExcited = $derived(
		molecules.find((m) => m === sample.molecule_excited) ?? 'Select a molecule'
	);

	const triggerSolvent = $derived(solvents.find((s) => s === sample.solvent) ?? 'Select a solvent');
</script>

<Card.Root class="grid w-full gap-6">
	<Card.Header>
		<Card.Title>Sample Parameters</Card.Title>
		<Card.Description>Parameters shared by both ground and excited states.</Card.Description>
	</Card.Header>

	<Card.Content class="grid gap-6">
		<div class="flex flex-col gap-2">
			<Label>Ground molecule</Label>
			<div class="flex flex-col items-stretch gap-2 sm:flex-row">
				<Select.Root type="single" bind:value={sample.molecule_ground} name="molecule">
					<Select.Trigger class="w-full justify-between">
						{triggerMoleculeGround}
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
		</div>

		<div class="flex flex-col gap-2">
			<Label>Excited molecule</Label>
			<div class="flex flex-col items-stretch gap-2 sm:flex-row">
				<Select.Root type="single" bind:value={sample.molecule_excited} name="molecule">
					<Select.Trigger class="w-full justify-between">
						{triggerMoleculeExcited}
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
		</div>

		<div class="grid gap-2">
			<Label>Solvent</Label>
			<Select.Root type="single" bind:value={sample.solvent} name="solvent">
				<Select.Trigger class="w-full justify-between">{triggerSolvent}</Select.Trigger>
				<Select.Content class="w-(--radix-select-trigger-width)">
					{#each solvents as label}
						<Select.Item value={label} {label}>
							{label}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="grid gap-2">
			<div class="flex items-center justify-between">
				<Label>Concentration</Label>
				<span class="text-sm text-muted-foreground">{sample.concentration}%</span>
			</div>
			<Input
				type="range"
				min="0"
				max="100"
				step="0.1"
				value={sample.concentration}
				oninput={(event) => {
					const target = event.currentTarget as HTMLInputElement;
					const nextValue = Number(target.value);
					sample.concentration = Number.isNaN(nextValue) ? sample.concentration : nextValue;
				}}
			/>
		</div>
	</Card.Content>
</Card.Root>
