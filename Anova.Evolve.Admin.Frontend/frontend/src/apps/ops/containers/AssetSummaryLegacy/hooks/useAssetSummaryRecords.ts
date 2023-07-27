/* tslint:disable */
/* eslint-disable */
import {
  AssetListFilterOptions,
  AssetSummaryGroupingOptions,
  DataChannelType,
  // EvolveRetrieveAssetSummaryRecordsByOptionsRequest,
  // EvolveRetrieveAssetSummaryRecordsByOptionsResponse,
  ListSortDirection,
  UnitType,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { useCallback, useEffect, useState } from 'react';
import { wildcardSearchText } from 'utils/api/helpers';

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
}

export const useAssetSummaryRecords = ({
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
}: Props) => {
  const [totalRows, setTotalRows] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [pageSize] = useState(100);
  const [pageNumber, setPageNumber] = useState(0);
  // const [sortColumnId, setSortColumnId] = useState('assetTitle');
  // const [isSortDescending, setIsSortDescending] = useState(false);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  const [startTimer, setStartTimer] = useState<Date | null>(null);
  const [endTimer, setEndTimer] = useState<Date | null>(null);
  const [endPageTimer, setEndPageTimer] = useState<Date | null>(null);

  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any | null>(null);
  const [apiResponse, setApiResponse] = useState<any | null>(null);

  const fetchRecords = useCallback(({}: // assetDomainId,
  // assetExpression,
  // itemsPerPage,
  // pageIndex,
  // groupBy,
  // filterText,
  // filterBy,
  // sortColumnName,
  // sortDirection,
  // activeDomainId,
  // activeUserId,
  // groupBySortDirection,
  // showDataChannelTypes,
  // showInventoryStateTypes,
  // chosenUnit,
  any) => {
    setIsFetching(true);
    setStartTimer(new Date());
    setEndTimer(null);
    setEndPageTimer(null);

    // @ts-ignore
    // AdminApiService.AssetService.retrieveAssetSummaryRecordsByOptions_RetrieveAssetSummaryRecordsByOptions({
    //   chosenUnit,
    //   areUnitTypesRequired: true,
    //   options: {
    //     assetSearchDomainID: assetDomainId || activeDomainId,
    //     assetSearchExpression: assetExpression,
    //     domainId: activeDomainId,
    //     dataChannelForecastRequired: 1,
    //     filterText: wildcardSearchText(filterText),
    //     isCountRequired: true,
    //     itemsPerPage,
    //     pageIndex,
    //     showDataChannelTypes,
    //     showInventoryStateTypes,
    //     sortColumnName,
    //     sortDirection,
    //     userId: activeUserId,
    //     filterBy,
    //     groupBy,
    //     groupBySortDirection,
    //     useAssetSummaryTable: true,
    //     eventsFilter: [] as string[],
    //     selectedEvents: [] as string[],
    //     // TODO: At some point we'll need to add an events dropdown which
    //     // will use data retrieved from an API
    //     // eventsFilter: ['Normal', 'Missing Data', 'test 1'],
    //     // selectedEvents: ['Normal', 'Missing Data', 'test 1'],
    //   },
    // } as any)

    //   .then((response) => {
    //     setEndTimer(new Date());
    //     setApiResponse(response);
    //     const totalRecords = response.totalRecords || 0;
    //     setTotalRows(totalRecords);
    //     setPageCount(Math.ceil(totalRecords / itemsPerPage));
    //   })
    //   .catch((error) => {
    //     setEndTimer(new Date());
    //     setResponseError(error);
    //   })
    //   .finally(() => {
    //     setIsFetching(false);
    //     setIsLoadingInitial(false);
    //     setEndPageTimer(new Date());
    //   });
  }, []);

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

  useEffect(() => {
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
    endPageTimer,
    refetchRecords,
    setPageNumber,
  };
};
