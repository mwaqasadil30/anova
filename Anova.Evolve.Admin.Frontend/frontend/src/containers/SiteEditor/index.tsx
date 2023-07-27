import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import {
  EvolveRetrieveSiteEditComponentsByIdRequest,
  EvolveRetrieveSiteEditComponentsByIdResponse,
  EvolveSaveSiteRequest,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import CircularProgress from 'components/CircularProgress';
import EntityDetails from 'components/EntityDetails';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import { FormikHelpers, FormikProps } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  selectActiveDomain,
  selectIsActiveDomainApciEnabled,
} from 'redux-app/modules/app/selectors';
import { formatValidationErrors } from 'utils/format/errors';
import ObjectForm from './components/ObjectForm';
import type { Values } from './components/ObjectForm/types';
import PageIntro from './components/PageIntro';

interface Props {
  editingSiteId?: string | null;
  headerNavButton?: React.ReactNode;
  isInlineForm?: boolean;
  saveCallback?: (response: any) => void;
  saveAndExitCallback?: (response: any) => void;
}

const SiteEditor = ({
  editingSiteId,
  headerNavButton,
  isInlineForm,
  saveCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  const [formInstance, setFormInstance] = React.useState<FormikProps<Values>>();
  const [isFetchingEditData, setIsFetchingEditData] = useState(false);
  const [
    editComponents,
    setEditComponents,
  ] = useState<EvolveRetrieveSiteEditComponentsByIdResponse | null>();
  const [editComponentsError, setEditComponentsError] = useState<any>();
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [savedData, setSavedData] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<any>();
  const [submissionError, setSubmissionError] = useState<any>();

  const isCreating = !editingSiteId;

  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;

  const fetchEditData = useCallback(() => {
    setIsFetchingEditData(true);
    return AdminApiService.GeneralService.retrieveSiteEditComponentsById_RetrieveSiteEditComponentsById(
      {
        ...(editingSiteId && {
          siteId: editingSiteId,
        }),
        loadEditComponents: true,
      } as EvolveRetrieveSiteEditComponentsByIdRequest
    )
      .then((response) => {
        setEditComponents(response);
      })
      .catch((error) => {
        setEditComponentsError(error);
      })
      .finally(() => {
        setIsFetchingEditData(false);
      });
  }, [editingSiteId]);

  useEffect(() => {
    fetchEditData();
  }, [fetchEditData]);

  const refetchEditData = () => {
    fetchEditData();
  };

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setSubmissionResult(undefined);
    return AdminApiService.GeneralService.saveSite_SaveSite({
      site: {
        ...values,
        domainId,
      },
    } as EvolveSaveSiteRequest)
      .then((response) => {
        const validationErrors =
          response.saveSiteResult?.editObject?.validationErrors;
        const formattedValidationErrors = formatValidationErrors(
          validationErrors
        );
        if (
          formattedValidationErrors &&
          Object.keys(formattedValidationErrors).length > 0
        ) {
          formikBag.setErrors(formattedValidationErrors);

          const errorResult = {
            errors: formattedValidationErrors,
          };

          // TODO: Cannot throw an error here since Formik doesn't seem to
          // catch it. Throwing an error is preferred so any place using this
          // submit logic can just use .then().catch(). Instead of using
          // .then() for successful submissions and .catch() for ones with
          // errors, we have to manage the state ourselves. See formik issue:
          // https://github.com/jaredpalmer/formik/issues/1580
          setSubmissionResult(errorResult);
          return errorResult;
        }

        setSavedData(response);

        const successResult = { response };
        setSubmissionResult(successResult);
        return successResult;
      })
      .catch((error) => {
        setSubmissionError(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleFormChange = (formik: FormikProps<Values>) => {
    setFormInstance(formik);
  };

  const editDetails =
    editComponents?.retrieveSiteEditComponentsByIdResult?.editObject;

  return (
    <>
      <PageIntroWrapper
        sticky
        isWithinDrawer={isInlineForm}
        {...(isInlineForm && { topOffset: 0 })}
      >
        <PageIntro
          isAirProductsEnabledDomain={isAirProductsEnabledDomain}
          isCreating={isCreating}
          isSubmitting={isSubmitting}
          submissionResult={submissionResult}
          refetchEditData={refetchEditData}
          submitForm={formInstance?.submitForm}
          headerNavButton={headerNavButton}
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
        <Fade in={!editComponentsError && !isFetchingEditData}>
          <div>
            {!editComponentsError && !isFetchingEditData && (
              <Grid
                container
                spacing={3}
                direction="column"
                justify="space-between"
              >
                <Grid item>
                  <ObjectForm
                    isAirProductsEnabledDomain={isAirProductsEnabledDomain}
                    initialValues={editDetails}
                    onSubmit={handleSubmit}
                    handleFormChange={handleFormChange}
                    submissionError={submissionError}
                    timezones={
                      editComponents?.retrieveSiteEditComponentsByIdResult
                        ?.timeZones
                    }
                    isInlineForm={isInlineForm}
                  />
                </Grid>
                {editDetails && !isCreating && (
                  <Grid item>
                    <EntityDetails
                      details={editDetails}
                      isInline={isInlineForm}
                      extraDetails={[
                        {
                          label: t('ui.site.rtucount', 'RTU Count'),
                          value: editDetails.rtuCount,
                        },
                        {
                          label: t('ui.site.assetCount', 'Asset Count'),
                          value: editDetails.assetCount,
                        },
                      ]}
                    />
                  </Grid>
                )}
              </Grid>
            )}
          </div>
        </Fade>
      </Box>
    </>
  );
};

export default SiteEditor;
