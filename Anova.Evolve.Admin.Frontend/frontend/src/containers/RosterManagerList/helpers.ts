import { RosterSummaryDto } from 'api/admin/api';

export enum RosterListColumnId {
  Description = 'description',
  Enabled = 'isEnabled',
  ActiveContacts = 'userCount',
  DataChannels = 'dataChannelCount',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case RosterListColumnId.Description:
      return 'Description';
    case RosterListColumnId.Enabled:
      return 'Enabled';
    case RosterListColumnId.ActiveContacts:
      return 'Active Contacts';
    case RosterListColumnId.DataChannels:
      return 'Data Channels';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case RosterListColumnId.Description:
      return 150;
    case RosterListColumnId.Enabled:
      return 100;
    case RosterListColumnId.ActiveContacts:
    case RosterListColumnId.DataChannels:
    default:
      return 125;
  }
};

export const isRecordDisabled = (
  roster: Omit<RosterSummaryDto, 'init' | 'toJSON'>
) => {
  return !!roster.dataChannelCount;
};
