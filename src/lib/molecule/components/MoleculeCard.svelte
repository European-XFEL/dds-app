<script lang="ts">
  import * as Card from '$shadcn/ui/card/index.js';
  import * as Field from '$shadcn/ui/field/index.js';
  import * as Select from '$shadcn/ui/select/index.js';
  import { Spinner } from '$shadcn/ui/spinner';

  import type { listMolecules } from '$lib/data/api';
  import type { Sample } from '$lib/types';

  type Molecules = Awaited<ReturnType<typeof listMolecules>>;

  type Props = {
    molecules: Molecules;
    ground?: Sample['ground'];
    excited?: Sample['excited'];
    loading?: boolean;
  };

  let {
    molecules,
    ground = $bindable(),
    excited = $bindable(),
    loading = false,
  }: Props = $props();

  let moleculesNames = $derived(new Set(molecules?.map((m) => m.moleculeName)));

  let moleculeName = $state<string>();

  let moleculeStates = $derived.by(() => {
    if (!molecules) return [];
    return molecules.filter((m) => m.moleculeName === moleculeName);
  });

  // Local state for select values (IDs)
  let groundId = $state<string>();
  let excitedId = $state<string>();

  // Auto-select ground/excited when molecule changes
  $effect(() => {
    if (!moleculeStates.length) return;
    const g = moleculeStates.find((s) => s.state === 0);
    const e = moleculeStates.find((s) => s.state === 1);
    if (g) {
      groundId = g.id;
    }
    if (e) {
      excitedId = e.id;
    }
  });

  function onMoleculeChange(name: string) {
    moleculeName = name;
    const states = molecules?.filter((m) => m.moleculeName === name) ?? [];
    const g = states.find((s) => s.state === 0);
    const e = states.find((s) => s.state === 1);
    if (g) {
      groundId = g.id;
      ground = g;
    } else {
      groundId = undefined;
      ground = null;
    }
    if (e) {
      excitedId = e.id;
      excited = e;
    } else {
      excitedId = undefined;
      excited = null;
    }
  }

  function onGroundChange(id: string) {
    groundId = id;
    ground = moleculeStates.find((s) => s.id === id) ?? null;
  }

  function onExcitedChange(id: string) {
    excitedId = id;
    excited = moleculeStates.find((s) => s.id === id) ?? null;
  }
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>
      Molecule Selection
      {#if loading}
        <div class="absolute ml-2 inline-block">
          <Spinner />
        </div>
      {/if}
    </Card.Title>
  </Card.Header>

  <Card.Content>
    <form>
      <Field.Group>
        <Field.Set>
          <!-- <Field.Description>...</Field.Description> -->
          <Field.Group>
            <Field.Field>
              <Field.Label>Molecule</Field.Label>
              <Select.Root
                name="molecule"
                type="single"
                disabled={loading}
                value={moleculeName}
                onValueChange={onMoleculeChange}
              >
                <Select.Trigger class="w-full justify-between">
                  {moleculeName || 'Select molecule'}
                </Select.Trigger>
                <Select.Content class="w-(--radix-select-trigger-width)">
                  {#each moleculesNames as moleculeName (moleculeName)}
                    <Select.Item value={moleculeName} label={moleculeName}>
                      {moleculeName}
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
            </Field.Field>
          </Field.Group>
        </Field.Set>

        <Field.Set class="flex flex-row gap-4">
          <Field.Field>
            <Field.Label>Ground State</Field.Label>
            <Select.Root
              type="single"
              value={groundId}
              onValueChange={onGroundChange}
            >
              <Select.Trigger>
                {ground ? `${ground.filename}` : 'Select ground state'}
              </Select.Trigger>
              <Select.Content>
                {#each moleculeStates as state (state.id)}
                  <Select.Item value={state.id} label={`${state.moleculeName}`}>
                    {state.filename}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </Field.Field>
          <Field.Field>
            <Field.Label>Excited State</Field.Label>
            <Select.Root
              type="single"
              value={excitedId}
              onValueChange={onExcitedChange}
            >
              <Select.Trigger>
                {excited ? `${excited.filename}` : 'Select excited state'}
              </Select.Trigger>
              <Select.Content>
                {#each moleculeStates as state (state.id)}
                  <Select.Item value={state.id} label={`${state.moleculeName}`}>
                    {state.filename}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </Field.Field>
        </Field.Set>
      </Field.Group>
      <!-- <Field.Field>
          <Field.Content class="items-stretch gap-2 sm:flex-row">
          </Field.Content>
        </Field.Field> -->
      <!-- {#if vizCollapseShow}
        <Collapsible.Root bind:open={vizOpen} class="w-full">
          <Collapsible.Trigger
            class="mb-2 w-full rounded-md bg-secondary/10 px-3 py-2 text-sm font-medium hover:bg-secondary/20"
          >
            {#if vizOpen}
              Hide Molecule Visualization
            {:else}
              Show Molecule Visualization
            {/if}
          </Collapsible.Trigger>
          <Collapsible.Content class="w-full">
            <MoleculeViz {molecule} />
          </Collapsible.Content>
        </Collapsible.Root>
      {:else if vizOpen}
        <MoleculeViz {molecule} />
      {/if} -->
    </form>
  </Card.Content>
</Card.Root>
