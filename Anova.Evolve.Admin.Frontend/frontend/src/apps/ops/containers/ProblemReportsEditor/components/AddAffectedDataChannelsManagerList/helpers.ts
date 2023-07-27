import { DataChannelFilter } from 'api/admin/api';

export enum AffectedDataChannelListColumnId {
  ShipTo = 'shipToNumber',
  AssetTitle = 'assetTitle',
  Description = 'description',
  RtuId = 'deviceId',
  Channel = 'channelNumber',
  BusinessUnit = 'businessUnit',
  Region = 'region',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case AffectedDataChannelListColumnId.ShipTo:
      return 'Ship to';
    case AffectedDataChannelListColumnId.AssetTitle:
      return 'Asset title';
    case AffectedDataChannelListColumnId.Description:
      return 'Description';
    case AffectedDataChannelListColumnId.RtuId:
      return 'Rtu device id';
    case AffectedDataChannelListColumnId.Channel:
      return 'Channel';
    case AffectedDataChannelListColumnId.BusinessUnit:
      return 'Business unit';
    case AffectedDataChannelListColumnId.Region:
      return 'Region';

    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case AffectedDataChannelListColumnId.ShipTo:
      return 125;
    case AffectedDataChannelListColumnId.AssetTitle:
      return 275;
    case AffectedDataChannelListColumnId.Description:
      return 150;
    case AffectedDataChannelListColumnId.RtuId:
      return 140;
    case AffectedDataChannelListColumnId.Channel:
      return 90;
    case AffectedDataChannelListColumnId.BusinessUnit:
      return 140;
    default:
      return 130;
  }
};

export interface FilterByData {
  filterByColumn: DataChannelFilter;
  filterTextValue: string;
}
