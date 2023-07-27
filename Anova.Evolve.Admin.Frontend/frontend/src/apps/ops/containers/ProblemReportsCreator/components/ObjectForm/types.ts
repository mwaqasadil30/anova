import {
  EventRuleImportanceLevel,
  PrimaryDataChannelInfoDto,
  ProblemReportStatusDto,
  ProblemReportWorkOrderDto,
  ProblemReportStatusEnum,
  TagDto,
  ProblemReportAffectedDataChannelDto,
  ProblemReportActivityLogDto,
} from 'api/admin/api';

export interface Values {
  problemReportId?: number; // defaults to 0 when creating
  problemReport?: {
    problemNumber?: string | null;
    domainId?: string;
    description?: string | null;
    primaryDataChannelInfo?: PrimaryDataChannelInfoDto | null;
    importanceLevelTypeId?: EventRuleImportanceLevel | undefined;
    reportedBy?: string | null;
    resolution?: string | null;
    statusTypeId?: ProblemReportStatusEnum;
    isDisableAutoClose?: boolean;
    currentOpStatus?: string | null;
    tags?: TagDto[] | null;
    statusInformation?: ProblemReportStatusDto | null;
    workOrder?: ProblemReportWorkOrderDto | null;
  };
  affectedDataChannels?: ProblemReportAffectedDataChannelDto[] | null;
  activityLog?: ProblemReportActivityLogDto[] | null;
}
