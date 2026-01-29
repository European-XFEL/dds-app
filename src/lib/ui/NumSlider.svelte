<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import { Input } from '$shadcn/ui/input/index.js';
  import { Label } from '$shadcn/ui/label/index.js';

  type Props = {
    value: any;
    label: string;
    classNum?: string;
    classRange?: string;
    min?: string | number;
    max?: string | number;
    step?: string | number;
  };

  let {
    value = $bindable(),
    classNum = 'nodrag w-30 text-sm text-muted-foreground',
    classRange,
    label,
    ...rest
  }: Props = $props();
</script>

<div class="grid grow gap-2 @sm:min-w-40">
  <Label>{label}</Label>
  <div class="flex items-center justify-between gap-4">
    <Input bind:value type="number" class={classNum} {...rest} />
    <Input bind:value type="range" class={classRange} {...rest} />
  </div>
</div>
