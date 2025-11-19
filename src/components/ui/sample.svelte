<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Upload } from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { SampleChangeDetail, SampleUploadDetail } from '$lib/types/sample';

	type Option = {
		label: string;
		value: string;
	};

	type KnownSample = {
		id: string;
		name: string;
	};

	const defaultMolecules: Option[] = [
		{ value: 'au2l2-a', label: 'Au2L2-a' },
		{ value: 'au2l2-b', label: 'Au2L2-b' },
		{ value: 'au2l2-c', label: 'Au2L2-c' }
	];

	const defaultSolvents: Option[] = [
		{ value: 'water', label: 'Water' },
		{ value: 'ethanol', label: 'Ethanol' },
		{ value: 'acetonitrile', label: 'Acetonitrile' }
	];

	const dispatch = createEventDispatcher<{
		change: SampleChangeDetail;
		upload: SampleUploadDetail;
	}>();

	function generateSampleId() {
		if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
			return crypto.randomUUID();
		}
		return `sample-${Math.random().toString(36).slice(2, 9)}`;
	}

	function normalizeName(name: string) {
		return name.trim();
	}

	function isNameUniqueFor(
		snapshot: Map<string, string>,
		targetId: string,
		normalizedName: string
	) {
		if (!normalizedName.length) {
			return false;
		}
		let duplicates = 0;
		for (const [id, name] of snapshot.entries()) {
			if (id === targetId) continue;
			if (name.toLowerCase() === normalizedName.toLowerCase()) {
				duplicates += 1;
				if (duplicates > 0) {
					return false;
				}
			}
		}
		return true;
	}

	type SampleProps = {
		sample_name?: string;
		sampleId?: string;
		molecules?: Option[];
		solvents?: Option[];
		initialMolecule?: string;
		initialSolvent?: string;
		initialConcentration?: number;
		knownSamples?: KnownSample[];
		sampleName?: string;
		selectedMolecule?: string;
		selectedSolvent?: string;
		concentration?: number;
	};

	let {
		sample_name = 'Sample',
		sampleId = generateSampleId(),
		molecules = defaultMolecules,
		solvents = defaultSolvents,
		initialMolecule = molecules[0]?.value ?? '',
		initialSolvent = solvents[0]?.value ?? '',
		initialConcentration = 50,
		knownSamples = [],
		sampleName = $bindable(
			(() => {
				const normalized = normalizeName(sample_name);
				return normalized.length ? normalized : 'Sample';
			})()
		),
		selectedMolecule = $bindable(initialMolecule),
		selectedSolvent = $bindable(initialSolvent),
		concentration = $bindable(initialConcentration)
	}: SampleProps = $props();

	const normalizedSampleName = $derived(normalizeName(sampleName));
	const displayName = $derived(normalizedSampleName.length ? normalizedSampleName : 'Untitled sample');

	let nameIsUnique = $state(true);

	$effect(() => {
		const snapshot = new Map<string, string>();
		for (const sample of knownSamples) {
			if (!sample) continue;
			snapshot.set(sample.id, normalizeName(sample.name));
		}
		if (!snapshot.has(sampleId)) {
			snapshot.set(sampleId, normalizedSampleName);
		}
		nameIsUnique = isNameUniqueFor(snapshot, sampleId, normalizedSampleName);
	});

	const nameIsMeaningful = $derived(normalizedSampleName.length > 0);
	const isNameValid = $derived(nameIsMeaningful && nameIsUnique);
	const nameError = $derived(
		!nameIsMeaningful ? 'Enter a sample name' : nameIsUnique ? '' : 'Name must be unique'
	);
	const hasNameError = $derived(Boolean(nameError));
	const moleculeTrigger = $derived(
		molecules.find((option: Option) => option.value === selectedMolecule)?.label ?? 'Select a molecule'
	);

	const solventTrigger = $derived(
		solvents.find((option: Option) => option.value === selectedSolvent)?.label ?? 'Select a solvent'
	);

	const componentId = `sample-${sampleId}`;
	const nameFieldId = `${componentId}-name`;
	const moleculeFieldId = `${componentId}-molecule`;
	const solventFieldId = `${componentId}-solvent`;
	const concentrationFieldId = `${componentId}-concentration`;
	const nameErrorId = `${componentId}-name-error`;

	function handleUploadRequest() {
		dispatch('upload', { sampleId });
	}

	$effect(() => {
		const normalized = normalizedSampleName;

		dispatch('change', {
			concentration,
			isNameValid,
			molecule: selectedMolecule,
			sampleId,
			sampleName: normalized,
			solvent: selectedSolvent,
			rawSampleName: sampleName
		});
	});
</script>

<Card.Root class="grid w-full gap-6">
	<Card.Header>
		<Card.Title>{displayName}</Card.Title>
		<Card.Description>
			Configure the source, solvent, and concentration for this sample.
		</Card.Description>
	</Card.Header>

	<Card.Content class="grid gap-6">
		<div class="grid gap-2">
			<Label for={nameFieldId}>Sample name</Label>
			<Input
				id={nameFieldId}
				placeholder="Enter a descriptive name"
				bind:value={sampleName}
				aria-invalid={!isNameValid}
				aria-describedby={hasNameError ? nameErrorId : undefined}
			/>
			{#if hasNameError}
				<p class="text-destructive text-sm" id={nameErrorId}>
					{nameError}
				</p>
			{/if}
		</div>

		<div class="flex flex-col gap-2">
			<Label for={moleculeFieldId}>Sample molecule</Label>
			<div class="flex flex-col items-stretch gap-2 sm:flex-row">
				<Select.Root type="single" bind:value={selectedMolecule} name="molecule">
					<Select.Trigger id={moleculeFieldId} class="w-full justify-between">
						{moleculeTrigger}
					</Select.Trigger>
					<Select.Content class="w-(--radix-select-trigger-width)">
						{#each molecules as option (option.value)}
							<Select.Item value={option.value} label={option.label}>
								{option.label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<Button type="button" variant="outline" class="whitespace-nowrap" onclick={handleUploadRequest}>
					<Upload class="mr-2 h-4 w-4" /> Upload file
				</Button>
			</div>
		</div>

		<div class="grid gap-2">
			<Label for={solventFieldId}>Solvent</Label>
			<Select.Root type="single" bind:value={selectedSolvent} name="solvent">
				<Select.Trigger id={solventFieldId} class="w-full justify-between">
					{solventTrigger}
				</Select.Trigger>
				<Select.Content class="w-(--radix-select-trigger-width)">
					{#each solvents as option (option.value)}
						<Select.Item value={option.value} label={option.label}>
							{option.label}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="grid gap-2">
			<div class="flex items-center justify-between">
				<Label for={concentrationFieldId}>Concentration</Label>
				<span class="text-muted-foreground text-sm">{concentration}%</span>
			</div>
			<Input
				id={concentrationFieldId}
				type="range"
				min="0"
				max="100"
				step="1"
				value={concentration}
				oninput={(event) => {
					const target = event.currentTarget as HTMLInputElement;
					const nextValue = Number(target.value);
					concentration = Number.isNaN(nextValue) ? concentration : nextValue;
				}}
			/>
		</div>
	</Card.Content>

	<Card.Footer class="grid gap-1 text-sm text-muted-foreground">
		<span>Molecule: {moleculeTrigger}</span>
		<span>Solvent: {solventTrigger}</span>
		<span>Concentration: {concentration}%</span>
	</Card.Footer>
</Card.Root>
