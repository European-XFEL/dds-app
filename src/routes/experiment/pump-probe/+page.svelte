<script lang="ts">
  import ProbeSetupCard from '$lib/probe/ProbeSetupCard.svelte';
  import { PumpSetupCard } from '$lib/pump';
</script>

<div class="flex flex-wrap gap-4">
  <PumpSetupCard />
  <ProbeSetupCard />
</div>
