<script lang="ts">
  import { Input } from '$shadcn/ui/input/index.js';
  import { Label } from '$shadcn/ui/label/index.js';

  import type { Detector } from '$lib/types';

  let {
    detector = $bindable(),
    short = false,
  }: {
    detector: Detector;
    short?: boolean;
  } = $props();

  let configure_via_q: boolean = $state(true);
</script>

<div class="flex flex-wrap gap-4">
  <div class="flex flex-col gap-2" hidden={short}>
    <Label for="pixel-size">Pixel Size (mm)</Label>
    <Input
      type="number"
      placeholder="0.172"
      bind:value={detector.pixelSize}
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
      <Input type="number" placeholder="512" value={detector?.imageShape?.[0]} readonly disabled />
      <Input type="number" placeholder="512" value={detector?.imageShape?.[1]} readonly disabled />
    </div>
  </div>
  <div class="flex flex-col gap-2" hidden={short}>
    <Label for="beam-center-x">Beam Center (px)</Label>
    <div class="flex flex-row gap-2">
      <Input
        type="number"
        placeholder="256"
        value={detector?.beamCenter?.x}
        disabled={configure_via_q}
      />
      <Input
        type="number"
        placeholder="256"
        value={detector.beamCenter?.y}
        disabled={configure_via_q}
      />
    </div>
  </div>
</div>
