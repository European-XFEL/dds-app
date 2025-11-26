<script lang="ts">
  import * as Card from '$shadcn/ui/card/index.js';
  import { Input } from '$shadcn/ui/input/index.js';
  import { Label } from '$shadcn/ui/label/index.js';
  import { Toggle } from '$shadcn/ui/toggle';

  import * as qConvert from '$lib/math/q_detector_convert.ts';
  import type { Detector, QVals } from '$lib/types';

  let {
    detector = $bindable(),
    q_vals = $bindable(),
    short = false,
  }: {
    detector: Detector;
    q_vals: QVals;
    short?: boolean;
  } = $props();

  let configure_via_q: boolean = $state(false);

  $effect(() => {
    if (configure_via_q) return;
    let new_q_vals = qConvert.detectorQParams(
      detector.shape,
      detector.pixel_size,
      detector.distance,
      detector.wavelength,
      detector.beam_center,
    );

    q_vals.min = new_q_vals.min;
    q_vals.max = new_q_vals.max;
    q_vals.step = new_q_vals.step;
  });
</script>

<Card.Root class="w-full @sm:gap-2">
  <Card.Header>
    <Card.Title>
      <div class="flex items-center justify-between">
        Detector Setup
        <Card.Action>
          <Toggle variant="outline" bind:pressed={configure_via_q}>
            <Label class="text-xs">Configure via Q parameters</Label>
          </Toggle>
        </Card.Action>
      </div>
    </Card.Title>
  </Card.Header>

  <Card.Content>
    <div class="grid grid-cols-3 gap-4 @sm:grid-cols-2">
      <div class="flex flex-col gap-2" hidden={short}>
        <Label for="pixel-size">Pixel Size (mm)</Label>
        <Input
          type="number"
          placeholder="0.172"
          bind:value={detector.pixel_size}
          disabled={configure_via_q}
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="distance">Distance (mm)</Label>
        <Input
          type="number"
          placeholder="200"
          bind:value={detector.distance}
          disabled={configure_via_q}
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="wavelength">Wavelength (Å)</Label>
        <Input
          type="number"
          placeholder="1.54"
          bind:value={detector.wavelength}
          disabled={configure_via_q}
        />
      </div>
      <div class="flex flex-col gap-2" hidden={short}>
        <Label>Image Shape (px)</Label>
        <div class="flex flex-row gap-2">
          <Input
            type="number"
            placeholder="512"
            bind:value={detector.shape[0]}
            disabled={configure_via_q}
          />
          <Input
            type="number"
            placeholder="512"
            bind:value={detector.shape[1]}
            disabled={configure_via_q}
          />
        </div>
      </div>
      <div class="flex flex-col gap-2" hidden={short}>
        <Label for="beam-center-x">Beam Center (px)</Label>
        <div class="flex flex-row gap-2">
          <Input
            type="number"
            placeholder="256"
            bind:value={detector.beam_center[0]}
            disabled={configure_via_q}
          />
          <Input
            type="number"
            placeholder="256"
            bind:value={detector.beam_center[1]}
            disabled={configure_via_q}
          />
        </div>
      </div>
    </div>
  </Card.Content>

  <hr class="my-4" />

  <Card.Header hidden={short}>
    <Card.Title hidden={short}>Q Parameters</Card.Title>
  </Card.Header>

  <Card.Content>
    <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      <div class="flex flex-col gap-2">
        <Label for="q-min">Q Min (Å⁻¹)</Label>
        <Input
          type="number"
          placeholder="0.1"
          bind:value={q_vals.min}
          disabled={!configure_via_q}
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="q-max">Q Max (Å⁻¹)</Label>
        <Input
          type="number"
          placeholder="5.0"
          bind:value={q_vals.max}
          disabled={!configure_via_q}
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="q-step">Q Step (Å⁻¹)</Label>
        <Input
          type="number"
          placeholder="0.01"
          bind:value={q_vals.step}
          disabled={!configure_via_q}
        />
      </div>
    </div>
  </Card.Content>
</Card.Root>
