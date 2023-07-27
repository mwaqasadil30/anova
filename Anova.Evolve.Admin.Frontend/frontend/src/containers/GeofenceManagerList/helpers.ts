import { GeoAreaDto } from 'api/admin/api';

export enum GeofenceListColumnId {
  Description = 'description',
  CategoryType = 'geoAreaCategoryTypeId',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case GeofenceListColumnId.Description:
      return 'Description';
    case GeofenceListColumnId.CategoryType:
      return 'Category type';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case GeofenceListColumnId.Description:
      return 150;
    case GeofenceListColumnId.CategoryType:
      return 125;
    default:
      return 150;
  }
};

export const isRecordDisabled = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  record: Omit<GeoAreaDto, 'init' | 'toJSON'>
) => {
  return false;
};
