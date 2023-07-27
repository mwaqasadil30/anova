/* eslint-disable import/prefer-default-export */

import type { FormValue } from './types';

export const toDate = (value: FormValue) => {
  if (typeof value === 'string') {
    return new Date(value);
  }
  return value;
};
