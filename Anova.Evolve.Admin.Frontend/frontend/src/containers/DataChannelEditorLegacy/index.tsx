/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AdminApiService from 'api/admin/ApiService';
import { DataChannelId } from 'apps/admin/routes';
import BackIconButton from 'components/buttons/BackIconButton';
import CircularProgress from 'components/CircularProgress';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import Tab from 'components/Tab';
import Tabs from 'components/Tabs';
import { SubmissionResult } from 'form-utils/types';
import { FormikHelpers, FormikProps } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';
import { parseResponseError } from 'utils/api/handlers';
import { buildDataChannelTypeTextMapping } from 'utils/i18n/enum-to-text';
import ObjectForm from './components/ObjectForm';
import {
  getPreciseOrRoundedValue,
  eventFormValuesToApiPayload,
} from './components/ObjectForm/helpers';
import type { Values } from './components/ObjectForm/types';
import PageIntro from './components/PageIntro';
import {
  DataChannelEditorTabs,
  RetrieveRequest,
  RetrieveResponse,
  SaveRequest,
  SaveResponse,
} from './types';

const mapApiErrorsToFields = (
  errors: Record<keyof SaveRequest, string | undefined>
): Record<Partial<keyof Values>, string | string[] | undefined> | null => {
  if (!errors) {
    return null;
  }

  const publishedChannelInfoErrors = [
    errors.sourceDataChannelId,
    errors.publishedComments,
  ];
  const filteredPublishedChannelInfoErrors = publishedChannelInfoErrors.filter(
    Boolean
  ) as string[];

  const {
    // Pull out errors that don't map 1 to 1 to form fields
    dataChannelTemplateId,
    productId,
    tankDimensionId,
    ...restOfErrors
  } = errors;

  return {
    // @ts-ignore
    ...(restOfErrors as Record<Partial<keyof Values>, string | string[]>),
    tankDimensionInfo: errors.tankDimensionId,
    rtuInfo: errors.rtuId,
    rtuChannelInfo: errors.rtuChannelId,
    dataChannelTemplateInfo: errors.dataChannelTemplateId,
    productInfo: errors.productId,
    ...(filteredPublishedChannelInfoErrors.length && {
      publishedChannelInfo: filteredPublishedChannelInfoErrors,
    }),
  };
};

interface RouteParams {
  [DataChannelId]: string;
}

