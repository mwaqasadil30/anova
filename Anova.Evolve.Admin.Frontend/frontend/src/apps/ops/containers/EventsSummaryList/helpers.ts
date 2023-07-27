import moment from 'moment';
import momentTimezone from 'moment-timezone';

export enum EventSummaryListColumnId {
  EventId = 'eventId',
  HasNotes = 'hasNotes',
  CreatedDate = 'createdDate',
  DeactivatedOn = 'deactivatedOn',
  EventRuleDescription = 'eventRuleDescription',
  EventImportanceLevel = 'eventImportanceLevel',
  AssetTitle = 'assetTitle',
  DataChannelType = 'dataChannelType',
  Message = 'message',
  ReadingTimestamp = 'readingTimestamp',
  ReadingScaledValue = 'readingScaledValue',
  AcknowledgedOn = 'acknowledgedOn',
  AcknowledgeUserName = 'acknowledgeUserName',
  FirstRosterName = 'firstRosterName',
  TagsAsText = 'tagsAsText',
  EventRuleType = 'eventRuleType',
  Acknowledge = 'acknowledge',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case EventSummaryListColumnId.EventId:
      return 'Event Id';
    case EventSummaryListColumnId.HasNotes:
      return 'Has notes';
    case EventSummaryListColumnId.CreatedDate:
      return 'Created on';
    case EventSummaryListColumnId.DeactivatedOn:
      return 'Inactive Date';
    case EventSummaryListColumnId.EventRuleDescription:
      return 'Event rule description';
    case EventSummaryListColumnId.EventImportanceLevel:
      return 'Event importance level';
    case EventSummaryListColumnId.AssetTitle:
      return 'Asset title';
    case EventSummaryListColumnId.DataChannelType:
      return 'Data channel type';
    case EventSummaryListColumnId.Message:
      return 'Message';
    case EventSummaryListColumnId.ReadingTimestamp:
      return 'Reading timestamp';
    case EventSummaryListColumnId.ReadingScaledValue:
      return 'Reading scaled value';
    case EventSummaryListColumnId.AcknowledgedOn:
      return 'Acknowledged on';
    case EventSummaryListColumnId.AcknowledgeUserName:
      return 'Acknowledged by';
    case EventSummaryListColumnId.FirstRosterName:
      return 'First roster name';
    case EventSummaryListColumnId.TagsAsText:
      return 'Tags';
    case EventSummaryListColumnId.EventRuleType:
      return 'Event rule type';
    case EventSummaryListColumnId.Acknowledge:
      return 'Acknowledge';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case EventSummaryListColumnId.Message:
      return 300;
    case EventSummaryListColumnId.AssetTitle:
      return 425;
    case EventSummaryListColumnId.CreatedDate:
    case EventSummaryListColumnId.DeactivatedOn:
    case EventSummaryListColumnId.ReadingTimestamp:
    case EventSummaryListColumnId.AcknowledgedOn:
    case EventSummaryListColumnId.AcknowledgeUserName:
      return 200;
    case EventSummaryListColumnId.HasNotes:
      return 70;
    case EventSummaryListColumnId.Acknowledge:
      return 50;
    default:
      return 165;
  }
};

export const getFormattedTimeStampWithTimezone = (
  date?: Date | null,
  timezone?: string | null
) => {
  if (!date || !timezone) {
    return date;
  }

  // NOTE: Moment has weird issues when converting dates to certain
  // timezones. This solution is long, but seems to work.
  const dateTimeFormat = 'YYYY-MM-DD HH:mm';
  const dateAsString = moment(date).format(dateTimeFormat);
  const result = momentTimezone.tz(dateAsString, dateTimeFormat, timezone);

  const formattedDate = result.utc().toDate();

  return formattedDate;
};
