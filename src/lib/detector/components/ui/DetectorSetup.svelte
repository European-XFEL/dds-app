<script lang="ts">
  import * as Field from '$shadcn/ui/field/index.js';
  import { Input } from '$shadcn/ui/input/index.js';
  import * as Select from '$shadcn/ui/select';

  import type { CartesianPoint } from '$lib/types';

  type Props = {
    distance: number;
    beamCenter: CartesianPoint;
  };

  let { distance = $bindable(), beamCenter = $bindable() }: Props = $props();

  type DetectorEntry = { name: string; enabled: boolean };

  const detectors: DetectorEntry[] = [
    { name: 'LPD', enabled: true },
    { name: 'AGIPD', enabled: false },
    { name: 'DSSC', enabled: false },
  ];

  let detectorName: string | undefined = $state('LPD');
</script>

<Field.Set>
  <Field.Legend>Detector Configuration</Field.Legend>
  <Field.Description
    >Select detector type and configure module positions.</Field.Description
  >

  <Field.Field>
    <Field.Label>Detector</Field.Label>
    <Select.Root type="single" bind:value={detectorName}>
      <Select.Trigger>
        <span>{detectorName || 'Select Detector'}</span>
      </Select.Trigger>
      <Select.Content>
        {#each detectors as { name, enabled } (name)}
          <Select.Item value={name} label={name} disabled={!enabled}>
            {name}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </Field.Field>

  <Field.Field>
    <Field.Label>Sample Detector Distance (mm)</Field.Label>
    <div class="flex min-w-fit items-center justify-between gap-x-2">
      <Input
        type="number"
        bind:value={distance}
        class="nodrag w-30 text-sm text-muted-foreground"
      />
      <Input type="range" bind:value={distance} class="nodrag" />
    </div>
  </Field.Field>

  <Field.Group class="flex flex-wrap">
    <Field.Field>
      <Field.Label>Beam Center (px)</Field.Label>
      <div class="grid grid-cols-2 gap-4">
        <Input type="number" bind:value={beamCenter.x} />
        <Input type="number" bind:value={beamCenter.y} />
      </div>
    </Field.Field>
  </Field.Group>
</Field.Set>
