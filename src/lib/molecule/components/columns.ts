import type { Molecule } from '../types';
import { createColumnHelper } from '@tanstack/table-core';

import { renderComponent } from '$lib/shadcn/components/ui/data-table';

import HeaderButton from './ui/TableHeaderButton.svelte';
import * as Cells from './ui/cells';

// Row type that includes both group rows and molecule rows
export type TableRow = GroupRow | MoleculeRow;

export type GroupRow = {
  moleculeName: string;
  atomCount: number;
  molecules: MoleculeRow[];
  // Mark this as a group row by omitting molecule-specific fields
  id?: never;
  filename?: never;
};

export type MoleculeRow = Molecule & {
  molecules?: never; // Molecule rows don't have subrows
};

// Type for external state handlers
export type MoleculeTableHandlers = {
  selectedGroundId: string | null;
  selectedExcitedId: string | null;
  editingCell: { id: string; field: string } | null;
  editValue: string;
  onSelectGround: (molecule: Molecule) => void;
  onSelectExcited: (molecule: Molecule) => void;
  onStartEdit: (
    id: string,
    field: string,
    value: string | number | null,
  ) => void;
  onSaveEdit: (value: string) => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
};

const columnHelper = createColumnHelper<TableRow>();

export function createMoleculeColumns(handlers: MoleculeTableHandlers) {
  return [
    // Molecule Name column
    columnHelper.accessor('moleculeName', {
      header: ({ column }) =>
        renderComponent(HeaderButton, {
          variant: 'ghost',
          size: 'sm',
          column: column,
          text: 'Molecule',
          onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }),
      cell: ({ row, getValue }) => {
        if (row.depth === 0) {
          // Group header - show molecule name and count
          return renderComponent(Cells.Text, {
            text: getValue(),
            class: 'font-medium',
          });
        }
        if (row.depth > 0) {
          const molecule = row.original as MoleculeRow;
          return renderComponent(Cells.Selection, {
            molecule,
            isSelectedGround: handlers.selectedGroundId === molecule.id,
            isSelectedExcited: handlers.selectedExcitedId === molecule.id,
            onSelectGround: handlers.onSelectGround,
            onSelectExcited: handlers.onSelectExcited,
          });
        }
        // Hide in child rows since shown in group header
        return '';
      },
    }),

    // Filename column
    columnHelper.accessor('filename', {
      header: 'Filename',
      cell: ({ row }) => {
        if (row.depth === 0) return '';
        const molecule = row.original as MoleculeRow;
        const isEditing =
          handlers.editingCell?.id === molecule.id &&
          handlers.editingCell?.field === 'filename';
        return renderComponent(Cells.TextEditable, {
          value: molecule.filename,
          isEditing,
          editValue: handlers.editValue,
          onStartEdit: () =>
            handlers.onStartEdit(molecule.id, 'filename', molecule.filename),
          onSave: handlers.onSaveEdit,
          onCancel: handlers.onCancelEdit,
          onEditValueChange: handlers.onEditValueChange,
        });
      },
    }),

    // Description column
    columnHelper.accessor('description', {
      header: 'Description',
      cell: ({ row }) => {
        if (row.depth === 0) return '';
        const molecule = row.original as MoleculeRow;
        const isEditing =
          handlers.editingCell?.id === molecule.id &&
          handlers.editingCell?.field === 'description';
        return renderComponent(Cells.TextEditable, {
          value: molecule.description,
          isEditing,
          editValue: handlers.editValue,
          maxWidth: '300px',
          onStartEdit: () =>
            handlers.onStartEdit(
              molecule.id,
              'description',
              molecule.description,
            ),
          onSave: handlers.onSaveEdit,
          onCancel: handlers.onCancelEdit,
          onEditValueChange: handlers.onEditValueChange,
        });
      },
    }),

    // State column
    columnHelper.accessor('state', {
      header: 'State',
      cell: ({ row, getValue }) => {
        const groupRow = row.original as GroupRow;
        if (row.depth === 0)
          return renderComponent(Cells.Text, {
            text: `(${groupRow.molecules.length} states)`,
            class: 'text-muted-foreground',
          });

        return renderComponent(Cells.StateBadge, {
          state: getValue(),
        });
      },
    }),

    // Reference column
    columnHelper.accessor('reference', {
      header: 'Reference',
      cell: ({ row }) => {
        if (row.depth === 0) return '';
        const molecule = row.original as MoleculeRow;
        const isEditing =
          handlers.editingCell?.id === molecule.id &&
          handlers.editingCell?.field === 'reference';
        return renderComponent(Cells.ReferenceEditable, {
          value: molecule.reference,
          isEditing,
          editValue: handlers.editValue,
          onStartEdit: () =>
            handlers.onStartEdit(molecule.id, 'reference', molecule.reference),
          onSave: handlers.onSaveEdit,
          onCancel: handlers.onCancelEdit,
          onEditValueChange: handlers.onEditValueChange,
        });
      },
    }),

    // Hidden columns
    columnHelper.accessor('atomCount', {
      header: ({ column }) =>
        renderComponent(HeaderButton, {
          variant: 'ghost',
          size: 'sm',
          column: column,
          text: 'Atoms',
          onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }),
      cell: ({ row, getValue }) => {
        if (row.depth === 0) return '';
        return renderComponent(Cells.Text, {
          text: getValue(),
        });
      },
    }),

    columnHelper.accessor('id', {
      header: 'ID',
      cell: ({ row, getValue }) => {
        if (row.depth === 0) return '';
        return renderComponent(Cells.Text, {
          text: getValue(),
          class: 'text-xs text-muted-foreground font-mono',
        });
      },
    }),

    columnHelper.accessor('sha', {
      header: 'SHA',
      cell: ({ row, getValue }) => {
        if (row.depth === 0) return '';
        return renderComponent(Cells.SHA, {
          sha: getValue(),
        });
      },
    }),

    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: ({ row, getValue }) => {
        if (row.depth === 0) return '';
        return renderComponent(Cells.Date, {
          date: getValue(),
        });
      },
    }),

    columnHelper.accessor('updatedAt', {
      header: 'Updated',
      cell: ({ row, getValue }) => {
        if (row.depth === 0) return '';
        return renderComponent(Cells.Date, {
          date: getValue(),
        });
      },
    }),
  ];
}
