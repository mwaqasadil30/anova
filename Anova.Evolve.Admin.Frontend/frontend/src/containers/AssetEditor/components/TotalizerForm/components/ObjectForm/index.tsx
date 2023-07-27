/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {
  EditAssetDataChannel,
  EventRuleGroupInfo,
  EvolveDataChannelTemplateDetail,
} from 'api/admin/api';
import Alert from 'components/Alert';
import EditorBox from 'components/EditorBox';
import FormLinearProgress from 'components/FormLinearProgress';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import FormikEffect from 'components/forms/FormikEffect';
import Checkbox from 'components/forms/styled-fields/Checkbox';
import PageSubHeader from 'components/PageSubHeader';
import {
  Field,
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik';
import { TFunction } from 'i18next';
import uniqBy from 'lodash/uniqBy';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { fadedTextColor } from 'styles/colours';
import { fieldIsRequired } from 'utils/forms/errors';
import * as Yup from 'yup';
import FormChangeEffect from '../FormChangeEffect';
import { Values } from './types';

const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  return Yup.object().shape({
    description: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.descriptionText))
      .required(fieldIsRequired(t, translationTexts.descriptionText)),
    dataChannelTemplateId: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.templateText))
      .required(fieldIsRequired(t, translationTexts.templateText)),
  });
};

interface InitialValuesOptions {
  products?: any[];
  templates?: EvolveDataChannelTemplateDetail[] | null;
}

const formatInitialValues = (
  values?: any,
  { products, templates }: InitialValuesOptions = {}
) => {
  return {
    ...values,
    // TODO: Should the default value be translated? or should it always be in
    // English?
    ...(!values?.description && { description: 'Total' }),
    ...(!values?.dataChannelTemplateId && {
      dataChannelTemplateId: templates?.[0]?.dataChannelTemplateId,
    }),
    ...(!values?.eventRuleGroupId && { eventRuleGroupId: '' }),
    ...(!values?.productId && {
      productId: products?.filter((product) => !!product.id)?.[0]?.id || '',
    }),
    ...(!values?.levelChannels && { levelChannels: [] }),
  };
};

interface Props {
  dataChannelTemplates?: EvolveDataChannelTemplateDetail[] | null;
  validLevelDataChannels?: EditAssetDataChannel[] | null;
  eventRuleGroups?: EventRuleGroupInfo[] | null;
  domainId?: string;
  userId?: string;
  initialValues: any;
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  submissionResult?: any;
  onSubmit: (values: Values, formikBag: FormikHelpers<Values>) => void;
  handleFormChange: (formik: FormikProps<Values>) => void;
}

