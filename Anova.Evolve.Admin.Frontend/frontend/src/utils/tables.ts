/* eslint-disable no-restricted-globals, no-continue */
import { Row } from 'react-table';

// By default, react-table seems to throw an error when sorting a column with
// dates that can be null. These helpers were copied over from react-table's
// source.
// https://github.com/tannerlinsley/react-table/blob/6600b275e34e49365119b9cbcba7f0a42c395a53/src/sortTypes.js
function getRowValueByColumnID<T extends object>(
  row: Row<T>,
  columnId: string
) {
  return row.values[columnId];
}

function compareBasic(a: any, b: any) {
  return a === b ? 0 : a > b ? 1 : -1;
}

export function sortNullableDates<T extends object>(
  rowA: Row<T>,
  rowB: Row<T>,
  columnId: string
) {
  let a = getRowValueByColumnID(rowA, columnId);
  let b = getRowValueByColumnID(rowB, columnId);
  a = a?.getTime();
  b = b?.getTime();

  // Handle when dates are null/undefined
  if (!a) {
    return -1;
  }
  if (!b) {
    return 1;
  }

  return compareBasic(a, b);
}

// Copied over from react table because it is inclusive of many edge cases
// Modified below (see note)
// https://github.com/tannerlinsley/react-table/blob/6600b275e34e49365119b9cbcba7f0a42c395a53/src/sortTypes.js
function toString(a: any) {
  if (typeof a === 'number') {
    if (isNaN(a) || a === Infinity || a === -Infinity) {
      return '';
    }
    return String(a);
  }
  if (typeof a === 'string') {
    return a;
  }
  if (typeof a === 'boolean') {
    return String(a);
  }
  return '';
}

export function caseInsensitive<T extends object>(
  rowA: Row<T>,
  rowB: Row<T>,
  columnId: string
) {
  let a = getRowValueByColumnID(rowA, columnId);
  let b = getRowValueByColumnID(rowB, columnId);

  a = toString(a).toLocaleLowerCase();
  b = toString(b).toLocaleLowerCase();

  return compareBasic(a, b);
}
