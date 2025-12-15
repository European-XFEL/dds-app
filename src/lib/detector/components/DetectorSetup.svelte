<script lang="ts">
  import * as Field from '$shadcn/ui/field/index.js';
  import { Input } from '$shadcn/ui/input/index.js';
  import * as Select from '$shadcn/ui/select';

  import type { Detector } from '$lib/types';

  let {
    detector = $bindable(),
    short = false,
  }: {
    detector: Detector;
    short?: boolean;
  } = $props();

  const detectors: string[] = ['LPD', 'AGIPD', 'DSSC'];
  let detectorName: string | undefined = $state();
</script>

<div class="min-w-md">
  <form>
    <Field.Set>
      <Field.Legend>Detector Configuration</Field.Legend>
      <Field.Description>Select detector type and configure module positions.</Field.Description>

      <Field.Field>
        <Field.Label>Detector</Field.Label>
        <Select.Root type="single" bind:value={detectorName}>
          <Select.Trigger>
            <span>
              {detectorName || 'Select Detector'}
            </span>
          </Select.Trigger>
          <Select.Content>
            {#each detectors as name}
              <Select.Item value={name} label={name}>
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
            bind:value={detector.distance}
            class="nodrag w-30 text-sm text-muted-foreground"
          />
          <Input type="range" bind:value={detector.distance} class="nodrag" />
        </div>
      </Field.Field>

      <Field.Group class="flex flex-wrap">
        <Field.Field>
          <Field.Label>Beam Center (px)</Field.Label>
          <div class="grid grid-cols-2 gap-4">
            <Input type="number" bind:value={detector.beamCenter.x} />
            <Input type="number" bind:value={detector.beamCenter.y} />
          </div>
        </Field.Field>
      </Field.Group>
    </Field.Set>
  </form>
</div>
