<script lang="ts">
  import { Input } from '$shadcn/ui/input/index.js';
  import { Label } from '$shadcn/ui/label/index.js';

  import * as qConvert from '$lib/detector/components/SetupQRange.helper';
  import type { Detector, QRange } from '$lib/types';

  let {
    detector = $bindable(),
    q_range = $bindable(),
  }: {
    detector: Detector;
    q_range: QRange;
    short?: boolean;
  } = $props();

  let configure_via_q: boolean = $state(true);

  $effect(() => {
    if (configure_via_q) return;

    let new_q_vals = qConvert.detectorQParams(
      detector.image_shape,
      detector.pixel_size,
      detector.distance,
      detector.wavelength,
      [detector?.beam_center?.x, detector?.beam_center?.y],
    );

    q_range.min = new_q_vals.min;
    q_range.max = new_q_vals.max;
    q_range.step = new_q_vals.step;
  });
</script>

<div class="flex flex-col gap-2">
  <Label for="q-min">Q Min (Å⁻¹)</Label>
  <Input
    type="number"
    placeholder="0.1"
    class="min-w-24"
    bind:value={q_range.min}
    disabled={!configure_via_q}
  />
</div>
<div class="flex flex-col gap-2">
  <Label for="q-max">Q Max (Å⁻¹)</Label>
  <Input
    type="number"
    placeholder="5.0"
    class="min-w-24"
    bind:value={q_range.max}
    disabled={!configure_via_q}
  />
</div>
<div class="flex flex-col gap-2">
  <Label for="q-step">Q Step (Å⁻¹)</Label>
  <Input
    type="number"
    placeholder="0.01"
    class="min-w-24"
    bind:value={q_range.step}
    disabled={!configure_via_q}
  />
</div>
