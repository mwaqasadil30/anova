export enum QuickAssetReportColumnId {
  CreatedOn = 'createdOn',
  CreatedByFullName = 'createdByFullName',
  AssetTitle = 'assetTitle',
  CustomerName = 'customerName',
  Country = 'country',
  State = 'state',
  City = 'city',
  Address1 = 'address1',
  DeviceId = 'deviceId',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case QuickAssetReportColumnId.CreatedOn:
      return 'Created on';
    case QuickAssetReportColumnId.CreatedByFullName:
      return 'Created by full name';
    case QuickAssetReportColumnId.AssetTitle:
      return 'Asset title';
    case QuickAssetReportColumnId.CustomerName:
      return 'Customer name';
    case QuickAssetReportColumnId.Country:
      return 'Country';
    case QuickAssetReportColumnId.State:
      return 'State';
    case QuickAssetReportColumnId.City:
      return 'City';
    case QuickAssetReportColumnId.Address1:
      return 'Address 1';
    case QuickAssetReportColumnId.DeviceId:
      return 'Device Id';
    default:
      return '';
  }
};
