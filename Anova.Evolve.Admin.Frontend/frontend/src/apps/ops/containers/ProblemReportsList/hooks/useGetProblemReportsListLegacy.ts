import {
  PagingResponseModelOfListOfProblemReport_SummaryDto,
  ProblemReportFilter,
  ProblemReportViewEnum,
  SortDirectionEnum,
  TimeRangeTypeEnum,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { ProblemReportStatusFilterEnum } from 'apps/ops/types';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { selectActiveDomainItemsPerPage } from 'redux-app/modules/app/selectors';
import { formatSearchText } from 'utils/api/helpers';
import { ProblemReportsApiHook } from '../types';

interface GetPageSizeInput {
  customPageSize?: number | null;
  statusType?: ProblemReportStatusFilterEnum;
  domainItemsPerPage?: number;
}

const getPageSize = ({
  customPageSize,
  statusType,
  domainItemsPerPage,
}: GetPageSizeInput) => {
  if (customPageSize !== undefined) {
    return customPageSize;
  }

  if (statusType === ProblemReportStatusFilterEnum.Open) {
    return null;
  }

  return domainItemsPerPage || 50;
};

interface Request {
  assetSearchExpression?: string | null;
  assetId?: string | null;
  viewTypeId?: ProblemReportViewEnum;
  showStatusTypeId?: ProblemReportStatusFilterEnum;
  filterByTypeId?: ProblemReportFilter;
  tagIdList?: number[] | null;
  timeRangeTypeId?: TimeRangeTypeEnum;
  fromDate?: Date | null;
  toDate?: Date | null;
  isAlarmVerified?: boolean | null;
  loadUserSettings?: boolean;
  showStatusAsBool?: boolean | null;
  isCountRequired?: boolean;
  userId?: string;
  domainId?: string;
  pageIndex?: number;
  itemsPerPage?: number | null;
  startIndex?: number;
  endIndex?: number;
  filterText?: string | null;
  sqlSafeFilterText?: string | null;
  sortColumnName?: string | null;
  sortDirectionTypeId?: SortDirectionEnum;
  sortDirectionAsText?: string | null;
}

interface Props {
  customPageSize?: number | null;
  assetSearchExpression?: string | null;
  assetId?: string | null;
  viewTypeId?: ProblemReportViewEnum;
  showStatusTypeId?: ProblemReportStatusFilterEnum;
  filterByTypeId?: ProblemReportFilter;
  tagIdList?: number[] | null;
  timeRangeTypeId?: TimeRangeTypeEnum;
  fromDate?: Date | null;
  toDate?: Date | null;
  isAlarmVerified?: boolean | null;
  loadUserSettings?: boolean;
  showStatusAsBool?: boolean | null;
  isCountRequired?: boolean;
  userId?: string;
  domainId?: string;
  pageIndex?: number;
  startIndex?: number;
  endIndex?: number;
  filterText?: string | null;
  sqlSafeFilterText?: string | null;
  sortColumnName?: string | null;
  sortDirectionTypeId?: SortDirectionEnum;
  sortDirectionAsText?: string | null;
  disableInitialFetch?: boolean;
  lastRefreshDate?: Date;
}

export const useGetProblemReportsListLegacy = ({
  customPageSize,
  assetSearchExpression,
  assetId,
  viewTypeId,
  showStatusTypeId,
  filterByTypeId,
  tagIdList,
  timeRangeTypeId,
  fromDate,
  toDate,
  isAlarmVerified,
  loadUserSettings,
  showStatusAsBool,
  isCountRequired,
  userId,
  domainId,
  pageIndex,
  startIndex,
  endIndex,
  filterText,
  sqlSafeFilterText,
  sortColumnName,
  sortDirectionTypeId,
  sortDirectionAsText,
  disableInitialFetch,
  lastRefreshDate,
}: Props): ProblemReportsApiHook => {
  const domainItemsPerPage = useSelector(selectActiveDomainItemsPerPage);
  const pageSize = getPageSize({
    customPageSize,
    statusType: showStatusTypeId,
    domainItemsPerPage,
  });
  // customPageSize !== undefined
  //   ? customPageSize
  //   : showStatusTypeId === ProblemReportStatusEnum.Open
  //   ? null
  //   : domainItemsPerPage || 50;

  const [totalRows, setTotalRows] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [pageNumber, setPageNumber] = useState(pageIndex || 0);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any | null>(null);
  const [
    apiResponse,
    setApiResponse,
  ] = useState<PagingResponseModelOfListOfProblemReport_SummaryDto | null>(
    null
  );

  const fetchRecords = useCallback((request: Request) => {
    setIsFetching(true);

    const showClosed =
      request.showStatusTypeId === ProblemReportStatusFilterEnum.Closed ||
      request.showStatusTypeId === ProblemReportStatusFilterEnum.Both;
    const showOpen =
      request.showStatusTypeId === ProblemReportStatusFilterEnum.Open ||
      request.showStatusTypeId === ProblemReportStatusFilterEnum.Both;

    AdminApiService.ProblemReportService.problemReport_GetList(
      request.assetSearchExpression,
      request.assetId,
      request.viewTypeId,
      showClosed,
      showOpen,
      request.filterByTypeId,
      request.tagIdList,
      request.timeRangeTypeId,
      request.fromDate,
      request.toDate,
      request.isAlarmVerified,
      request.loadUserSettings,
      request.isCountRequired,
      request.userId,
      request.domainId,
      request.pageIndex,
      undefined, // We request ALL problem reports.
      formatSearchText(request.filterText, { addWildcardAsterisks: true }),
      request.sortColumnName,
      request.sortDirectionTypeId
      // // Page numbers are 1-indexed in this new api (asset summary)
      // pageNumber: currentPageIndex + 1,
      // pageSize: numberOfItemsPerPage,
      // assetSearchDomainId: assetDomainId || activeDomainId,
    )
      .then((response) => {
        setApiResponse(response);
        // const totalRecords = response.count || 0;
        const totalRecords = response.paging?.totalCount || 0; // note: remove hardcoded values
        setTotalRows(totalRecords);
        // setPageCount(Math.ceil(totalRecords / numberOfItemsPerPage));
        setPageCount(Math.ceil(totalRecords / 20));
        setResponseError(null);
      })
      .catch((error) => {
        setResponseError(error);
      })
      .finally(() => {
        setIsFetching(false);
        setIsLoadingInitial(false);
      });
  }, []);

  const refetchRecords = useCallback(() => {
    const request = {
      assetSearchExpression,
      assetId,
      viewTypeId,
      showStatusTypeId,
      filterByTypeId,
      tagIdList,
      timeRangeTypeId,
      fromDate,
      toDate,
      isAlarmVerified,
      loadUserSettings,
      showStatusAsBool,
      isCountRequired,
      userId,
      domainId,
      pageIndex,
      itemsPerPage: pageSize,
      startIndex,
      endIndex,
      filterText,
      sqlSafeFilterText,
      sortColumnName,
      sortDirectionTypeId,
      sortDirectionAsText,
    };

    fetchRecords(request);
  }, [
    fetchRecords,
    assetSearchExpression,
    assetId,
    viewTypeId,
    showStatusTypeId,
    filterByTypeId,
    tagIdList,
    timeRangeTypeId,
    fromDate,
    toDate,
    isAlarmVerified,
    loadUserSettings,
    showStatusAsBool,
    isCountRequired,
    userId,
    domainId,
    pageIndex,
    startIndex,
    endIndex,
    filterText,
    sqlSafeFilterText,
    sortColumnName,
    sortDirectionTypeId,
    sortDirectionAsText,
    // assetSearchDomainId,
    // pageSize,
    // pageNumber,
    lastRefreshDate,
  ]);

  useEffect(() => {
    if (!disableInitialFetch) {
      refetchRecords();
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [refetchRecords]);

  useUpdateEffect(() => {
    if (!disableInitialFetch) {
      setPageNumber(0);
    }
  }, [
    viewTypeId,
    showStatusTypeId,
    filterByTypeId,
    // tagIdList,
    timeRangeTypeId,
    fromDate,
    toDate,
    startIndex,
    endIndex,
    filterText,
    sortColumnName,
    sortDirectionTypeId,
    sortDirectionAsText,
  ]);

  return {
    isLoadingInitial,
    isFetching,
    responseError,
    apiResponse,
    totalRows,
    pageSize,
    pageCount,
    pageNumber,
    refetchRecords,
    setPageNumber,
  };
};
