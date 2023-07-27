import { TFunction } from 'i18next';
import { fieldIsRequired, fieldMaxLength } from 'utils/forms/errors';
import * as Yup from 'yup';
import { ObjectSchemaDefinition } from 'yup';
import {
  CustomPropertyDataType,
  EditAsset,
  EditAssetCustomPropertyItem,
} from '../../api/admin/api';
import { EMPTY_GUID } from '../../utils/api/constants';

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

export const buildValidationSchema = (
  t: TFunction,
  { descriptionText, siteText }: Record<string, string>
) => {
  const geoAreaGroupRequiredWithIsMobileText = t(
    'validate.asset.geoareagrouprequiredifassetmobile',
    'Geo Area Group is required if the Asset is marked as Mobile.'
  );

  const customPropertiesSchema = Yup.array(
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
    } as ObjectSchemaDefinition<Omit<EditAssetCustomPropertyItem, 'init' | 'toJSON'>>)
  );
  const editObjectSchema = Yup.object().shape(({
    description: Yup.string()
      .typeError(fieldIsRequired(t, descriptionText))
      .required(fieldIsRequired(t, descriptionText))
      .max(128, fieldMaxLength(t)),
    integrationName: Yup.string().max(80, fieldMaxLength(t)),
    notes: Yup.string().max(1000, fieldMaxLength(t)),
    siteId: Yup.string()
      .typeError(fieldIsRequired(t, siteText))
      .required(fieldIsRequired(t, siteText))
      .test(
        'Empty uuid',
        fieldIsRequired(t, siteText),
        (value) => value !== EMPTY_GUID
      ),
    geoAreaGroupId: Yup.mixed().when('isMobile', {
      is: (val) => !!val,
      then: Yup.string()
        .typeError(geoAreaGroupRequiredWithIsMobileText)
        .required(geoAreaGroupRequiredWithIsMobileText),
      otherwise: Yup.mixed(),
    }),
    customProperties: customPropertiesSchema,
  } as unknown) as ObjectSchemaDefinition<Omit<EditAsset, 'init' | 'toJSON'>>);

  return Yup.object().shape({
    asset: editObjectSchema,
  });
};
