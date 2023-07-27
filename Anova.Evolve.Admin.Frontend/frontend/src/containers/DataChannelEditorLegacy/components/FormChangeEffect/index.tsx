import {
  DataChannelDataSourceType,
  EditDataChannelOptions,
  EvolveRetrieveRtuChannelUsageInfoListByRtuRequest,
  EvolveRetrieveSourceDataChannelDefaultsByIdRequest,
  FtpDomainInfo,
  RTUChannelUsageInfo,
  SourceDataChannelDefaultsInfo,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { FormikProps } from 'formik';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import { isNumber } from 'utils/format/numbers';
import useCalculateFtpIdV2 from '../../hooks/useCalculateFtpIdV2';
import useRoundedAndPreciseValue from '../../hooks/useRoundedAndPreciseValue';
import useRoundedAndPreciseValueForArray from '../../hooks/useRoundedAndPreciseValueForArray';
import { getDecimalPlacesFromValues } from '../ObjectForm/helpers';
import { Values } from '../ObjectForm/types';

interface FormChangeEffectProps {
  values: Values;
  options?: EditDataChannelOptions | null;
  rtuChannelsFromRtu?: RTUChannelUsageInfo[] | null;
  integrationDomains?: FtpDomainInfo[] | null;
  sourceDataChannelDetails?: SourceDataChannelDefaultsInfo | null;
  dataChannelId?: string;
  setFieldValue: FormikProps<Values>['setFieldValue'];
  setRtuChannelsFromRtu: Dispatch<
    SetStateAction<RTUChannelUsageInfo[] | null | undefined>
  >;
  setSourceDataChannelDetails: Dispatch<
    SetStateAction<SourceDataChannelDefaultsInfo | null | undefined>
  >;
}

const FormChangeEffect = (props: FormChangeEffectProps) => {
  const {
    values,
    options,
    rtuChannelsFromRtu,
    sourceDataChannelDetails,
    dataChannelId,
    setFieldValue,
    setRtuChannelsFromRtu,
    setSourceDataChannelDetails,
  } = props;
  const { rtuInfo, rtuChannelId, sourceDataChannelId } = values;

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

  useEffect(() => {
    // Reset RTU Channels since the selected RTU was changed
    setRtuChannelsFromRtu(null);

    if (rtuInfo?.rtuId) {
      fetchRtuDetails({
        dataChannelId,
        rtuId: rtuInfo?.rtuId,
        excludeNonNumericChannelNumbers: false,
      } as EvolveRetrieveRtuChannelUsageInfoListByRtuRequest);
    }
  }, [rtuInfo?.rtuId]);

  useEffect(() => {
    if (sourceDataChannelId) {
      fetchDataChannelDetails({
        sourceDataChannelId,
      } as EvolveRetrieveSourceDataChannelDefaultsByIdRequest);
    } else {
      setSourceDataChannelDetails(null);
    }
  }, [sourceDataChannelId]);

  // Reset the integration ID fields when a field required for ftpId
  // calculation isn't set
  useEffect(() => {
    if (
      (values.dataSource === DataChannelDataSourceType.RTU &&
        !values.rtuInfo?.deviceId) ||
      (values.dataSource === DataChannelDataSourceType.PublishedDataChannel &&
        !sourceDataChannelDetails)
    ) {
      if (values.autoGenerateIntegration1Id) {
        setFieldValue('integration1Id', '');
      }
      if (values.autoGenerateIntegration2Id) {
        setFieldValue('integration2Id', '');
      }
    }
  }, [values.rtuInfo?.deviceId, values.dataSource, sourceDataChannelDetails]);

  // Check/uncheck the auto generate checkbox and/or reset the integrationId
  // field when the integration target domain changes. NOTE: this effect is
  // only run on updates (not on initial mount)
  useUpdateEffect(() => {
    const selectedIntegrationDomain = options?.domainIntegrationInfo?.find(
      (domain) => domain.targetDomainId === values.integration1DomainId
    );
    const ftpFileFormat = selectedIntegrationDomain?.targetDomainFtpFileFormat;
    const autoGenerateFtpId = selectedIntegrationDomain?.autoGenerateFtpId;
    if (autoGenerateFtpId && typeof ftpFileFormat === 'number') {
      setFieldValue('autoGenerateIntegration1Id', true);
    } else {
      setFieldValue('autoGenerateIntegration1Id', false);
      setFieldValue('integration1Id', '');
    }
  }, [values.integration1DomainId]);
  useUpdateEffect(() => {
    const selectedIntegrationDomain = options?.domainIntegrationInfo?.find(
      (domain) => domain.targetDomainId === values.integration2DomainId
    );
    const ftpFileFormat = selectedIntegrationDomain?.targetDomainFtpFileFormat;
    const autoGenerateFtpId = selectedIntegrationDomain?.autoGenerateFtpId;
    if (autoGenerateFtpId && typeof ftpFileFormat === 'number') {
      setFieldValue('autoGenerateIntegration2Id', true);
    } else {
      setFieldValue('autoGenerateIntegration2Id', false);
      setFieldValue('integration2Id', '');
    }
  }, [values.integration2DomainId]);

  const selectedRtu = rtuChannelsFromRtu?.find(
    (channel) => channel.rtuChannelId === rtuChannelId
  );

  useCalculateFtpIdV2({
    fieldName: 'integration1Id',
    rtuDeviceId: values.rtuInfo?.deviceId,
    selectedChannelNumber: selectedRtu?.channelNumber,
    integrationDomains: options?.domainIntegrationInfo,
    shouldAutoGenerate: values.autoGenerateIntegration1Id,
    integrationId: values.integration1Id,
    integrationDomainId: values.integration1DomainId,
    setFieldValue,
  });
  useCalculateFtpIdV2({
    fieldName: 'integration2Id',
    rtuDeviceId: values.rtuInfo?.deviceId,
    selectedChannelNumber: selectedRtu?.channelNumber,
    integrationDomains: options?.domainIntegrationInfo,
    shouldAutoGenerate: values.autoGenerateIntegration2Id,
    integrationId: values.integration2Id,
    integrationDomainId: values.integration2DomainId,
    setFieldValue,
  });

  const scaledDecimalPlaces = isNumber(values.scaledDecimalPlaces)
    ? Number(values.scaledDecimalPlaces)
    : 0;
  const displayDecimalPlaces = getDecimalPlacesFromValues(values);

  // #region Rounded + precise values for fields within arrays
  useRoundedAndPreciseValueForArray({
    values,
    setFieldValue,
    arrayPropertyName: 'levelEventRules',
    propertyName: 'eventValue',
    decimalPlaces: displayDecimalPlaces,
  });
  useRoundedAndPreciseValueForArray({
    values,
    setFieldValue,
    arrayPropertyName: 'levelEventRules',
    propertyName: 'hysteresis',
    decimalPlaces: displayDecimalPlaces,
  });
  useRoundedAndPreciseValueForArray({
    values,
    setFieldValue,
    arrayPropertyName: 'usageRateEventRules',
    propertyName: 'usageRate',
    decimalPlaces: displayDecimalPlaces,
  });
  // #endregion Rounded + precise values for fields within arrays

  // #region Rounded + precise values for non-array fields
  useRoundedAndPreciseValue({
    values,
    setFieldValue,
    fieldName: 'scaledMaxProductHeight',
    decimalPlaces: scaledDecimalPlaces,
  });
  useRoundedAndPreciseValue({
    values,
    setFieldValue,
    fieldName: 'displayMaxProductHeight',
    decimalPlaces: displayDecimalPlaces,
  });
  useRoundedAndPreciseValue({
    values,
    setFieldValue,
    fieldName: 'graphMin',
    decimalPlaces: displayDecimalPlaces,
  });
  useRoundedAndPreciseValue({
    values,
    setFieldValue,
    fieldName: 'graphMax',
    decimalPlaces: displayDecimalPlaces,
  });
  useRoundedAndPreciseValue({
    values,
    setFieldValue,
    fieldName: 'maxDeliverQuantity',
    decimalPlaces: displayDecimalPlaces,
  });
  useRoundedAndPreciseValue({
    values,
    setFieldValue,
    fieldName: 'manualUsageRate',
    decimalPlaces: displayDecimalPlaces,
  });
  // #endregion Rounded + precise values for non-array fields

  return null;
};

export default FormChangeEffect;
