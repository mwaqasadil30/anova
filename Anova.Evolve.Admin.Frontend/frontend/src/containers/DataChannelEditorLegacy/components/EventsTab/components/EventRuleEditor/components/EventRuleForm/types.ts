import {
  EventComparatorType,
  EventInventoryStatusType,
  EventRuleType,
  EvolveDataChannelEventRuleRosterInfo,
} from 'api/admin/api';

export interface Values {
  // Read-only values
  description?: string | null;
  inventoryStatus?: EventInventoryStatusType | null;
  eventComparator?: EventComparatorType | null;
  eventRuleType?: EventRuleType;

  rosters?: EvolveDataChannelEventRuleRosterInfo[] | null;
}
