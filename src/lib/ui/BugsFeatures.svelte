<script lang="ts">
  import { BugIcon } from '@lucide/svelte';

  import * as Dialog from '$shadcn/ui/dialog/index.js';
  import Separator from '$shadcn/ui/separator/separator.svelte';
  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  let open = $state(false);

  const features = [
    '2D detector image simulation',
    'Data export/Jupyter Notebook generation',
    'Result comparison',
    'Simulation history view',
    'Additional detectors/flexible detector configuration',
    'Simulation node graph viewer',
    'Contextual warnings - e.g. if simulation exceeds dSdT data range',
    'Allow setting dE/dT directly instead of via optical pump',
  ];

  const bugs = [
    'Unrealistic detector module movement',
    'Animations replaying on navigation',
    'Inconsistent molecule name display/state',
    'Delta T/deposited energy broken',
    'Inconsistent use of X-ray energy state',
  ];
</script>

<Sidebar.MenuItem>
  <Sidebar.MenuButton
    tooltipContent="Features & Bugs"
    onclick={() => {
      open = true;
    }}
  >
    <BugIcon />
    <span>Features & Bugs</span>
  </Sidebar.MenuButton>
</Sidebar.MenuItem>

<Dialog.Root bind:open>
  <Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-140">
    <Dialog.Header>
      <Dialog.Title>Planned Features</Dialog.Title>
    </Dialog.Header>

    <section>
      <ul class="list-disc pl-5">
        {#each features as feature}
          <li>{feature}</li>
        {/each}
      </ul>
    </section>

    <Separator class="my-4" />

    <Dialog.Header>
      <Dialog.Title>Known Bugs</Dialog.Title>
    </Dialog.Header>

    <section>
      <ul class="list-disc pl-5">
        {#each bugs as bug}
          <li>{bug}</li>
        {/each}
      </ul>
    </section>
  </Dialog.Content>
</Dialog.Root>
