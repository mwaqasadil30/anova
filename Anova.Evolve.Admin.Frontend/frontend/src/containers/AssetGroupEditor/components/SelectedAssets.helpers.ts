export enum SelectedAssetsColumnId {
  AssetDescription = 'assetDescription',
  AssetTitle = 'assetTitle',
  DataChannelDescription = 'dataChannelDescription',
  ProductDescription = 'productDescription',
  RtuDeviceId = 'rtuDeviceId',
  ChannelNumber = 'channelNumber',
  DataChannelType = 'dataChannelType',
  AssetType = 'assetType',
  GroupedColumn = 'groupedColumn',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case SelectedAssetsColumnId.AssetDescription:
      return 'Asset description';
    case SelectedAssetsColumnId.AssetTitle:
      return 'Asset title';
    case SelectedAssetsColumnId.DataChannelDescription:
      return 'Data channel description';
    case SelectedAssetsColumnId.ProductDescription:
      return 'Product description';
    case SelectedAssetsColumnId.RtuDeviceId:
      return 'RTU device Id';
    case SelectedAssetsColumnId.ChannelNumber:
      return 'Channel number';
    case SelectedAssetsColumnId.DataChannelType:
      return 'Data channel type';
    case SelectedAssetsColumnId.AssetType:
      return 'Asset type';
    case SelectedAssetsColumnId.GroupedColumn:
      return 'Grouped column';
    default:
      return '';
  }
};