const DataChannelEditorLegacy = () => {
  const { t } = useTranslation();
  const dataChannelTypeTextMapping = useMemo(
    () => buildDataChannelTypeTextMapping(t),
    [t]
  );

  const params = useParams<RouteParams>();
  const [formInstance, setFormInstance] = React.useState<FormikProps<Values>>();
  const [isFetchingEditData, setIsFetchingEditData] = useState(false);
  const [
    editComponents,
    setEditComponents,
  ] = useState<RetrieveResponse | null>();
  const [editComponentsError, setEditComponentsError] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<
    SubmissionResult<SaveResponse>
  >();
  const [submissionError, setSubmissionError] = useState<any>();

  const editingObjectId = params[DataChannelId];
  const isCreating = !editingObjectId;

  const domainId = useSelector(selectActiveDomainId);

  const fetchEditData = useCallback(() => {
    setIsFetchingEditData(true);
    return AdminApiService.DataChannelService.retrieveEditLevelDataChannelInfo_RetrieveEditLevelDataChannelInfo(
      {
        dataChannelId: editingObjectId,
        domainId,
      } as RetrieveRequest
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
  }, [editingObjectId]);

  useEffect(() => {
    fetchEditData();
  }, [fetchEditData]);

  const refetchEditData = () => {
    fetchEditData();
    setSubmissionError(undefined);
    setSubmissionResult(undefined);
  };

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setSubmissionResult(undefined);

    const eventRulesApiPayload = eventFormValuesToApiPayload(values);

    return AdminApiService.DataChannelService.saveEditLevelDataChannelInfo_SaveEditLevelDataChannelInfo(
      {
        dataChannelId: editingObjectId,
        domainId,
        description: values.description,
        serialNumber: values.serialNumber,
        isTankDimensionsSet: values.isTankDimensionsSet,
        tankType: values.tankType,
        tankDimensionId: values.tankDimensionInfo?.tankDimensionId,
        productId: values.productInfo?.productId,
        dataSource: values.dataSource,
        rtuId: values.rtuInfo?.rtuId,
        rtuChannelId: values.rtuChannelInfo?.rtuChannelId,
        sourceDataChannelId: values.publishedChannelInfo?.sourceDataChannelId,
        publishedComments: values.publishedChannelInfo?.publishedComments,
        dataChannelTemplateId:
          values.dataChannelTemplateInfo?.dataChannelTemplateId,
        scaledUnitsAsText: values.scaledUnitsAsText,
        scaledUnits: values.scaledUnits,
        scaledDecimalPlaces: values.scaledDecimalPlaces || 0,
        scaledMaxProductHeight: values.scaledMaxProductHeight,
        displayUnits: values.displayUnits,
        displayMaxProductHeight: getPreciseOrRoundedValue(
          values,
          'displayMaxProductHeight'
        ),
        displayDecimalPlaces: values.displayDecimalPlaces || 0,
        graphYAxisScaleId: values.graphYAxisScaleId,
        graphMax: getPreciseOrRoundedValue(values, 'graphMax'),
        graphMin: getPreciseOrRoundedValue(values, 'graphMin'),
        isDisplayGapsInGraph: values.isDisplayGapsInGraph,
        forecastMode: values.forecastMode,
        manualUsageRate: getPreciseOrRoundedValue(values, 'manualUsageRate'),
        maxDeliverQuantity: getPreciseOrRoundedValue(
          values,
          'maxDeliverQuantity'
        ),
        showHighLowForecast: values.showHighLowForecast,
        showScheduledDeliveriesInforecast:
          values.showScheduledDeliveriesInforecast,
        autoGenerateIntegration1Id: values.autoGenerateIntegration1Id,
        enableIntegration1: values.enableIntegration1,
        integration1DomainId: values.integration1DomainId,
        integration1Id: values.integration1Id,
        autoGenerateIntegration2Id: values.autoGenerateIntegration2Id,
        enableIntegration2: values.enableIntegration2,
        integration2DomainId: values.integration2DomainId,
        integration2Id: values.integration2Id,
        ...eventRulesApiPayload,
      } as SaveRequest
    )
      .then((response) => {
        const successResult = { response };
        setSubmissionResult(successResult);

        // Update the last updated by username + date after saving
        formikBag.setValues({
          ...values,
          lastUpdateUserName:
            response.dataChannelGeneralInfo?.lastUpdateUserName,
          lastUpdatedDate: response.dataChannelGeneralInfo?.lastUpdatedDate,
        });

        return successResult;
      })
      .catch((error) => {
        const errorResult = parseResponseError(error);
        if (errorResult) {
          const formattedErrors = mapApiErrorsToFields(
            errorResult.errors as any
          );

          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
          setSubmissionResult(errorResult);
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

  const [activeTab, setActiveTab] = React.useState(
    DataChannelEditorTabs.General
  );

  const handleChangeActiveTab = (
    event: React.ChangeEvent<{}> | undefined,
    newValue: DataChannelEditorTabs
  ) => {
    setActiveTab(newValue);
  };

  const dataChannelData = editComponents?.dataChannelGeneralInfo;
  const dataChannelEventData = editComponents?.dataChannelEventInfo;
  const dataChannelTypeText =
    dataChannelTypeTextMapping[dataChannelData?.dataChannelType!];

  return (
    <>
      <Fade in={isFetchingEditData} unmountOnExit>
        <div>
          {isFetchingEditData && (
            <MessageBlock>
              <CircularProgress />
            </MessageBlock>
          )}
        </div>
      </Fade>

      <Fade in={!isFetchingEditData} unmountOnExit>
        <div>
          {!isFetchingEditData && (
            <>
              <PageIntroWrapper
                sticky
                divider={
                  <Tabs
                    value={activeTab}
                    // @ts-ignore
                    onChange={handleChangeActiveTab}
                    aria-label="Data channel editor tabs"
                  >
                    <Tab label={t('ui.common.general', 'General')} />
                    <Tab label={t('ui.common.events', 'Events')} />
                    <Tab
                      label={t('ui.datachannel.publish', 'Publish')}
                      disabled
                    />
                    <Tab label={t('ui.common.history', 'History')} />
                  </Tabs>
                }
              >
                <PageIntro
                  isCreating={isCreating}
                  isSubmitting={isSubmitting}
                  submissionResult={submissionResult}
                  submissionError={submissionError}
                  formikErrorStatus={formInstance?.status?.errors}
                  refetchEditData={refetchEditData}
                  submitForm={formInstance?.submitForm}
                  isValid={formInstance?.isValid}
                  headerNavButton={<BackIconButton />}
                  assetDescription={dataChannelData?.assetDescription}
                  siteCustomerName={dataChannelData?.siteCustomerName}
                  dataChannelTypeText={dataChannelTypeText}
                  handleChangeActiveTab={handleChangeActiveTab}
                />
              </PageIntroWrapper>

              <Box mt={3}>
                <Fade
                  in={!isFetchingEditData && editComponentsError}
                  unmountOnExit
                >
                  <div>
                    {!isFetchingEditData && editComponentsError && (
                      <MessageBlock>
                        <Typography variant="body2" color="error">
                          {t(
                            'ui.common.retrieveDataError',
                            'Unable to retrieve data'
                          )}
                        </Typography>
                      </MessageBlock>
                    )}
                  </div>
                </Fade>
                <Fade in={!editComponentsError && !isFetchingEditData}>
                  <div>
                    {!editComponentsError && !isFetchingEditData && (
                      <Grid
                        container
                        spacing={2}
                        direction="column"
                        justify="space-between"
                      >
                        <Grid item xs={12}>
                          <ObjectForm
                            initialValues={dataChannelData}
                            eventsData={dataChannelEventData}
                            onSubmit={handleSubmit}
                            handleFormChange={handleFormChange}
                            activeTab={activeTab}
                            domainId={domainId}
                            dataChannelId={editingObjectId}
                            dataChannelTypeText={dataChannelTypeText}
                            options={editComponents?.options}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </div>
                </Fade>
              </Box>
            </>
          )}
        </div>
      </Fade>
    </>
  );
};

export default DataChannelEditorLegacy;
