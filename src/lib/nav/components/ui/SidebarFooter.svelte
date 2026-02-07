<script lang="ts">
  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  let {
    sample,
  }: {
    sample: {
      moleculeName: string | undefined;
      groundName: string | undefined;
      excitedName: string | undefined;
      solventName: string | undefined;
      concentrationSoluteMolar: number | undefined;
    };
  } = $props();
</script>

<Sidebar.Footer
  class="flex flex-col text-sm text-muted-foreground group-data-[collapsible=icon]:hidden"
>
  <section class="flex flex-1 flex-col">
    <div>Molecule: {sample.moleculeName ?? ''}</div>
    <div>Ground: {sample.groundName ?? ''}</div>
    <div>Excited: {sample.excitedName ?? ''}</div>
    <div>Solvent: {sample.solventName ?? ''}</div>
    <div>
      Solute Concentration: {sample.concentrationSoluteMolar ?? ''} mol/L
    </div>
  </section>
</Sidebar.Footer>
