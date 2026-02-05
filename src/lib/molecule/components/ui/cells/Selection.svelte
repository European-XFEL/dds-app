<script lang="ts">
  import type { Molecule } from '../../../types';

  import { Button } from '$shadcn/ui/button';

  type Props = {
    molecule: Molecule;
    isSelectedGround: boolean;
    isSelectedExcited: boolean;
    onSelectGround: (molecule: Molecule) => void;
    onSelectExcited: (molecule: Molecule) => void;
  };

  let {
    molecule,
    isSelectedGround,
    isSelectedExcited,
    onSelectGround,
    onSelectExcited,
  }: Props = $props();
</script>

<div class="flex items-center gap-1">
  <Button
    variant={isSelectedGround ? 'default' : 'outline'}
    size="sm"
    class={`h-7 px-2 text-xs ${isSelectedGround ? 'border-blue-400 bg-blue-300 text-white hover:bg-blue-500' : 'hover:bg-gray-100'}`}
    onclick={() => onSelectGround(molecule)}
  >
    Ground
  </Button>
  <Button
    variant={isSelectedExcited ? 'default' : 'outline'}
    size="sm"
    class={`h-7 px-2 text-xs ${isSelectedExcited ? 'border-orange-400 bg-orange-300 text-white hover:bg-orange-500' : 'hover:bg-gray-100'}`}
    onclick={() => onSelectExcited(molecule)}
  >
    Excited
  </Button>
</div>
