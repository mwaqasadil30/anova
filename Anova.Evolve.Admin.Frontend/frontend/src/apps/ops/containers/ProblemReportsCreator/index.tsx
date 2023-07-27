/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { ProblemReportDetailDto } from 'api/admin/api';
import BackIconButton from 'components/buttons/BackIconButton';
import CircularProgress from 'components/CircularProgress';
import Fade from 'components/common/animations/DefaultTransition';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import PageSubHeader from 'components/PageSubHeader';
import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import {
  selectActiveDomainId,
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import ObjectForm from './components/ObjectForm';
import {
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './components/ObjectForm/helpers';
import type { Values } from './components/ObjectForm/types';
import PageIntro from './components/PageIntro';
import { useCreateNewProblemReport } from './hooks/useCreateNewProblemReport';
import { useGenerateNewProblemReport } from './hooks/useGenerateNewProblemReport';

interface RouteParams {
  dataChannelId?: string;
}

interface Props {
  isInlineForm?: boolean;
}

const ProblemReportsCreator = ({ isInlineForm }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams<RouteParams>();

  const activeDomainId = useSelector(selectActiveDomainId);

  const editingProblemReportDataChannelId = params.dataChannelId;

  const isCreating = !editingProblemReportDataChannelId;

  const generateNewProblemReportApi = useGenerateNewProblemReport(
    params.dataChannelId!
  );
  const createNewProblemReportApi = useCreateNewProblemReport();

  const editProblemReportError = generateNewProblemReportApi.error;
  const problemReportData = generateNewProblemReportApi.data;

  const refetchEditData = () => {
    // Clear the error state when submitting
    createNewProblemReportApi.reset();

    // NOTE:
    // Remove clears the cache, and forces the getApi hook to refetch the data
    // This allows the cancel button to refetch & show the loading spinner
    // to fetch the latest data on the server
    generateNewProblemReportApi.remove();
  };

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    createNewProblemReportApi.reset();

    const formattedValuesForApi = formatValuesForApi(values);

    return createNewProblemReportApi
      .mutateAsync({
        problemReport: {
          ...formattedValuesForApi,
          problemReport: {
            ...formattedValuesForApi.problemReport,
            domainId: activeDomainId,
          },
        } as ProblemReportDetailDto,
        dataChannelId: editingProblemReportDataChannelId!,
      })
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const saveAndExitCallback = (response: any) => {
    if (response) {
      history.goBack();
    }
  };

  const isLoadingEditData = generateNewProblemReportApi.isLoading;
  const hasFetchingError = generateNewProblemReportApi.isError;

  const formattedInitialValues = formatInitialValues(problemReportData);

  const topOffset = useSelector(selectTopOffset);

  if (isLoadingEditData || hasFetchingError) {
    return (
      <>
        <PageIntroWrapper sticky {...(isInlineForm && { topOffset: 0 })}>
          <PageIntro
            isCreating={isCreating}
            isSubmitting={isLoadingEditData}
            cancelCallback={refetchEditData}
            headerNavButton={<BackIconButton />}
            isInlineForm={isInlineForm}
          />
        </PageIntroWrapper>

        <Box mt={3}>
          <TransitionLoadingSpinner in={isLoadingEditData} />
          <TransitionErrorMessage in={!isLoadingEditData && hasFetchingError} />
        </Box>
      </>
    );
  }

  return (
    <>
      <Formik<Values>
        initialValues={formattedInitialValues}
        // NOTE: Using `enableReinitialize` could cause the resetForm method to
        // not work. Instead, we're resetting the form by re-fetching the
        // required data to edit the form, and unmounting then mounting the form
        // again so that the initialValues passed from the parent are used
        // correctly
        onSubmit={handleSubmit}
        // We still use enableReinitialize because when a user switches between
        // watchlist problem report items, the api call to fetch that problem
        // report's data would never be made
        enableReinitialize
      >
        {({
          isSubmitting,
          submitForm,
          values,
          resetForm,
          setFieldValue,
          dirty,
        }) => {
          return (
            <>
              <PageIntroWrapper
                topOffset={topOffset}
                sticky
                {...(isInlineForm && { topOffset: 0 })}
              >
                <PageIntro
                  isCreating={isCreating}
                  isSubmitting={
                    isSubmitting || generateNewProblemReportApi.isFetching
                  }
                  submissionResult={createNewProblemReportApi.data}
                  submissionError={createNewProblemReportApi.error}
                  cancelCallback={() => {
                    resetForm();
                    refetchEditData();
                  }}
                  submitForm={submitForm}
                  headerNavButton={<BackIconButton />}
                  saveAndExitCallback={saveAndExitCallback}
                  isInlineForm={isInlineForm}
                  problemNumber={values.problemReport?.problemNumber}
                  isFormDirty={dirty}
                />
              </PageIntroWrapper>

              <Box mt={2} mb={1}>
                <Fade in={isLoadingEditData} unmountOnExit>
                  <div>
                    {isLoadingEditData && (
                      <MessageBlock>
                        <CircularProgress />
                      </MessageBlock>
                    )}
                  </div>
                </Fade>

                <Fade in={!editProblemReportError && !isLoadingEditData}>
                  <div>
                    {!editProblemReportError && !isLoadingEditData && (
                      <Grid
                        container
                        spacing={2}
                        direction="column"
                        justify="space-between"
                        alignItems="stretch"
                      >
                        <Grid item xs={12} style={{ padding: '0 8px 0 8px' }}>
                          <PageSubHeader dense>
                            {t('ui.common.generalinfo', 'General Information')}
                          </PageSubHeader>
                        </Grid>
                        <Grid item xs={12}>
                          <ObjectForm
                            isSubmitting={isSubmitting}
                            formValues={values}
                            setFieldValue={setFieldValue}
                          />
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
    </>
  );
};

export default ProblemReportsCreator;
