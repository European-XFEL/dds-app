<script lang="ts">
  import * as Empty from '$shadcn/ui/empty/index.js';

  interface Props {
    title?: string;
    description?: string;
  }

  let { title, description }: Props = $props();
</script>

<Empty.Root
  class="h-full w-full bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_8px,var(--border)_2px,var(--border)_10px)]"
>
  <Empty.Header>
    <Empty.Title>{title}</Empty.Title>
    <Empty.Description>{description}</Empty.Description>
  </Empty.Header>
  <Empty.Content></Empty.Content>
</Empty.Root>
