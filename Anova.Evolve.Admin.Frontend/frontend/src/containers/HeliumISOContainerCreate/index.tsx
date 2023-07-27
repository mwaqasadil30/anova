/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import {
  EvolveRetrieveHeliumISOContainerRequest,
  EvolveRetrieveQuickAssetCreateHeliumISOContainerResponse,
  EvolveSaveQuickAssetCreateHeliumISOContainerRequest,
  EvolveSaveQuickAssetCreateHeliumISOContainerResponse,
  RTUChannelUsageInfo,
  RTUDeviceInfo,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import CircularProgress from 'components/CircularProgress';
import FormErrorDialog from 'components/dialog/FormErrorDialog';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import { SubmissionResult } from 'form-utils/types';
import { FormikHelpers, FormikProps } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { selectUser } from 'redux-app/modules/user/selectors';
import { parseResponseError } from 'utils/api/handlers';
import type { FormIntegrationDetails } from 'utils/forms/types';
import PageIntro from './components/PageIntro';
import SuccessfulCreationContent from './components/SuccessfulCreationContent';
import ObjectForm from './components/TankForm';
import { Values } from './components/TankForm/types';

const buildIntegrationDetails = (
  integrationDetails: FormIntegrationDetails,
  values: Values
) => {
  const { shouldAutoGenerate, ...etc } = integrationDetails;
  return {
    ...etc,
    integrationDomainId: values.integrationDomainId,
  };
};

const mapApiErrorsToFields = (errors: any) => {
  if (!errors) {
    return null;
  }

  const possibleIntegrationDomainIdErrors = [
    errors.integrationDomainId,
    errors.heliumLevelIntegrationDetails?.integrationDomainId,
    errors.heliumPressureIntegrationDetails?.integrationDomainId,
    errors.nitrogenLevelIntegrationDetails?.integrationDomainId,
    errors.nitrogenPressureIntegrationDetails?.integrationDomainId,
    errors.batteryIntegrationDetails?.integrationDomainId,
    errors.gpsIntegrationDetails?.integrationDomainId,
  ];
  const firstIntegrationDomainIdError = possibleIntegrationDomainIdErrors.find(
    (error) => !!error
  );

  return {
    ...errors,
    ...(firstIntegrationDomainIdError && {
      integrationDomainId: firstIntegrationDomainIdError,
    }),
  };
};

type RetrieveRequestObj = EvolveRetrieveHeliumISOContainerRequest;
type RetrieveResponseObj = EvolveRetrieveQuickAssetCreateHeliumISOContainerResponse;

type SaveRequestObj = EvolveSaveQuickAssetCreateHeliumISOContainerRequest;
type ResponseObj = EvolveSaveQuickAssetCreateHeliumISOContainerResponse;

const HeliumISOContainerCreate = () => {
  const { t } = useTranslation();
  const [formInstance, setFormInstance] = React.useState<FormikProps<Values>>();
  const [isFormErrorDialogOpen, setIsFormErrorDialogOpen] = useState(false);

  // Fetch asset edit components state vars
  const [isFetchingEditData, setIsFetchingEditData] = useState(false);
  const [
    editComponents,
    setEditComponents,
  ] = useState<RetrieveResponseObj | null>();
  const [editComponentsError, setEditComponentsError] = useState<any>();

  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<
    SubmissionResult<ResponseObj>
  >();
  const [submissionError, setSubmissionError] = useState<any>();

  // Data set within the form
  const [selectedRtu, setSelectedRtu] = useState<RTUDeviceInfo | null>(null);
  const [rtuChannelsFromRtu, setRtuChannelsFromRtu] = useState<
    RTUChannelUsageInfo[] | null | undefined
  >();

  const activeDomain = useSelector(selectActiveDomain);
  const user = useSelector(selectUser);
  const userId =
    user.data?.authenticateAndRetrieveApplicationInfoResult?.userInfo?.userId;
  const domainId = activeDomain?.domainId;

  const fetchEditData = useCallback(() => {
    setIsFetchingEditData(true);
    return AdminApiService.AssetService.retrieveQuickAssetCreateHeliumIsoContainer_RetrieveHeliumISOContainer(
      {
        domainId,
      } as RetrieveRequestObj
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
  }, []);

  useEffect(() => void fetchEditData(), [fetchEditData]);

  const refetchEditData = fetchEditData;

  const handleCloseFormErrorDialog = () => {
    setIsFormErrorDialogOpen(false);
  };

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setSubmissionResult(undefined);

    const integrationParameterFields = [
      'heliumLevelIntegrationDetails',
      'heliumPressureIntegrationDetails',
      'nitrogenLevelIntegrationDetails',
      'nitrogenPressureIntegrationDetails',
      'batteryIntegrationDetails',
      'gpsIntegrationDetails',
    ];

    const integrationParameterValues = integrationParameterFields.reduce(
      (prev, fieldName) => ({
        ...prev,
        // @ts-ignore
        [fieldName]: buildIntegrationDetails(values[fieldName], values),
      }),
      { assetIntegrationId: values.assetIntegrationId }
    );

    return AdminApiService.AssetService.saveQuickAssetCreateHeliumIsoContainer_SaveQuickAssetCreateHeliumISOContainer(
      {
        domainId,
        description: values.description,
        designCurveId: values.designCurveId,
        siteId: values.siteId,
        notes: values.notes,
        customProperties: values.customProperties?.map((property) => ({
          propertyTypeId: property.propertyTypeId,
          name: property.name,
          value: property.value,
        })),
        rtuId: values.rtuId,
        addHeliumPressureRateOfChange: values.addHeliumPressureRateOfChange,

        // Only pass integration parameter related fields when the integration
        // feed is enabled
        ...(editComponents?.isIntegrationFeedEnabled &&
          integrationParameterValues),
      } as SaveRequestObj
    )
      .then((response) => {
        const successResult = { response };
        setSubmissionResult(successResult);
        return successResult;
      })
      .catch((error) => {
        const errorResult = parseResponseError(error);
        if (errorResult) {
          const formattedErrors = mapApiErrorsToFields(errorResult.errors);

          formikBag.setErrors(formattedErrors);
          formikBag.setStatus({ errors: formattedErrors });
          setSubmissionResult(errorResult);

          if (formattedErrors.errors) {
            setIsFormErrorDialogOpen(true);
          }
        } else {
          setSubmissionError(error);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleFormChange = (formik: FormikProps<Values>) => {
    setFormInstance(formik);
  };

  const handleCreateNew = () => {
    setSubmissionResult(undefined);
    refetchEditData();
  };

  const createdAsset = submissionResult?.response?.asset;
  const hasFinishedCreating = !!createdAsset;

  return (
    <>
      {/*
        Use a zIndex of 3 to prevent some mapbox elements (which have a zIndex
        of 2) from overlapping on the sticky page intro
      */}
      <PageIntroWrapper sticky zIndex={3}>
        <PageIntro
          title={
            hasFinishedCreating
              ? t(
                  'ui.quicktankcreate.heliumISOContainer.successfullyCreatedHeader',
                  'New Helium ISO Container Asset Created'
                )
              : t(
                  'ui.quicktankcreate.heliumISOContainer.header',
                  'Add Helium ISO Container Asset'
                )
          }
          isSubmitting={isSubmitting}
          showFinishedAction={hasFinishedCreating}
          refetchEditData={refetchEditData}
          submitForm={formInstance?.submitForm}
          handleCreateNew={handleCreateNew}
        />
      </PageIntroWrapper>

      <FormErrorDialog
        open={isFormErrorDialogOpen}
        errors={submissionResult?.errors?.errors}
        onConfirm={handleCloseFormErrorDialog}
      />

      <Box mt={5}>
        <Fade in={isFetchingEditData} unmountOnExit>
          <div>
            {isFetchingEditData && (
              <MessageBlock>
                <CircularProgress />
              </MessageBlock>
            )}
          </div>
        </Fade>
        <Fade in={hasFinishedCreating} unmountOnExit>
          <div>
            <SuccessfulCreationContent createdAsset={createdAsset} />
          </div>
        </Fade>
        <Fade
          in={
            !editComponentsError && !isFetchingEditData && !hasFinishedCreating
          }
        >
          <div>
            {!editComponentsError &&
              !isFetchingEditData &&
              !hasFinishedCreating && (
                <Grid
                  container
                  spacing={2}
                  direction="column"
                  justify="space-between"
                >
                  <Grid item xs={12}>
                    <ObjectForm
                      initialValues={{}}
                      onSubmit={handleSubmit}
                      // @ts-ignore
                      handleFormChange={handleFormChange}
                      submissionError={submissionError}
                      editDetails={editComponents}
                      domain={activeDomain}
                      userId={userId}
                      customProperties={editComponents?.customProperties}
                      domainDefaultSite={
                        editComponents?.domainHeliumISODefaultSite
                      }
                      selectedRtu={selectedRtu}
                      rtuChannelsFromRtu={rtuChannelsFromRtu}
                      setSelectedRtu={setSelectedRtu}
                      setRtuChannelsFromRtu={setRtuChannelsFromRtu}
                    />
                  </Grid>
                </Grid>
              )}
          </div>
        </Fade>
      </Box>
    </>
  );
};

export default HeliumISOContainerCreate;
