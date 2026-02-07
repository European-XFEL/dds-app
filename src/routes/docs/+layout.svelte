<script lang="ts">
  let { children } = $props();
</script>

<article class="prose mt-8 max-w-none dark:prose-invert">
  {@render children?.()}
</article>
