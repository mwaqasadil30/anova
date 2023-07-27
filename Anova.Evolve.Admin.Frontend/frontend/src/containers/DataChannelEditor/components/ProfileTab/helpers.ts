import { isNumber } from 'utils/format/numbers';

export const labelWithOptionalText = (
  label: string,
  optionalText?: string | null
) => {
  return optionalText ? `${label} (${optionalText})` : label;
};

export const valueWithOptionalText = (
  value?: number | null,
  unitText?: string | null,
  optionalMaxValue?: number | null
) => {
  const formattedValue = isNumber(value) ? value?.toString() : '';
  const formattedOptionalMaxValue = isNumber(optionalMaxValue)
    ? optionalMaxValue?.toString()
    : '';

  if (formattedValue && optionalMaxValue && unitText) {
    return `${formattedValue} - ${formattedOptionalMaxValue} ${unitText}`;
  }

  if (formattedValue && unitText) {
    return [formattedValue, unitText].join(' ');
  }

  return formattedValue;
};

export const showBlankForNullOrZeroNumberValues = (
  value: number | undefined | null
) => {
  if (!value) {
    return '';
  }

  return value;
};

export const showDashForNullOrZeroNumberValues = (
  value: number | undefined | null
) => {
  if (!value) {
    return '-';
  }

  return value;
};

export const showDashForEmptyStrings = (value: string | undefined | null) => {
  if (!value) {
    return '-';
  }

  return value;
};
