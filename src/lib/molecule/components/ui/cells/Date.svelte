<script lang="ts">
  type Props = {
    date: string;
  };

  let { date }: Props = $props();
</script>

<span class="text-sm text-muted-foreground">
  {new Date(date).toLocaleDateString()}
</span>
