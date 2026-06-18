<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import CardWrapper from '$lib/ui/CardWrapper.svelte';

  import ProbeSetup from './ProbeSetup.svelte';

  let { probe = $bindable(), short }: ComponentProps<typeof ProbeSetup> =
    $props();
</script>

<CardWrapper>
  <ProbeSetup bind:probe {short} />
</CardWrapper>
