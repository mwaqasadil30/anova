import {
  ProblemReportFilter,
  ProblemReportViewEnum,
  SortDirectionEnum,
  TimeRangeTypeEnum,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { ProblemReportStatusFilterEnum } from 'apps/ops/types';
import { PROBLEM_REPORT_API_POLLING_INTERVAL_IN_SECONDS } from 'env';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { selectActiveDomainItemsPerPage } from 'redux-app/modules/app/selectors';
import { selectCanViewProblemReportsTab } from 'redux-app/modules/user/selectors';
import { formatSearchText } from 'utils/api/helpers';
import { getPageSize } from '../helpers';

export interface GetProblemReportsListRequest {
  assetSearchExpression?: string | null;
  assetId?: string | null;
  viewTypeId?: ProblemReportViewEnum;
  statusType: ProblemReportStatusFilterEnum;
  filterByTypeId: ProblemReportFilter;
  tagIdList?: number[] | null;
  timeRangeTypeId?: TimeRangeTypeEnum;
  fromDate?: Date;
  toDate?: Date;
  isAlarmVerified?: boolean | null;
  loadUserSettings?: boolean;
  isCountRequired?: boolean;
  // showStatusAsBool?: boolean | null;
  userId?: string;
  domainId?: string;
  pageNumber: number; // pageIndex
  pageSize?: number; // itemsPerPage
  // startIndex?: number;
  // endIndex?: number;
  filterText?: string | null;
  sortColumnName?: string | null;
  sortDirectionTypeId?: SortDirectionEnum;
  // sqlSafeFilterText?: string | null;
  // sortDirectionAsText?: string | null;
}

const getProblemReportsList = (request: GetProblemReportsListRequest) => {
  const formattedShowClosed =
    request.statusType === ProblemReportStatusFilterEnum.Closed ||
    request.statusType === ProblemReportStatusFilterEnum.Both;
  const formattedShowOpen =
    request.statusType === ProblemReportStatusFilterEnum.Open ||
    request.statusType === ProblemReportStatusFilterEnum.Both;

  return ApiService.ProblemReportService.problemReport_GetList(
    request.assetSearchExpression,
    request.assetId,
    request.viewTypeId,
    formattedShowClosed, // use showClosed / showOpen variables outside of this hook (re: original hook)
    formattedShowOpen, // use showClosed / showOpen variables outside of this hook (re: original hook)
    request.filterByTypeId,
    request.tagIdList,
    request.timeRangeTypeId,
    request.fromDate,
    request.toDate,
    request.isAlarmVerified,
    request.loadUserSettings,
    // request.showStatusAsBool,
    request.isCountRequired,
    request.userId,
    request.domainId,
    request.pageNumber ? request.pageNumber + 1 : request.pageNumber, // 1-indexed, not 0-indexed
    request.pageSize, // itemsPerPage
    // request.startIndex,
    // request.endIndex,
    formatSearchText(request.filterText, { addWildcardAsterisks: true }),
    request.sortColumnName,
    request.sortDirectionTypeId
    // request.sqlSafeFilterText,
    // request.sortDirectionAsText
  );
};

export const useGetProblemReportsListUpdated = (
  request?: GetProblemReportsListRequest
) => {
  const canUserAccessProblemReports = useSelector(
    selectCanViewProblemReportsTab
  );

  const domainItemsPerPage = useSelector(selectActiveDomainItemsPerPage);
  const formattedPageSize = getPageSize({
    customPageSize: undefined,
    currentStatusType: (request?.statusType as unknown) as ProblemReportStatusFilterEnum,
    domainItemsPerPage,
  });

  return useQuery(
    [APIQueryKey.getProblemReportList, request],
    () =>
      getProblemReportsList({
        ...request!,
        pageSize: formattedPageSize || undefined,
      }),
    {
      enabled: !!request && canUserAccessProblemReports,
      // Default interval is 2 minutes (120 seconds) if environment variable is not defined.
      refetchInterval: PROBLEM_REPORT_API_POLLING_INTERVAL_IN_SECONDS * 1000,
    }
  );
};
