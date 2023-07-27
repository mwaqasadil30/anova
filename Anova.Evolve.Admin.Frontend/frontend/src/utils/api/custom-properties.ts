import {
  CustomPropertyDataType,
  EditAssetCustomPropertyItem,
} from 'api/admin/api';
import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const deserializeListValues = (listValues: string) =>
  listValues.split(',').filter(Boolean);
export const deserializeBooleanValue = (booleanValue?: string | null) => {
  // todo: aggressive assuming, userinput
  return ['true', '1', 'yes'].includes(booleanValue?.toLowerCase()!);
};
export const serializeBooleanValue = (booleanValue: boolean | null) => {
  // todo: aggressive assuming
  return booleanValue ? 'True' : 'False';
};
// todo aggressive assuming
export const deserializeNumberValue = (numberValue: string) =>
  Number.parseFloat(numberValue);
// todo aggressive assuming
export const serializeNumberValue = (numberValue: number) => `${numberValue}`;

const getPrecision = (currentValue: number) => {
  /* eslint-disable-next-line no-restricted-globals */
  if (!isFinite(currentValue) || (!currentValue && currentValue !== 0)) {
    return 0;
  }
  let exponent = 1;
  let precision = 0;
  while (Math.round(currentValue * exponent) / exponent !== currentValue) {
    exponent *= 10;
    precision += 1;
  }
  return precision;
};

/**
 * Return Yup validation to be used for an asset's custom properties.
 * @param t The i18next translation function
 */
export const customPropertiesValidationSchema = (t: TFunction) =>
  Yup.array(
    Yup.object().shape({
      dataType: Yup.number(),
      minimum: Yup.number().nullable(true),
      maximum: Yup.number().nullable(true),
      precision: Yup.number().nullable(true),
      value: Yup.mixed().when(
        ['dataType', 'minimum', 'maximum', 'precision'],
        (
          dataType: CustomPropertyDataType,
          minimum: number,
          maximum: number,
          precision: number
        ) => {
          switch (dataType) {
            case CustomPropertyDataType.Boolean: {
              return Yup.boolean();
            }
            case CustomPropertyDataType.Number: {
              const minmaxErrorMessage = t(
                'validate.common.minmaxnumber',
                'Value must be between {{minimum}} and {{maximum}} with a precision of {{precision}}',
                { minimum, maximum, precision }
              );
              return Yup.number()
                .nullable()
                .transform((currentValue, originalValue) =>
                  originalValue === '' ? null : currentValue
                )
                .test('Test', minmaxErrorMessage, (value: number) => {
                  return (
                    (!value && value !== 0) ||
                    (precision >= getPrecision(value) &&
                      minimum <= value &&
                      value <= maximum)
                  );
                });
            }
            case CustomPropertyDataType.String: {
              return Yup.string();
            }
            default:
              return Yup.mixed();
          }
        }
      ),
    })
  );

/**
 * Return a list of custom properties adjusted with formatted values to be used
 * in forms.
 * @param customProperties A list of an asset's custom properties
 */
export const massageCustomProperties = (
  customProperties?: EditAssetCustomPropertyItem[] | null
) => {
  const initialCustomProperties = customProperties || [];
  const formattedCustomProperties = initialCustomProperties.map((property) => {
    let { value }: any = property;

    switch (property.dataType) {
      case CustomPropertyDataType.Boolean: {
        value = deserializeBooleanValue(value) || false;
        break;
      }
      case CustomPropertyDataType.Number: {
        property.minimum = property.minimum || 0;
        property.maximum = property.maximum || 0;
        property.precision = property.precision || 0;
        value = value || '';
        break;
      }
      case CustomPropertyDataType.String:
      case CustomPropertyDataType.ValueList: {
        value = value || '';
        break;
      }
      default:
    }

    return {
      ...property,
      value,
    };
  });

  return formattedCustomProperties;
};
