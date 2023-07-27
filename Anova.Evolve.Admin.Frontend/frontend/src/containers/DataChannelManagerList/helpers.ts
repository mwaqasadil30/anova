export enum DataChannelColumnId {
  Selection = 'selection',
  Description = 'dataChannelDescription',
  CustomerName = 'customerName',
  DataChannelType = 'dataChannelType',
  DeviceId = 'deviceId',
  ChannelNumber = 'channelNumber',
  ProductName = 'productName',
  LatestReadingTime = 'latestReadingTime',
  DataChannelTemplateName = 'dataChannelTemplateName',
  ReferenceCount = 'referenceCount',
  IsPublished = 'isPublished',
  Action = 'action',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case DataChannelColumnId.Selection:
      return 'Selection';
    case DataChannelColumnId.Description:
      return 'Description';
    case DataChannelColumnId.CustomerName:
      return 'Customer name';
    case DataChannelColumnId.DataChannelType:
      return 'Data channel type';
    case DataChannelColumnId.DeviceId:
      return 'Device id';
    case DataChannelColumnId.ChannelNumber:
      return 'Channel number';
    case DataChannelColumnId.ProductName:
      return 'Product name';
    case DataChannelColumnId.LatestReadingTime:
      return 'Latest Reading time';
    case DataChannelColumnId.DataChannelTemplateName:
      return 'Data channel template name';
    case DataChannelColumnId.ReferenceCount:
      return 'Reference count';
    case DataChannelColumnId.IsPublished:
      return 'Published';
    case DataChannelColumnId.Action:
      return 'Action';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case DataChannelColumnId.Selection:
      return 50;
    case DataChannelColumnId.Description:
      return 170;
    case DataChannelColumnId.CustomerName:
      return 150;
    case DataChannelColumnId.DataChannelType:
      return 80;
    case DataChannelColumnId.DeviceId:
      return 80;
    case DataChannelColumnId.ChannelNumber:
      return 115;
    case DataChannelColumnId.ProductName:
      return 80;
    case DataChannelColumnId.LatestReadingTime:
      return 175;
    case DataChannelColumnId.DataChannelTemplateName:
      return 200;
    case DataChannelColumnId.ReferenceCount:
      return 95;
    case DataChannelColumnId.IsPublished:
      return 95;
    case DataChannelColumnId.Action:
      return 200;
    default:
      return 130;
  }
};

// NOTE: Assumes that record cannot be disabled. Method required by GenericeDataTable component
export const isRecordDisabled = () => false;
