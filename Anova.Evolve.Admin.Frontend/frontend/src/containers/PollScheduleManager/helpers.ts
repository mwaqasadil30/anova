export enum RtuPollScheduleGroupColumnId {
  Selection = 'selection',
  Name = 'name',
  Type = 'typeOfSchedule',
  RTUCount = 'rtuCount',
  TotalPolls = 'totalPolls',
  Action = 'action',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case RtuPollScheduleGroupColumnId.Name:
      return 'Description';
    case RtuPollScheduleGroupColumnId.Type:
      return 'Type';
    case RtuPollScheduleGroupColumnId.RTUCount:
      return 'RTU Count';
    case RtuPollScheduleGroupColumnId.TotalPolls:
      return 'Total Polls';
    case RtuPollScheduleGroupColumnId.Selection:
      return 'Selection';
    case RtuPollScheduleGroupColumnId.Action:
      return 'Action';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case RtuPollScheduleGroupColumnId.Name:
      return 220;
    default:
      return 130;
  }
};

// NOTE: Assumes that record cannot be disabled. Method required by GenericeDataTable component
export const isRecordDisabled = () => false;
