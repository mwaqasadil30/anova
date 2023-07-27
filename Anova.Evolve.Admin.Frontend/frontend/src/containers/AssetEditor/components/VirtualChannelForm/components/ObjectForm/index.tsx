import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import {
  EditAssetDataChannel,
  EventRuleGroupInfo,
  EvolveDataChannelTemplateDetail,
} from 'api/admin/api';
import { ReactComponent as AddIcon } from 'assets/icons/icon-add.svg';
import { ReactComponent as RemoveOutlinedDarkIcon } from 'assets/icons/icon-remove.svg';
import Alert from 'components/Alert';
import Button from 'components/Button';
import EditorBox from 'components/EditorBox';
import FormLinearProgress from 'components/FormLinearProgress';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import FormikEffect from 'components/forms/FormikEffect';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import MessageBlock from 'components/MessageBlock';
import PageSubHeader from 'components/PageSubHeader';
import {
  Field,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { defaultTextColor, fadedTextColor } from 'styles/colours';
import { fieldIsRequired } from 'utils/forms/errors';
import { getOperatorTypeOptions } from 'utils/i18n/enum-to-text';
import * as Yup from 'yup';
import { Values } from './types';

const StyledEmptyText = styled(Typography)`
  font-weight: 500;
  color: ${defaultTextColor};
`;

const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  return Yup.object().shape({
    description: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.descriptionText))
      .required(fieldIsRequired(t, translationTexts.descriptionText)),
  });
};

const formatInitialValues = (values?: any) => {
  return {
    ...values,
    ...(!values?.description && { description: '' }),
    ...(!values?.dataChannelTemplateId && { dataChannelTemplateId: '' }),
    ...(!values?.eventRuleGroupId && { eventRuleGroupId: '' }),
    ...(!values?.productId && { productId: '' }),
    ...(!values?.dataChannelIds && { dataChannelIds: [] }),
  };
};

interface Props {
  dataChannelTemplates?: EvolveDataChannelTemplateDetail[] | null;
  dataChannels?: EditAssetDataChannel[] | null;
  levelDataChannels?: EditAssetDataChannel[] | null;
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
  dataChannels,
  eventRuleGroups,
  initialValues,
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  onSubmit,
  submissionError,
}: Props) => {
  const { t } = useTranslation();

  const formattedInitialValues = formatInitialValues(initialValues);

  const descriptionText = t('ui.common.description', 'Description');

  const operatorTypeOptions = getOperatorTypeOptions();
  const validationSchema = buildValidationSchema(t, {
    descriptionText,
  });

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
        return (
          <>
            <FormikEffect
              onChange={handleFormChange}
              isValid={isValid}
              restoreTouchedFields={restoreTouchedFields}
              restoreInitialValues={restoreInitialValues}
            />

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
                      component={CustomTextField}
                      name="dataChannelTemplateId"
                      label={t('ui.datachannel.template', 'Template')}
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

                  <FieldArray
                    name="formulaParts"
                    render={(arrayHelpers) => (
                      <>
                        <Grid item xs={12}>
                          <Grid
                            container
                            alignItems="center"
                            justify="space-between"
                            spacing={1}
                          >
                            <Grid item>
                              <PageSubHeader dense>
                                {t('ui.virtualChannel.operands', 'Operands')}
                              </PageSubHeader>
                            </Grid>
                            <Grid item>
                              <Button
                                variant="text"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                  arrayHelpers.push({
                                    isEnabled: false,
                                    dataChannel: '',
                                    expression: '',
                                    constant: '',
                                    operation: '',
                                  });
                                }}
                              >
                                {t('ui.common.add', 'Add')}
                              </Button>
                            </Grid>
                            <Grid item xs={12}>
                              <Divider />
                            </Grid>
                          </Grid>
                        </Grid>

                        {!values.formulaParts?.length ? (
                          <Grid item xs={12}>
                            <MessageBlock height="initial">
                              <StyledEmptyText>
                                {t(
                                  'ui.virtualChannel.noOperandsAdded',
                                  'No operands added'
                                )}
                              </StyledEmptyText>
                            </MessageBlock>
                          </Grid>
                        ) : (
                          <Grid item xs={12}>
                            {values.formulaParts?.map((formulaPart, index) => {
                              return (
                                <Grid key={index} container spacing={3}>
                                  <Grid item xs={12}>
                                    <Grid
                                      container
                                      alignItems="center"
                                      justify="space-between"
                                    >
                                      <Grid item>
                                        <Field
                                          component={CheckboxWithLabel}
                                          name={`formulaParts.${index}.isEnabled`}
                                          type="checkbox"
                                          Label={{
                                            label: t(
                                              'ui.virtualChannel.operandNumberEnabled',
                                              'Operand {{number}} enabled',
                                              {
                                                number: index + 1,
                                              }
                                            ),
                                          }}
                                        />
                                      </Grid>
                                      <Grid item>
                                        <Button
                                          variant="text"
                                          startIcon={<RemoveOutlinedDarkIcon />}
                                          onClick={() => {
                                            arrayHelpers.remove(index);
                                          }}
                                        >
                                          {t('ui.common.remove', 'Remove')}
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Field
                                      component={CustomTextField}
                                      name={`formulaParts.${index}.dataChannel`}
                                      label={t(
                                        'ui.common.datachannel',
                                        'Data Channel'
                                      )}
                                      select
                                      SelectProps={{ displayEmpty: true }}
                                    >
                                      <MenuItem value="">
                                        <SelectItem />
                                      </MenuItem>
                                      {dataChannels?.map((dataChannel) => (
                                        <MenuItem
                                          key={dataChannel.dataChannelId}
                                          value={dataChannel.dataChannelId}
                                        >
                                          {dataChannel.description}
                                        </MenuItem>
                                      ))}
                                    </Field>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Field
                                      component={CustomTextField}
                                      name={`formulaParts.${index}.expression`}
                                      label={t(
                                        'ui.datachannel.expression',
                                        'Expression'
                                      )}
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Field
                                      component={CustomTextField}
                                      name={`formulaParts.${index}.constant`}
                                      label={t(
                                        'ui.datachannel.constant',
                                        'Constant'
                                      )}
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Field
                                      component={CustomTextField}
                                      name={`formulaParts.${index}.operation`}
                                      label={t(
                                        'ui.datachannel.operation',
                                        'Operation'
                                      )}
                                      select
                                      SelectProps={{ displayEmpty: true }}
                                    >
                                      <MenuItem value="">
                                        <span
                                          style={{
                                            color: fadedTextColor,
                                          }}
                                        >
                                          {t('ui.common.select', 'Select')}
                                        </span>
                                      </MenuItem>
                                      {operatorTypeOptions.map((option) => (
                                        <MenuItem
                                          key={option.label}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                    </Field>
                                  </Grid>
                                </Grid>
                              );
                            })}
                          </Grid>
                        )}
                      </>
                    )}
                  />

                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <PageSubHeader dense>
                          {t('ui.datachannel.formula', 'Formula')}
                        </PageSubHeader>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      label={t(
                        'ui.virtualChannel.formulaPreview',
                        'Formula Preview'
                      )}
                      // TODO: Generate the formula from values.operands
                      value=""
                      disabled
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
