import { SiteInfoRecord } from 'api/admin/api';

export enum SiteListColumnId {
  City = 'city',
  State = 'state',
  Country = 'country',
  SiteNumber = 'siteNumber',
  AssetCount = 'assetCount',
  RtuCount = 'rtuCount',
  TimeZoneName = 'timeZoneName',
  CustomerName = 'customerName',
  Selection = 'selection',
  Action = 'action',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case SiteListColumnId.CustomerName:
      return 'Customer name';
    case SiteListColumnId.City:
      return 'City';
    case SiteListColumnId.State:
      return 'State';
    case SiteListColumnId.Country:
      return 'Country';
    case SiteListColumnId.SiteNumber:
      return 'Site number';
    case SiteListColumnId.AssetCount:
      return 'Asset count';
    case SiteListColumnId.RtuCount:
      return 'RTU count';
    case SiteListColumnId.TimeZoneName:
      return 'Timezone name';
    case SiteListColumnId.Selection:
      return 'Selection';
    case SiteListColumnId.Action:
      return 'Action';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case SiteListColumnId.City:
      return 220;
    case SiteListColumnId.State:
      return 65;
    case SiteListColumnId.Country:
      return 130;
    case SiteListColumnId.SiteNumber:
      return 130;
    case SiteListColumnId.AssetCount:
      return 140;
    case SiteListColumnId.RtuCount:
      return 105;
    case SiteListColumnId.TimeZoneName:
      return 200;
    default:
      return 130;
  }
};

export const isRecordDisabled = (
  record: Omit<SiteInfoRecord, 'init' | 'toJSON'>
) => {
  return !!(record.assetCount || record.rtuCount);
};
