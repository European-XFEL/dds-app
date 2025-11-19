<script lang="ts">
	import { appState } from './state.svelte';
	import AppShell from '$components/layout/shell.svelte';

	let { sample } = $state(appState);

	let { children } = $props();
</script>

<AppShell {sample}>
	<div class="flex flex-1 flex-col gap-4 p-4">
		{@render children()}
	</div>
</AppShell>
