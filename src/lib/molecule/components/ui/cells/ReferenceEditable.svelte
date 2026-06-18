<script lang="ts">
  import ExternalLink from '@lucide/svelte/icons/external-link';

  import EditableInput from './EditableInput.svelte';

  type Props = {
    value: string | null;
    isEditing: boolean;
    editValue: string;
    onStartEdit: () => void;
    onSave: (value: string) => void;
    onCancel: () => void;
    onEditValueChange: (value: string) => void;
  };

  let {
    value,
    isEditing,
    editValue,
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

  function isValidUrl(str: string | null): boolean {
    if (!str) return false;
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }
</script>

{#if isEditing}
  <EditableInput
    value={editValue}
    placeholder="https://..."
    onSave={() => onSave(editValue)}
    {onCancel}
    onChange={onEditValueChange}
    onKeydown={handleKeydown}
  />
{:else if isValidUrl(value)}
  <!-- eslint-disable svelte/no-navigation-without-resolve -->
  <a
    href={value}
    target="_blank"
    rel="noopener noreferrer"
    class="flex max-w-50 items-center gap-1 truncate text-primary hover:underline"
    ondblclick={(e) => {
      e.preventDefault();
      onStartEdit();
    }}
  >
    <span class="truncate">{value}</span>
    <ExternalLink class="size-3 shrink-0" />
  </a>
  <!-- eslint-enable svelte/no-navigation-without-resolve -->
{:else}
  <button
    type="button"
    class="cursor-pointer rounded px-1 py-0.5 text-left text-muted-foreground hover:bg-muted/50"
    ondblclick={onStartEdit}
    title="Double-click to add reference"
  >
    {value ?? '-'}
  </button>
{/if}
