<script lang="ts">
  type Props = {
    text: string | number | null;
    class?: string;
  };

  let { text, class: className = '' }: Props = $props();
</script>

<span class={className}>{text ?? '-'}</span>
