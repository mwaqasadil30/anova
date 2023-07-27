import {
  DataChannelType,
  EventImportanceLevelType,
  EventInventoryStatusType,
} from 'api/admin/api';
import { UnitDisplayType } from 'types';

export enum AssetSummaryColumnId {
  AssetId = 'assetId',
  ReadingTime = 'readingTime',
  DataChannelDescription = 'dataChannelDescription',
  Reading = 'reading',
  PercentFull = 'percentFull',
  ProductDescription = 'productDescription',
  InventoryState = 'inventoryState',
  ImportanceLevelImage = 'importanceLevelImage',
  EventImportanceLevel = 'eventImportanceLevel',
  Status = 'status',
  ScheduledRefill = 'scheduledRefill',
  CustomField1 = 'customField1',
  CustomField2 = 'customField2',
  CustomField3 = 'customField3',
  CustomField4 = 'customField4',
  CustomField5 = 'customField5',
  CustomField6 = 'customField6',
  CustomField7 = 'customField7',
  CustomField8 = 'customField8',
  CustomField9 = 'customField9',
  CustomField10 = 'customField10',
  FtpDomain = 'ftpDomain',
  FtpId = 'ftpId',
  AssetTitle = 'assetTitle',
  AssetDescription = 'assetDescription',
  AssetType = 'assetType',
  ChannelNumber = 'channelNumber',
  City = 'city',
  Country = 'country',
  CustomerName = 'customerName',
  DataAge = 'dataAge',
  DataChannelTypeColumn = 'dataChannelType',
  DomainName = 'domainName',
  FtpEnabled = 'ftpEnabled',
  InstalledTechName = 'installedTechName',
  RTUDeviceId = 'rtuDeviceId',
  SiteTimeZoneName = 'siteTimeZoneDisplayName',
  State = 'state',
  StreetAddress = 'streetAddress',
  ForecastEstimate = 'forecastEstimate',
  DisplayPriority = 'displayPriority',
}

