import {
  RTUInfoRecord,
  RTUListGroupingOptions,
  RTUCategoryType,
  RtuDeviceCategory,
} from 'api/admin/api';
import { RTUEditorTab } from 'containers/RTUEditor/types';

export enum BulkActions {
  Swap = 'swap',
  Copy = 'copy',
  CreateTemplate = 'createTemplate',
  ApplyTemplate = 'applyTemplate',
  Transfer = 'transfer',
  Delete = 'delete',
}

export enum RtuManagerColumnId {
  Selection = 'selection',
  CustomerName = 'customerName',
  DeviceId = 'deviceId',
  DeviceNetworkAddress = 'deviceNetworkAddress',
  CarrierName = 'carrierName',
  RtuChannelCount = 'rtuChannelCount',
  DataChannelCount = 'dataChannelCount',
  SiteTitle = 'siteTitle',
  LatestPacketTimeStamp = 'latestPacketTimeStamp',
  IsSyncFailure = 'isSyncFailure',
  IsInSync = 'isInSync',
  Category = 'category',
  IsPollable = 'isPollable',
  Action = 'action',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case RtuManagerColumnId.Selection:
      return 'Selection';
    case RtuManagerColumnId.CustomerName:
      return 'Customer name';
    case RtuManagerColumnId.DeviceId:
      return 'Device id';
    case RtuManagerColumnId.DeviceNetworkAddress:
      return 'Device network address';
    case RtuManagerColumnId.CarrierName:
      return 'Carrier name';
    case RtuManagerColumnId.RtuChannelCount:
      return 'Rtu channel count';
    case RtuManagerColumnId.DataChannelCount:
      return 'Data channel count';
    case RtuManagerColumnId.SiteTitle:
      return 'Site title';
    case RtuManagerColumnId.LatestPacketTimeStamp:
      return 'Last comm date';
    case RtuManagerColumnId.IsSyncFailure:
      return 'Sync failure';
    case RtuManagerColumnId.IsInSync:
      return 'Is in sync';
    case RtuManagerColumnId.Category:
      return 'Category';
    case RtuManagerColumnId.IsPollable:
      return 'Is pollable';
    case RtuManagerColumnId.Action:
      return 'Action';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case RtuManagerColumnId.Selection:
      return 50;
    case RtuManagerColumnId.CustomerName:
      return 205;
    case RtuManagerColumnId.DeviceId:
      return 100;
    case RtuManagerColumnId.DeviceNetworkAddress:
      return 150;
    case RtuManagerColumnId.CarrierName:
      return 105;
    case RtuManagerColumnId.RtuChannelCount:
      return 125;
    case RtuManagerColumnId.DataChannelCount:
      return 120;
    case RtuManagerColumnId.SiteTitle:
      return 200;
    case RtuManagerColumnId.LatestPacketTimeStamp:
      return 180;
    case RtuManagerColumnId.IsSyncFailure:
      return 75;
    case RtuManagerColumnId.IsInSync:
      return 75;
    case RtuManagerColumnId.Category:
      return 90;
    case RtuManagerColumnId.IsPollable:
      return 90;
    default:
      return 130;
  }
};

// NOTE: Assumes that record cannot be disabled. Method required by GenericeDataTable component
export const isRecordDisabled = () => false;

export const isRecordForDeleteDisabled = (record: RTUInfoRecord) => {
  const hasDataChannelCount = record?.dataChannelCount;
  return !!record.isPollable || !!hasDataChannelCount;
};

export const getHiddenColumnsForGroupedColumn = (
  groupByOption: RTUListGroupingOptions
) => {
  return groupByOption === RTUListGroupingOptions.CustomerName
    ? [RtuManagerColumnId.DeviceId]
    : [];
};

export const getRtuTabName = (
  rtuCategory: RTUCategoryType | RtuDeviceCategory
) => {
  switch (rtuCategory) {
    case RTUCategoryType.Horner:
      return RTUEditorTab.Configuration;
    case RtuDeviceCategory.Horner:
      return RTUEditorTab.Configuration;
    default:
      return RTUEditorTab.PacketsAndCallHistory;
  }
};
