import { ProductRecord } from 'api/admin/api';

export enum ProductListColumnId {
  Name = 'name',
  Description = 'description',
  ProductGroup = 'productGroup',
  SpecificGravity = 'specificGravity',
  StandardVolumePerCubicMeter = 'standardVolumePerCubicMeter',
  DataChannelCount = 'dataChannelCount',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case ProductListColumnId.Name:
      return 'Name';
    case ProductListColumnId.Description:
      return 'Description';
    case ProductListColumnId.ProductGroup:
      return 'Product group';
    case ProductListColumnId.SpecificGravity:
      return 'Specific gravity';
    case ProductListColumnId.StandardVolumePerCubicMeter:
      return 'Standard volume per cubic meter';
    case ProductListColumnId.DataChannelCount:
      return 'Data channel count';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case ProductListColumnId.Name:
      return 220;
    case ProductListColumnId.Description:
      return 130;
    case ProductListColumnId.ProductGroup:
      return 130;
    case ProductListColumnId.SpecificGravity:
      return 140;
    case ProductListColumnId.StandardVolumePerCubicMeter:
      return 245;
    case ProductListColumnId.DataChannelCount:
      return 165;
    default:
      return 130;
  }
};

export const isRecordDisabled = (
  record: Omit<ProductRecord, 'init' | 'toJSON'>
) => {
  return !!record.dataChannelCount;
};
