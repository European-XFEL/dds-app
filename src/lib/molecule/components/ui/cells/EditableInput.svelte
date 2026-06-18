<script lang="ts">
  import Check from '@lucide/svelte/icons/check';
  import X from '@lucide/svelte/icons/x';

  import { Button } from '$shadcn/ui/button';
  import { Input } from '$shadcn/ui/input';

  type Props = {
    value: string;
    placeholder?: string;
    onSave: () => void;
    onCancel: () => void;
    onChange: (value: string) => void;
    onKeydown: (e: KeyboardEvent) => void;
  };

  let { value, placeholder, onSave, onCancel, onChange, onKeydown }: Props =
    $props();
</script>

<div class="flex items-center gap-1">
  <Input
    {value}
    oninput={(e) => onChange(e.currentTarget.value)}
    onkeydown={onKeydown}
    class="h-7 text-sm"
    {placeholder}
    autofocus
  />
  <Button variant="ghost" size="icon" class="size-7" onclick={onSave}>
    <Check class="size-3" />
  </Button>
  <Button variant="ghost" size="icon" class="size-7" onclick={onCancel}>
    <X class="size-3" />
  </Button>
</div>
