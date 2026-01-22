<script lang="ts">
  import todos from '../../data/todos.json';

  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  let {
    sample,
  }: {
    sample: {
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
    <div>Ground: {sample.groundName ?? ''}</div>
    <div>Excited: {sample.excitedName ?? ''}</div>
    <div>Solvent: {sample.solventName ?? ''}</div>
    <div>Solute Concentration: {sample.concentrationSoluteMolar ?? ''}%</div>
  </section>
</Sidebar.Footer>
