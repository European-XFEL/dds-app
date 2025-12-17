<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  import { AppPicker } from '$lib/ui';

  import SidebarContent from './SidebarContent.svelte';
  import SidebarFooter from './SidebarFooter.svelte';

  let {
    sample,
    ref = $bindable(null),
    collapsible = 'icon',
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> & ComponentProps<typeof SidebarFooter> = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps} variant="floating">
  <Sidebar.Header>
    <AppPicker
      apps={[
        { title: 'Scattering Simulator' },
        { title: 'Diffraction Analyzer', disabled: true },
        { title: 'Molecular Viewer', disabled: true },
      ]}
    />
  </Sidebar.Header>

  <Sidebar.Content>
    <SidebarContent />
  </Sidebar.Content>

  <SidebarFooter {sample} />

  <Sidebar.Rail />
</Sidebar.Root>
