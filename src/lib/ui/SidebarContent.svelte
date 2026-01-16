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

  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
      {
        title: '',
        url: '#',
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
        url: '#',
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
        url: '#',
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
        url: '#',
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
    ],
  };
</script>

<script lang="ts">
  import * as Sidebar from '$shadcn/ui/sidebar/index.js';
</script>

{#each data.navMain as group (group.title)}
  <Sidebar.Group>
    {#if group.title}
      <Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
    {/if}
    <Sidebar.GroupContent>
      <Sidebar.Menu>
        {#each group.items as item (item.title)}
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              {...item?.disabled ? { 'aria-disabled': 'true', tabindex: -1 } : {}}
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
