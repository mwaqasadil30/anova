import {
  AssetListFilterOptions,
  AssetSummaryGroupingOptions,
  DataChannelType,
  EvolveGetAssetSummaryRecordsByOptionsRequest,
  EvolveGetAssetSummaryRecordsByOptionsResponse,
  ListSortDirection,
  UnitType,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveDomainItemsPerPage } from 'redux-app/modules/app/selectors';
import { formatSearchText } from 'utils/api/helpers';
import { AssetSummaryApiHook } from '../types';

export interface AssetSummaryApiRequest {
  domainId?: string | null;
  userId?: string | null;

  assetSearchDomainId?: string | null;
  assetSearchExpression?: string | null;
  pageNumber?: number | null;
  customPageSize?: number | null;
  disableInitialFetch?: boolean;
  groupByColumn?: AssetSummaryGroupingOptions | null;
  filterTextValue?: string | null;
  filterByColumn?: AssetListFilterOptions | null;
  sortByColumnId?: string | null;
  sortByColumnDirection?: ListSortDirection | null;
  groupBySortDirectionSelected?: ListSortDirection | null;
  dataChannelSelected?: DataChannelType[] | null;
  inventoryStateSelected?: string[] | null;
  unitSelected?: UnitType | null;
  lastRefreshDate?: Date;
  initialPageNumber?: number;
}

export const useAssetSummaryRecordsUpdated = ({
  domainId,
  userId,
  assetSearchDomainId,
  assetSearchExpression,
  groupByColumn,
  groupBySortDirectionSelected,
  sortByColumnId,
  sortByColumnDirection,
  filterTextValue,
  filterByColumn,
  dataChannelSelected,
  inventoryStateSelected,
  unitSelected,
  lastRefreshDate,
  initialPageNumber,
  customPageSize,
  disableInitialFetch,
}: AssetSummaryApiRequest): AssetSummaryApiHook => {
  const domainItemsPerPage = useSelector(selectActiveDomainItemsPerPage);
  const pageSize =
    customPageSize !== undefined ? customPageSize : domainItemsPerPage || 100;

  const [totalRows, setTotalRows] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [pageNumber, setPageNumber] = useState(initialPageNumber || 0);
  // const [sortColumnId, setSortColumnId] = useState('assetTitle');
  // const [isSortDescending, setIsSortDescending] = useState(false);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  const [startTimer, setStartTimer] = useState<Date | null>(null);
  const [endTimer, setEndTimer] = useState<Date | null>(null);
  const [endPageTimer, setEndPageTimer] = useState<Date | null>(null);

  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any | null>(null);
  const [
    apiResponse,
    setApiResponse,
  ] = useState<EvolveGetAssetSummaryRecordsByOptionsResponse | null>(null);

  const fetchRecords = useCallback(
    ({
      assetDomainId,
      assetExpression,
      itemsPerPage,
      pageIndex,
      groupBy,
      filterText,
      filterBy,
      sortColumnName,
      sortDirection,
      activeDomainId,
      activeUserId,
      groupBySortDirection,
      showDataChannelTypes,
      showInventoryStateTypes,
    }: any) => {
      setIsFetching(true);
      setStartTimer(new Date());
      setEndTimer(null);
      setEndPageTimer(null);

      AdminApiService.AssetService.getAssetSummaryRecordsByOptions_GetAssetSummaryRecordsByOptions(
        {
          options: {
            domainId: activeDomainId,
            userId: activeUserId,
            // Page numbers are 1-indexed in this new api
            pageNumber: pageIndex + 1,
            pageSize: itemsPerPage,
            sortBy: sortColumnName,
            sortDirection,
            filterBy,
            filterText: formatSearchText(filterText, {
              addWildcardAsterisks: true,
            }),
            groupBy,
            groupSortDirection: groupBySortDirection,
            assetSearchExpression: assetExpression,
            dataChannelTypes: showDataChannelTypes,
            inventoryStates: showInventoryStateTypes,
            assetSearchDomainId: assetDomainId || activeDomainId,
          },
        } as EvolveGetAssetSummaryRecordsByOptionsRequest
      )
        .then((response) => {
          setEndTimer(new Date());
          setApiResponse(response);
          const totalRecords = response.count || 0;
          setTotalRows(totalRecords);
          setPageCount(Math.ceil(totalRecords / itemsPerPage));
          setResponseError(null);
        })
        .catch((error) => {
          setEndTimer(new Date());
          setResponseError(error);
        })
        .finally(() => {
          setIsFetching(false);
          setIsLoadingInitial(false);
          setEndPageTimer(new Date());
        });
    },
    []
  );

  const refetchRecords = useCallback(() => {
    fetchRecords({
      assetDomainId: assetSearchDomainId,
      assetExpression: assetSearchExpression,
      pageIndex: pageNumber,
      itemsPerPage: pageSize,
      groupBy: groupByColumn,
      filterText: filterTextValue,
      filterBy: filterByColumn,
      sortColumnName: sortByColumnId,
      sortDirection: sortByColumnDirection,
      activeDomainId: domainId,
      activeUserId: userId,
      groupBySortDirection: groupBySortDirectionSelected,
      showDataChannelTypes: dataChannelSelected,
      showInventoryStateTypes: inventoryStateSelected,
      chosenUnit: unitSelected,
    });
  }, [
    fetchRecords,
    // assetSearchDomainId,
    // assetSearchExpression,
    pageSize,
    pageNumber,
    sortByColumnId,
    sortByColumnDirection,
    // unitSelected,
    // groupByColumn,
    // filterTextValue,
    // filterByColumn,
    // groupBySortDirectionSelected,
    // dataChannelSelected,
    // inventoryStateSelected,
    // domainId,
    // userId,
    lastRefreshDate,
  ]);

  useEffect(() => {
    if (!disableInitialFetch) {
      refetchRecords();
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [refetchRecords]);

  // useUpdateEffect(() => {
  //   if (!disableInitialFetch) {
  //     setPageNumber(0);
  //   }
  // }, [
  //   filterByColumn,
  //   filterTextValue,
  //   dataChannelSelected,
  //   inventoryStateSelected,
  //   groupByColumn,
  // ]);

  return {
    isLoadingInitial,
    isFetching,
    responseError,
    apiResponse,
    totalRows,
    pageSize,
    pageCount,
    pageNumber,
    startTimer,
    endTimer,
    endPageTimer,
    apiDuration: isFetching ? null : Number(endTimer) - Number(startTimer),
    refetchRecords,
    setPageNumber,
  };
};
