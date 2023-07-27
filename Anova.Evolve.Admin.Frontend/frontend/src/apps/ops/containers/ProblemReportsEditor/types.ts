import {
  EventRuleImportanceLevel,
  ProblemReportPriorityEnum,
} from 'api/admin/api';
import { ProblemReportAffectedDataChannel } from './components/ObjectForm/types';

export type SaveCallbackFunction = (response: ProblemReportDetails) => void;

export interface ProblemReportDetails {
  description?: string | null;
  importance?: EventRuleImportanceLevel | null;
  disableAutoclose?: boolean | null;
  reportedBy?: string | null;
  currentOpStatus?: string | null;
  resolution?: string | null;
  tagIdList?: number[] | null;
  priority?: ProblemReportPriorityEnum | null;
  fixDate?: Date | null;
  workOrderNumber?: number | null;
  initiatedDate?: Date | null;
  closedDate?: Date | null;
  affectedDataChannels?: ProblemReportAffectedDataChannel[];
  // non-form fields
  problemReportId?: string | null;
  isClosed?: boolean | null;
  businessUnit?: string | null;
  region?: string | null;
  rtuId?: string | null;
  assetTitle?: string | null;
  assetId?: string | null;
  openDate?: Date | null;
}
