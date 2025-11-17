<script lang="ts">
	import AppShell from '$components/layout/shell.svelte';
	let { children } = $props();
</script>

<AppShell>
	{@render children()}
</AppShell>
