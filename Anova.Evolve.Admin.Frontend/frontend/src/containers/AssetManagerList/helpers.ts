import { AssetListGroupingOptions } from 'api/admin/api';

export enum AssetManagerColumnId {
  Selection = 'selection',
  CustomerName = 'customerName',
  AssetTitle = 'assetTitle',
  AssetDescription = 'assetDescription',
  DeviceId = 'deviceId',
  SiteInformation = 'siteInformation',
  ProductName = 'productName',
  DataChannelCount = 'dataChannelCount',
  Action = 'action',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case AssetManagerColumnId.Selection:
      return 'Selection';
    case AssetManagerColumnId.CustomerName:
      return 'Customer name';
    case AssetManagerColumnId.AssetDescription:
      return 'Asset description';
    case AssetManagerColumnId.DeviceId:
      return 'Device Id';
    case AssetManagerColumnId.SiteInformation:
      return 'Site information';
    case AssetManagerColumnId.ProductName:
      return 'Product name';
    case AssetManagerColumnId.DataChannelCount:
      return 'Data channel count';
    case AssetManagerColumnId.Action:
      return 'Action';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case AssetManagerColumnId.Selection:
      return 220;
    case AssetManagerColumnId.CustomerName:
      return 65;
    case AssetManagerColumnId.AssetDescription:
      return 130;
    case AssetManagerColumnId.DeviceId:
      return 140;
    case AssetManagerColumnId.SiteInformation:
      return 105;
    case AssetManagerColumnId.ProductName:
      return 200;
    default:
      return 130;
  }
};

// NOTE: Assumes that record cannot be disabled. Method required by GenericeDataTable component
export const isRecordDisabled = () => false;

export const getHiddenColumnsForGroupedColumn = (
  groupByOption: AssetListGroupingOptions
) => {
  return groupByOption === AssetListGroupingOptions.CustomerName
    ? [AssetManagerColumnId.AssetTitle]
    : [];
};
