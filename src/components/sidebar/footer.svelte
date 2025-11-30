<script lang="ts">
  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  let {
    sample,
  }: {
    sample: {
      groundName: string;
      excitedName: string;
      solventName: string;
      concentrationSoluteMolar: number;
    };
  } = $props();
</script>

<Sidebar.Footer
  class="grid gap-1 text-sm text-muted-foreground group-data-[collapsible=icon]:hidden"
>
  <span>Ground: {sample.groundName}</span>
  <span>Excited: {sample.excitedName}</span>
  <span>Solvent: {sample.solventName}</span>
  <span>Solute Concentration: {sample.concentrationSoluteMolar}%</span>
</Sidebar.Footer>
