<script lang="ts">
  import Check from '@lucide/svelte/icons/check';
  import ExternalLink from '@lucide/svelte/icons/external-link';
  import X from '@lucide/svelte/icons/x';

  import { Button } from '$shadcn/ui/button';
  import { Input } from '$shadcn/ui/input';

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
  <div class="flex items-center gap-1">
    <Input
      value={editValue}
      oninput={(e) => onEditValueChange(e.currentTarget.value)}
      onkeydown={handleKeydown}
      class="h-7 text-sm"
      placeholder="https://..."
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
