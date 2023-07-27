export enum AssetTreeListColumnId {
  Description = 'name',
  TreeExpression = 'expression',
  Selection = 'selection',
  Action = 'action',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case AssetTreeListColumnId.Description:
      return 'Description';
    case AssetTreeListColumnId.TreeExpression:
      return 'Tree Expression';
    case AssetTreeListColumnId.Selection:
      return 'Selection';
    case AssetTreeListColumnId.Action:
      return 'Action';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case AssetTreeListColumnId.Description:
      return 200;
    case AssetTreeListColumnId.TreeExpression:
      return 200;
    default:
      return 200;
  }
};

// NOTE: Assumes that record cannot be disabled. Method required by GenericeDataTable component
export const isRecordDisabled = () => false;
