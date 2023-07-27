import { MessageTemplate_SummaryDto } from 'api/admin/api';

export enum MessageTemplateListColumnId {
  Description = 'description',
  RosterCount = 'rosterCount',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case MessageTemplateListColumnId.Description:
      return 'Description';
    case MessageTemplateListColumnId.RosterCount:
      return 'Roster Count';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case MessageTemplateListColumnId.Description:
      return 200;
    case MessageTemplateListColumnId.RosterCount:
      return 150;
    default:
      return 150;
  }
};

export const isRecordDisabled = (
  messageTemplate: Omit<MessageTemplate_SummaryDto, 'init' | 'toJSON'>
) => {
  const rosterCount = Number(messageTemplate.rosterCount);

  return rosterCount > 0;
};
