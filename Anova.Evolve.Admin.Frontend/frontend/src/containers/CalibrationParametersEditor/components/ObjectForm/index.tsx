import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { EditDataChannelOptions, ScalingModeType } from 'api/admin/api';
import Alert from 'components/Alert';
import FormLinearProgress from 'components/FormLinearProgress';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import FreeSoloAutocomplete from 'components/forms/form-fields/FreeSoloAutocomplete';
import FormikEffect from 'components/forms/FormikEffect';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import PageSubHeader from 'components/PageSubHeader';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getBoolValue, getNumberValue } from 'utils/forms/values';
import { getScalingModeTypeOptions } from 'utils/i18n/enum-to-text';
import * as Yup from 'yup';
import { Values } from './types';

interface FormProps
  extends Pick<
    FormikProps<Values>,
    | 'isSubmitting'
    | 'isValid'
    | 'errors'
    | 'touched'
    | 'setFieldTouched'
    | 'values'
    | 'setFieldValue'
  > {
  submissionError?: any;
  options?: EditDataChannelOptions | null;
}

const ObjectFormContent = ({
  values,
  options,
  isSubmitting,
  submissionError,
}: FormProps) => {
  const { t } = useTranslation();
  const scalingModeOptions = getScalingModeTypeOptions(t);

  return (
    <Form>
      <Grid container spacing={3}>
        <Fade in={!!submissionError} unmountOnExit>
          <Grid item xs={12}>
            {/* TODO: Move the error into the page intro? */}
            <Alert severity="error">
              {t(
                'ui.calibrationParameters.saveError',
                'Unable to save calibration parameters'
              )}
            </Alert>
          </Grid>
        </Fade>
        <Grid item xs={12}>
          <FormLinearProgress in={isSubmitting} />
        </Grid>
        <Grid item xs={12}>
          <Field
            id="scalingMode-input"
            component={CustomTextField}
            label={t('ui.datachannel.scalingmode', 'Scaling Mode')}
            select
            name="scalingMode"
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value="" disabled>
              <SelectItem />
            </MenuItem>

            {scalingModeOptions?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field>
        </Grid>
        {values.scalingMode === ScalingModeType.Linear && (
          <>
            <Grid item xs={12}>
              <PageSubHeader dense>
                {t('ui.calibrationParameters.rawParameters', 'Raw Parameters')}
              </PageSubHeader>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Field
                    id="rawUnits-input"
                    component={FreeSoloAutocomplete}
                    name="rawUnits"
                    textFieldProps={{
                      label: t('ui.datachannel.rawunits', 'Raw Units'),
                    }}
                    options={options?.rawUnitsList}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Field
                id="rawUnitsAtZero-input"
                name="rawUnitsAtZero"
                type="number"
                component={CustomTextField}
                label={t(
                  'ui.datachannel.rawunitsatzero',
                  'Raw Units At Zero Scale'
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                id="rawUnitsAtFullScale-input"
                name="rawUnitsAtFullScale"
                type="number"
                component={CustomTextField}
                label={t(
                  'ui.datachanneltemplate.rawunitsatfullscale',
                  'Raw Units At Full Scale'
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={6}>
              <Field
                id="rawUnitsAtScaledMin-input"
                name="rawUnitsAtScaledMin"
                type="number"
                component={CustomTextField}
                label={t(
                  'ui.datachanneltemplate.rawunitsatscaledmin',
                  'Raw Units At Scaled Min'
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                id="rawUnitsAtScaledMax-input"
                name="rawUnitsAtScaledMax"
                type="number"
                component={CustomTextField}
                label={t(
                  'ui.datachanneltemplate.rawunitsatscaledmax',
                  'Raw Units At Scaled Max'
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                id="isDataInverted-input"
                name="isDataInverted"
                type="checkbox"
                component={CheckboxWithLabel}
                Label={{
                  label: t('ui.datachannel.invertdata', 'Invert Data'),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <PageSubHeader dense>
                {t(
                  'ui.calibrationParameters.outOfRangeReadingRules',
                  'Out of Range Reading Rules'
                )}
              </PageSubHeader>
            </Grid>
            <Grid item xs={6}>
              <Field
                id="rawUnitsAtUnderRange-input"
                name="rawUnitsAtUnderRange"
                type="number"
                component={CustomTextField}
                label={t('ui.calibrationParameters.underRange', 'Under Range')}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                id="rawUnitsAtOverRange-input"
                name="rawUnitsAtOverRange"
                type="number"
                component={CustomTextField}
                label={t('ui.calibrationParameters.overRange', 'Over Range')}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <PageSubHeader dense>
            {t(
              'ui.calibrationParameters.scaledParameters',
              'Scaled Parameters'
            )}
          </PageSubHeader>
        </Grid>
        <Grid item xs={6}>
          <Field
            id="scaledMin-input"
            name="scaledMin"
            type="number"
            component={CustomTextField}
            label={t('ui.datachannel.scaledmin', 'Scaled Min')}
          />
        </Grid>
        <Grid item xs={6}>
          <Field
            id="scaledMax-input"
            name="scaledMax"
            type="number"
            component={CustomTextField}
            label={t('ui.datachannel.scaledmax', 'Scaled Max')}
          />
        </Grid>
      </Grid>
    </Form>
  );
};

const formatInitialValues = (values?: any): Values => {
  return {
    scalingMode: values?.scalingMode || ScalingModeType.Linear,
    rawUnits: values.rawUnits || '',
    rawUnitsAtZero: getNumberValue(values.rawUnitsAtZero),
    rawUnitsAtFullScale: getNumberValue(values.rawUnitsAtFullScale),
    rawUnitsAtScaledMin: getNumberValue(values.rawUnitsAtScaledMin),
    rawUnitsAtScaledMax: getNumberValue(values.rawUnitsAtScaledMax),
    isDataInverted: getBoolValue(values.isDataInverted),
    rawUnitsAtUnderRange: getNumberValue(values.rawUnitsAtUnderRange),
    rawUnitsAtOverRange: getNumberValue(values.rawUnitsAtOverRange),
    scaledMin: getNumberValue(values.scaledMin),
    scaledMax: getNumberValue(values.scaledMax),
  };
};

const buildValidationSchema = () => {
  // NOTE: Front-end validation may not be needed for this form
  return Yup.object().shape({});
};

interface Props {
  initialValues: any;
  options?: EditDataChannelOptions | null;
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  onSubmit: (values: Values, formikBag: FormikHelpers<Values>) => void;
  handleFormChange: (formik: FormikProps<Values>) => void;
}

const ObjectFormWrapper = ({
  initialValues,
  options,
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  onSubmit,
  submissionError,
}: Props) => {
  const formattedInitialValues = formatInitialValues(initialValues);
  const validationSchema = buildValidationSchema();

  return (
    <Formik
      // NOTE: Using `enableReinitialize` could cause the resetForm method to
      // not work. Instead, we're resetting the form by re-fetching the
      // required data to edit the form, and unmounting then mounting the form
      // again so that the initialValues passed from the parent are used
      // correctly
      initialValues={formattedInitialValues}
      validateOnChange
      validateOnBlur
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps) => (
        <>
          <FormikEffect
            onChange={handleFormChange}
            // NOTE: Adding additional props here like isValid may cause the
            // restoring of tabbed form values to screw up. Just something to
            // be aware of if values stop being restored properly
            isValid={formikProps.isValid}
            restoreTouchedFields={restoreTouchedFields}
            restoreInitialValues={restoreInitialValues}
          />
          <ObjectFormContent
            {...formikProps}
            options={options}
            submissionError={submissionError}
          />
        </>
      )}
    </Formik>
  );
};

export default ObjectFormWrapper;
