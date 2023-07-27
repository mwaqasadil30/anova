import { isNumber } from 'utils/format/numbers';

export const getNumberValue = (value: any) => (isNumber(value) ? value : '');
export const convertToNumber = <T = null>(value: any, defaultValue?: T) =>
  isNumber(value) ? Number(value) : defaultValue;
export const getBoolValue = (value: any) => value || false;
export function fieldValueOrEmpty<T>(value: T | null | undefined) {
  return value !== null && value !== undefined ? value : '';
}
