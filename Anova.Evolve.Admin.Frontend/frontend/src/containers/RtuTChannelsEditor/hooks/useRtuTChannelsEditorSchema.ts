import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const useRtuTChannelsEditorSchema = () => {
  const { t } = useTranslation();
  const rtuTChannelsEditorSchema = Yup.object().shape({
    channels: Yup.array().of(
      Yup.object().shape({
        decimalPlaces: Yup.number()
          .integer()
          .typeError(t('ui.error.valuemustnumber', 'Value must be a number.'))
          .nullable(true),
        rawMinimumValue: Yup.number()
          .integer()
          .typeError(t('ui.error.valuemustnumber', 'Value must be a number.'))
          .max(
            Yup.ref('rawMaximumValue'),
            t(
              'ui.error.minmustlessthanmax',
              '{{min}} must be less than {{max}}',
              { min: 'RAW MIN', max: 'RAW MAX' }
            )
          )
          .nullable(true),
        rawMaximumValue: Yup.number()
          .integer()
          .typeError(t('ui.error.valuemustnumber', 'Value must be a number.'))
          .min(
            Yup.ref('rawMinimumValue'),
            t(
              'ui.error.maxmustmorethanmin',
              '{{max}} must be greater than {{min}}',
              { min: 'RAW MIN', max: 'RAW MAX' }
            )
          )
          .nullable(true),
        scaledMinimumValue: Yup.number()
          .integer()
          .typeError(t('ui.error.valuemustnumber', 'Value must be a number.'))
          .max(
            Yup.ref('scaledMaximumValue'),
            t(
              'ui.error.minmustlessthanmax',
              '{{min}} must be less than {{max}}',
              { min: 'SCALED MIN', max: 'SCALED MAX' }
            )
          )
          .nullable(true),
        scaledMaximumValue: Yup.number()
          .integer()
          .typeError(t('ui.error.valuemustnumber', 'Value must be a number.'))
          .min(
            Yup.ref('scaledMinimumValue'),
            t(
              'ui.error.maxmustmorethanmin',
              '{{max}} must be greater than {{min}}',
              { min: 'SCALED MIN', max: 'SCALED MAX' }
            )
          )
          .nullable(true),
      })
    ),
  });
  return rtuTChannelsEditorSchema;
};
export default useRtuTChannelsEditorSchema;
