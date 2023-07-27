import {
  EventRuleImportanceLevel,
  PrimaryDataChannelInfoDto,
  ProblemReportStatusDto,
  ProblemReportWorkOrderDto,
  ProblemReportStatusEnum,
  TagDto,
} from 'api/admin/api';

export interface ProblemReportAffectedDataChannel {
  isPrimary: boolean;
  isFaulty: boolean;
  shipTo?: number;
  assetTitle?: string | null;
  description?: string | null;
  rtuId?: string | null;
  assetId?: string | null;
  channel?: number;
  scaledMax?: string | null;
  deviceNetworkAddress?: number | null;
  businessUnit?: string | null;
  region?: string | null;
}

export interface Values {
  problemNumber?: string | null;
  domainId?: string;
  description?: string | null;
  primaryDataChannelInfo?: PrimaryDataChannelInfoDto | null;
  importanceLevelTypeId?: EventRuleImportanceLevel | '';
  reportedBy?: string | null;
  resolution?: string | null;
  statusTypeId?: ProblemReportStatusEnum;
  isDisableAutoClose?: boolean;
  currentOpStatus?: string | null;
  tags?: TagDto[] | null;
  statusInformation?: ProblemReportStatusDto | null;
  workOrder?: ProblemReportWorkOrderDto | null;
}
