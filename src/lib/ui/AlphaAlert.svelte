<script lang="ts">
  import { CircleAlert } from '@lucide/svelte';

  import * as Alert from '$shadcn/ui/alert';
</script>

<Alert.Root variant="destructive" class="bg-destructive/10">
  <Alert.Title>
    <div class="flex items-center gap-2">
      <CircleAlert class="h-4 w-4" />
      Interface Preview
    </div>
  </Alert.Title>
  <Alert.Description class="[&_p]:my-1 [&_p]:leading-snug">
    <p>This is an early preview/concept of a simulation interface.</p>
    <p>Results and contents may be inaccurate.</p>
    <p>
      The main aim of this is to get early feedback on the design and to collect
      ideas for features and improvements.
    </p>
  </Alert.Description>
</Alert.Root>
