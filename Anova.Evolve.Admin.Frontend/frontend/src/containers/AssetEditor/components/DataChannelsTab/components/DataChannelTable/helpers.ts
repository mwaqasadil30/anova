export enum AssetEditorDataChannelColumnId {
  ChannelName = 'name',
  Description = 'description',
  RtuDeviceId = 'rtuDeviceId',
  RtuChannelNumber = 'rtuChannelNumber',
  Type = 'type',
  IsVolumetric = 'isVolumetric',
  ScaledMin = 'scaledMin',
  ScaledMax = 'scaledMax',
  ScaledUnitsAsText = 'scaledUnitsAsText',
  ProductName = 'productName',
  TankType = 'tankType',
  IsPublished = 'isPublished',
  PublishedComments = 'publishedComments',
  Selection = 'selection',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case AssetEditorDataChannelColumnId.ChannelName:
      return 'Channel name';
    case AssetEditorDataChannelColumnId.Description:
      return 'Description';
    case AssetEditorDataChannelColumnId.RtuDeviceId:
      return 'RTU device Id';
    case AssetEditorDataChannelColumnId.RtuChannelNumber:
      return 'RTU channel number';
    case AssetEditorDataChannelColumnId.Type:
      return 'Type';
    case AssetEditorDataChannelColumnId.IsVolumetric:
      return 'Is volumetric';
    case AssetEditorDataChannelColumnId.ScaledMin:
      return 'Scaled min';
    case AssetEditorDataChannelColumnId.ScaledMax:
      return 'Scaled max';
    case AssetEditorDataChannelColumnId.ScaledUnitsAsText:
      return 'Scaled units as text';
    case AssetEditorDataChannelColumnId.ProductName:
      return 'Product name';
    case AssetEditorDataChannelColumnId.TankType:
      return 'Tank type';
    case AssetEditorDataChannelColumnId.IsPublished:
      return 'Is published';
    case AssetEditorDataChannelColumnId.PublishedComments:
      return 'Published comments';
    case AssetEditorDataChannelColumnId.Selection:
      return 'Selection';
    default:
      return '';
  }
};
