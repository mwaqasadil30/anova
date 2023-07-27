import {
  EventInventoryStatusType,
  EventRuleType,
  EvolveRetrieveEventRuleGroupRuleInfoListByTypeAndInventoryStatusRequest,
  EvolveRetrieveProductDetailByIdRequest,
  EvolveRetrieveRtuChannelUsageInfoListByRtuRequest,
  EvolveRetrieveSiteEditComponentsByIdRequest,
  EvolveRetrieveSourceDataChannelDefaultsByIdRequest,
  EvolveRetrieveTankDimensionDetailByIdRequest,
  UnitType,
  FtpFileFormat,
  DataChannelDataSourceType,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import useConvertUnits from 'containers/QuickTankCreate/hooks/useConvertUnits';
import { FormChangeEffectProps } from 'containers/QuickTankCreate/types';
import { useCallback, useEffect } from 'react';
import { getFtpId } from 'utils/api/helpers';
import { isNumber } from 'utils/format/numbers';

const FormChangeEffect = (props: FormChangeEffectProps) => {
  const {
    values,
    selectedRtu,
    integrationDomains,
    selectedLevelSensor,
    rtuChannelsFromRtu,
    scaledUnitTypeOption,
    sourceDataChannelDetails,
    setFieldValue,
    setEventRuleGroupInfoDetails,
    setRtuChannelsFromRtu,
    setTankDimensionDetails,
    setProductDetails,
    setSourceDataChannelDetails,
    setSiteDetails,
  } = props;
  const {
    eventRuleGroupId,
    rtuId,
    isTankDimensionsSet,
    tankDimensionId,
    productId,
    sourceDataChannelId,
    siteId,
  } = values;

  // When "Set tank dimensions" is toggled, convert max product height, reorder
  // level and critical level fields when changing display units
  useConvertUnits(props);

  const fetchEventRuleGroupDetails = useCallback(
    (
      request: EvolveRetrieveEventRuleGroupRuleInfoListByTypeAndInventoryStatusRequest
    ) => {
      return AdminApiService.EventService.retrieveEventRuleGroupRuleInfoListByTypeAndInventoryStatus_RetrieveEventRuleGroupRuleInfoListByTypeAndInventoryStatus(
        request
      )
        .then((response) => {
          setEventRuleGroupInfoDetails(
            response.retrieveEventRuleGroupRuleInfoListByTypeAndInventoryStatusResult
          );
        })
        .catch((error) => {
          console.error(
            'Unable to fetch event rule group rule info details',
            error
          );
        });
    },
    []
  );

  const fetchRtuDetails = useCallback(
    (request: EvolveRetrieveRtuChannelUsageInfoListByRtuRequest) => {
      return AdminApiService.RTUService.retrieveRtuChannelUsageInfoListByRtu_RetrieveRtuChannelUsageInfoListByRtu(
        request
      )
        .then((response) => {
          setRtuChannelsFromRtu(
            response.retrieveRTUChannelUsageInfoListByRTUResult
          );
        })
        .catch((error) => {
          console.error('Unable to fetch RTU details', error);
        });
    },
    []
  );

  const fetchTankDimensionDetails = useCallback(
    (request: EvolveRetrieveTankDimensionDetailByIdRequest) => {
      return AdminApiService.GeneralService.retrieveTankDimensionDetailById_RetrieveTankDimensionDetailById(
        request
      )
        .then((response) => {
          setTankDimensionDetails(
            response.retrieveTankDimensionDetailByIdResult
          );
        })
        .catch((error) => {
          console.error('Unable to fetch tank dimension details', error);
        });
    },
    []
  );

  const fetchProductDetails = useCallback(
    (request: EvolveRetrieveProductDetailByIdRequest) => {
      return AdminApiService.GeneralService.retrieveProductDetailById_RetrieveProductDetailById(
        request
      )
        .then((response) => {
          setProductDetails(response.retrieveProductDetailByIdResult);
        })
        .catch((error) => {
          console.error('Unable to fetch product details', error);
        });
    },
    []
  );

  const fetchDataChannelDetails = useCallback(
    (request: EvolveRetrieveSourceDataChannelDefaultsByIdRequest) => {
      return AdminApiService.DataChannelService.retrieveSourceDataChannelDefaultsById_RetrieveSourceDataChannelDefaultsById(
        request
      )
        .then((response) => {
          setSourceDataChannelDetails(
            response.retrieveSourceDataChannelDefaultsByIdResult
          );
        })
        .catch((error) => {
          console.error('Unable to fetch source data channel', error);
        });
    },
    []
  );

  const fetchSiteDetails = useCallback(
    (request: EvolveRetrieveSiteEditComponentsByIdRequest) => {
      return AdminApiService.GeneralService.retrieveSiteEditComponentsById_RetrieveSiteEditComponentsById(
        request
      )
        .then((response) => {
          setSiteDetails(response.retrieveSiteEditComponentsByIdResult);
        })
        .catch((error) => {
          console.error('Unable to fetch site details', error);
        });
    },
    []
  );

  useEffect(() => {
    if (eventRuleGroupId) {
      fetchEventRuleGroupDetails({
        eventRuleGroupId,
        ruleType: EventRuleType.Level,
        inventoryStatusTypes: [
          EventInventoryStatusType.Reorder,
          EventInventoryStatusType.Critical,
        ],
      } as EvolveRetrieveEventRuleGroupRuleInfoListByTypeAndInventoryStatusRequest);
    }
  }, [eventRuleGroupId]);

  useEffect(() => {
    if (rtuId) {
      fetchRtuDetails({
        rtuId,
        dataChannelId: null,
        excludeNonNumericChannelNumbers: false,
      } as EvolveRetrieveRtuChannelUsageInfoListByRtuRequest);
    }
  }, [rtuId]);

  useEffect(() => {
    if (tankDimensionId) {
      fetchTankDimensionDetails({
        tankDimensionId,
      } as EvolveRetrieveTankDimensionDetailByIdRequest);
    } else {
      setTankDimensionDetails(null);
    }
  }, [tankDimensionId]);

  useEffect(() => {
    if (productId) {
      fetchProductDetails({
        productId,
      } as EvolveRetrieveProductDetailByIdRequest);
    } else {
      setProductDetails(null);
    }
  }, [productId]);

  // Adjust "Display Units" field when changing "Set Tank Dimensions" checkbox
  useEffect(() => {
    if (isTankDimensionsSet && selectedLevelSensor) {
      setFieldValue(
        'displayUnits',
        scaledUnitTypeOption
          ? scaledUnitTypeOption.value
          : UnitType.WaterColumnInches
      );
    } else {
      setFieldValue('displayUnits', '');
    }
  }, [isTankDimensionsSet, selectedLevelSensor]);

  useEffect(() => {
    if (sourceDataChannelId) {
      fetchDataChannelDetails({
        sourceDataChannelId,
      } as EvolveRetrieveSourceDataChannelDefaultsByIdRequest);
    } else {
      setSourceDataChannelDetails(null);
    }
  }, [sourceDataChannelId]);

  useEffect(() => {
    if (siteId) {
      fetchSiteDetails({
        siteId,
        loadEditComponents: false,
      } as EvolveRetrieveSiteEditComponentsByIdRequest);
    } else {
      setSiteDetails(null);
    }
  }, [siteId]);

  useEffect(() => {
    if (values.sourceDataChannelId && sourceDataChannelDetails) {
      setFieldValue(
        'levelMonitoringMaxProductHeight',
        sourceDataChannelDetails.maxProductHeight
      );
    } else {
      setFieldValue('levelMonitoringMaxProductHeight', '');
    }
  }, [values.sourceDataChannelId, sourceDataChannelDetails?.dataChannelId]);

  // Reset the "Pressure Channel" when clearing the "Pressure Sensor" to avoid
  // having the same channel clash with the selected "Level Channel"
  useEffect(() => {
    if (!values.pressureDataChannelTemplateId) {
      setFieldValue('pressureRtuChannelId', '');
    }
  }, [values.pressureDataChannelTemplateId]);

  // Reset the integration ID fields when a field required for ftpId
  // calculation isn't set
  useEffect(() => {
    if (
      (values.dataSource === DataChannelDataSourceType.RTU &&
        (!selectedRtu || !selectedRtu?.deviceId)) ||
      (values.dataSource === DataChannelDataSourceType.PublishedDataChannel &&
        !sourceDataChannelDetails)
    ) {
      if (values.levelIntegrationDetails.shouldAutoGenerate) {
        setFieldValue('levelIntegrationDetails.integrationId', '');
      }
      if (values.pressureIntegrationDetails.shouldAutoGenerate) {
        setFieldValue('pressureIntegrationDetails.integrationId', '');
      }
      if (values.batteryIntegrationDetails.shouldAutoGenerate) {
        setFieldValue('batteryIntegrationDetails.integrationId', '');
      }
    }
  }, [selectedRtu, values.dataSource, sourceDataChannelDetails]);

  // Check/uncheck the auto generate checkbox and/or reset the integrationId
  // field when the integration target domain changes
  useEffect(() => {
    const selectedIntegrationDomain = integrationDomains?.find(
      (domain) => domain.targetDomainId === values.integrationDomainId
    );
    const ftpFileFormat = selectedIntegrationDomain?.targetDomainFtpFileFormat;
    if (
      selectedIntegrationDomain?.autoGenerateFtpId &&
      typeof ftpFileFormat === 'number'
    ) {
      setFieldValue('levelIntegrationDetails.shouldAutoGenerate', true);
      setFieldValue('pressureIntegrationDetails.shouldAutoGenerate', true);
      setFieldValue('batteryIntegrationDetails.shouldAutoGenerate', true);
    } else {
      setFieldValue('levelIntegrationDetails.shouldAutoGenerate', false);
      setFieldValue('pressureIntegrationDetails.shouldAutoGenerate', false);
      setFieldValue('batteryIntegrationDetails.shouldAutoGenerate', false);
      setFieldValue('levelIntegrationDetails.integrationId', '');
      setFieldValue('pressureIntegrationDetails.integrationId', '');
      setFieldValue('batteryIntegrationDetails.integrationId', '');
    }
  }, [values.integrationDomainId]);

  // Integration Parameters: Level Data Channel
  useEffect(() => {
    if (!values.levelIntegrationDetails.shouldAutoGenerate) {
      return;
    }

    const selectedIntegrationDomain = integrationDomains?.find(
      (domain) => domain.targetDomainId === values.integrationDomainId
    );
    const ftpFileFormat = selectedIntegrationDomain?.targetDomainFtpFileFormat;
    const deviceId = selectedRtu?.deviceId;
    const selectedLevelChannel = rtuChannelsFromRtu?.find(
      (channel) => channel.rtuChannelId === values.levelRtuChannelId
    );

    // Reset the integrationId when there a field that's required isn't set
    if (!selectedLevelChannel?.channelNumber) {
      setFieldValue('levelIntegrationDetails.integrationId', '');
      return;
    }

    const canAutoGenerateFtpId = selectedIntegrationDomain?.autoGenerateFtpId;
    if (
      // Since the user is only able to type into it when its NOT auto
      // generated, this shouldnt effect shouldnt fire constantly
      values.levelIntegrationDetails.shouldAutoGenerate &&
      canAutoGenerateFtpId &&
      typeof ftpFileFormat === 'number' &&
      ((values.dataSource === DataChannelDataSourceType.RTU &&
        deviceId &&
        selectedLevelChannel?.channelNumber) ||
        (values.dataSource === DataChannelDataSourceType.PublishedDataChannel &&
          sourceDataChannelDetails))
    ) {
      const deviceIdForDataSource =
        values.dataSource === DataChannelDataSourceType.PublishedDataChannel
          ? ''
          : deviceId || '';
      const channelNumberForDataSource =
        values.dataSource === DataChannelDataSourceType.PublishedDataChannel ||
        !isNumber(selectedLevelChannel.channelNumber)
          ? 0
          : Number(selectedLevelChannel.channelNumber);
      const ftpId = getFtpId(
        ftpFileFormat,
        deviceIdForDataSource,
        channelNumberForDataSource,
        selectedIntegrationDomain?.targetDomainFtpFileFormat ===
          FtpFileFormat.Boc
          ? ''
          : values.levelIntegrationDetails.integrationId
      );
      setFieldValue('levelIntegrationDetails.integrationId', ftpId);
    }
  }, [
    values.levelIntegrationDetails.shouldAutoGenerate,
    values.levelIntegrationDetails.integrationId,
    values.integrationDomainId,
    values.dataSource,
    sourceDataChannelDetails,
    selectedRtu,
    rtuChannelsFromRtu,
    values.levelRtuChannelId,
  ]);

  // Integration Parameters: Pressure Data Channel
  useEffect(() => {
    if (!values.pressureIntegrationDetails.shouldAutoGenerate) {
      return;
    }

    const selectedIntegrationDomain = integrationDomains?.find(
      (domain) => domain.targetDomainId === values.integrationDomainId
    );
    const ftpFileFormat = selectedIntegrationDomain?.targetDomainFtpFileFormat;
    const deviceId = selectedRtu?.deviceId;
    const selectedPressureChannel = rtuChannelsFromRtu?.find(
      (channel) => channel.rtuChannelId === values.pressureRtuChannelId
    );

    // Reset the integrationId when there a field that's required isn't set
    if (!selectedPressureChannel?.channelNumber) {
      setFieldValue('pressureIntegrationDetails.integrationId', '');
      return;
    }

    const canAutoGenerateFtpId = selectedIntegrationDomain?.autoGenerateFtpId;
    if (
      values.pressureIntegrationDetails.shouldAutoGenerate &&
      canAutoGenerateFtpId &&
      typeof ftpFileFormat === 'number' &&
      deviceId &&
      selectedPressureChannel?.channelNumber
    ) {
      const ftpId = getFtpId(
        ftpFileFormat,
        deviceId,
        isNumber(selectedPressureChannel.channelNumber)
          ? Number(selectedPressureChannel.channelNumber)
          : 0,
        selectedIntegrationDomain?.targetDomainFtpFileFormat ===
          FtpFileFormat.Boc
          ? ''
          : values.pressureIntegrationDetails.integrationId
      );
      setFieldValue('pressureIntegrationDetails.integrationId', ftpId);
    }
  }, [
    values.pressureIntegrationDetails.shouldAutoGenerate,
    values.pressureIntegrationDetails.integrationId,
    values.integrationDomainId,
    selectedRtu,
    rtuChannelsFromRtu,
    values.pressureRtuChannelId,
  ]);

  // Integration Parameters: Battery Data Channel
  useEffect(() => {
    if (!values.batteryIntegrationDetails.shouldAutoGenerate) {
      return;
    }

    const selectedIntegrationDomain = integrationDomains?.find(
      (domain) => domain.targetDomainId === values.integrationDomainId
    );
    const ftpFileFormat = selectedIntegrationDomain?.targetDomainFtpFileFormat;
    const deviceId = selectedRtu?.deviceId;

    const canAutoGenerateFtpId = selectedIntegrationDomain?.autoGenerateFtpId;
    if (
      values.batteryIntegrationDetails.shouldAutoGenerate &&
      canAutoGenerateFtpId &&
      typeof ftpFileFormat === 'number' &&
      deviceId
    ) {
      const ftpId = getFtpId(
        ftpFileFormat,
        deviceId,
        0, // The back-end converts "BATTERY_VOLTAGE" to 0
        selectedIntegrationDomain?.targetDomainFtpFileFormat ===
          FtpFileFormat.Boc
          ? ''
          : values.batteryIntegrationDetails.integrationId
      );
      setFieldValue('batteryIntegrationDetails.integrationId', ftpId);
    }
  }, [
    values.batteryIntegrationDetails.shouldAutoGenerate,
    values.batteryIntegrationDetails.integrationId,
    values.integrationDomainId,
    selectedRtu,
    rtuChannelsFromRtu,
  ]);

  return null;
};

export default FormChangeEffect;
