<script lang="ts">
  import { Input } from '$shadcn/ui/input/index.js';
  import { Label } from '$shadcn/ui/label/index.js';

  import type { Sample } from '$lib/types';

  type Props = {
    concentrationSoluteMolar: Sample['concentrationSoluteMolar'];
  };

  let { concentrationSoluteMolar = $bindable() }: Props = $props();
</script>

<div class="grid grow gap-2 @sm:min-w-40">
  <Label>Solute Concentration (%)</Label>
  <div class="flex items-center justify-between gap-4">
    <Input
      type="number"
      min="0.001"
      max="5"
      step="0.001"
      bind:value={concentrationSoluteMolar}
      disabled={false}
      class="nodrag w-30 text-sm text-muted-foreground"
    />
    <Input
      type="range"
      min="0.001"
      max="5"
      step="0.001"
      bind:value={concentrationSoluteMolar}
      class="nodrag"
    />
  </div>
</div>
