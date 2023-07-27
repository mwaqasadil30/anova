import {
  DataChannelEventRuleBaseDTO,
  DataChannelEventRuleByUsageRateDTO,
  DataChannelEventRuleDeliveryScheduleDTO,
  DataChannelEventRuleInventoryDTO,
  DataChannelEventRuleLevelDTO,
  DataChannelEventRuleMissingDataDTO,
  DataChannelEventRulesDTO,
  ErrorRecordResponseModel,
  EventRuleCategory,
} from 'api/admin/api';
import { FormikProps } from 'formik';

export interface QEERInventoryDTOWithPreciseValue
  extends Omit<DataChannelEventRuleInventoryDTO, 'init' | 'toJSON'> {
  _precise_eventValue?: number | null;
}
export interface QEERLevelDTOWithPreciseValue
  extends Omit<DataChannelEventRuleLevelDTO, 'init' | 'toJSON'> {
  _precise_eventValue?: number | null;
}
export interface QEERMissingDataDTOWithPreciseValue
  extends Omit<DataChannelEventRuleMissingDataDTO, 'init' | 'toJSON'> {
  _precise_eventValue?: number | null;
}
export interface QEERUsageRateDTOWithPreciseValue
  extends Omit<DataChannelEventRuleByUsageRateDTO, 'init' | 'toJSON'> {
  _precise_eventValue?: number | null;
}
export interface QEERDeliveryScheduleDTOWithPreciseValue
  extends Omit<DataChannelEventRuleDeliveryScheduleDTO, 'init' | 'toJSON'> {
  _precise_eventValue?: number | null;
}

// @ts-ignore
export interface QuickEditEventsDTOWithPreciseValues
  extends Omit<DataChannelEventRulesDTO, 'init' | 'toJSON'> {
  inventoryEvents?: QEERInventoryDTOWithPreciseValue[] | null;
  levelEvents?: QEERLevelDTOWithPreciseValue[] | null;
  missingDataEvent?: QEERMissingDataDTOWithPreciseValue | null;
  usageRateEvent?: QEERUsageRateDTOWithPreciseValue | null;
  deliveryScheduleEvents?: QEERDeliveryScheduleDTOWithPreciseValue[] | null;
}

export type Values = QuickEditEventsDTOWithPreciseValues;

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
  eventRule: Omit<DataChannelEventRuleBaseDTO, 'init' | 'toJSON'>;
  eventRuleType: EventRuleCategory;
  fieldNamePrefix: string;
}

// Common props passed to each type of event rule row (level, inventory, usage
// rate, missing data)
export interface CommonEventTableRowProps {
  isAirProductsEnabledDomain: boolean;
  domainTagsOptions?: string[] | null;
  canEdit?: boolean;
  hasIntegrationId: boolean;
  dataChannel?: QuickEditEventsDTOWithPreciseValues | null;
  errors: any;
  status?: Status;
  openRostersDrawer: (eventRuleData: EditingEventRuleData) => void;
  setFieldValue: FormikProps<Values>['setFieldValue'];
}
