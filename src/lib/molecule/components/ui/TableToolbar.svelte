<script lang="ts">
  import type { Molecule, MoleculeSelection } from '../../types';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import Settings2 from '@lucide/svelte/icons/settings-2';
  import type { Table } from '@tanstack/table-core';

  import { Badge } from '$shadcn/ui/badge';
  import { Button } from '$shadcn/ui/button';
  import * as DropdownMenu from '$shadcn/ui/dropdown-menu';
  import { Input } from '$shadcn/ui/input';

  type Props = {
    table: Table<any>; // Accept any table type
    globalFilter: string;
    onGlobalFilterChange: (value: string) => void;
    selection: MoleculeSelection;
    molecules: Molecule[];
  };

  let {
    table,
    globalFilter,
    onGlobalFilterChange,
    selection,
    molecules,
  }: Props = $props();

  function handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    onGlobalFilterChange(target.value);
  }
</script>

<div class="flex items-center justify-between gap-4">
  <div class="flex items-center gap-2">
    <Input
      placeholder="Search molecules..."
      value={globalFilter}
      oninput={handleInputChange}
      class="h-9 w-[250px]"
    />
  </div>
  <div class="flex items-center gap-2">
    <div class="flex items-center gap-3 text-sm">
      {#if selection.ground || selection.excited}
        <div class="flex items-center gap-2">
          {#if selection.ground}
            <Badge variant="secondary" class="gap-1">
              Ground: {selection.ground.moleculeName}
            </Badge>
          {/if}
          {#if selection.excited}
            <Badge variant="default" class="gap-1">
              Excited: {selection.excited.moleculeName}
            </Badge>
          {/if}
        </div>
      {:else}
        <span class="text-muted-foreground">No selection</span>
      {/if}
    </div>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Button variant="outline" size="sm" class="bg-transparent" {...props}>
            <Settings2 class="mr-2 size-4" />
            Columns
            <ChevronDown class="ml-2 size-4" />
          </Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" class="w-[180px]">
        {#each table
          .getAllColumns()
          .filter((col) => col.getCanHide()) as column}
          <DropdownMenu.CheckboxItem
            checked={column.getIsVisible()}
            onCheckedChange={(value) => {
              console.log(column.getIsVisible());
              column.toggleVisibility(!!value);
              console.log(column.getIsVisible());
            }}
          >
            {column.id}
          </DropdownMenu.CheckboxItem>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</div>
