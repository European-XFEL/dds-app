<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { SampleDetails } from '$lib/types';

	let {
		solvents,
		sample = $bindable()
	}: {
		solvents: { id: string; name: string }[];
		sample: SampleDetails;
	} = $props();

	const triggerSolvent = $derived(
		solvents.find((s) => s.id === sample.solvent.id)?.name ?? 'Select a solvent'
	);
</script>

<Card.Root class="grid w-full gap-6">
	<Card.Header>
		<Card.Title>Sample Parameters</Card.Title>
		<Card.Description>Parameters shared by both ground and excited states.</Card.Description>
	</Card.Header>

	<Card.Content class="grid gap-6">
		<div class="grid gap-2">
			<Label>Solvent</Label>
			<Select.Root
				type="single"
				name="solvent"
				bind:value={
					() => sample.solvent.id,
					(v) => (
						(sample.solvent.id = v),
						(sample.solvent.name = solvents.find((s) => s.id === v)?.name ?? sample.solvent.name)
					)
				}
			>
				<Select.Trigger class="w-full justify-between">
					{triggerSolvent}
				</Select.Trigger>
				<Select.Content class="w-(--radix-select-trigger-width)">
					{#each solvents as { id, name }}
						<Select.Item value={id} label={name}>
							{name}
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
