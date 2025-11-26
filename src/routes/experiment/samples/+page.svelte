<script lang="ts">
	import SampleCardParameters from '$components/sample-card-parameters.svelte';
	import SampleCardGround from '$components/sample-card-ground.svelte';
	import SampleCardExcited from '$components/sample-card-excited.svelte';
</script>

<div class="grid gap-4 md:grid-rows-1">
	<div>
		<SampleCardParameters />
	</div>
	<div class="grid gap-4 md:grid-cols-2">
		<SampleCardGround />
		<SampleCardExcited />
	</div>
</div>
