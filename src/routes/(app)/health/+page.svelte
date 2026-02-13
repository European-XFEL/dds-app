<script lang="ts">
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  let capabilities = $derived(data.capabilities);
</script>

<pre>{JSON.stringify(capabilities, null, 2)}</pre>
