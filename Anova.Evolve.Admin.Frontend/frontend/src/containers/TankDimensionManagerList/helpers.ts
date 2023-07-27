import { TankDimensionInfoRecord } from 'api/admin/api';

export enum TankDimensionsListColumnId {
  Description = 'description',
  Type = 'type',
  Width = 'width',
  Height = 'height',
  DishHeight = 'dishHeight',
  UnitsOfMeasure = 'units',
  DataChannelCount = 'dataChannelCount',
  Selection = 'selection',
  Action = 'action',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case TankDimensionsListColumnId.Description:
      return 'Description';
    case TankDimensionsListColumnId.Type:
      return 'Type';
    case TankDimensionsListColumnId.Width:
      return 'Width';
    case TankDimensionsListColumnId.Height:
      return 'Height';
    case TankDimensionsListColumnId.DishHeight:
      return 'Dish height';
    case TankDimensionsListColumnId.UnitsOfMeasure:
      return 'Units of measure';
    case TankDimensionsListColumnId.DataChannelCount:
      return 'Data channel count';
    case TankDimensionsListColumnId.Selection:
      return 'Selection';
    case TankDimensionsListColumnId.Action:
      return 'Action';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case TankDimensionsListColumnId.Description:
      return 300;
    case TankDimensionsListColumnId.Type:
      return 180;
    case TankDimensionsListColumnId.Width:
    case TankDimensionsListColumnId.Height:
      return 100;
    case TankDimensionsListColumnId.DishHeight:
      return 120;
    case TankDimensionsListColumnId.UnitsOfMeasure:
      return 150;
    case TankDimensionsListColumnId.DataChannelCount:
      return 170;
    default:
      return 120;
  }
};

export const isRecordDisabled = (
  record: Omit<TankDimensionInfoRecord, 'init' | 'toJSON'>
) => {
  return !!record.dataChannelCount;
};
