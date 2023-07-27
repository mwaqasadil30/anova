/* eslint-disable indent */
import { SortDirectionEnum, UserProblemReportSettingDto } from 'api/admin/api';
import { ProblemReportStatusFilterEnum } from 'apps/ops/types';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import {
  selectActiveDomainId,
  selectActiveDomainItemsPerPage,
  selectOpsNavigationData,
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import { selectUserId } from 'redux-app/modules/user/selectors';
import { OpsNavItemType } from 'types';
import {
  defaultStatusType,
  enumToProblemReportAccessorMap,
  getInitialStateValues,
  getPageSize,
  stringToProblemReportEnum,
} from '../helpers';
import {
  CustomHookData,
  FilterByData,
  LocationState,
  TableDataForDownload,
  UpdateRouteStateParams,
} from '../types';
import { useGetProblemReportsListLegacy } from './useGetProblemReportsListLegacy';
import {
  GetProblemReportsListRequest,
  useGetProblemReportsListUpdated,
} from './useGetProblemReportsListUpdated';

interface ProblemReportsListDetailsProps {
  assetId?: string;
  userProblemReportSettings?: UserProblemReportSettingDto | undefined;
  saveUserProblemReportSettings?: (
    request: Omit<UserProblemReportSettingDto, 'init' | 'toJSON'>
  ) => Promise<UserProblemReportSettingDto>;
}

const useProblemReportsListDetails = ({
  assetId,
  userProblemReportSettings,
  saveUserProblemReportSettings,
}: ProblemReportsListDetailsProps) => {
  const location = useLocation<LocationState | undefined>();
  const history = useHistory();
  const opsNavData = useSelector(selectOpsNavigationData);
  const topOffset = useSelector(selectTopOffset);

  const userId = useSelector(selectUserId);
  const domainId = useSelector(selectActiveDomainId);

  const initialStateValues = getInitialStateValues({
    opsNavData,
    viewType:
      userProblemReportSettings?.currentListProblemReportViewId ||
      location.state?.viewType,
    defaultDomainId: domainId,
    filterBy:
      stringToProblemReportEnum[userProblemReportSettings?.filterBy!] ||
      location.state?.filterBy,
    filterByText:
      userProblemReportSettings?.filterText || location.state?.filterText,
    // Temporarily not saving user's statusType until back-end updates
    // the statusType (showStatusValue) to use proper ENUM
    // TODO: Use userProblemReportSettings?.showStatusValue
    statusType: location.state?.statusType || defaultStatusType,
    tagIds: userProblemReportSettings?.tagIdList || location.state?.tagIds,
    sortByColumnId: location.state?.sortColumnName,
    sortByColumnDirection: location.state?.sortDirection,
    pageNumber: location.state?.pageNumber,
    fromDate: userProblemReportSettings?.fromDate
      ? moment(userProblemReportSettings?.fromDate).startOf('day')
      : location.state?.fromDate
      ? moment(location.state?.fromDate).startOf('day')
      : null,
    toDate: userProblemReportSettings?.toDate
      ? moment(userProblemReportSettings?.toDate)
      : location.state?.toDate
      ? moment(location.state?.toDate)
      : null,
  });

  const [tableOptions, setTableOptions] = useState(initialStateValues);

  const {
    viewType: viewTypeId,
    filterBy: filterByColumn,
    filterByText: filterTextValue,
    tagIds: selectedTagIds,
    sortByColumnId,
    sortByColumnDirection,
    assetSearchExpression,
    fromDate,
    toDate,
  } = tableOptions;
  const formattedFromDate = moment(fromDate).startOf('day');

  const domainItemsPerPage = useSelector(selectActiveDomainItemsPerPage);

  // Table state/data to perform a CSV download/export
  const [
    tableStateForDownload,
    setTableStateForDownload,
  ] = useState<TableDataForDownload | null>(null);

  const initialFilterOptionsRequestForApi = {
    assetSearchExpression,
    assetId: assetId || null,
    viewTypeId,
    statusType: initialStateValues.statusType,
    filterByTypeId: filterByColumn,
    // We dont use tags when an assetId is used, meaning the data being fetched
    // is for the Asset Details page/component.
    // For more, see: <AssetDetailProblemReportsTableAndTableOptions />.
    tagIdList: assetId ? null : selectedTagIds,
    timeRangeTypeId: undefined,
    fromDate: formattedFromDate.toDate(),
    toDate: toDate.toDate(),
    isAlarmVerified: null,
    loadUserSettings: false,
    isCountRequired: false,
    userId: undefined,
    domainId: undefined,
    // Pagination only for Closed or Both status type dropdown options
    pageNumber:
      initialStateValues.statusType !== ProblemReportStatusFilterEnum.Open
        ? initialStateValues.pageNumber
        : 0,
    filterText: filterTextValue,
    sortColumnName:
      initialStateValues.statusType !== ProblemReportStatusFilterEnum.Open
        ? sortByColumnId
        : undefined, // Use client-side sorting
    sortDirectionTypeId:
      initialStateValues.statusType !== ProblemReportStatusFilterEnum.Open
        ? sortByColumnDirection
        : undefined, // Use client-side sorting
  };

  const [
    filterOptionsForApi,
    setFilterOptionsForApi,
  ] = useState<GetProblemReportsListRequest>(initialFilterOptionsRequestForApi);

  const formattedPageSize = getPageSize({
    customPageSize: undefined,
    currentStatusType: (filterOptionsForApi.statusType as unknown) as ProblemReportStatusFilterEnum,
    domainItemsPerPage,
  });

  const getProblemReportsListApi = useGetProblemReportsListUpdated(
    filterOptionsForApi
  );

  const problemReportsListApiData = getProblemReportsListApi.data;

  // #region Preserve table scroll state
  // Preserve the filter state in the browser history state so when the user
  // goes "back" (via the browser), the state would be restored.
  const updateRouteState = ({
    problemReportId,
  }: UpdateRouteStateParams = {}) => {
    const cleanProblemReportId =
      problemReportId || location.state?.selectedProblemReportId;

    history.replace(location.pathname, {
      viewType: tableOptions.viewType,
      filterBy: tableOptions.filterBy,
      filterText: tableOptions.filterByText,
      statusType: tableOptions.statusType,
      tagIds: tableOptions.tagIds,
      sortColumnName: tableOptions.sortByColumnId,
      sortDirection: tableOptions.sortByColumnDirection,
      assetSearchExpression: tableOptions.assetSearchExpression,
      pageNumber: tableOptions.pageNumber,
      selectedProblemReportId: cleanProblemReportId,
      fromDate: formattedFromDate.toISOString(),
      toDate: toDate.toISOString(),
    } as LocationState);
  };

  const handleUpdateFromAndToDates = (
    startDatetime: moment.Moment,
    endDatetime: moment.Moment
  ) => {
    // We set filter options because selecting a date will automatically make
    // an api call.
    setFilterOptionsForApi((prevState) => ({
      ...prevState,
      fromDate: moment(startDatetime).startOf('day').toDate(),
      toDate: endDatetime.toDate(),
      pageNumber: 0, // reset pagination after date change
    }));

    // We need to set table options as well as setting filterOptionsForApi so
    // both states match when the user changes other filters that will refer
    // to the dates within tableOptions rather than the filterOptionsForApi.
    if (startDatetime && endDatetime) {
      setTableOptions((prevState) => ({
        ...prevState,
        fromDate: startDatetime,
        toDate: endDatetime,
      }));
    }
  };

  const handlePageNumberChange = (selectedPageNumber: number) => {
    setFilterOptionsForApi((prevState) => ({
      ...prevState,
      pageNumber: selectedPageNumber,
    }));
  };

  const handleFilterTextAndColumnChange = (filterData: FilterByData) => {
    setTableOptions((prevState) => ({
      ...prevState,
      filterBy: filterData.filterByColumn,
      filterByText: filterData.filterTextValue,
    }));
  };

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const statusTypeId = event.target.value as ProblemReportStatusFilterEnum;
    setFilterOptionsForApi((prevState) => ({
      ...prevState,
      statusType: statusTypeId,
      pageNumber: 0, // reset pagination after statusType change
      // Bring over the client-side sorting if the status type was "Open"
      sortColumnName: tableOptions.sortByColumnId,
      sortDirectionTypeId: tableOptions.sortByColumnDirection,
    }));
  };

  const handleSelectTag = (tagId: number) => {
    setTableOptions((prevState) => ({
      ...prevState,
      tagIds: [...(prevState.tagIds || []), tagId],
    }));
  };

  const handleDeleteTag = (tagId: number) => () => {
    setTableOptions((prevState) => ({
      ...prevState,
      tagIds: [...(prevState.tagIds || [])].filter(
        (selectedTagId) => selectedTagId !== tagId
      ),
    }));
  };

  const handleSortByChange = (columnId: string, isDescending: boolean) => {
    setTableOptions((prevState) => ({
      ...prevState,
      sortByColumnId: columnId,
      sortByColumnDirection: isDescending
        ? SortDirectionEnum.Descending
        : SortDirectionEnum.Ascending,
    }));
  };

  const handleSubmitAllFilters = () => {
    updateRouteState();

    setFilterOptionsForApi({
      ...filterOptionsForApi,
      filterByTypeId: tableOptions.filterBy,
      filterText: tableOptions.filterByText,
      tagIdList: tableOptions.tagIds,
      pageNumber: 0,
      fromDate: formattedFromDate.toDate(),
      toDate: toDate.toDate(),
    });
  };

  useEffect(() => {
    updateRouteState();

    if (filterOptionsForApi.statusType !== ProblemReportStatusFilterEnum.Open) {
      setFilterOptionsForApi((prevState) => ({
        ...prevState,
        sortColumnName: tableOptions.sortByColumnId,
        sortDirectionTypeId: tableOptions.sortByColumnDirection,
      }));
    }
  }, [tableOptions.sortByColumnDirection, tableOptions.sortByColumnId]);

  useEffect(() => {
    // We do not want to make this call if the user is not on an air products
    // domain. For more details, see 'DetailsTabWithUserSettings'.
    if (saveUserProblemReportSettings) {
      saveUserProblemReportSettings({
        userId,
        domainId,
        currentListProblemReportViewId: viewTypeId,
        filterBy:
          enumToProblemReportAccessorMap[filterOptionsForApi.filterByTypeId],
        filterText: filterOptionsForApi.filterText,
        // Temporarily not saving statusType for back-end property change to use proper ENUM
        // showStatusValue: (filterOptionsForApi.statusType as unknown) as ProblemReportStatusEnum,
        tagIdList: filterOptionsForApi.tagIdList,
        fromDate: filterOptionsForApi.fromDate,
        toDate: filterOptionsForApi.toDate,
      }).catch(() => {});

      updateRouteState();
    }
  }, [
    // Hardcoded to Basic viewType as we might not implement the other view types
    tableOptions.viewType,
    userId,
    domainId,
    filterOptionsForApi.filterByTypeId,
    filterOptionsForApi.filterText,
    filterOptionsForApi.statusType,
    filterOptionsForApi.tagIdList,
    filterOptionsForApi.fromDate,
    filterOptionsForApi.toDate,
  ]);

  // Refetch the list of assets. Handle a special case where adding/editing a
  // favourite should not trigger a refetch
  // NOTE: Need opsNavData because of assetSearchExpression etc.
  useUpdateEffect(() => {
    if (opsNavData?.type === OpsNavItemType.Favourite) {
      const tableOptionToFavouriteProperty = {
        assetSearchExpression: 'assetSearchExpression',
        // We only need search expression (see ProblemReport List api)
        // but these remain commented out incase we need to re-add
        // filterBy: 'filterBy',
        // filterByText: 'filterText',
        // sortByColumnId: 'sortColumnName',
        // sortByColumnDirection: 'sortDirection',
        // navigationDomainId: 'navigationDomainId',
      };
      const areFilterValuesDifferent = Object.entries(
        tableOptionToFavouriteProperty
      ).some(([tableOptionKey, favouriteKey]) => {
        // @ts-ignore
        const tableOptionValue = tableOptions[tableOptionKey];
        // @ts-ignore
        const favouriteFilterValue = opsNavData.item[favouriteKey];

        return !isEqual(tableOptionValue, favouriteFilterValue);
      });

      if (areFilterValuesDifferent) {
        setFilterOptionsForApi((prevState) => ({
          ...prevState,
          assetSearchExpression: initialStateValues.assetSearchExpression,
        }));
      }
    } else {
      setFilterOptionsForApi((prevState) => ({
        ...prevState,
        assetSearchExpression: initialStateValues.assetSearchExpression,
      }));
    }
  }, [opsNavData]);

  // CSV EXPORT API CALL
  const getAllProblemReportsListForCsvApi = useGetProblemReportsListLegacy({
    assetSearchExpression: tableOptions.assetSearchExpression,
    viewTypeId, // Always Basic
    showStatusTypeId: filterOptionsForApi.statusType,
    filterByTypeId: filterOptionsForApi.filterByTypeId,
    filterText: filterOptionsForApi.filterText,
    tagIdList: filterOptionsForApi.tagIdList,
    fromDate: filterOptionsForApi.fromDate,
    toDate: filterOptionsForApi.toDate,

    disableInitialFetch: true,
  });

  const isDownloadButtonDisabled =
    getAllProblemReportsListForCsvApi?.isFetching ||
    getProblemReportsListApi.isError ||
    // If the regular paginated API doesn't return records, then there most
    // likely aren't ANY records to be exported
    !problemReportsListApiData?.result?.length;

  return {
    assetId,
    location,
    topOffset,
    formattedPageSize,
    getProblemReportsListApi,
    filterByColumn,
    filterTextValue,
    filterOptionsForApi,
    sortByColumnId,
    sortByColumnDirection,
    getAllProblemReportsListForCsvApi,
    tableStateForDownload,
    isDownloadButtonDisabled,
    selectedTagIds,
    problemReportsListApiData,
    fromDate: moment(filterOptionsForApi.fromDate),
    toDate: moment(filterOptionsForApi.toDate),
    setTableStateForDownload,
    handlePageNumberChange,
    handleFilterTextAndColumnChange,
    handleStatusChange,
    handleDeleteTag,
    handleSelectTag,
    handleSortByChange,
    handleSubmitAllFilters,
    handleUpdateFromAndToDates,
    updateRouteState,
  } as CustomHookData;
};

export default useProblemReportsListDetails;
