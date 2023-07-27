export enum ProblemReportsColumnId {
  OpenDate = 'openDate',
  PlantStatus = 'plantStatusTypeId',
  DistributionNote = 'distributionNoteTypeId',
  Owner = 'ownerTypeId',
  IsAlarmVerified = 'isAlarmVerified',
  ShipTo = 'shipTo',
  AssetTitle = 'assetTitle',
  City = 'city',
  State = 'state',
  WorkOrderNumber = 'workOrderNumber',
  Description = 'description',
  CurrentOpStatus = 'currentOpStatus',
  RtuId = 'deviceId',
  Priority = 'priorityTypeId',
  BusinessUnit = 'businessUnit',
  Region = 'region',
  Tags = 'tags',
  ProblemNumber = 'problemNumber',
  Status = 'isClosed',
  Action = 'action',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case ProblemReportsColumnId.OpenDate:
      return 'Open Date';
    case ProblemReportsColumnId.PlantStatus:
      return 'Plant Status';
    case ProblemReportsColumnId.DistributionNote:
      return 'Distribution note';
    case ProblemReportsColumnId.Owner:
      return 'Owner';
    case ProblemReportsColumnId.IsAlarmVerified:
      return 'Is alarm verified';
    case ProblemReportsColumnId.ShipTo:
      return 'Ship To';
    case ProblemReportsColumnId.AssetTitle:
      return 'Asset title';
    case ProblemReportsColumnId.City:
      return 'City';
    case ProblemReportsColumnId.State:
      return 'State';
    case ProblemReportsColumnId.WorkOrderNumber:
      return 'Work order number';
    case ProblemReportsColumnId.Description:
      return 'Description';
    case ProblemReportsColumnId.CurrentOpStatus:
      return 'Current Op Status';
    case ProblemReportsColumnId.RtuId:
      return 'RTU device id';
    case ProblemReportsColumnId.Priority:
      return 'Priority';
    case ProblemReportsColumnId.BusinessUnit:
      return 'Business Unit';
    case ProblemReportsColumnId.Region:
      return 'Region';
    case ProblemReportsColumnId.Tags:
      return 'Tags';
    case ProblemReportsColumnId.Status:
      return 'Status';
    case ProblemReportsColumnId.ProblemNumber:
      return 'Problem number';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case ProblemReportsColumnId.AssetTitle:
      return 330;
    case ProblemReportsColumnId.Description:
      return 330;
    case ProblemReportsColumnId.CurrentOpStatus:
      return 275;
    case ProblemReportsColumnId.OpenDate:
    case ProblemReportsColumnId.DistributionNote:
    case ProblemReportsColumnId.Owner:
    case ProblemReportsColumnId.IsAlarmVerified:
    case ProblemReportsColumnId.Tags:
    case ProblemReportsColumnId.ProblemNumber:
    case ProblemReportsColumnId.RtuId:
      return 200;
    case ProblemReportsColumnId.City:
    case ProblemReportsColumnId.WorkOrderNumber:
      return 160;
    case ProblemReportsColumnId.BusinessUnit:
      return 155;
    case ProblemReportsColumnId.Priority:
      return 140;
    case ProblemReportsColumnId.Region:
      return 115;
    case ProblemReportsColumnId.State:
      return 100;
    case ProblemReportsColumnId.ShipTo:
      return 110;
    case ProblemReportsColumnId.Status:
      return 105;
    case ProblemReportsColumnId.Action:
      return 35;
    default:
      return 150;
  }
};
