<script lang="ts">
  import { LayoutDashboard } from '@lucide/svelte';

  import type { ComponentProps } from 'svelte';

  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  import AppPicker from '$components/ui/app-picker.svelte';

  import Content from './content.svelte';
  import Footer from './footer.svelte';

  let {
    sample,
    ref = $bindable(null),
    collapsible = 'icon',
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> & ComponentProps<typeof Footer> = $props();
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
    <Content />
  </Sidebar.Content>

  <Footer {sample} />

  <Sidebar.Rail />
</Sidebar.Root>
