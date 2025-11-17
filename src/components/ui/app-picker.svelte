<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import FlaskRoundIcon from '@lucide/svelte/icons/flask-round';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';

	let {
		apps
	}: {
		apps: {
			title: string;
			disabled?: boolean;
		}[];
	} = $props();

	const sidebar = useSidebar();
	let selectedApp = $state(apps[0]);
	const fallbackApp = $derived(apps[0]);
	const displayApp = $derived(
		selectedApp && apps.includes(selectedApp) ? selectedApp : fallbackApp
	);

	function handleSelect(app: { title: string; disabled?: boolean }) {
		if (!apps.includes(app)) {
			return;
		}

		selectedApp = app;
	}
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div
							class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
						>
							<FlaskRoundIcon class="size-4" />
						</div>
						<div class="flex flex-col gap-0.5 leading-none">
							<span class="font-semibold">{displayApp.title}</span>
						</div>
						<ChevronsUpDownIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-48 rounded-lg"
				align="start"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				sideOffset={4}
			>
				{#if apps.length}
					{#each apps as app (app.title)}
						<DropdownMenu.Item onSelect={() => handleSelect(app)} disabled={app.disabled}>
							<span>{app.title}</span>
							{#if app === displayApp}
								<CheckIcon class="ml-auto size-4" />
							{/if}
						</DropdownMenu.Item>
					{/each}
				{:else}
					<DropdownMenu.Item disabled>No apps available</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
