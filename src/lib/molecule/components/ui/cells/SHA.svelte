<script lang="ts">
  type Props = {
    sha: string;
  };

  let { sha }: Props = $props();
</script>

<code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
  {sha.slice(0, 8)}...
</code>
