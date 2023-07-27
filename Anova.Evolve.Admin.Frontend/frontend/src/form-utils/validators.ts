import type { FormValue } from './types';

export const requiredField = (value: FormValue) =>
  value ? undefined : 'Required';
export const arrayMinLength = (minLength: number) => (
  value: Array<FormValue>
) => {
  if (!value || value.length < minLength) {
    return 'Required';
  }

  return '';
};

export const email = (value: string) => {
  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return 'Invalid email address';
  }

  return '';
};

export const requiredArray = arrayMinLength(1);
export const maxLength = (max: number) => (value: string | undefined | null) =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
export const minLength = (min: number) => (value: string | undefined | null) =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
export const number = (value: string | number | undefined | null) =>
  value && Number.isNaN(Number(value)) ? 'Must be a number' : undefined;
export const minValue = (min: number) => (value: number | undefined | null) =>
  value && value < min ? `Must be at least ${min}` : undefined;
