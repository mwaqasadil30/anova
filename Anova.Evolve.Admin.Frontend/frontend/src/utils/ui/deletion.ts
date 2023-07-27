import { Row } from 'react-table';

export function toggleAllSelectedRows<T extends object>(
  selectedRows: Record<string, T>,
  selectableRows: Row<T>[],
  idKey: keyof T
) {
  const areAllRowsSelected =
    !!selectableRows.length &&
    selectableRows.every(
      // The ID field is usually a string (GUID)
      (row) => selectedRows[(row.original[idKey] as unknown) as string]
    );

  if (areAllRowsSelected) {
    return {};
  }

  return selectableRows.reduce<Record<string, T>>((mem, row) => {
    mem[(row.original[idKey!] as unknown) as string] = row.original;
    return mem;
  }, {});
}

export function toggleOneSelectedRow<T extends object>(
  previousSelectedRows: Record<string, T>,
  toggledRow: Row<T>,
  idKey: keyof T
) {
  const newSelectedRows = { ...previousSelectedRows };
  const idValue = (toggledRow.original[idKey] as unknown) as string;
  const isChecked = newSelectedRows[idValue];
  if (isChecked) {
    delete newSelectedRows[idValue];
  } else {
    newSelectedRows[idValue] = toggledRow.original;
  }

  return newSelectedRows;
}
