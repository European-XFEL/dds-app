<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
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

	const {
		sample = $bindable(),
		molecules = $bindable(),
		solvents = $bindable(),
		isUnique = true
	}: Props = $props();

	const nameIsMeaningful = $derived(sample.name.length > 0);
	const isNameValid = $derived(nameIsMeaningful && isUnique);
	const nameError = $derived(
		!nameIsMeaningful ? 'Enter a sample name' : isUnique ? '' : 'Name must be unique'
	);
	const hasNameError = $derived(Boolean(nameError));

	const triggerMolecule = $derived(
		molecules.find((m) => m === sample.molecule) ?? 'Select a molecule'
	);

	const triggerSolvent = $derived(solvents.find((s) => s === sample.solvent) ?? 'Select a solvent');

	const triggerLabel = $derived(sample.name.length ? sample.name : 'Configure sample');
</script>

<Popover.Root>
	<Popover.Trigger class="w-full">
		<Button type="button" variant="outline" class="w-full justify-between">
			<span>{triggerLabel}</span>
			<span class="text-sm text-muted-foreground">{sample.concentration}%</span>
		</Button>
	</Popover.Trigger>
	<Popover.Content align="start" class="w-md">
		<div class="grid gap-6">
			<div class="grid gap-1">
				<p class="text-sm leading-none font-medium text-muted-foreground">Sample overview</p>
				<h3 class="text-lg leading-tight font-semibold">{sample.name || 'New sample'}</h3>
				<p class="text-sm text-muted-foreground">
					Configure the source, solvent, and concentration for this sample.
				</p>
			</div>

			<div class="grid gap-2">
				<Label>Sample name</Label>
				<Input
					bind:value={sample.name}
					placeholder="Enter a descriptive name"
					aria-invalid={!isNameValid}
				/>
				{#if hasNameError}
					<p class="text-sm text-destructive">
						{nameError}
					</p>
				{/if}
			</div>

			<div class="flex flex-col gap-2">
				<Label>Sample molecule</Label>
				<div class="flex flex-col items-stretch gap-2 sm:flex-row">
					<Select.Root type="single" bind:value={sample.molecule} name="molecule">
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
		</div>

		<div class="mt-4 grid gap-1 border-t pt-3 text-sm text-muted-foreground">
			<span>Molecule: {sample.molecule}</span>
			<span>Solvent: {sample.solvent}</span>
			<span>Concentration: {sample.concentration}%</span>
		</div>
	</Popover.Content>
</Popover.Root>
