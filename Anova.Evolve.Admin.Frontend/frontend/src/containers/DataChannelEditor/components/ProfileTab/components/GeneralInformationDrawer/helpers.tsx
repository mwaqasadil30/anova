/* eslint-disable indent */
import {
  DataChannelDataSource,
  DataChannelGeneralInfoDTO,
  DataChannelReportDTO,
  RtuPriorityLevelTypeEnum,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
import { fieldValueOrEmpty } from 'utils/forms/values';
import { Values } from './types';

export const formatInitialValues = (
  dataChannelDetails?: DataChannelReportDTO | null | undefined
): Values => {
  return {
    dataChannelDescription: dataChannelDetails?.dataChannelDescription || '',
    dataChannelTemplateId: dataChannelDetails?.dataChannelTemplateId || '',
    serialNumber: dataChannelDetails?.serialNumber || '',
    dataChannelDataSourceTypeId: fieldValueOrEmpty(
      dataChannelDetails?.dataSourceInfo?.dataChannelDataSourceTypeId
    ),
    gasMixerDataChannelTypeId: fieldValueOrEmpty(
      dataChannelDetails?.assetInfo?.gasMixerAssetInfo
        ?.gasMixerDataChannelTypeId
    ),
    // Fields shown when the data source is RTU
    rtuId:
      dataChannelDetails?.dataSourceInfo?.rtuDataSourceTypeInfo?.rtuId || '',
    rtuChannelId:
      dataChannelDetails?.dataSourceInfo?.rtuDataSourceTypeInfo?.rtuChannelId ||
      '',

    // Fields shown when the data source is PublishedDataChannel
    publishedDataChannelSourceDataChannelId:
      dataChannelDetails?.dataSourceInfo?.publishedDataSourceTypeInfo
        ?.publishedDataChannelSourceDataChannelId || '',
    publishedDataChannelSourceDomainId:
      dataChannelDetails?.dataSourceInfo?.publishedDataSourceTypeInfo
        ?.publishedDataChannelSourceDomainId || '',
    publishedCommentsId: fieldValueOrEmpty(
      dataChannelDetails?.dataSourceInfo?.publishedDataSourceTypeInfo
        ?.publishedCommentsId
    ),
    // "Set As Primary" field, was previously named setAsMaster
    setAsPrimary:
      dataChannelDetails?.dataSourceInfo?.rtuDataSourceTypeInfo
        ?.rtuPriorityLevelTypeId === RtuPriorityLevelTypeEnum.Master,
  };
};

export const formatValuesForApi = (
  values: Values
): DataChannelGeneralInfoDTO => {
  const isValidDataChannelDataSourceTypeId = isNumber(
    values?.dataChannelDataSourceTypeId
  );
  // Check if this variable's logic is applied correctly below once we allow more
  // dataChannelDataSourceTypeId dropdown options (other options: DataChannel, PublishedDataChannel)
  const isManualDataChannelDataSourceTypeId =
    values?.dataChannelDataSourceTypeId === DataChannelDataSource.Manual;

  return {
    dataChannelDescription: values?.dataChannelDescription || '',
    dataChannelTemplateId: values?.dataChannelTemplateId || undefined,
    serialNumber: values?.serialNumber || '',
    dataChannelDataSourceTypeId: isValidDataChannelDataSourceTypeId
      ? values?.dataChannelDataSourceTypeId
      : undefined,

    // TODO: uncomment gasMixer once api is updated with it
    // gasMixerDataChannelTypeId: fieldValueOrEmpty(
    //   values?.gasMixerDataChannelTypeId
    // ),

    // Fields shown when the data source is RTU
    rtuId: !isManualDataChannelDataSourceTypeId ? values?.rtuId : undefined,
    rtuChannelId: !isManualDataChannelDataSourceTypeId
      ? values?.rtuChannelId
      : undefined,

    // Fields shown when the data source is PublishedDataChannel
    // "Set As Primary" field, was previously named setAsMaster
    rtuPriorityLevelTypeId: isManualDataChannelDataSourceTypeId
      ? undefined
      : values.setAsPrimary
      ? RtuPriorityLevelTypeEnum.Master
      : RtuPriorityLevelTypeEnum.Secondary,
    publishedDataChannelSourceDataChannelId:
      values.publishedDataChannelSourceDataChannelId || undefined,
    publishedCommentsId: values?.publishedCommentsId || undefined,
    publishedDataChannelSourceDomainId:
      values.publishedDataChannelSourceDomainId || undefined,
  } as DataChannelGeneralInfoDTO;
};

export const mapApiErrorsToFields = (t: TFunction, errors: any) => {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    return formatApiErrors(t, errors);
  }

  return errors;
};
