import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { MessageTemplateDto } from 'api/admin/api';
import routes from 'apps/admin/routes';
import BackIconButton from 'components/buttons/BackIconButton';
import CircularProgress from 'components/CircularProgress';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory, useParams } from 'react-router';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { convertToNumber } from 'utils/forms/values';
import EntityDetails from 'components/EntityDetails';
import ObjectForm from './components/ObjectForm';
import {
  buildValidationSchema,
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './components/ObjectForm/helpers';
import type { Values } from './components/ObjectForm/types';
import PageIntro from './components/PageIntro';
import { useGetMessageTemplateById } from './hooks/useRetrieveMessageTemplateDetails';
import { useSaveMessageTemplate } from './hooks/useSaveMessageTemplate';

interface RouteParams {
  messageTemplateId?: string;
}

interface Props {
  isInlineForm?: boolean;
}

const MessageTemplateEditor = ({ isInlineForm }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams<RouteParams>();

  const editingMessageTemplateId = convertToNumber(params.messageTemplateId);

  const isCreating = !editingMessageTemplateId;

  // Edit User Api
  const editMessageTemplateApi = useGetMessageTemplateById(
    editingMessageTemplateId!
  );
  const messageTemplateData = editMessageTemplateApi.data;

  const editRosterError = editMessageTemplateApi.error;

  // Update/Save User Api
  const updateMessageTemplateApi = useSaveMessageTemplate();

  const refetchEditData = () => {
    // Clear the error state when submitting
    updateMessageTemplateApi.reset();
    if (!isCreating) {
      editMessageTemplateApi.refetch();
    }
  };
  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    updateMessageTemplateApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);
    return updateMessageTemplateApi
      .mutateAsync({
        ...formattedValuesForApi,
        domainId: messageTemplateData?.domainId || domainId,
        messageTemplateId: params.messageTemplateId,
      } as MessageTemplateDto)
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const saveCallback = (response: MessageTemplateDto) => {
    if (response?.messageTemplateId) {
      const editRoutePath = generatePath(routes.messageTemplateManager.edit, {
        messageTemplateId: response.messageTemplateId,
      });
      history.replace(editRoutePath);
    }
  };
  const saveAndExitCallback = () => {
    history.push(routes.messageTemplateManager.list);
  };

  const isFetchingEditData = editMessageTemplateApi.isFetching;
  const hasFetchingError = editMessageTemplateApi.isError;

  if (isFetchingEditData || hasFetchingError) {
    return (
      <>
        <PageIntroWrapper sticky {...(isInlineForm && { topOffset: 0 })}>
          <PageIntro
            isCreating={isCreating}
            cancelCallback={refetchEditData}
            headerNavButton={<BackIconButton />}
            isInlineForm={isInlineForm}
          />
        </PageIntroWrapper>

        <Box mt={3}>
          <TransitionLoadingSpinner in={isFetchingEditData} />
          <TransitionErrorMessage
            in={!isFetchingEditData && hasFetchingError}
          />
        </Box>
      </>
    );
  }

  const formattedInitialValues = formatInitialValues(messageTemplateData);

  const descriptionText = t('ui.common.description', 'Description');
  const bodyTemplateText = t('ui.messageTemplateEditor.body', 'Body');
  const validationSchema = buildValidationSchema(t, {
    descriptionText,
    bodyTemplateText,
  });

  return (
    <Formik<Values>
      // NOTE: Using `enableReinitialize` could cause the resetForm method to
      // not work. Instead, we're resetting the form by re-fetching the
      // required data to edit the form, and unmounting then mounting the form
      // again so that the initialValues passed from the parent are used
      // correctly
      initialValues={formattedInitialValues}
      validateOnChange
      validateOnBlur
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm, values, resetForm, setFieldValue }) => {
        return (
          <>
            <PageIntroWrapper sticky {...(isInlineForm && { topOffset: 0 })}>
              <PageIntro
                isCreating={isCreating}
                isSubmitting={isSubmitting}
                submissionResult={updateMessageTemplateApi.data}
                submissionError={updateMessageTemplateApi.error}
                cancelCallback={() => {
                  resetForm();
                  refetchEditData();
                }}
                submitForm={() => {
                  return submitForm();
                }}
                headerNavButton={<BackIconButton />}
                saveCallback={saveCallback}
                saveAndExitCallback={saveAndExitCallback}
                isInlineForm={isInlineForm}
              />
            </PageIntroWrapper>

            <Box mt={3}>
              <Fade in={isFetchingEditData} unmountOnExit>
                <div>
                  {isFetchingEditData && (
                    <MessageBlock>
                      <CircularProgress />
                    </MessageBlock>
                  )}
                </div>
              </Fade>
              <Fade in={!editRosterError && !isFetchingEditData}>
                <div>
                  {!editRosterError && !isFetchingEditData && (
                    <Grid
                      container
                      spacing={2}
                      direction="column"
                      justify="space-between"
                    >
                      <Grid item xs={12}>
                        <ObjectForm
                          isSubmitting={isSubmitting}
                          timeZoneTypeId={values.timeZoneTypeId}
                          subjectTemplate={values.subjectTemplate}
                          bodyTemplate={values.bodyTemplate}
                          setFieldValue={setFieldValue}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {messageTemplateData && !isCreating && (
                          <Box py={2}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <EntityDetails
                                  details={messageTemplateData}
                                  extraDetails={[
                                    {
                                      label: t(
                                        'ui.messageTemplateEditor.rosterCount',
                                        'Roster Count'
                                      ),
                                      value: messageTemplateData.rosterCount,
                                    },
                                  ]}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  )}
                </div>
              </Fade>
            </Box>
          </>
        );
      }}
    </Formik>
  );
};

export default MessageTemplateEditor;
