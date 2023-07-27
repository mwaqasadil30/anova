import {
  QeerBaseDto,
  QeerInventoryDto,
  QeerLevelDto,
  QeerMissingDataDto,
  QeerUsageRateDto,
  ErrorRecordResponseModel,
  EventRuleCategory,
  QuickEditEventsDto,
} from 'api/admin/api';

export interface QEERInventoryDTOWithPreciseValue
  extends Omit<QeerInventoryDto, 'init' | 'toJSON'> {
  _precise_eventValue?: number | null;
}
export interface QEERLevelDTOWithPreciseValue
  extends Omit<QeerLevelDto, 'init' | 'toJSON'> {
  _precise_eventValue?: number | null;
}
export interface QEERMissingDataDTOWithPreciseValue
  extends Omit<QeerMissingDataDto, 'init' | 'toJSON'> {
  _precise_eventValue?: number | null;
}
export interface QEERUsageRateDTOWithPreciseValue
  extends Omit<QeerUsageRateDto, 'init' | 'toJSON'> {
  _precise_eventValue?: number | null;
}

// @ts-ignore
export interface QuickEditEventsDTOWithPreciseValues
  extends Omit<QuickEditEventsDto, 'init' | 'toJSON'> {
  inventoryEvents?: QEERInventoryDTOWithPreciseValue[] | null;
  levelEvents?: QEERLevelDTOWithPreciseValue[] | null;
  missingDataEvent?: QEERMissingDataDTOWithPreciseValue | null;
  usageRateEvent?: QEERUsageRateDTOWithPreciseValue | null;
}

export interface Values {
  dataChannels: QuickEditEventsDTOWithPreciseValues[];
}

export interface Status {
  errors?: any;
}

export type RecordIdToErrorsMapping = Record<
  string,
  ErrorRecordResponseModel[]
>;

// Used to keep track of the event rule being used in the Roster drawer.
// We also keep track of the fieldNamePrefix to prevent determining it again
// since it uses a doubly nested array.
// Example: dataChannels[index1].inventoryEvents[index2].rosters
export interface EditingEventRuleData {
  eventRule: Omit<QeerBaseDto, 'init' | 'toJSON'>;
  eventRuleType: EventRuleCategory;
  fieldNamePrefix: string;
}

// Common props passed to each type of event rule row (level, inventory, usage
// rate, missing data)
export interface CommonEventTableRowProps {
  canEdit?: boolean;
  hasIntegrationId: boolean;
  dataChannel?: QuickEditEventsDTOWithPreciseValues | null;
  dataChannelIndex: number;
  errors: any;
  status?: Status;
  openRostersDrawer: (eventRuleData: EditingEventRuleData) => void;
}
