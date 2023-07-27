import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { RosterDto } from 'api/admin/api';
import routes from 'apps/admin/routes';
import BackIconButton from 'components/buttons/BackIconButton';
import CircularProgress from 'components/CircularProgress';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import { Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory, useParams } from 'react-router';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { convertToNumber } from 'utils/forms/values';
import ObjectForm from './components/ObjectForm';
import {
  buildValidationSchema,
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './components/ObjectForm/helpers';
import type { Values } from './components/ObjectForm/types';
import PageIntro from './components/PageIntro';
import { useGetRosterById } from './hooks/useRetrieveRosterDetails';
import { useSaveRoster } from './hooks/useSaveRoster';
import { SaveCallbackOptions } from './types';

interface RouteParams {
  rosterId?: string;
}

interface Props {
  isInlineForm?: boolean;
}

const RosterEditor = ({ isInlineForm }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams<RouteParams>();

  const editingRosterId = convertToNumber(params.rosterId);

  const isCreating = !editingRosterId;

  // Weird logic to handle the case when creating a Roster via the
  // "Add Contact" button since users may want to immediately attempt to add a
  // contact on a new Roster.
  const [
    wasSavedViaAddContactButton,
    setWasSavedViaAddContactButton,
  ] = useState(false);

  // Edit User Api
  const editRosterApi = useGetRosterById(editingRosterId!);
  const rosterData = editRosterApi.data;
  const editRosterError = editRosterApi.error;

  // Update/Save User Api
  const updateRosterApi = useSaveRoster();

  const refetchEditData = () => {
    // Clear the error state when submitting
    updateRosterApi.reset();
    if (!isCreating) {
      editRosterApi.refetch();
    }
  };
  const activeDomain = useSelector(selectActiveDomain);
  const domainId = rosterData?.domainId || activeDomain?.domainId;

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    updateRosterApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);
    return updateRosterApi
      .mutateAsync({
        ...formattedValuesForApi,
        domainId,
        rosterId: params.rosterId,
      } as RosterDto)
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const saveCallback = (response: RosterDto, options?: SaveCallbackOptions) => {
    if (response?.rosterId) {
      const editRoutePath = generatePath(routes.rosterManager.edit, {
        rosterId: response.rosterId,
      });
      history.replace(editRoutePath, { openDrawer: options?.openDrawer });
    }
  };
  const saveAndExitCallback = () => {
    history.push(routes.rosterManager.list);
  };

  const isFetchingEditData = editRosterApi.isFetching;
  const isLoadingInitial = editRosterApi.isLoading;
  const hasFetchingError = editRosterApi.isError;

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

  const formattedInitialValues = formatInitialValues(rosterData, isCreating);

  const descriptionText = t('ui.common.description', 'Description');
  const validationSchema = buildValidationSchema(t, {
    descriptionText,
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
      {({ isSubmitting, submitForm, values, setFieldValue, resetForm }) => {
        return (
          <>
            <PageIntroWrapper sticky {...(isInlineForm && { topOffset: 0 })}>
              <PageIntro
                isCreating={isCreating}
                isSubmitting={isSubmitting}
                submissionResult={updateRosterApi.data}
                submissionError={updateRosterApi.error}
                cancelCallback={() => {
                  resetForm();
                  refetchEditData();
                }}
                submitForm={() => {
                  setWasSavedViaAddContactButton(false);
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
                          isCreating={isCreating}
                          isSubmitting={isSubmitting}
                          isFetching={isFetchingEditData}
                          isLoadingInitial={isLoadingInitial}
                          responseError={hasFetchingError}
                          domainId={domainId}
                          rosterData={rosterData}
                          rosterUsers={values.rosterUsers}
                          submissionResult={updateRosterApi.data}
                          saveCallback={saveCallback}
                          setFieldValue={setFieldValue}
                          submitFormViaAddContact={() => {
                            setWasSavedViaAddContactButton(true);
                            return submitForm();
                          }}
                          wasSavedViaAddContactButton={
                            wasSavedViaAddContactButton
                          }
                          setWasSavedViaAddContactButton={
                            setWasSavedViaAddContactButton
                          }
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
  );
};

export default RosterEditor;
