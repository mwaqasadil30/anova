/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import {
  DataChannelDataSourceType,
  DataChannelType,
  EvolveGetUnitTypesRequest,
  EvolveQuickAssetCreateBulkTankRequest,
  EvolveQuickAssetCreateBulkTankResponse,
  EvolveRetrieveQuickAssetCreateBulkTankResponse,
  EvolveRetrieveUnitTypeByUnitQuantityTypeIdRequest,
  EvolveUnitQuantityType,
  EvolveUnitType,
  ProductDetail,
  PublishedDataChannelSearchInfo,
  RTUChannelUsageInfo,
  RTUDeviceInfo,
  TankDimensionDetail,
  UnitType,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import routes from 'apps/admin/routes';
import CircularProgress from 'components/CircularProgress';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import { SubmissionResult } from 'form-utils/types';
import { FormikHelpers, FormikProps } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath } from 'react-router';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { selectUser } from 'redux-app/modules/user/selectors';
import { parseResponseError } from 'utils/api/handlers';
import {
  canAddBatteryChannelForRtu,
  canAddRtuTemperatureChannelForRtu,
} from 'utils/api/helpers';
import { isNumber } from 'utils/format/numbers';
import type { FormIntegrationDetails } from 'utils/forms/types';
import PageIntro from './components/PageIntro';
import SuccessfulCreationDialog from './components/SuccessfulCreationDialog';
import ObjectForm from './components/TankForm';
import { Values } from './components/TankForm/types';

const getValidConversionValue = (
  convertedValue: string | number | null | undefined,
  inputValue: string | number | null | undefined,
  values: Values
) => {
  return values.isTankDimensionsSet && isNumber(convertedValue)
    ? convertedValue
    : inputValue;
};

const buildIntegrationDetails = (
  integrationDetails: FormIntegrationDetails,
  values: Values
) => {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { shouldAutoGenerate, ...etc } = integrationDetails;
  return {
    ...etc,
    integrationDomainId: values.integrationDomainId,
  };
};

const mapNestedApiErrorsToFields = (errors: any) => {
  if (!errors) {
    return null;
  }

  const { maxProductHeight, maxProductHeightInDisplayUnits, ...etc } = errors;

  return {
    ...etc,
    ...(maxProductHeight && {
      levelMonitoringMaxProductHeight: maxProductHeight,
    }),
    ...(maxProductHeightInDisplayUnits && {
      levelVolumeMaxProductHeight: maxProductHeightInDisplayUnits,
    }),
  };
};

const mapApiErrorsToFields = (errors: any) => {
  if (!errors) {
    return null;
  }

  const {
    dataChannelsBasedRtu,
    dataChannelBasedPublishedChannel,
    ...nonNestedErrors
  } = errors;

  const possibleIntegrationDomainIdErrors = [
    errors.integrationDomainId,
    dataChannelsBasedRtu?.levelIntegrationDetails?.integrationDomainId,
    dataChannelsBasedRtu?.pressureIntegrationDetails?.integrationDomainId,
    dataChannelsBasedRtu?.batteryIntegrationDetails?.integrationDomainId,
    dataChannelBasedPublishedChannel?.levelIntegrationDetails
      ?.integrationDomainId,
  ];
  const firstIntegrationDomainIdError = possibleIntegrationDomainIdErrors.find(
    (error) => !!error
  );

  return {
    ...nonNestedErrors,
    ...mapNestedApiErrorsToFields(dataChannelsBasedRtu),
    ...mapNestedApiErrorsToFields(dataChannelBasedPublishedChannel),
    integrationDomainId: firstIntegrationDomainIdError,
  };
};

interface ResponseObj extends EvolveRetrieveQuickAssetCreateBulkTankResponse {}

