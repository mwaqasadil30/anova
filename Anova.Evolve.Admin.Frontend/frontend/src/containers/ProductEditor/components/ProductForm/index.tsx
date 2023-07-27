import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from 'components/Alert';
import EditorBox from 'components/EditorBox';
import FormLinearProgress from 'components/FormLinearProgress';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import FreeSoloAutocomplete from 'components/forms/form-fields/FreeSoloAutocomplete';
import FormikEffect from 'components/forms/FormikEffect';
import PageSubHeader from 'components/PageSubHeader';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { fadedTextColor } from 'styles/colours';
import { getSimplifiedVolumetricUnits } from 'utils/i18n/enum-to-text';
import * as Yup from 'yup';
import { Values } from './types';

const buildProductSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const productNameRequiredText = t(
    'validate.common.isrequired',
    '{{field}} is required.',
    {
      field: translationTexts.productNameText,
    }
  );
  const specificGravityRangeText = t(
    'validate.product.invalidspecificgravityrange',
    'Specific Gravity must be between 0 and 9999.'
  );
  const standardVolumePerCubicMeterRangeText = t(
    'validate.product.invalidstandardvolumepercubicmeterrange',
    'SCM/M3 must be between 0 and 999999.'
  );
  return Yup.object().shape({
    name: Yup.string()
      .typeError(productNameRequiredText)
      .required(productNameRequiredText),
    specificGravity: Yup.number()
      .typeError(specificGravityRangeText)
      .nullable()
      .moreThan(0, specificGravityRangeText)
      .max(9999, specificGravityRangeText),
    standardVolumePerCubicMeter: Yup.number()
      .typeError(standardVolumePerCubicMeterRangeText)
      .nullable()
      .moreThan(0, standardVolumePerCubicMeterRangeText)
      .max(999999, standardVolumePerCubicMeterRangeText),
  });
};

const defaultInitialValues = {
  name: '',
  description: '',
  specificGravity: '',
  standardVolumePerCubicMeter: '',
  productGroup: '',
  displayUnit: '',
};

interface ProductFormProps
  extends Pick<
    FormikProps<Values>,
    'isSubmitting' | 'isValid' | 'errors' | 'touched' | 'setFieldTouched'
  > {
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  handleFormChange: (formik: FormikProps<Values>) => void;
  productGroupList: string[] | null | undefined;
  isInlineForm?: boolean;
}

const ProductForm = ({
  isSubmitting,
  productGroupList,
  submissionError,
  isInlineForm,
}: ProductFormProps) => {
  const { t } = useTranslation();

  const unitTypeSelectOptions = getSimplifiedVolumetricUnits(t);
  const productNameText = t('ui.product.productname', 'Product Name');

  return (
    <Form>
      {/*
        NOTE: Submitting with the enter key may cause issues with redirection
        logic since this form is used for both creating and editing. If this is
        a requirement, then re-add it and handle the case when creating using
        the enter key, and redirecting to the edit page.
      */}
      {/* <button type="submit" style={{ display: 'none' }}>
        Submit
      </button> */}

      <Grid container spacing={2}>
        {/*
          TODO: Find a better way to handle errors + loading state. At the
          moment the shift is too jarring where the error appears and takes up
          space pushing the loading spinner down
        */}
        <Fade in={!!submissionError} unmountOnExit>
          <Grid item xs={12}>
            <Alert severity="error">
              {t('ui.product.saveError', 'Unable to save product')}
            </Alert>
          </Grid>
        </Fade>
        <Grid item xs={12}>
          <FormLinearProgress in={isSubmitting} />
        </Grid>
        <Grid item xs={12}>
          <PageSubHeader dense>
            {t('ui.product.productInformation', 'Product Information')}
          </PageSubHeader>
        </Grid>

        <Grid item xs={12}>
          <EditorBox>
            <Grid container spacing={3}>
              <Grid item xs={12} md={isInlineForm ? undefined : 6}>
                <Grid container spacing={3} direction="column">
                  <Grid item>
                    <Field
                      id="name-input"
                      component={CustomTextField}
                      required
                      name="name"
                      label={productNameText}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      id="description-input"
                      component={CustomTextField}
                      name="description"
                      label={t('ui.common.description', 'Description')}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      id="productGroup-input"
                      component={FreeSoloAutocomplete}
                      name="productGroup"
                      textFieldProps={{
                        label: t('ui.product.productgroup', 'Product Group'),
                      }}
                      options={productGroupList}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={isInlineForm ? undefined : 6}>
                <Grid container spacing={3} direction="column">
                  <Grid item>
                    <Field
                      id="specificGravity-input"
                      component={CustomTextField}
                      type="number"
                      name="specificGravity"
                      label={t(
                        'ui.product.specificgravity',
                        'Specific Gravity'
                      )}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      id="standardVolumePerCubicMeter-input"
                      component={CustomTextField}
                      type="number"
                      name="standardVolumePerCubicMeter"
                      label={t('ui.product.scmm3', 'SCM/M3')}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      id="displayUnit-input"
                      component={CustomTextField}
                      select
                      name="displayUnit"
                      label={t('ui.rtu.displayunits', 'Display Units')}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="" disabled>
                        <span style={{ color: fadedTextColor }}>
                          {t('ui.common.select', 'Select')}
                        </span>
                      </MenuItem>
                      {unitTypeSelectOptions.map((option) => (
                        <MenuItem key={option.label} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </EditorBox>
        </Grid>
      </Grid>
    </Form>
  );
};

const formatInitialValues = (values: any) => {
  return {
    ...values,
    ...(!values.name && { name: '' }),
    ...(!values.description && { description: '' }),
    ...(!values.specificGravity && { specificGravity: '' }),
    ...(!values.standardVolumePerCubicMeter && {
      standardVolumePerCubicMeter: '',
    }),
    ...(!values.productGroup && { productGroup: '' }),
    ...(!values.displayUnit && { displayUnit: '' }),
  };
};

interface Props {
  initialValues: any;
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  onSubmit: (values: Values, formikBag: FormikHelpers<Values>) => void;
  handleFormChange: (formik: FormikProps<Values>) => void;
  productGroupList: string[] | null | undefined;
  isInlineForm?: boolean;
}

const ProductFormWrapper = ({
  initialValues,
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  productGroupList,
  onSubmit,
  submissionError,
  isInlineForm,
}: Props) => {
  const { t } = useTranslation();

  const formInitialValues = initialValues || defaultInitialValues;
  const formattedInitialValues = formatInitialValues(formInitialValues);

  const productNameText = t('ui.product.productname', 'Product Name');
  const validationSchema = buildProductSchema(t, { productNameText });

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
          <ProductForm
            {...formikProps}
            restoreInitialValues={restoreInitialValues}
            handleFormChange={handleFormChange}
            restoreTouchedFields={restoreTouchedFields}
            productGroupList={productGroupList}
            submissionError={submissionError}
            isInlineForm={isInlineForm}
          />
        </>
      )}
    </Formik>
  );
};

export default ProductFormWrapper;
