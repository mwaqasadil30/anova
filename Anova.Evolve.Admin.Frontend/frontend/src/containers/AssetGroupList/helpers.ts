import { AssetGroupInfoRecord } from 'api/admin/api';

export enum AssetGroupListColumnId {
  Description = 'name',
  Criteria = 'criteria',
  UserCount = 'userCount',
  Display = 'isDisplay',
  Domain = 'domainName',
  Selection = 'selection',
  Action = 'action',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case AssetGroupListColumnId.Description:
      return 'Description';
    case AssetGroupListColumnId.Criteria:
      return 'Criteria';
    case AssetGroupListColumnId.UserCount:
      return 'User count';
    case AssetGroupListColumnId.Display:
      return 'Display';
    case AssetGroupListColumnId.Domain:
      return 'Domain';
    case AssetGroupListColumnId.Selection:
      return 'Selection';
    case AssetGroupListColumnId.Action:
      return 'Action';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case AssetGroupListColumnId.Description:
      return 305;
    case AssetGroupListColumnId.Criteria:
      return 220;
    case AssetGroupListColumnId.UserCount:
      return 120;
    case AssetGroupListColumnId.Display:
      return 115;
    case AssetGroupListColumnId.Domain:
      return 160;
    default:
      return 115;
  }
};

export const isRecordDisabled = (activeDomainId?: string) => (
  record: Omit<AssetGroupInfoRecord, 'init' | 'toJSON'>
) => {
  // You cannot delete records that have at least one user assigned, or are
  // published from another domain
  return !!record.userCount || record.domainId !== activeDomainId;
};
