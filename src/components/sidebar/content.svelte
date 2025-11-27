<script lang="ts" module>
  import {
    Beaker,
    History,
    LayoutDashboard,
    Microscope,
    Projector,
    TestTubes,
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
            url: '/',
            icon: LayoutDashboard,
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
            icon: TestTubes,
          },
          {
            title: 'Optical Pump', // Check if this name is appropriate
            url: '/experiment/ir-pump',
            icon: Projector,
          },
          {
            title: 'X-Ray Probe', // Detector wavelength goes here
            url: '/experiment/pump-probe',
            icon: Projector,
          },
          {
            title: 'X-Ray Detector',
            url: '/experiment/detector',
            icon: Microscope,
          },
        ],
      },
      {
        title: 'Results',
        url: '#',
        items: [
          // {
          // 	title: 'Compare',
          // 	url: '/results/patterns',
          // 	icon: GitCompare
          // },
          {
            title: 'History',
            url: '/results/history',
            icon: History,
          },
        ],
      },
      {
        title: 'Define',
        url: '#',
        items: [
          {
            title: 'Molecular Files',
            url: '/define/upload',
            icon: Upload,
            isActive: true,
          },
          {
            title: 'Solvents',
            url: '/define/solvent',
            icon: Beaker,
          },
          {
            title: 'Detectors',
            url: '/define/detectors',
            icon: Microscope,
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
            <Sidebar.MenuButton>
              {#snippet tooltipContent()}
                {item.title}
              {/snippet}
              {#snippet child({ props })}
                <a href={item.url} {...props}>
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
