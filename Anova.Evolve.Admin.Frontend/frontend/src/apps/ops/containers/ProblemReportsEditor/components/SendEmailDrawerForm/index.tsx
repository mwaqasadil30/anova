/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { MessageTemplateDto } from 'api/admin/api';
import Button from 'components/Button';
import CustomThemeProvider from 'components/CustomThemeProvider';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import EditorBox from 'components/EditorBox';
import EditorPageIntro from 'components/EditorPageIntro';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import EmptyDropdownAutocomplete from 'components/forms/styled-fields/EmptyDropdownAutocomplete';
import StyledStaticFieldWithChildren from 'components/forms/styled-fields/StyledStaticFieldWithChildren';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { Field, Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { enqueueProblemReportEmailSendSuccessSnackbar } from 'redux-app/modules/app/actions';
import styled from 'styled-components';
import { fadedTextColor } from 'styles/colours';
import { replaceRange } from 'utils/format/messageTemplate';
import { convertToNumber } from 'utils/forms/values';
import { useGetPreviewProblemReportEmail } from '../../hooks/useGetPreviewProblemReportEmail';
import { useGetProblemReportEmailAddresses } from '../../hooks/useGetProblemReportEmailAddresses';
import { useGetProblemReportMessageTemplates } from '../../hooks/useGetProblemReportMessageTemplate';
import { useGetProblemReportMessageTemplateOptions } from '../../hooks/useGetProblemReportMessageTemplateOptions';
import { useSendProblemReportEmail } from '../../hooks/useSendProblemReportEmail';
import FormEffect from './FormEffect';
import {
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import { Values } from './types';

const StyledGrid = styled(Grid)`
  padding-top: 1px;
`;

interface RouteParams {
  problemReportId?: string;
}

interface Props {
  cancelCallback: () => void;
  saveAndExitCallback?: () => void;
}

const SendEmailDrawerForm = ({
  cancelCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const params = useParams<RouteParams>();
  const editingProblemReportId = convertToNumber(params.problemReportId);

  // Get all of the email template's field data
  const getProblemReportMessageTemplateApi = useGetProblemReportMessageTemplates();

  // Subject & Body Template field dropdown options
  const getProblemReportMessageTemplateDropdownOptionsApi = useGetProblemReportMessageTemplateOptions();

  // 'To' 'Cc' 'Bcc' email dropdown options
  const getProblemReportEmailAddressDropdownOptionsApi = useGetProblemReportEmailAddresses();

  const [subjectDropdownItem, setSubjectDropdownItem] = useState('');
  const [bodyDropdownItem, setBodyDropdownItem] = useState('');

  /* The handle functions below could possibly be changed into a single one. */
  const handleSubjectDropdownChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newSubjectTemplateItem = event.target.value as any;
    setSubjectDropdownItem(newSubjectTemplateItem);
  };

  const handleBodyDropdownChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newBodyTemplateItem = event.target.value as any;
    setBodyDropdownItem(newBodyTemplateItem);
  };

  const [subjectCursorRange, setSubjectCursorRange] = useState<
    [number, number] | null
  >(null);
  const [bodyCursorRange, setBodyCursorRange] = useState<
    [number, number] | null
  >(null);

  // Preview dialog
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = React.useState(false);

  const handleOpenPreviewDialog = () => {
    setIsPreviewDialogOpen(true);
  };

  const getPreviewProblemReportEmailApi = useGetPreviewProblemReportEmail();

  const handlePreviewApiRequest = (
    formValues: Values,
    setErrors: FormikProps<{}>['setErrors'],
    setStatus: FormikProps<{}>['setStatus']
  ) => {
    // Clear the error state when submitting the preview api
    getPreviewProblemReportEmailApi.reset();

    const formattedValuesForApi = formatValuesForApi(formValues);

    getPreviewProblemReportEmailApi
      .mutateAsync({
        problemReportId: editingProblemReportId!,
        messageTemplate: {
          ...formattedValuesForApi,
        } as MessageTemplateDto,
      })
      .finally(() => {
        handleOpenPreviewDialog();
      })
      .catch((error) => {
        console.error(`Unable to preview email: ${error}`);
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          setErrors(formattedErrors as any);
          setStatus({ errors: formattedErrors });
        }
      });
  };

  const sendProblemReportEmailApi = useSendProblemReportEmail();

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    sendProblemReportEmailApi.reset();

    const formattedValuesForApi = formatValuesForApi(values);

    return sendProblemReportEmailApi
      .mutateAsync({
        problemReportId: editingProblemReportId!,
        messageTemplate: {
          ...formattedValuesForApi,
        } as MessageTemplateDto,
      })
      .then(() => {
        dispatch(enqueueProblemReportEmailSendSuccessSnackbar(t));
      })
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const handleClosePreviewDialog = () => {
    setIsPreviewDialogOpen(false);
    getPreviewProblemReportEmailApi.reset();
  };

  return (
    <Formik<Values>
      initialValues={formatInitialValues()}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        values,
        setFieldValue,
        setValues,
        submitForm,
        setErrors,
        setStatus,
      }) => {
        const addTemplateVariable = (
          templateString: string,
          fieldName: string,
          templateCursorRange?: number[] | null,
          selectedOption?: string | null
        ) => {
          if (!selectedOption) {
            return;
          }

          let startRange = templateString.length;
          let endRange = templateString.length;
          if (templateCursorRange) {
            [startRange, endRange] = templateCursorRange;
          }

          // Subject & Body fields
          const newSubjectOrBodyTemplateValue = replaceRange(
            templateString,
            startRange,
            endRange,
            `{${selectedOption}}`
          );

          setFieldValue(fieldName, newSubjectOrBodyTemplateValue);
        };

        const addEmailVariable = (
          emailString: string,
          fieldName: string,
          selectedOption?: string | null
        ) => {
          if (!selectedOption) {
            return;
          }

          const formattedSelectedEmailOption = emailString
            .split(';')
            .filter(Boolean);

          if (formattedSelectedEmailOption.length >= 1) {
            setFieldValue(fieldName, emailString.concat(`;${selectedOption}`));
          } else {
            setFieldValue(fieldName, emailString.concat(`${selectedOption}`));
          }
        };

        const isPreviewDisabled =
          !values.sendToAddressList ||
          !values.subjectTemplate ||
          !values.bodyTemplate;

        return (
          <>
            <FormEffect
              selectedMessageTemplateId={values.messageTemplateId}
              templateApiData={getProblemReportMessageTemplateApi?.data}
              setValues={setValues}
            />
            <UpdatedConfirmationDialog
              maxWidth="md"
              isMdOrLarger
              open={isPreviewDialogOpen}
              mainTitle={t(
                'ui.problemreport.problemReportEmailPreview',
                'Problem Report Email Preview'
              )}
              content={
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <StyledTextField
                      label={t('ui.messageTemplateEditor.subject', 'Subject')}
                      value={
                        getPreviewProblemReportEmailApi.data?.subjectTemplate
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      label={t('ui.messageTemplateEditor.body', 'Body')}
                      multiline
                      rows={9}
                      value={getPreviewProblemReportEmailApi.data?.bodyTemplate}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                </Grid>
              }
              hideCancelButton
              confirmationButtonText={t('ui.common.close', 'Close')}
              onConfirm={handleClosePreviewDialog}
              isError={getPreviewProblemReportEmailApi.isError}
            />

            <CustomThemeProvider forceThemeType="dark">
              <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                <EditorPageIntro
                  showSaveOptions
                  title={t('ui.problemreport.sendemail', 'Send Email')}
                  cancelCallback={cancelCallback}
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  submissionResult={sendProblemReportEmailApi.data}
                  submissionError={sendProblemReportEmailApi.error}
                  saveAndExitCallback={saveAndExitCallback}
                  saveAndExitButtonText={t('ui.common.send', 'Send')}
                  extraButtonComponent={
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        handlePreviewApiRequest(values, setErrors, setStatus);
                      }}
                      useDomainColorForIcon
                      disabled={isPreviewDisabled || isSubmitting}
                    >
                      {t('ui.problemreport.preview', 'Preview')}
                    </Button>
                  }
                />
              </PageIntroWrapper>
            </CustomThemeProvider>
            <Box mt={3} />
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={12}>
                <EditorBox borderRadius="10px 10px 0px 0px">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Field
                        id="messageTemplateId-input"
                        name="messageTemplateId"
                        component={CustomTextField}
                        select
                        SelectProps={{ displayEmpty: true }}
                        label={t('ui.problemreport.template', 'Template')}
                      >
                        {getProblemReportMessageTemplateApi?.data?.map(
                          (option) => (
                            <MenuItem
                              key={option.messageTemplateId}
                              value={option.messageTemplateId}
                            >
                              {option.description}
                            </MenuItem>
                          )
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        id="replyTo-input"
                        name="replyTo"
                        component={CustomTextField}
                        label={t('ui.problemreport.replyto', 'Reply To')}
                      />
                    </Grid>

                    {/* 'To:' section */}
                    <Grid item xs={6}>
                      <EmptyDropdownAutocomplete
                        label={t('ui.common.to', 'To')}
                        options={
                          getProblemReportEmailAddressDropdownOptionsApi?.data ||
                          []
                        }
                        getOptionLabel={(option) => option || ''}
                        onChange={(_: any, selectedOption) => {
                          if (selectedOption) {
                            addEmailVariable(
                              values.sendToAddressList,
                              'sendToAddressList',
                              selectedOption
                            );
                          }
                        }}
                        renderOption={(option) => option}
                        textFieldProps={{
                          placeholder: t(
                            'ui.problemReport.enterRecipients',
                            'Enter Recipients'
                          ),
                          required: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        component={CustomTextField}
                        id="sendToAddressList-input"
                        name="sendToAddressList"
                        disabled={isSubmitting}
                      />
                    </Grid>

                    {/* 'CC' section */}
                    <Grid item xs={6}>
                      <EmptyDropdownAutocomplete
                        label={t('ui.problemreport.cc', 'CC')}
                        options={
                          getProblemReportEmailAddressDropdownOptionsApi?.data ||
                          []
                        }
                        getOptionLabel={(option) => option || ''}
                        onChange={(_: any, selectedOption) => {
                          if (selectedOption) {
                            addEmailVariable(
                              values.sendToCcAddressList,
                              'sendToCcAddressList',
                              selectedOption
                            );
                          }
                        }}
                        renderOption={(option) => option}
                        textFieldProps={{
                          placeholder: t(
                            'ui.problemReport.enterRecipients',
                            'Enter Recipients'
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        component={CustomTextField}
                        id="sendToCcAddressList-input"
                        name="sendToCcAddressList"
                        disabled={isSubmitting}
                      />
                    </Grid>

                    {/* 'BCC' section */}
                    <Grid item xs={6}>
                      <EmptyDropdownAutocomplete
                        label={t('ui.problemreport.bcc', 'BCC')}
                        options={
                          getProblemReportEmailAddressDropdownOptionsApi?.data ||
                          []
                        }
                        getOptionLabel={(option) => option || ''}
                        onChange={(_: any, selectedOption) => {
                          if (selectedOption) {
                            addEmailVariable(
                              values.sendToBccAddressList,
                              'sendToBccAddressList',
                              selectedOption
                            );
                          }
                        }}
                        renderOption={(option) => option}
                        textFieldProps={{
                          placeholder: t(
                            'ui.problemReport.enterRecipients',
                            'Enter Recipients'
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        component={CustomTextField}
                        id="sendToBccAddressList-input"
                        name="sendToBccAddressList"
                        disabled={isSubmitting}
                      />
                    </Grid>
                  </Grid>
                </EditorBox>
              </Grid>

              {/* Subject + Body fields */}
              <StyledGrid item xs={12}>
                <EditorBox borderRadius="0px 0px 10px 10px">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Grid container spacing={2} alignItems="stretch">
                        <Grid item xs={6}>
                          <StyledTextField
                            select
                            id="subjectTemplateOptions-input"
                            label={t('ui.problemreport.subject', 'Subject')}
                            onChange={handleSubjectDropdownChange}
                            value={subjectDropdownItem}
                            InputProps={{
                              style: { overflow: 'hidden' },
                            }}
                            SelectProps={{ displayEmpty: true }}
                            required
                          >
                            <MenuItem value="">
                              <span style={{ color: fadedTextColor }}>
                                {t(
                                  'ui.problemReport.selectDefinedField',
                                  'Select defined field'
                                )}
                              </span>
                            </MenuItem>
                            {getProblemReportMessageTemplateDropdownOptionsApi?.data?.map(
                              (option) => (
                                <MenuItem key={option} value={option}>
                                  {`{${option}}`}
                                </MenuItem>
                              )
                            )}
                          </StyledTextField>
                        </Grid>

                        <Grid item xs={6}>
                          <StyledStaticFieldWithChildren label="&nbsp;">
                            <Button
                              variant="outlined"
                              disabled={!subjectDropdownItem}
                              onClick={() => {
                                addTemplateVariable(
                                  values.subjectTemplate,
                                  'subjectTemplate',
                                  subjectCursorRange,
                                  subjectDropdownItem
                                );
                              }}
                            >
                              {t('ui.common.add', 'Add')}
                            </Button>
                          </StyledStaticFieldWithChildren>
                        </Grid>

                        <Grid item xs={12}>
                          <Field
                            component={CustomTextField}
                            id="subjectTemplate-input"
                            name="subjectTemplate"
                            disabled={isSubmitting}
                            onBlur={(e: any) => {
                              setSubjectCursorRange([
                                e.target.selectionStart,
                                e.target.selectionEnd,
                              ]);
                            }}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <StyledTextField
                            select
                            id="bodyTemplateOptions-input"
                            label={t('ui.problemreport.body', 'Body')}
                            onChange={handleBodyDropdownChange}
                            value={bodyDropdownItem}
                            InputProps={{
                              style: { overflow: 'hidden' },
                            }}
                            SelectProps={{ displayEmpty: true }}
                            required
                          >
                            <MenuItem value="">
                              <span style={{ color: fadedTextColor }}>
                                {t(
                                  'ui.problemReport.selectDefinedField',
                                  'Select defined field'
                                )}
                              </span>
                            </MenuItem>
                            {getProblemReportMessageTemplateDropdownOptionsApi?.data?.map(
                              (option) => (
                                <MenuItem key={option} value={option}>
                                  {`{${option}}`}
                                </MenuItem>
                              )
                            )}
                          </StyledTextField>
                        </Grid>
                        <Grid item xs={6}>
                          <StyledStaticFieldWithChildren label="&nbsp;">
                            <Button
                              variant="outlined"
                              disabled={!bodyDropdownItem}
                              onClick={() => {
                                addTemplateVariable(
                                  values.bodyTemplate,
                                  'bodyTemplate',
                                  bodyCursorRange,
                                  bodyDropdownItem
                                );
                              }}
                            >
                              {t('ui.common.add', 'Add')}
                            </Button>
                          </StyledStaticFieldWithChildren>
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            component={CustomTextField}
                            multiline
                            id="bodyTemplate-input"
                            name="bodyTemplate"
                            rows={7}
                            onBlur={(e: any) => {
                              setBodyCursorRange([
                                e.target.selectionStart,
                                e.target.selectionEnd,
                              ]);
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </EditorBox>
              </StyledGrid>
            </Grid>
          </>
        );
      }}
    </Formik>
  );
};

export default SendEmailDrawerForm;
