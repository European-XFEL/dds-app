<script lang="ts" module>
  import {
    Beaker,
    BookOpen,
    Flower,
    Fullscreen,
    GitCompare,
    History,
    LayoutDashboard,
    Microscope,
    Projector,
    TestTube,
    Upload,
  } from '@lucide/svelte';

  import type { Pathname } from '$app/types';

  interface NavItem {
    title: string;
    url?: Pathname;
    icon: typeof LayoutDashboard;
    disabled?: boolean;
  }

  interface NavSection {
    title: string;
    url?: Pathname;
    items: NavItem[];
  }

  let data: NavSection[] = [
    {
      title: '',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Flow',
          // url: '/flow',
          icon: Flower,
          disabled: true,
        },
        {
          title: 'Docs',
          url: '/docs',
          icon: BookOpen,
        },
      ],
    },
    {
      title: 'Experiment',
      items: [
        {
          title: 'Sample',
          url: '/experiment/samples',
          icon: TestTube,
        },
        {
          title: 'Pump/Probe',
          url: '/experiment/pump-probe',
          icon: Projector,
        },
        {
          title: 'X-Ray Detector',
          url: '/experiment/detector',
          icon: Fullscreen,
        },
      ],
    },
    {
      title: 'Results',
      items: [
        {
          title: 'Compare',
          // url: '/results/compare',
          icon: GitCompare,
          disabled: true,
        },
        {
          title: 'History',
          // url: '/results/history',
          icon: History,
          disabled: true,
        },
      ],
    },
    {
      title: 'Define',
      items: [
        {
          title: 'Molecular Files',
          // url: '/define/upload',
          icon: Upload,
          disabled: true,
        },
        {
          title: 'Solvents',
          // url: '/define/solvent',
          icon: Beaker,
          disabled: true,
        },
        {
          title: 'Detectors',
          // url: '/define/detectors',
          icon: Microscope,
          disabled: true,
        },
      ],
    },
  ];
</script>

<script lang="ts">
  import { resolve } from '$app/paths';

  import * as Sidebar from '$shadcn/ui/sidebar/index.js';

  // Resolve the urls in `data`
  for (const group of data) {
    for (const item of group.items) {
      if (item.url) {
        // @ts-expect-error
        item.url = resolve(item.url);
      }
    }
  }
</script>

{#each data as group (group.title)}
  <Sidebar.Group>
    {#if group.title}
      <Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
    {/if}
    <Sidebar.GroupContent>
      <Sidebar.Menu>
        {#each group.items as item (item.title)}
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              {...item?.disabled
                ? { 'aria-disabled': 'true', tabindex: -1 }
                : {}}
            >
              {#snippet tooltipContent()}
                {item.title}
              {/snippet}
              {#snippet child({ props })}
                <a href={item?.url} {...props}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        {/each}
      </Sidebar.Menu>
    </Sidebar.GroupContent>
  </Sidebar.Group>
{/each}
