<script lang="ts" module>
	import { Beaker, Upload, Microscope, History } from '@lucide/svelte';

	const data = {
		user: {
			name: 'shadcn',
			email: 'm@example.com',
			avatar: '/avatars/shadcn.jpg'
		},
		navMain: [
			{
				title: 'Results',
				url: '#',
				items: [
					{
						title: 'Compare',
						url: '/results/patterns',
						icon: GitCompare
					},
					{
						title: 'History',
						url: '/results/history',
						icon: History
					}
				]
			},
			{
				title: 'Define',
				url: '#',
				items: [
					{
						title: 'Molecular Files',
						url: '/define/upload',
						icon: Upload,
						isActive: true
					},
					{
						title: 'Solvents',
						url: '/define/solvent',
						icon: Beaker
					},
					{
						title: 'Detectors',
						url: '/define/detectors',
						icon: Microscope
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { LayoutDashboard } from '@lucide/svelte';
	import { GitCompare } from '@lucide/svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg" class="mt-4">
					<LayoutDashboard class="size-5" />
					<span class="ml-2">Dashboard</span>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		{#each data.navMain as group (group.title)}
			<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
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
	</Sidebar.Content>
</Sidebar.Root>
