<script lang="ts">
  import Check from '@lucide/svelte/icons/check';
  import X from '@lucide/svelte/icons/x';

  import { Button } from '$shadcn/ui/button';
  import { Input } from '$shadcn/ui/input';

  type Props = {
    value: string | null;
    isEditing: boolean;
    editValue: string;
    maxWidth?: string;
    onStartEdit: () => void;
    onSave: (value: string) => void;
    onCancel: () => void;
    onEditValueChange: (value: string) => void;
  };

  let {
    value,
    isEditing,
    editValue,
    maxWidth = '200px',
    onStartEdit,
    onSave,
    onCancel,
    onEditValueChange,
  }: Props = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      onSave(editValue);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  }
</script>

{#if isEditing}
  <div class="flex items-center gap-1">
    <Input
      value={editValue}
      oninput={(e) => onEditValueChange(e.currentTarget.value)}
      onkeydown={handleKeydown}
      class="h-7 text-sm"
      autofocus
    />
    <Button
      variant="ghost"
      size="icon"
      class="size-7"
      onclick={() => onSave(editValue)}
    >
      <Check class="size-3" />
    </Button>
    <Button variant="ghost" size="icon" class="size-7" onclick={onCancel}>
      <X class="size-3" />
    </Button>
  </div>
{:else}
  <button
    type="button"
    class="block cursor-pointer truncate rounded px-1 py-0.5 text-left hover:bg-muted/50"
    style:max-width={maxWidth}
    ondblclick={onStartEdit}
    title={value ?? 'Double-click to edit'}
  >
    {value ?? '-'}
  </button>
{/if}
