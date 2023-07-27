export enum EventsTabColumnId {
  EventId = 'eventId',
  HasNotes = 'hasNotes',
  CreatedOn = 'createdOn',
  DeactivatedOn = 'deactivatedOn',
  EventDescription = 'eventDescription',
  EventImportanceLevel = 'eventImportanceLevel',
  AssetTitle = 'assetTitle',
  DataChannelType = 'dataChannelType',
  Message = 'message',
  ReadingTimestamp = 'readingTimestamp',
  ReadingScaledValue = 'readingScaledValue',
  AcknowledgedOn = 'acknowledgedOn',
  AcknowledgeUserName = 'acknowledgeUserName',
  Rosters = 'rosters',
  Tags = 'tags',
  EventType = 'eventType',
  Acknowledge = 'acknowledge',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case EventsTabColumnId.EventId:
      return 'Event Id';
    case EventsTabColumnId.HasNotes:
      return 'Has notes';
    case EventsTabColumnId.CreatedOn:
      return 'Created on';
    case EventsTabColumnId.DeactivatedOn:
      return 'Inactive Date';
    case EventsTabColumnId.EventDescription:
      return 'Event rule description';
    case EventsTabColumnId.EventImportanceLevel:
      return 'Event importance level';
    case EventsTabColumnId.AssetTitle:
      return 'Asset title';
    case EventsTabColumnId.DataChannelType:
      return 'Data channel type';
    case EventsTabColumnId.Message:
      return 'Message';
    case EventsTabColumnId.ReadingTimestamp:
      return 'Reading timestamp';
    case EventsTabColumnId.ReadingScaledValue:
      return 'Reading scaled value';
    case EventsTabColumnId.AcknowledgedOn:
      return 'Acknowledged on';
    case EventsTabColumnId.AcknowledgeUserName:
      return 'Acknowledged by';
    case EventsTabColumnId.Rosters:
      return 'Rosters';
    case EventsTabColumnId.Tags:
      return 'Tags';
    case EventsTabColumnId.EventType:
      return 'Event rule type';
    case EventsTabColumnId.Acknowledge:
      return 'Acknowledge';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case EventsTabColumnId.Message:
      return 300;
    case EventsTabColumnId.AssetTitle:
      return 425;
    case EventsTabColumnId.CreatedOn:
    case EventsTabColumnId.DeactivatedOn:
    case EventsTabColumnId.ReadingTimestamp:
    case EventsTabColumnId.AcknowledgedOn:
    case EventsTabColumnId.AcknowledgeUserName:
      return 200;
    case EventsTabColumnId.HasNotes:
      return 70;
    case EventsTabColumnId.Acknowledge:
      return 50;
    default:
      return 165;
  }
};
