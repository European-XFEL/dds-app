<script lang="ts">
  import { formatState } from '../../../types';

  import { Badge } from '$shadcn/ui/badge';

  type Props = {
    state: number;
  };

  let { state }: Props = $props();
</script>

{#if state === 0}
  <Badge variant={state === 0 ? 'outline' : 'default'} >
    {formatState(state)}
  </Badge>
{:else}
  <Badge variant={state === 0 ? 'outline' : 'default'} >
    {formatState(state)}
  </Badge>
{/if}

