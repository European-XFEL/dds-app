<script lang="ts">
  import katex from 'katex';

  interface Props {
    math: string;
    displayMode?: boolean;
    class?: string;
  }

  let { math, displayMode = false, class: className = '' }: Props = $props();

  const rendered = $derived(
    katex.renderToString(math, {
      displayMode,
      throwOnError: false,
      strict: false,
    }),
  );
</script>

<span class={className}>
  {@html rendered}
</span>
