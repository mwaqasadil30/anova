export enum DefaultChartListColumnId {
  GlobalChartname = 'name',
  FreezerType = 'assetSubTypeId',
  LeftYAxis = 'leftYAxis',
  RightYAxis = 'rightYAxis',
  SortIndex = 'sortIndex',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case DefaultChartListColumnId.GlobalChartname:
      return 'Global Chart Name';
    case DefaultChartListColumnId.FreezerType:
      return 'Freezer type';
    case DefaultChartListColumnId.LeftYAxis:
      return 'Left y axis';
    case DefaultChartListColumnId.RightYAxis:
      return 'Right y axis';
    case DefaultChartListColumnId.SortIndex:
      return 'Sort index';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case DefaultChartListColumnId.GlobalChartname:
      return 100;
    case DefaultChartListColumnId.FreezerType:
      return 120;
    case DefaultChartListColumnId.LeftYAxis:
    case DefaultChartListColumnId.RightYAxis:
      return 150;
    case DefaultChartListColumnId.SortIndex:
      return 75;
    default:
      return 100;
  }
};

// NOTE: Assumes that record cannot be disabled. Method required by GenericeDataTable component
export const isRecordDisabled = () => false;
