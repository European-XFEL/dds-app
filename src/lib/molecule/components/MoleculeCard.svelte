<script lang="ts">
  import * as Card from '$shadcn/ui/card/index.js';
  import * as Field from '$shadcn/ui/field/index.js';
  import * as Select from '$shadcn/ui/select/index.js';
  import { Spinner } from '$shadcn/ui/spinner';

  import { listMolecules } from '$remote';

  import type { Sample } from '$lib/types';

  import MoleculeViz from './ui/MoleculeViz.svelte';

  type Molecules = Awaited<ReturnType<typeof listMolecules>>;

  type Props = {
    ground?: Sample['ground'];
    excited?: Sample['excited'];
    molecules?: Molecules;
    vizOpen?: boolean;
    vizCollapseShow?: boolean;
    loading?: boolean;
  };

  let {
    ground = $bindable(),
    excited = $bindable(),
    molecules,
    loading = true,
    vizOpen = false,
    vizCollapseShow = false,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  if (!molecules) {
    listMolecules().then((data) => {
      molecules = data;
      loading = false;
    });
  }

  let moleculesNames = $derived(
    new Set(molecules?.map((m) => m.moleculeName)) ?? [],
  );

  let moleculeName = $state<string>();

  let moleculeStates = $derived.by(() => {
    if (!molecules) return [];
    return molecules.filter((m) => m.moleculeName === moleculeName);
  });

  $effect(() => {
    if (!moleculeStates) return;

    for (const state of moleculeStates) {
      if (state.state === 0) {
        ground = state;
      } else if (state.state === 1) {
        excited = state;
      }
    }
  });
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
                bind:value={moleculeName}
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
            <Select.Root type="single">
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
            <Select.Root type="single">
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
