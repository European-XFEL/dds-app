<script lang="ts">
  import {
    type GroupRow,
    type MoleculeRow,
    type TableRow,
    createMoleculeColumns,
  } from '../columns';
  import {
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getSortedRowModel,
  } from '@tanstack/table-core';

  import { flip } from 'svelte/animate';
  import { slide } from 'svelte/transition';

  import { FlexRender, createSvelteTable } from '$shadcn/ui/data-table';
  import { Spinner } from '$shadcn/ui/spinner';
  import * as Table from '$shadcn/ui/table';

  import type { Molecule, MoleculeSelection, Molecules } from '$lib/types';

  import TableFooter from './TableFooter.svelte';
  import TableToolbar from './TableToolbar.svelte';

  interface Props {
    molecules: Molecules;
    ground?: Molecule | null;
    excited?: Molecule | null;
    loading?: boolean;
  }

  let {
    molecules = $bindable(),
    ground = $bindable(),
    excited = $bindable(),
    loading,
  }: Props = $props();

  // Table state
  let sorting = $state<SortingState>([{ id: 'moleculeName', desc: false }]);
  let columnFilters = $state<ColumnFiltersState>([]);
  let columnVisibility = $state<VisibilityState>({
    sha: false,
    atomCount: false,
    state: false,
    createdAt: false,
    updatedAt: false,
    id: false,
  });
  let globalFilter = $state('');

  // Selection state
  let selectedGroundId = $state<string | null>(null);
  let selectedExcitedId = $state<string | null>(null);

  // Editable cell state
  let editingCell = $state<{ id: string; field: string } | null>(null);
  let editValue = $state('');

  // Selection handlers
  function selectGround(molecule: Molecule) {
    selectedGroundId = selectedGroundId === molecule.id ? null : molecule.id;
    ground = molecule;
  }

  function selectExcited(molecule: Molecule) {
    selectedExcitedId = selectedExcitedId === molecule.id ? null : molecule.id;
    excited = molecule;
  }

  // Editing handlers
  function startEditing(
    id: string,
    field: string,
    currentValue: string | number | null,
  ) {
    editingCell = { id, field };
    editValue = currentValue?.toString() ?? '';
  }

  function saveEdit(value: string) {
    if (editingCell) {
      const finalValue =
        editingCell.field === 'atomCount'
          ? Number.parseInt(value) || 0
          : value || null;
      console.log(
        editingCell.id,
        editingCell.field as keyof Molecule,
        finalValue,
      );
    }
    editingCell = null;
    editValue = '';
  }

  function cancelEdit() {
    editingCell = null;
    editValue = '';
  }

  // Group molecules by name - this transforms flat molecule list into hierarchical data
  let groupedData = $derived.by((): TableRow[] => {
    const groups = new Map<string, MoleculeRow[]>();

    for (const molecule of molecules) {
      const existing = groups.get(molecule.moleculeName);
      if (existing) {
        existing.push(molecule as MoleculeRow);
      } else {
        groups.set(molecule.moleculeName, [molecule as MoleculeRow]);
      }
    }

    return Array.from(groups.entries()).map(
      ([moleculeName, moleculeRows]): GroupRow => ({
        moleculeName,
        atomCount: moleculeRows[0].atomCount,
        molecules: moleculeRows,
      }),
    );
  });

  // Create columns with handlers
  const columns = $derived(
    createMoleculeColumns({
      selectedGroundId,
      selectedExcitedId,
      editingCell,
      editValue,
      onSelectGround: selectGround,
      onSelectExcited: selectExcited,
      onStartEdit: startEditing,
      onSaveEdit: saveEdit,
      onCancelEdit: cancelEdit,
      onEditValueChange: (v) => (editValue = v),
    }),
  );

  // Create table instance using TanStack Table's native features
  const table = $derived(
    createSvelteTable({
      columns,
      data: groupedData,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      getSubRows: (row) => (row as GroupRow).molecules, // Enable hierarchical rows
      onSortingChange: (updater) => {
        sorting = typeof updater === 'function' ? updater(sorting) : updater;
      },
      onColumnFiltersChange: (updater) => {
        columnFilters =
          typeof updater === 'function' ? updater(columnFilters) : updater;
      },
      onColumnVisibilityChange: (updater) => {
        columnVisibility =
          typeof updater === 'function' ? updater(columnVisibility) : updater;
      },
      onGlobalFilterChange: (updater) => {
        globalFilter =
          typeof updater === 'function' ? updater(globalFilter) : updater;
      },
      initialState: {
        expanded: true, // Expand all groups by default
      },
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        globalFilter,
      },
    }),
  );

  // Report selection changes
  $effect(() => {
    ground = selectedGroundId
      ? (molecules.find((m) => m.id === selectedGroundId) ?? null)
      : null;

    excited = selectedExcitedId
      ? (molecules.find((m) => m.id === selectedExcitedId) ?? null)
      : null;
  });

  // Current selection for toolbar display
  let selection = $derived<MoleculeSelection>({
    ground: selectedGroundId
      ? (molecules.find((m) => m.id === selectedGroundId) ?? null)
      : null,
    excited: selectedExcitedId
      ? (molecules.find((m) => m.id === selectedExcitedId) ?? null)
      : null,
  });
</script>

<div class="space-y-4">
  <TableToolbar
    {table}
    {globalFilter}
    onGlobalFilterChange={(value) => (globalFilter = value)}
    {selection}
    {molecules}
  />

  <div class="rounded-md border">
    <Table.Root>
      <Table.Header>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              {#if header.column.getIsVisible()}
                <Table.Head>
                  {#if !header.isPlaceholder}
                    <FlexRender
                      content={header.column.columnDef.header}
                      context={header.getContext()}
                    />
                  {/if}
                </Table.Head>
              {/if}
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>
      <Table.Body>
        {#each table.getRowModel().rows as row, index (row.id)}
          <!-- Note: table row extracted from Table.Row to apply slide/flip -->
          <tr
            data-slot="table-row"
            in:slide|global={{ duration: 300, delay: index * 60 }}
            animate:flip={{ duration: 300 }}
            class="border-b transition-colors data-[state=selected]:bg-muted hover:[&,&>svelte-css-wrapper]:[&>th,td]:bg-muted/50 {row.depth ===
            0
              ? 'bg-muted/30 hover:bg-muted/50'
              : row.depth > 0 &&
                  (selectedGroundId === (row.original as MoleculeRow).id ||
                    selectedExcitedId === (row.original as MoleculeRow).id)
                ? 'bg-primary/5 hover:bg-primary/10'
                : ''}"
          >
            {#each row.getVisibleCells() as cell (cell.id)}
              <Table.Cell>
                <div
                  in:slide|global={{ duration: 300, delay: index * 60 }}
                >
                  <FlexRender
                    content={cell.column.columnDef.cell}
                    context={cell.getContext()}
                  />
                </div>
              </Table.Cell>
            {/each}
          </tr>
        {/each}
        {#if table.getRowModel().rows.length === 0}
          <Table.Row>
            <Table.Cell
              colspan={table.getVisibleLeafColumns().length}
              class="h-24 text-center text-muted-foreground"
            >
              {#if loading}
                Loading Molecules
                <div class="absolute ml-2 inline-block">
                  <Spinner />
                </div>
              {:else}
                No molecules found.
              {/if}
            </Table.Cell>
          </Table.Row>
        {/if}
      </Table.Body>
    </Table.Root>
  </div>

  <TableFooter rowCount={molecules.length} groupCount={groupedData.length} />
</div>