const QuickTankCreate = () => {
  const { t } = useTranslation();
  const [formInstance, setFormInstance] = React.useState<
    FormikProps<ResponseObj>
  >();

  // Fetch asset edit components state vars
  const [isFetchingEditData, setIsFetchingEditData] = useState(false);
  const [editComponents, setEditComponents] = useState<ResponseObj | null>();
  const [editComponentsError, setEditComponentsError] = useState<any>();

  // Fetch unit types (volumetric and non-volumetric) state vars
  const [unitTypes, setUnitTypes] = useState<
    EvolveUnitType[] | null | undefined
  >();
  const [
    isFetchingVolumetricUnitTypes,
    setIsFetchingVolumetricUnitTypes,
  ] = useState(false);
  const [
    isFetchingNonVolumetricUnitTypes,
    setIsFetchingNonVolumetricUnitTypes,
  ] = useState(false);
  const [volumetricUnitTypes, setVolumetricUnitTypes] = useState<
    UnitType[] | null | undefined
  >();
  const [nonVolumetricUnitTypes, setNonVolumetricUnitTypes] = useState<
    UnitType[] | null | undefined
  >();

  // Fetch unit quantity types state vars
  const [unitQuantityTypes, setUnitQuantityTypes] = useState<
    EvolveUnitQuantityType[] | null | undefined
  >();

  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<
    SubmissionResult<EvolveQuickAssetCreateBulkTankResponse>
  >();
  const [submissionError, setSubmissionError] = useState<any>();

  // Data set within the form
  const [selectedRtu, setSelectedRtu] = useState<RTUDeviceInfo | null>(null);
  const [rtuChannelsFromRtu, setRtuChannelsFromRtu] = useState<
    RTUChannelUsageInfo[] | null | undefined
  >();
  const [tankDimensionDetails, setTankDimensionDetails] = useState<
    TankDimensionDetail | null | undefined
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [productDetails, setProductDetails] = useState<
    ProductDetail | null | undefined
  >(null);
  const [
    publishedCommentDetails,
    setPublishedCommentDetails,
  ] = useState<PublishedDataChannelSearchInfo | null>(null);

  const activeDomain = useSelector(selectActiveDomain);
  const user = useSelector(selectUser);
  const userId =
    user.data?.authenticateAndRetrieveApplicationInfoResult?.userInfo?.userId;
  const domainId = activeDomain?.domainId;

  const eventRuleGroups = editComponents?.eventRuleGroups;

  // Dropdown options
  const dataChannelTemplates = editComponents?.dataChannelTemplates;
  const pressureSensorOptions = dataChannelTemplates?.filter(
    (dataChannelTemplate) =>
      dataChannelTemplate.dataChannelType === DataChannelType.Pressure
  );
  const levelSensorOptions = dataChannelTemplates?.filter(
    (dataChannelTemplate) =>
      dataChannelTemplate.dataChannelType === DataChannelType.Level
  );

  const fetchEditData = useCallback(() => {
    setIsFetchingEditData(true);
    return AdminApiService.AssetService.retrieveQuickAssetCreateBulkTank_RetrieveQuickAssetCreateBulkTank()
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

  const fetchUnitTypes = useCallback(() => {
    return AdminApiService.UnitTypeService.getUnitTypes_GetUnitTypes(
      {} as EvolveGetUnitTypesRequest
    )
      .then((response) => {
        setUnitTypes(response.result);
      })
      .catch((error) => {
        console.error('Unable to fetch unit types', error);
      });
  }, []);

  const fetchUnitQuantityTypes = useCallback(() => {
    return AdminApiService.UnitQuantityTypeService.getUnitQuantityTypes_GetUnitQuantityTypes()
      .then((response) => {
        setUnitQuantityTypes(response.unitQuantityType);
      })
      .catch((error) => {
        console.error('Unable to fetch unit quantity types', error);
      });
  }, []);

  const fetchUnitTypesByUnitQuantityType = useCallback((typeIds: number[]) => {
    return AdminApiService.GeneralService.retrieveUnitTypeByUnitQuantityTypeId_RetrieveUnitTypeByUnitQuantityTypeId(
      {
        unitQuantityTypeIds: typeIds,
      } as EvolveRetrieveUnitTypeByUnitQuantityTypeIdRequest
    );
  }, []);

  const fetchVolumetricUnitTypes = useCallback(
    (quantityTypes: EvolveUnitQuantityType[]) => {
      const unitQuantityTypeIds = quantityTypes
        .map((type) => type.unitQuantityTypeId)
        .filter(isNumber) as number[];

      setIsFetchingVolumetricUnitTypes(true);
      return fetchUnitTypesByUnitQuantityType(unitQuantityTypeIds)
        .then((response) => {
          setVolumetricUnitTypes(
            response.retrieveUnitTypeByUnitQuantityTypeIdResult
          );
        })
        .catch((error) => {
          console.error('Unable to fetch volumetric unit types', error);
        })
        .finally(() => {
          setIsFetchingVolumetricUnitTypes(false);
        });
    },
    []
  );

  const fetchNonVolumetricUnitTypes = useCallback(
    (quantityTypes: EvolveUnitQuantityType[]) => {
      const unitQuantityTypeIds = quantityTypes
        .filter((type) => type.name === 'Mass' || type.name === 'Volume')
        .map((type) => type.unitQuantityTypeId)
        .filter(isNumber) as number[];

      setIsFetchingNonVolumetricUnitTypes(true);
      return fetchUnitTypesByUnitQuantityType(unitQuantityTypeIds)
        .then((response) => {
          setNonVolumetricUnitTypes(
            response.retrieveUnitTypeByUnitQuantityTypeIdResult
          );
        })
        .catch((error) => {
          console.error('Unable to fetch non-volumetric unit types', error);
        })
        .finally(() => {
          setIsFetchingNonVolumetricUnitTypes(false);
        });
    },
    []
  );

  useEffect(() => void fetchUnitTypes(), []);
  useEffect(() => void fetchEditData(), [fetchEditData]);
  useEffect(() => void fetchUnitQuantityTypes(), [fetchUnitQuantityTypes]);
  useEffect(() => {
    if (unitQuantityTypes && unitQuantityTypes.length > 0) {
      fetchVolumetricUnitTypes(unitQuantityTypes);
      fetchNonVolumetricUnitTypes(unitQuantityTypes);
    }
  }, [
    unitQuantityTypes,
    fetchVolumetricUnitTypes,
    fetchNonVolumetricUnitTypes,
  ]);

  const refetchEditData = fetchEditData;

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setSubmissionResult(undefined);

    const isAddBatteryChannelEnabled = canAddBatteryChannelForRtu(selectedRtu);
    const isAddRtuTemperatureChannelEnabled = canAddRtuTemperatureChannelForRtu(
      selectedRtu
    );
    const shouldAddBatteryChannel =
      isAddBatteryChannelEnabled && values.addBatteryChannel;
    const shouldAddRtuTemperatureChannel =
      isAddRtuTemperatureChannelEnabled && values.addRtuTemperatureChannel;

    const commonDataChannelValues = {
      isTankDimensionsSet: values.isTankDimensionsSet,
      // TODO: See if tank type is conditional on isTankDimensionsSet
      tankType: values.tankType,
      tankDimensionId: values.tankDimensionId,
      productId: values.productId,
      eventRuleGroupId: values.eventRuleGroupId,
      displayUnits: values.displayUnits,
      ...(values.isTankDimensionsSet
        ? {
            maxProductHeight: getValidConversionValue(
              values._convertedDisplayUnitsProductHeight,
              values.levelMonitoringMaxProductHeight,
              values
            ),
            maxProductHeightInDisplayUnits: undefined,
          }
        : {
            maxProductHeight: values.levelMonitoringMaxProductHeight,
            maxProductHeightInDisplayUnits: values.levelVolumeMaxProductHeight,
          }),
      reorderEventValue: getValidConversionValue(
        values._convertedReorderEventValue,
        values.reorderEventValue,
        values
      ),
      criticalEventValue: getValidConversionValue(
        values._convertedCriticalEventValue,
        values.criticalEventValue,
        values
      ),
    };

    return AdminApiService.AssetService.saveQuickAssetCreateBulkTank_SaveQuickAssetCreateBulkTank(
      {
        description: values.description,
        domainId,
        siteId: values.siteId,
        technician: values.technician,
        notes: values.notes,
        integrationId: values.integrationId,
        customProperties: values.customProperties?.map((property) => ({
          propertyTypeId: property.propertyTypeId,
          name: property.name,
          value: property.value,
        })),

        ...(values.dataSource === DataChannelDataSourceType.RTU
          ? {
              dataChannelsBasedRtu: {
                ...commonDataChannelValues,
                rtuId: values.rtuId,
                levelRtuChannelId: values.levelRtuChannelId,
                levelDataChannelTemplateId: values.levelDataChannelTemplateId,
                pressureRtuChannelId: values.pressureRtuChannelId,
                pressureDataChannelTemplateId:
                  values.pressureDataChannelTemplateId,
                addBatteryChannel: shouldAddBatteryChannel,
                addRtuTemperatureChannel: shouldAddRtuTemperatureChannel,
                levelIntegrationDetails: buildIntegrationDetails(
                  values.levelIntegrationDetails,
                  values
                ),
                pressureIntegrationDetails: values.pressureDataChannelTemplateId
                  ? buildIntegrationDetails(
                      values.pressureIntegrationDetails,
                      values
                    )
                  : null,
                batteryIntegrationDetails: shouldAddBatteryChannel
                  ? buildIntegrationDetails(
                      values.batteryIntegrationDetails,
                      values
                    )
                  : null,
              },
            }
          : {
              dataChannelBasedPublishedChannel: {
                ...commonDataChannelValues,
                sourceDataChannelId: values.sourceDataChannelId,
                publishedComments: publishedCommentDetails?.publishedComments,
                levelIntegrationDetails: buildIntegrationDetails(
                  values.levelIntegrationDetails,
                  values
                ),
              },
            }),
      } as EvolveQuickAssetCreateBulkTankRequest
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

          // @ts-ignore
          formikBag.setErrors(formattedErrors);
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

  const handleFormChange = (formik: FormikProps<ResponseObj>) => {
    setFormInstance(formik);
  };

  const handleCreateNew = () => {
    setSubmissionResult(undefined);
    refetchEditData();
  };

  const unitTypeTextToEnumMapping = unitTypes?.reduce(
    (prev, current) => ({
      ...prev,
      [current.displayUnit as any]: current.unitTypeId,
    }),
    {}
  ) as Record<string, UnitType>;

  const createdAsset = submissionResult?.response?.asset;
  const viewDetailsPath = createdAsset?.assetId
    ? generatePath(routes.assetManager.edit, { assetId: createdAsset.assetId })
    : '';

  return (
    <>
      {/*
        Use a zIndex of 3 to prevent some mapbox elements (which have a zIndex
        of 2) from overlapping on the sticky page intro
      */}
      <PageIntroWrapper sticky zIndex={3}>
        <PageIntro
          title={t('ui.quicktankcreate.header', 'Add Tank Asset')}
          isSubmitting={isSubmitting}
          refetchEditData={refetchEditData}
          submitForm={formInstance?.submitForm}
        />
      </PageIntroWrapper>

      <SuccessfulCreationDialog
        createdAsset={createdAsset}
        viewDetailsPath={viewDetailsPath}
        exitPath={routes.assetManager.list}
        handleCreateNew={handleCreateNew}
      />

      <Box mt={5}>
        <Fade
          in={
            isFetchingEditData ||
            isFetchingNonVolumetricUnitTypes ||
            isFetchingVolumetricUnitTypes
          }
          unmountOnExit
        >
          <div>
            {(isFetchingEditData ||
              isFetchingNonVolumetricUnitTypes ||
              isFetchingVolumetricUnitTypes) && (
              <MessageBlock>
                <CircularProgress />
              </MessageBlock>
            )}
          </div>
        </Fade>
        <Fade
          in={
            !editComponentsError &&
            !isFetchingEditData &&
            !isFetchingNonVolumetricUnitTypes &&
            !isFetchingVolumetricUnitTypes
          }
        >
          <div>
            {!editComponentsError &&
              !isFetchingEditData &&
              !isFetchingNonVolumetricUnitTypes &&
              !isFetchingVolumetricUnitTypes && (
                <Grid
                  container
                  spacing={2}
                  direction="column"
                  justify="space-between"
                >
                  <Grid item>
                    <ObjectForm
                      initialValues={{}}
                      onSubmit={handleSubmit}
                      // @ts-ignore
                      handleFormChange={handleFormChange}
                      submissionError={submissionError}
                      editDetails={editComponents}
                      domain={activeDomain}
                      userId={userId}
                      eventRuleGroups={eventRuleGroups}
                      customProperties={editComponents?.customProperties}
                      pressureSensorOptions={pressureSensorOptions}
                      levelSensorOptions={levelSensorOptions}
                      volumetricUnitTypes={volumetricUnitTypes}
                      nonVolumetricUnitTypes={nonVolumetricUnitTypes}
                      tankDimensionDetails={tankDimensionDetails}
                      selectedRtu={selectedRtu}
                      rtuChannelsFromRtu={rtuChannelsFromRtu}
                      unitTypeTextToEnumMapping={unitTypeTextToEnumMapping}
                      setSelectedRtu={setSelectedRtu}
                      setRtuChannelsFromRtu={setRtuChannelsFromRtu}
                      setTankDimensionDetails={setTankDimensionDetails}
                      setProductDetails={setProductDetails}
                      setPublishedCommentDetails={setPublishedCommentDetails}
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

export default QuickTankCreate;
