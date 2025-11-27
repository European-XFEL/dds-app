<script lang="ts">
  import { Upload } from '@lucide/svelte';

  import { Button } from '$shadcn/ui/button/index.js';
  import * as Card from '$shadcn/ui/card/index.js';
  import * as Field from '$shadcn/ui/field/index.js';
  import * as Select from '$shadcn/ui/select/index.js';
  import { Skeleton } from '$shadcn/ui/skeleton';

  import type { SampleDetails } from '$lib/types';

  let {
    title,
    molecules,
    molecule = $bindable(),
  }: {
    title: string;
    molecules: { id: string; name: string; content: string }[];
    molecule: SampleDetails['ground'] | SampleDetails['excited'];
  } = $props();

  const triggerMolecule = $derived(
    molecules.find((m) => m.id === molecule.id)?.name ?? 'Select a molecule',
  );
</script>

<Card.Root class="flex-auto @sm:gap-3">
  <Card.Header>
    <Card.Title>{title}</Card.Title>
  </Card.Header>

  <Card.Content>
    <form class="flex flex-col gap-6">
      <Field.Field>
        <Field.Label>Sample molecule</Field.Label>
        <Field.Content class="items-stretch gap-2 sm:flex-row">
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
        </Field.Content>
      </Field.Field>
      <Field.Field>
        <Field.Content>
          <div class="h-60 w-full border border-muted/50">
            {#await import('./molecule-viewer.svelte')}
              <Skeleton class="h-full w-full" />
            {:then { default: MoleculeViewer }}
              <MoleculeViewer {molecule} />
            {/await}
          </div>
        </Field.Content>
      </Field.Field>
    </form>
  </Card.Content>
</Card.Root>
