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
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> & ComponentProps<typeof Footer> = $props();
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
  <Sidebar.Header>
    <AppPicker
      apps={[
        { title: 'Scattering Simulator' },
        { title: 'Diffraction Analyzer', disabled: true },
        { title: 'Molecular Viewer', disabled: true },
      ]}
    />

    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton size="lg" class="mt-4">
          <a href="/" class="flex items-center">
            <LayoutDashboard class="size-5" />
            <span class="ml-2">Dashboard</span>
          </a>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Header>

  <Content />

  <Footer {sample} />
</Sidebar.Root>
