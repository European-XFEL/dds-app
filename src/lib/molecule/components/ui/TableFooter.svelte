<script lang="ts">
  type Props = {
    rowCount: number;
    groupCount: number;
  };

  let { rowCount, groupCount }: Props = $props();
</script>

<div class="flex items-center justify-between text-sm text-muted-foreground">
  <div>
    {rowCount} molecule entries across
    {groupCount} molecules
  </div>
  <div class="text-xs">Double-click to edit fields</div>
</div>
