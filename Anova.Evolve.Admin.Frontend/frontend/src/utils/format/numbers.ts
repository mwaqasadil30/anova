// IMPORTANT NOTE: This isNumber helper behaves differently from lodash's
// isNumber function.
export const isNumber = (n: any) => {
  // eslint-disable-next-line no-restricted-globals
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
};

export const isInteger = (num: any) => {
  return isNumber(num) && Number.isInteger(Number(num));
};

export const formatTo4DecimalPlaces = (value: any, defaultDisplay = '') =>
  value ? Number.parseFloat(value).toFixed(4) : defaultDisplay;

export const formatSpecificGravity = (value: any) =>
  formatTo4DecimalPlaces(value);

export const formatStandardVolumPerCubicMeter = (value: any) =>
  formatTo4DecimalPlaces(value);

interface DecimalPlaceProps {
  scaledMin: number;
  scaledMax: number;
  heightInScaledUnits: number;
  heightInDisplayUnits: number;
}

// Potential helper function to that could be used in multiple places.
// See "Rounding values to Decimal Places for display purpose" in this spec:
// https://dev.azure.com/anovateam/Evolve/_wiki/wikis/Evolve.wiki/1270/Evolve-Quick-Tank-Create
export const getDecimalPlaces = ({
  scaledMin,
  scaledMax,
  heightInScaledUnits,
  heightInDisplayUnits,
}: DecimalPlaceProps) => {
  // 3 and 100 in the formula are default RTU instrumentation settings
  const sensorSpan = Math.abs(scaledMax - scaledMin);
  const offset =
    Math.floor(Math.log10(100)) -
    Math.round(Math.log10((100.0 * heightInScaledUnits) / sensorSpan));
  const decimalPlaces = Math.round(
    3 - Math.floor(Math.log10(heightInDisplayUnits)) - offset
  );

  // NOTE: This is a safeguard since this return value is eventually passed to
  // .toFixed() which only accepts values between 0 and 100, but the
  // calculations above can have a value of -1.
  return decimalPlaces < 0 ? 0 : decimalPlaces;
};

export const getNumberOrDefault = (
  originalNumber: string | number | null | undefined,
  defaultValue: string | number | null | undefined
) => {
  return isNumber(originalNumber) ? originalNumber : defaultValue;
};
