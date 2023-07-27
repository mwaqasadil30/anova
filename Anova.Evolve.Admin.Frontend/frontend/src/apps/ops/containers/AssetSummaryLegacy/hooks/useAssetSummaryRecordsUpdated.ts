import {
  AssetListFilterOptions,
  AssetSummaryDto,
  AssetSummaryGroupingOptions,
  DataChannelType,
  ListSortDirection,
  UnitType,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { selectActiveDomainItemsPerPage } from 'redux-app/modules/app/selectors';
import { formatSearchText } from 'utils/api/helpers';

interface Props {
  domainId?: string | null;
  userId?: string | null;

  assetSearchDomainId?: string | null;
  assetSearchExpression?: string | null;
  pageNumber?: number | null;
  pageSize?: number | null;
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
}: Props) => {
  const domainItemsPerPage = useSelector(selectActiveDomainItemsPerPage);

  const [totalRows, setTotalRows] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [pageSize] = useState(domainItemsPerPage || 100);
  const [pageNumber, setPageNumber] = useState(initialPageNumber || 0);
  // const [sortColumnId, setSortColumnId] = useState('assetTitle');
  // const [isSortDescending, setIsSortDescending] = useState(false);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  const [startTimer, setStartTimer] = useState<Date | null>(null);
  const [endTimer, setEndTimer] = useState<Date | null>(null);
  const [endPageTimer, setEndPageTimer] = useState<Date | null>(null);

  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any | null>(null);
  const [apiResponse, setApiResponse] = useState<AssetSummaryDto | null>(null);

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

      AdminApiService.AssetService.asset_GetSummary(
        activeDomainId,
        activeUserId,
        pageIndex + 1, // pageNumber
        itemsPerPage, // pageSize
        sortColumnName, // sortBy
        sortDirection,
        filterBy,
        formatSearchText(filterText, {
          addWildcardAsterisks: true,
        }), // filterText
        groupBy,
        groupBySortDirection, // groupSortDirection
        assetExpression, // assetSearchExpression
        showDataChannelTypes, // dataChannelTypes
        showInventoryStateTypes, // inventoryStates
        assetDomainId || activeDomainId // assetSearchDomainId
      )
        .then((response) => {
          setEndTimer(new Date());
          setApiResponse(response);
          const totalRecords = response.totalCount || 0;
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
    assetSearchDomainId,
    assetSearchExpression,
    pageSize,
    pageNumber,
    sortByColumnId,
    sortByColumnDirection,
    unitSelected,
    groupByColumn,
    filterTextValue,
    filterByColumn,
    groupBySortDirectionSelected,
    dataChannelSelected,
    inventoryStateSelected,
    domainId,
    userId,
    lastRefreshDate,
  ]);

  useEffect(() => {
    refetchRecords();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [refetchRecords]);

  useUpdateEffect(() => {
    setPageNumber(0);
  }, [
    filterByColumn,
    filterTextValue,
    dataChannelSelected,
    inventoryStateSelected,
    groupByColumn,
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
    startTimer,
    endTimer,
    apiDuration: isFetching ? null : Number(endTimer) - Number(startTimer),
    endPageTimer,
    refetchRecords,
    setPageNumber,
  };
};