export const columnIdToApiProperty: Record<AssetSummaryColumnId, string> = {
  [AssetSummaryColumnId.AssetId]: 'assetId',
  [AssetSummaryColumnId.ReadingTime]: 'ReadingTime',
  [AssetSummaryColumnId.DataChannelDescription]: 'DataChannelDescription',
  [AssetSummaryColumnId.Reading]: 'Reading', // Previously readingValue
  [AssetSummaryColumnId.PercentFull]: 'PercentFull',
  [AssetSummaryColumnId.ProductDescription]: 'ProductDescription',
  [AssetSummaryColumnId.InventoryState]: 'InventoryState',
  [AssetSummaryColumnId.ImportanceLevelImage]: 'ImportanceLevelImage',
  [AssetSummaryColumnId.EventImportanceLevel]: 'ImportanceLevelImage', // Uses same value as ImportanceLevelImage
  [AssetSummaryColumnId.Status]: 'Status', // Previously eventInventoryStatus/eventStatus
  [AssetSummaryColumnId.ScheduledRefill]: 'ScheduledRefill',
  // TODO: There are multiple alarm level properties in the row response (one
  // for each display unit: scaled, display, percent full)
  // alarmLevels: 'AlarmLevels',
  // TODO: Same case as alarmLevels
  // deliverable: 'Deliverable',
  [AssetSummaryColumnId.CustomField1]: 'CustomField1', // Previously field1
  [AssetSummaryColumnId.CustomField2]: 'CustomField2', // Previously field2
  [AssetSummaryColumnId.CustomField3]: 'CustomField3', // Previously field3
  [AssetSummaryColumnId.CustomField4]: 'CustomField4', // Previously field4
  [AssetSummaryColumnId.CustomField5]: 'CustomField5', // Previously field5
  [AssetSummaryColumnId.CustomField6]: 'CustomField6', // Previously field6
  [AssetSummaryColumnId.CustomField7]: 'CustomField7', // Previously field7
  [AssetSummaryColumnId.CustomField8]: 'CustomField8', // Previously field8
  [AssetSummaryColumnId.CustomField9]: 'CustomField9', // Previously field9
  [AssetSummaryColumnId.CustomField10]: 'CustomField10', // Previously field10
  [AssetSummaryColumnId.FtpDomain]: 'FtpDomain', // Previously ftpDomain1
  [AssetSummaryColumnId.FtpId]: 'FtpId', // Previously ftpId1
  [AssetSummaryColumnId.AssetDescription]: 'AssetDescription',
  [AssetSummaryColumnId.AssetTitle]: 'AssetTitle',
  [AssetSummaryColumnId.AssetType]: 'AssetType',
  [AssetSummaryColumnId.ChannelNumber]: 'ChannelNumber',
  [AssetSummaryColumnId.City]: 'City',
  [AssetSummaryColumnId.Country]: 'Country',
  [AssetSummaryColumnId.CustomerName]: 'CustomerName',
  [AssetSummaryColumnId.DataAge]: 'DataAge', // Previously readingTime
  [AssetSummaryColumnId.DataChannelTypeColumn]: 'DataChannelType',
  [AssetSummaryColumnId.DomainName]: 'DomainName',
  [AssetSummaryColumnId.FtpEnabled]: 'FtpEnabled',
  [AssetSummaryColumnId.InstalledTechName]: 'InstalledTechName',
  [AssetSummaryColumnId.RTUDeviceId]: 'RTUDeviceId', // Notice the casing is different
  [AssetSummaryColumnId.SiteTimeZoneName]: 'SiteTimeZoneName', // Not sortable
  [AssetSummaryColumnId.State]: 'State',
  [AssetSummaryColumnId.StreetAddress]: 'StreetAddress',
  [AssetSummaryColumnId.ForecastEstimate]: 'ForecastEstimate', // No longer used, not sortable
  [AssetSummaryColumnId.DisplayPriority]: 'DisplayPriority',
};

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case 'AlarmLevel':
      return 'Alarm Level';
    case AssetSummaryColumnId.ForecastEstimate:
      return 'Forecast Estimate';
    case 'assetShipto':
      return 'Asset Ship To';
    case 'dataChannelShipTo':
      return 'Data Channel Ship To';
    case 'deliverable':
      return 'Deliverable';
    case 'eventInventoryStatus':
      return 'Event Inventory Status';
    case AssetSummaryColumnId.AssetTitle:
      return 'Asset Title';
    case AssetSummaryColumnId.AssetDescription:
      return 'Asset Description';
    case AssetSummaryColumnId.AssetType:
      return 'Asset Type';
    case AssetSummaryColumnId.ChannelNumber:
      return 'Channel Number';
    case AssetSummaryColumnId.City:
      return 'City';
    case AssetSummaryColumnId.Country:
      return 'Country';
    case AssetSummaryColumnId.CustomerName:
      return 'Customer Name';
    case AssetSummaryColumnId.DataAge:
      return 'Data Age';
    case AssetSummaryColumnId.DataChannelDescription:
      return 'Data Channel Description';
    case AssetSummaryColumnId.DataChannelTypeColumn:
      return 'Data Channel Type';
    case AssetSummaryColumnId.DomainName:
      return 'Domain Name';
    case AssetSummaryColumnId.FtpDomain:
      return 'FTP Domain';
    case AssetSummaryColumnId.FtpEnabled:
      return 'FTP Enabled';
    case AssetSummaryColumnId.FtpId:
      return 'FTP ID';
    case AssetSummaryColumnId.EventImportanceLevel:
    case AssetSummaryColumnId.ImportanceLevelImage:
      return 'Importance';
    case AssetSummaryColumnId.InstalledTechName:
      return 'Technician';
    case AssetSummaryColumnId.InventoryState:
      return 'Inventory State';
    case AssetSummaryColumnId.PercentFull:
      return '%Full';
    case AssetSummaryColumnId.ProductDescription:
      return 'Product';
    case AssetSummaryColumnId.Reading:
      return 'Reading';
    case AssetSummaryColumnId.ReadingTime:
      return 'Reading Time';
    case AssetSummaryColumnId.RTUDeviceId:
      return 'RTU';
    case AssetSummaryColumnId.ScheduledRefill:
      return 'Scheduled Refill';
    case AssetSummaryColumnId.SiteTimeZoneName:
      return 'Site Time Zone';
    case AssetSummaryColumnId.State:
      return 'State';
    case AssetSummaryColumnId.Status:
      return 'Status';
    case AssetSummaryColumnId.StreetAddress:
      return 'Street Address';
    case AssetSummaryColumnId.CustomField1:
      return 'Custom Field 1';
    case AssetSummaryColumnId.CustomField2:
      return 'Custom Field 2';
    case AssetSummaryColumnId.CustomField3:
      return 'Custom Field 3';
    case AssetSummaryColumnId.CustomField4:
      return 'Custom Field 4';
    case AssetSummaryColumnId.CustomField5:
      return 'Custom Field 5';
    case AssetSummaryColumnId.CustomField6:
      return 'Custom Field 6';
    case AssetSummaryColumnId.CustomField7:
      return 'Custom Field 7';
    case AssetSummaryColumnId.CustomField8:
      return 'Custom Field 8';
    case AssetSummaryColumnId.CustomField9:
      return 'Custom Field 9';
    case AssetSummaryColumnId.CustomField10:
      return 'Custom Field 10';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case AssetSummaryColumnId.AssetTitle:
      return 400;
    case AssetSummaryColumnId.DataChannelDescription:
      return 230;
    case AssetSummaryColumnId.SiteTimeZoneName:
    case 'AlarmLevel':
    case AssetSummaryColumnId.CustomerName:
    case AssetSummaryColumnId.Country:
    case AssetSummaryColumnId.AssetDescription:
    case AssetSummaryColumnId.StreetAddress:
      return 200;
    case AssetSummaryColumnId.ReadingTime:
    case AssetSummaryColumnId.ScheduledRefill:
      return 185;
    case AssetSummaryColumnId.InventoryState:
    case AssetSummaryColumnId.ChannelNumber:
      return 160;
    case AssetSummaryColumnId.Reading:
    case AssetSummaryColumnId.ForecastEstimate:
    case AssetSummaryColumnId.InstalledTechName:
      return 150;
    case AssetSummaryColumnId.CustomField1:
    case AssetSummaryColumnId.CustomField2:
    case AssetSummaryColumnId.CustomField3:
    case AssetSummaryColumnId.CustomField4:
    case AssetSummaryColumnId.CustomField5:
    case AssetSummaryColumnId.CustomField6:
    case AssetSummaryColumnId.CustomField7:
    case AssetSummaryColumnId.CustomField8:
    case AssetSummaryColumnId.CustomField9:
    case AssetSummaryColumnId.CustomField10:
      return 170;
    case AssetSummaryColumnId.FtpEnabled:
      return 135;
    case AssetSummaryColumnId.EventImportanceLevel:
    case AssetSummaryColumnId.ImportanceLevelImage:
      return 140;
    default:
      return 125;
  }
};

interface GetValidUnitDisplayTypeParams {
  unitDisplayType: UnitDisplayType;
  dataChannelType: DataChannelType | null | undefined;
  hasValidDisplayValue: boolean;
}
export const getValidUnitDisplayType = ({
  unitDisplayType,
  dataChannelType,
  hasValidDisplayValue,
}: GetValidUnitDisplayTypeParams) => {
  // Non level and totalizer data channels always used scaled units no matter
  // what
  if (
    dataChannelType !== DataChannelType.Level &&
    dataChannelType !== DataChannelType.TotalizedLevel
  ) {
    return UnitDisplayType.Scaled;
  }

  // If the user's trying to view display units, but there isn't a valid
  // display value, fall back to scaled units
  if (unitDisplayType === UnitDisplayType.Display && !hasValidDisplayValue) {
    return UnitDisplayType.Scaled;
  }

  return unitDisplayType;
};

interface GetRowColourProps {
  eventInventoryStatus: EventInventoryStatusType | undefined | null;
  eventImportanceLevel: EventImportanceLevelType | undefined | null;
  hasMissingData: boolean | undefined;
}