const ObjectForm = ({
  dataChannelTemplates,
  validLevelDataChannels,
  eventRuleGroups,
  initialValues,
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  onSubmit,
  submissionError,
}: Props) => {
  const { t } = useTranslation();

  const descriptionText = t('ui.common.description', 'Description');
  const productText = t('ui.common.product', 'Product');
  const templateText = t('ui.datachannel.template', 'Template');
  const validationSchema = buildValidationSchema(t, {
    descriptionText,
    templateText,
  });

  const allProducts = validLevelDataChannels?.map((channel) => ({
    id: channel.productId,
    name: channel.productName,
    specificGravity: channel.productSpecificGravity,
    description: channel.productDescription,
  }));

  const uniqueProducts = uniqBy(allProducts, 'id');

  const formattedInitialValues = formatInitialValues(initialValues, {
    products: uniqueProducts,
    templates: dataChannelTemplates,
  });

  const handleCheckBox = (
    value: string,
    isChecked: boolean,
    selectedDataChannelsValue: string[] | undefined,
    arrayHelpers: FieldArrayRenderProps
  ) => {
    if (isChecked) {
      arrayHelpers.push(value);
      return;
    }

    const checkboxIndex = selectedDataChannelsValue?.indexOf(value);
    // NOTE: There's a bug in Formik where removing the last element in a
    // FieldArray sets the array value to undefined.
    // https://github.com/formik/formik/issues/2130

    if (checkboxIndex !== -1 && checkboxIndex !== undefined) {
      arrayHelpers.remove(checkboxIndex);
    }
  };

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
      {({ isSubmitting, isValid, values }) => {
        const levelDataChannelsForSelectedProduct = validLevelDataChannels?.filter(
          (channel) => channel.productId === values.productId
        );
        return (
          <>
            <FormikEffect
              onChange={handleFormChange}
              isValid={isValid}
              restoreTouchedFields={restoreTouchedFields}
              restoreInitialValues={restoreInitialValues}
            />
            <FormChangeEffect />

            <Form>
              <Grid container spacing={2}>
                <Fade in={!!submissionError} unmountOnExit>
                  <Grid item xs={12}>
                    <Alert severity="error">
                      {t(
                        'ui.asset.addDataChannelError',
                        'Unable to add data channel'
                      )}
                    </Alert>
                  </Grid>
                </Fade>
                <Grid item xs={12}>
                  <FormLinearProgress in={isSubmitting} />
                </Grid>
              </Grid>

              <EditorBox>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      component={CustomTextField}
                      name="description"
                      label={t('ui.common.description', 'Description')}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      id="product-input"
                      component={CustomTextField}
                      name="productId"
                      label={productText}
                      select
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="" disabled>
                        <span style={{ color: fadedTextColor }}>
                          {t('ui.common.select', 'Select')}
                        </span>
                      </MenuItem>
                      {uniqueProducts?.map((product) => (
                        <MenuItem key={product.id!} value={product.id!}>
                          {product.name || t('ui.common.none', 'None')}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      component={CustomTextField}
                      name="dataChannelTemplateId"
                      label={templateText}
                      select
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="" disabled>
                        <span style={{ color: fadedTextColor }}>
                          {t('ui.common.select', 'Select')}
                        </span>
                      </MenuItem>
                      {dataChannelTemplates?.map((template) => (
                        <MenuItem
                          key={template.dataChannelTemplateId}
                          value={template.dataChannelTemplateId}
                        >
                          {template.description}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      id="eventRuleGroupId-input"
                      component={CustomTextField}
                      select
                      name="eventRuleGroupId"
                      label={t('ui.common.eventrulegroup', 'Event Rule Group')}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="" disabled>
                        <span style={{ color: fadedTextColor }}>
                          {t('ui.common.select', 'Select')}
                        </span>
                      </MenuItem>
                      {eventRuleGroups?.map((eventRuleGroup) => (
                        <MenuItem
                          key={eventRuleGroup.eventRuleGroupId}
                          value={eventRuleGroup.eventRuleGroupId}
                        >
                          {eventRuleGroup.description}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <FieldArray
                      name="levelChannels"
                      render={(arrayHelpers) => (
                        <Grid container>
                          <Grid item xs={12}>
                            <Box mb={2}>
                              <PageSubHeader dense>
                                {t(
                                  'ui.totalizer.selectLevelChannels',
                                  'Select Level Channels to Totalize'
                                )}
                              </PageSubHeader>
                            </Box>
                          </Grid>

                          {levelDataChannelsForSelectedProduct?.map(
                            (dataChannel) => {
                              const isSelected = !!values.levelChannels?.includes(
                                dataChannel.dataChannelId!
                              );

                              const deviceIdLabel = dataChannel.rtuDeviceId
                                ? `(${dataChannel.rtuDeviceId})`
                                : '';
                              const label = [
                                dataChannel.description,
                                deviceIdLabel,
                              ]
                                .filter(Boolean)
                                .join(' ');

                              return (
                                <Grid
                                  item
                                  xs={12}
                                  key={dataChannel.dataChannelId!}
                                >
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={isSelected}
                                        key={dataChannel.dataChannelId!}
                                        value={dataChannel.dataChannelId!}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                          handleCheckBox(
                                            dataChannel.dataChannelId!,
                                            e.target.checked,
                                            values.levelChannels!,
                                            arrayHelpers
                                          );

                                          // Reset the field error because formik
                                          // will could treat the error message
                                          // string as an array and remove
                                          // characters when checking/unchecking
                                          // these checkboxes
                                          arrayHelpers.form.setFieldError(
                                            'levelChannels',
                                            ''
                                          );
                                        }}
                                      />
                                    }
                                    label={label}
                                  />
                                </Grid>
                              );
                            }
                          )}

                          <FormHelperText error>
                            {arrayHelpers.form.errors.levelChannels}
                          </FormHelperText>
                        </Grid>
                      )}
                    />
                  </Grid>
                </Grid>
              </EditorBox>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default ObjectForm;
