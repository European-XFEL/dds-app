<script lang="ts">
  import * as Card from '$shadcn/ui/card/index.js';

  let { children } = $props();
</script>

<Card.Root>
  <Card.Content>
    {@render children()}
  </Card.Content>
</Card.Root>
