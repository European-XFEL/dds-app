<script lang="ts">
  import EditableInput from './EditableInput.svelte';

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
  <EditableInput
    value={editValue}
    onSave={() => onSave(editValue)}
    {onCancel}
    onChange={onEditValueChange}
    onKeydown={handleKeydown}
  />
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
