<script lang="ts">
	import { appState } from '$lib/state.svelte';
	import AppShell from '$components/layout/shell.svelte';

	let { sample: state } = $state(appState);

	let { children } = $props();
</script>

<AppShell {state}>
	<div class="flex flex-1 flex-col gap-4 p-4">
		{@render children()}
	</div>
</AppShell>
