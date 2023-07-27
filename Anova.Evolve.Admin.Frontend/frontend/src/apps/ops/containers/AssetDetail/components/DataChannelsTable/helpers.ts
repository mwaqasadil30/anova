export const tableRowHeight = 40;

export enum DataChannelColumnId {
  Description = 'description',
  DataChannelSiteNumber = 'dataChannel_SiteNumber',
  IsLBShellEnabled = 'isLBShellEnabled',
  RtuDeviceId = 'rtuDeviceId',
  RtuPollStatus = 'rtuPollStatus',
  HasRtuNotes = 'hasRtuNotes',
  ChannelNumber = 'channelNumber',
  ProductDescription = 'productDescription',
  LatestReadingValue = 'latestReadingValue',
  PercentFull = 'latestReadingValueInPercentFull',
  EventStatus = 'eventStatus',
  ReadingTime = 'latestReadingTimestamp',
  Selection = '_selection',
  Action = '_action',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case DataChannelColumnId.Description:
      return 'Description';
    case DataChannelColumnId.DataChannelSiteNumber:
      return 'Data channel site number';
    case DataChannelColumnId.IsLBShellEnabled:
      return 'Lb shell';
    case DataChannelColumnId.RtuDeviceId:
      return 'RTU device ID';
    case DataChannelColumnId.RtuPollStatus:
      return 'RTU poll status';
    case DataChannelColumnId.HasRtuNotes:
      return 'RTU notes';
    case DataChannelColumnId.ChannelNumber:
      return 'Channel number';
    case DataChannelColumnId.ProductDescription:
      return 'Product description';
    case DataChannelColumnId.LatestReadingValue:
      return 'Latest reading value';
    case DataChannelColumnId.PercentFull:
      return '% full';
    case DataChannelColumnId.EventStatus:
      return 'Event status';
    case DataChannelColumnId.ReadingTime:
      return 'Reading time';
    default:
      return '';
  }
};

export const getColumnWidth = (
  columnId: string,
  isAirProductsDomain?: boolean
) => {
  switch (columnId) {
    case DataChannelColumnId.Description:
    case DataChannelColumnId.LatestReadingValue:
      return 150;
    case DataChannelColumnId.ReadingTime:
      return 180;
    case DataChannelColumnId.RtuDeviceId:
      return 115;
    case DataChannelColumnId.IsLBShellEnabled:
      return 40;
    case DataChannelColumnId.HasRtuNotes:
    case DataChannelColumnId.RtuPollStatus:
      return 60;
    case DataChannelColumnId.DataChannelSiteNumber:
    case DataChannelColumnId.PercentFull:
      return 75;
    case DataChannelColumnId.ChannelNumber:
      return 100;
    case DataChannelColumnId.ProductDescription:
      return 90;
    case DataChannelColumnId.EventStatus:
      return isAirProductsDomain ? 180 : 115;
    case DataChannelColumnId.Action:
      return 50;
    case DataChannelColumnId.Selection:
      return 5;
    default:
      return 125;
  }
};
