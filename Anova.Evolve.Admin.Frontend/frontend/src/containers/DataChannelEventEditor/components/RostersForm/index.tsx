import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { DataChannelEventRuleBaseDTO, EventRuleCategory } from 'api/admin/api';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import CustomThemeProvider from 'components/CustomThemeProvider';
import EditorPageIntro from 'components/EditorPageIntro';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { Formik, FormikHelpers } from 'formik';
import { useRetrieveRostersByDomainId } from 'hooks/useRetrieveRostersByDomainId';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ObjectForm from './components/ObjectForm';
import {
  buildValidationSchema,
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './components/ObjectForm/helpers';
import type { Values } from './components/ObjectForm/types';
import { useGetRosters } from './hooks/useGetRosters';
import { useSaveRosters } from './hooks/useSaveRosters';

interface Props {
  domainId: string;
  isInlineForm?: boolean;
  eventRule: DataChannelEventRuleBaseDTO;
  eventRuleType?: EventRuleCategory;
  cancelCallback: () => void;
  saveAndExitCallback: (response: string) => void;
}

const RostersForm = ({
  domainId,
  isInlineForm,
  eventRule,
  eventRuleType,
  cancelCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();

  const editingObjectId = eventRule.dataChannelEventRuleId!;

  // API hooks
  const getRostersByDomainIdApi = useRetrieveRostersByDomainId(domainId);
  const getApi = useGetRosters(editingObjectId!);
  const saveApi = useSaveRosters({
    onSuccess: (data) => {
      saveAndExitCallback(data);
    },
  });

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    saveApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);
    return saveApi
      .mutateAsync({
        dataChannelEventRuleId: editingObjectId,
        rosterIds: formattedValuesForApi.rosterIds,
      })
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const commonPageIntroProps = {
    showSaveOptions: true,
    isWithinDrawer: isInlineForm,
    title: t('ui.datachanneleventrule.rosters', 'Rosters'),
    cancelCallback,
  };

  const isFetchingEditData =
    getApi.isFetching || getRostersByDomainIdApi.isFetching;
  const hasFetchingError = getApi.isError || getRostersByDomainIdApi.isError;

  if (isFetchingEditData || hasFetchingError) {
    return (
      <>
        <CustomThemeProvider forceThemeType="dark">
          <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
            <EditorPageIntro
              {...commonPageIntroProps}
              disableSaveAndExit
              saveAndExitCallback={() => {}}
            />
          </PageIntroWrapper>
        </CustomThemeProvider>

        <Box mt={3}>
          <TransitionLoadingSpinner in={isFetchingEditData} />
          <TransitionErrorMessage
            in={!isFetchingEditData && hasFetchingError}
          />
        </Box>
      </>
    );
  }

  const formattedInitialValues = formatInitialValues(getApi.data);

  const validationSchema = buildValidationSchema();

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
      {({ isSubmitting, submitForm, setFieldValue }) => {
        return (
          <>
            <CustomThemeProvider forceThemeType="dark">
              <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                <EditorPageIntro
                  {...commonPageIntroProps}
                  isSubmitting={isSubmitting}
                  submissionResult={saveApi.data}
                  submissionError={saveApi.error}
                  submitForm={() => {
                    return submitForm();
                  }}
                  // The EditorPageIntro only calls saveAndExitCallback when
                  // the response is truthy. In the case of the event rule
                  // rosters save API, it may return nothing if all rosters
                  // have been removed. Instead, the saveAndExitCallback prop
                  // is called via the mutation's onSuccess callback.
                  saveAndExitCallback={() => {}}
                />
              </PageIntroWrapper>
            </CustomThemeProvider>

            <DefaultTransition in={!hasFetchingError && !isFetchingEditData}>
              <Box mt={3}>
                {!hasFetchingError && !isFetchingEditData && (
                  <Grid
                    container
                    spacing={2}
                    direction="column"
                    justify="space-between"
                  >
                    <Grid item xs={12}>
                      <ObjectForm
                        allRosters={getRostersByDomainIdApi.data}
                        eventRule={eventRule}
                        eventRuleType={eventRuleType}
                        isSubmitting={isSubmitting}
                        setFieldValue={setFieldValue}
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>
            </DefaultTransition>
          </>
        );
      }}
    </Formik>
  );
};

export default RostersForm;
