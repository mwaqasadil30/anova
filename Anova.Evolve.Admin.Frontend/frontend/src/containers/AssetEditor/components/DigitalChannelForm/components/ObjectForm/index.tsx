/* eslint-disable indent */
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import {
  EventRuleGroupInfo,
  EvolveDataChannelTemplateDetail,
  RTUChannelUsageInfo,
  RTUDeviceInfo,
} from 'api/admin/api';
import Alert from 'components/Alert';
import EditorBox from 'components/EditorBox';
import FormLinearProgress from 'components/FormLinearProgress';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import RTUAutoCompleteLegacy from 'components/forms/form-fields/RTUAutoCompleteLegacy';
import FormikEffect from 'components/forms/FormikEffect';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fadedTextColor } from 'styles/colours';
import { fieldIsRequired, fieldMustBeNumber } from 'utils/forms/errors';
import * as Yup from 'yup';
import FormChangeEffect from '../FormChangeEffect';
import { Values } from './types';

const StyledTitleText = styled(Typography)`
  font-weight: 600;
  font-size: 20px;
`;

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
    state0Value: Yup.number()
      .typeError(fieldMustBeNumber(t, translationTexts.valueText))
      .required(fieldIsRequired(t, translationTexts.valueText)),
    state1Value: Yup.number()
      .typeError(fieldMustBeNumber(t, translationTexts.valueText))
      .required(fieldIsRequired(t, translationTexts.valueText)),
    state0Text: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.stateText))
      .required(fieldIsRequired(t, translationTexts.stateText)),
    state1Text: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.stateText))
      .required(fieldIsRequired(t, translationTexts.stateText)),
  });
};

const formatInitialValues = (values?: any) => {
  return {
    ...values,
    ...(!values?.description && { description: '' }),
    ...(!values?.rtuId && { rtuId: '' }),
    ...(!values?.rtuChannelId && { rtuChannelId: '' }),
    ...(!values?.dataChannelTemplateId && { dataChannelTemplateId: '' }),
    ...(!values?.eventRuleGroupId && { eventRuleGroupId: '' }),
    ...(!values?.state0Value && { state0Value: '' }),
    ...(!values?.state0Text && { state0Text: '' }),
    ...(!values?.state1Value && { state1Value: '' }),
    ...(!values?.state1Text && { state1Text: '' }),
  };
};

interface Props {
  dataChannelTemplates?: EvolveDataChannelTemplateDetail[] | null;
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
  eventRuleGroups,
  domainId,
  initialValues,
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  onSubmit,
  submissionError,
}: Props) => {
  const { t } = useTranslation();

  const [selectedRtu, setSelectedRtu] = useState<RTUDeviceInfo | null>(null);
  const [rtuChannelsFromRtu, setRtuChannelsFromRtu] = useState<
    RTUChannelUsageInfo[] | null | undefined
  >();

  const formattedInitialValues = formatInitialValues(initialValues);

  const descriptionText = t('ui.common.description', 'Description');
  const rtuText = t('ui.common.rtu', 'RTU');
  const stateText = t('ui.digitalChannel.text', 'Text');
  const valueText = t('ui.common.value', 'Value');
  const templateText = t('ui.datachannel.template', 'Template');
  const validationSchema = buildValidationSchema(t, {
    descriptionText,
    stateText,
    valueText,
    templateText,
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
      {({ isSubmitting, isValid, values, setFieldValue }) => {
        return (
          <>
            <FormikEffect
              onChange={handleFormChange}
              isValid={isValid}
              restoreTouchedFields={restoreTouchedFields}
              restoreInitialValues={restoreInitialValues}
            />
            <FormChangeEffect
              values={values}
              setRtuChannelsFromRtu={setRtuChannelsFromRtu}
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
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      id="rtuId-input"
                      component={RTUAutoCompleteLegacy}
                      name="rtuId"
                      domainId={domainId}
                      selectedOption={selectedRtu}
                      textFieldProps={{
                        placeholder: t(
                          'ui.common.enterSearchCriteria',
                          'Enter Search Criteria...'
                        ),
                        label: rtuText,
                      }}
                      onChange={(selectedOption: RTUDeviceInfo | null) => {
                        setSelectedRtu(selectedOption);

                        // Always reset the Level Channel + Pressure Channel
                        // fields when changing the RTUs since the selected RTU
                        // can have different channels
                        setFieldValue('rtuChannelId', '');
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      component={CustomTextField}
                      name="rtuChannelId"
                      label={t('ui.common.channel', 'Channel')}
                      select
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="" disabled>
                        <span style={{ color: fadedTextColor }}>
                          {t('ui.common.select', 'Select')}
                        </span>
                      </MenuItem>
                      {rtuChannelsFromRtu?.map((option) => (
                        <MenuItem
                          key={option.rtuChannelId}
                          value={option.rtuChannelId}
                        >
                          {option.channelNumber}&nbsp;
                          <em>
                            {option.dataChannelCount
                              ? t('ui.datachannel.channelinuse', '(in use)')
                              : t(
                                  'ui.datachannel.channelnotinuse',
                                  '(not in use)'
                                )}
                          </em>
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
                      required
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
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={3}>
                        <StyledTitleText>
                          {t('ui.digitalChannel.state', 'State')} 0
                        </StyledTitleText>
                      </Grid>
                      <Grid item xs={3}>
                        <Field
                          component={CustomTextField}
                          name="state0Value"
                          label={t('ui.common.value', 'Value')}
                          type="number"
                          required
                        />
                      </Grid>
                      <Grid item xs>
                        <Field
                          component={CustomTextField}
                          name="state0Text"
                          label={stateText}
                          required
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={3}>
                        <StyledTitleText>
                          {t('ui.digitalChannel.state', 'State')} 1
                        </StyledTitleText>
                      </Grid>
                      <Grid item xs={3}>
                        <Field
                          component={CustomTextField}
                          name="state1Value"
                          label={t('ui.common.value', 'Value')}
                          type="number"
                          required
                        />
                      </Grid>
                      <Grid item xs>
                        <Field
                          component={CustomTextField}
                          name="state1Text"
                          label={stateText}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                    </Grid>
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
