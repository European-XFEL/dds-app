<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import * as Card from '$shadcn/ui/card/index.js';

  import DetectorInfo from './components/DetectorInfo.svelte';

  type Props = ComponentProps<typeof DetectorInfo>;

  let { ...restProps }: Props = $props();
</script>

<Card.Root class="flex-1 min-w-sm">
  <Card.Content>
    <DetectorInfo {...restProps} />
  </Card.Content>
</Card.Root>
