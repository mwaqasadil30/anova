export enum ChannelsTableColumnId {
  FieldName = 'fieldName',
  FieldType = 'fieldType',
  ChannelNumber = 'channelNumber',
  RawMinimumValue = 'rawMinimumValue',
  RawMaximumValue = 'rawMaximumValue',
  ScaledMinimumValue = 'scaledMinimumValue',
  ScaledMaximumValue = 'scaledMaximumValue',
  UnitOfMeasure = 'unitOfMeasure',
  DecimalPlaces = 'decimalPlaces',
  IsDisplayed = 'isDisplayed',
}

export const channelsTablecolumnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case ChannelsTableColumnId.FieldName:
      return 'Field Name';
    case ChannelsTableColumnId.FieldType:
      return 'Field Type';
    case ChannelsTableColumnId.ChannelNumber:
      return 'Channel Number';
    case ChannelsTableColumnId.RawMinimumValue:
      return 'Raw Minimum Value';
    case ChannelsTableColumnId.RawMaximumValue:
      return 'Raw Maximum Value';
    case ChannelsTableColumnId.ScaledMinimumValue:
      return 'Scaled Minimum Value';
    case ChannelsTableColumnId.ScaledMaximumValue:
      return 'Scaled Maximum Value';
    case ChannelsTableColumnId.UnitOfMeasure:
      return 'Unit Of Measure';
    case ChannelsTableColumnId.DecimalPlaces:
      return 'Decimal Places';
    case ChannelsTableColumnId.IsDisplayed:
      return 'Is Displayed';
    default:
      return '';
  }
};
