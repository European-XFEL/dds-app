<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    label,
    ...restProps
  }: {
    label: string;
  } & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...restProps} class={['relative', restProps.class]}>
  <div
    class="h-full w-full bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_8px,var(--border)_2px,var(--border)_10px)]"
  ></div>
  <div class="absolute inset-0 flex items-center justify-center">
    <p>{label}</p>
  </div>
</div>
