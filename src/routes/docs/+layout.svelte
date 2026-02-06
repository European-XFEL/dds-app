<script lang="ts">
  let { children } = $props();
</script>

<article class="mt-8 prose max-w-none dark:prose-invert">
  {@render children?.()}
</article>
