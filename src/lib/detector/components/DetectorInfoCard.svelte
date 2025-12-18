<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import * as Card from '$shadcn/ui/card/index.js';

  import DetectorInfo from './ui/DetectorInfo.svelte';

  type Props = ComponentProps<typeof DetectorInfo>;

  let { ...restProps }: Props = $props();
</script>

<Card.Root class="min-w-sm flex-1">
  <Card.Content>
    <DetectorInfo {...restProps} />
  </Card.Content>
</Card.Root>
