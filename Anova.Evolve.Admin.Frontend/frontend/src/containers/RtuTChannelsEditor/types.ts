export type HornerRtuChannelTableInfo = {
  id?: string;
  fieldName?: string | null;
  fieldType?: string | null;
  channelNumber?: string | null;
  rawMinimumValue?: number | null;
  rawMaximumValue?: number | null;
  scaledMinimumValue?: number | null;
  scaledMaximumValue?: number | null;
  unitOfMeasure?: string | null;
  decimalPlaces?: number | null;
  isDisplayed?: any | null;
  isRowSelected?: boolean;
};
export type FieldTypeInfo = {
  label?: string | null;
  value?: string | null;
  isRawMinDisplayed?: boolean;
  isRawMaxDisplayed?: boolean;
  isScaledMinDisplayed?: boolean;
  isScaledMaxDisplayed?: boolean;
  isUomDisplayed?: boolean;
  isDecimalPlacesDisplayed?: boolean;
};
