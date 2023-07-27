/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { DataChannelType } from 'api/admin/api';
import Alert from 'components/Alert';
import EditorBox from 'components/EditorBox';
import FormLinearProgress from 'components/FormLinearProgress';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import FormikEffect from 'components/forms/FormikEffect';
import Checkbox from 'components/forms/styled-fields/Checkbox';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
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
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fieldIsRequired } from 'utils/forms/errors';
import { buildDataChannelTypeTextMapping } from 'utils/i18n/enum-to-text';
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
    deviceId: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.rtuText))
      .required(fieldIsRequired(t, translationTexts.rtuText)),
    diagnosticChannel: Yup.array()
      .of(Yup.number())
      .required(translationTexts.atLeastOneChannelRequiredText),
  });
};

interface FormatInitialValuesOptions {
  diagnosticChannels?: { [key: string]: DataChannelType[] };
}

const formatInitialValues = (
  values?: any,
  { diagnosticChannels }: FormatInitialValuesOptions = {}
) => {
  const initialDeviceId =
    (diagnosticChannels && Object.keys(diagnosticChannels)?.[0]) || '';
  return {
    ...values,
    ...(!values?.deviceId && {
      deviceId: initialDeviceId,
    }),
    // NOTE: setting the value as an empty array causes the value to be removed
    // from the formik state:
    // https://github.com/formium/formik/issues/2151
    ...(!values?.diagnosticChannel && { diagnosticChannel: [] }),
  };
};

interface Props {
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  supportedDiagnosticChannels: { [key: string]: DataChannelType[] };
  onSubmit: (values: Values, formikBag: FormikHelpers<Values>) => void;
  handleFormChange: (formik: FormikProps<Values>) => void;
}

const ObjectForm = ({
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  onSubmit,
  submissionError,
  supportedDiagnosticChannels,
}: Props) => {
  const { t } = useTranslation();

  const formattedInitialValues = formatInitialValues(
    {},
    { diagnosticChannels: supportedDiagnosticChannels }
  );

  const dataChannelTypeTextMapping = buildDataChannelTypeTextMapping(t);
  const rtuText = t('ui.common.rtu', 'RTU');
  const atLeastOneChannelRequiredText = t(
    'validate.diagnosticChannel.atLeastOneChannelRequired',
    'At least one diagnostic channel is required.'
  );
  const validationSchema = buildValidationSchema(t, {
    rtuText,
    atLeastOneChannelRequiredText,
  });

  const rtuDeviceIds = Object.keys(supportedDiagnosticChannels);

  const handleCheckBox = (
    value: DataChannelType,
    isChecked: boolean,
    selectedDataChannelsValue: DataChannelType[] | null | undefined,
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
        const deviceDiagnosticChannelTypes =
          supportedDiagnosticChannels[values.deviceId!] || [];
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
                      name="deviceId"
                      label={rtuText}
                      select
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="" disabled>
                        <SelectItem />
                      </MenuItem>
                      {rtuDeviceIds?.map((deviceId) => (
                        <MenuItem key={deviceId} value={deviceId}>
                          {deviceId.toUpperCase()}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>

                  {values.deviceId && (
                    <>
                      <Grid item xs={12}>
                        <StyledTitleText>
                          {t(
                            'ui.diagnosticChannels.availableDiagnosticChannels',
                            'Available Diagnostic Channels'
                          )}
                        </StyledTitleText>
                      </Grid>

                      <Grid item xs={12}>
                        {!deviceDiagnosticChannelTypes.length && (
                          <MessageBlock>
                            <Box m={2}>
                              <SearchCloudIcon />
                            </Box>
                            <LargeBoldDarkText>
                              {t(
                                'ui.datachannel.noDiagnosticChannelsAvailable',
                                'No diagnostic channels available'
                              )}
                            </LargeBoldDarkText>
                          </MessageBlock>
                        )}
                        <FieldArray
                          name="diagnosticChannel"
                          render={(arrayHelpers) => (
                            <Grid
                              container
                              spacing={1}
                              aria-label="Available diagnostic channel checkboxes"
                            >
                              {deviceDiagnosticChannelTypes?.map(
                                (channelType) => {
                                  const isSelected = !!arrayHelpers.form.values.diagnosticChannel?.includes(
                                    channelType
                                  );

                                  return (
                                    <Grid item xs={12} key={channelType}>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={isSelected}
                                            value={channelType}
                                            onChange={(
                                              e: React.ChangeEvent<HTMLInputElement>
                                            ) => {
                                              handleCheckBox(
                                                channelType,
                                                e.target.checked,
                                                values.diagnosticChannel,
                                                arrayHelpers
                                              );
                                              arrayHelpers.form.setFieldTouched(
                                                'diagnosticChannel',
                                                true,
                                                true
                                              );
                                            }}
                                            onBlur={() =>
                                              arrayHelpers.form.setFieldValue(
                                                'diagnosticChannel',
                                                arrayHelpers.form.values
                                                  .diagnosticChannel
                                              )
                                            }
                                          />
                                        }
                                        label={
                                          dataChannelTypeTextMapping[
                                            channelType
                                          ]
                                        }
                                      />
                                    </Grid>
                                  );
                                }
                              )}
                              {!!values.deviceId &&
                                !!deviceDiagnosticChannelTypes.length &&
                                !arrayHelpers.form.values.diagnosticChannel
                                  ?.length && (
                                  <Grid item xs={12}>
                                    <FormHelperText>
                                      {atLeastOneChannelRequiredText}
                                    </FormHelperText>
                                  </Grid>
                                )}
                            </Grid>
                          )}
                        />
                      </Grid>
                    </>
                  )}
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
