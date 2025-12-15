<script lang="ts">
  import type { DetectorModule } from '$lib/types';

  let {
    modules,
  }: {
    modules: DetectorModule[];
  } = $props();
</script>

<div class="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
  {#each modules as module (module.id)}
    <div
      class="flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 shadow-sm"
    >
      <span
        class="size-3 rounded-full border border-border/70"
        style={`background-color: ${module.color}; opacity: 0.7;`}
        aria-hidden="true"
      ></span>
      <span class="font-medium">{module.id.replace('module-', 'Module ')}</span>
    </div>
  {/each}
</div>
