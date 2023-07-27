/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import {
  AssetListFilterOptions,
  AssetSummaryGroupingOptions,
  DataChannelType,
  ListSortDirection,
  UnitType,
} from 'api/admin/api';
import routes from 'apps/ops/routes';
import { parseAssetSummaryQuery } from 'apps/ops/utils/routes';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import isEqual from 'lodash/isEqual';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import {
  selectActiveDomain,
  selectIsActiveDomainApciEnabled,
  selectOpsNavigationData,
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import { selectUser } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { OpsNavItemType, UnitDisplayType } from 'types';
import { isNumber } from 'utils/format/numbers';
import AssetSummaryTable from './components/AssetSummaryTable';
import PageIntro from './components/PageIntro';
import TableOptions from './components/TableOptions';
import { getInitialStateValues, TooltipValues } from './helpers';
import { useAssetFilters } from './hooks/useAssetFilters';
import { useAssetSummaryRecordsUpdated } from './hooks/useAssetSummaryRecordsUpdated';
import {
  TableDataForDownload,
  TableOptionsOutput,
  UpdateRouteStateParams,
} from './types';

// Styled component to allow setting up overflow: hidden on a parent to prevent
// the table from exceeding the height of the page. The key properties being
// `display: flex` and `height: calc(...)` which allows the overflow: hidden to
// work properly.
const Wrapper = styled(({ topOffset, ...props }) => <div {...props} />)`
  ${(props) =>
    props.topOffset &&
    `
      display: flex;
      flex-direction: column;
      height: calc(100vh - ${props.topOffset}px - 16px);
    `};
`;

interface LocationState {
  filterBy?: AssetListFilterOptions;
  filterText?: string | null;
  groupBy?: AssetSummaryGroupingOptions;
  groupBySortDirection?: ListSortDirection;
  displayUnit?: UnitType;
  unitDisplayType?: UnitDisplayType;
  dataChannelTypes?: DataChannelType[] | null;
  inventoryStatusLevel?: string[] | null;
  sortColumnName?: string | null;
  sortDirection?: ListSortDirection;
  assetSearchExpression?: string | null;
  page?: number;
  selectedAssetId?: string;
  selectedDataChannelId?: string;
  disableInitialFetch?: boolean;
}
interface FilterByData {
  filterByColumn: AssetListFilterOptions;
  filterTextValue: string;
}

const useInventoryStatusLevelQueryParameter = () => {
  const location = useLocation();
  const parsedQuery = parseAssetSummaryQuery(location.search);
  return parsedQuery.inventoryStatusLevel;
};

interface Props {
  userId: string;
  domainId: string;
  dataChannels: DataChannelType[];
  inventoryStates: string[];
}

const AssetSummary = ({
  userId,
  domainId,
  dataChannels,
  inventoryStates,
}: Props) => {
  const location = useLocation<LocationState | undefined>();
  const history = useHistory();
  const opsNavData = useSelector(selectOpsNavigationData);
  const topOffset = useSelector(selectTopOffset);

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  const inventoryStatusLevel = useInventoryStatusLevelQueryParameter();
  const initialStateValues = getInitialStateValues({
    opsNavData,
    defaultDataChannels: dataChannels,
    defaultInventoryStates: inventoryStates,
    inventoryStatusQuery: inventoryStatusLevel,
    defaultDomainId: domainId,
    filterBy: location.state?.filterBy,
    filterByText: location.state?.filterText,
    unitSelected: location.state?.displayUnit,
    unitDisplayType: location.state?.unitDisplayType,
    dataChannels: location.state?.dataChannelTypes,
    inventoryStates: location.state?.inventoryStatusLevel,
    groupByColumn: location.state?.groupBy,
    groupBySortDirectionSelected: location.state?.groupBySortDirection,
    sortByColumnId: location.state?.sortColumnName,
    sortByColumnDirection: location.state?.sortDirection,
    disableInitialFetch:
      location.state?.disableInitialFetch ?? isAirProductsEnabledDomain,
  });

  const [lastRefreshDate, setLastRefreshDate] = useState<Date>();

  const [unitDisplayType, setUnitDisplayType] = useState<UnitDisplayType>(
    isNumber(location.state?.unitDisplayType)
      ? location.state?.unitDisplayType!
      : UnitDisplayType.Display
  );
  const [tableOptions, setTableOptions] = useState<TableOptionsOutput>(
    initialStateValues
  );
  const {
    filterBy: filterByColumn,
    filterByText: filterTextValue,
    unitSelected,
    dataChannels: dataChannelSelected,
    inventoryStates: inventoryStateSelected,
    groupByColumn,
    groupBySortDirectionSelected,
    sortByColumnId,
    sortByColumnDirection,
    assetSearchExpression,
    navigationDomainId,
    disableInitialFetch,
  } = tableOptions;

  // Table state/data to perform a CSV download/export
  const [
    tableStateForDownload,
    setTableStateForDownload,
  ] = useState<TableDataForDownload | null>(null);

  // Separate API call to fetch ALL records to be used in a CSV download/export
  const allAssetSummaryDataApi = useAssetSummaryRecordsUpdated({
    domainId,
    userId,
    assetSearchDomainId: navigationDomainId,
    assetSearchExpression,
    groupByColumn,
    filterTextValue,
    filterByColumn,
    groupBySortDirectionSelected,
    dataChannelSelected,
    inventoryStateSelected,
    unitSelected,
    lastRefreshDate,
    sortByColumnId,
    sortByColumnDirection,
    initialPageNumber: location.state?.page,
    // These are the different properties to fetch ALL data
    customPageSize: null,
    disableInitialFetch: true,
  });

  const assetSummaryDataUpdated = useAssetSummaryRecordsUpdated({
    domainId,
    userId,
    assetSearchDomainId: navigationDomainId,
    assetSearchExpression,
    groupByColumn,
    filterTextValue,
    filterByColumn,
    groupBySortDirectionSelected,
    dataChannelSelected,
    inventoryStateSelected,
    unitSelected,
    lastRefreshDate,
    sortByColumnId,
    sortByColumnDirection,
    initialPageNumber: location.state?.page,
    // Don't make initial api call if the current domain is an air products domain.
    disableInitialFetch,
  });

  // #region Preserve table scroll state
  // Preserve the filter state in the browser history state so when the user
  // goes "back" (via the browser), the state would be restored.
  const updateRouteState = ({
    assetId,
    dataChannelId,
  }: UpdateRouteStateParams = {}) => {
    let cleanAssetId = assetId || location.state?.selectedAssetId;
    let cleanDataChannelId =
      dataChannelId || location.state?.selectedDataChannelId;

    // Prioritize scrolling to the data channel over scrolling to the asset
    if (dataChannelId) {
      cleanAssetId = undefined;
    } else if (assetId) {
      cleanDataChannelId = undefined;
    }

    history.replace(routes.assetSummary.list, {
      filterBy: tableOptions.filterBy,
      filterText: tableOptions.filterByText,
      groupBy: tableOptions.groupByColumn,
      groupBySortDirection: tableOptions.groupBySortDirectionSelected,
      displayUnit: isNumber(tableOptions.unitSelected)
        ? tableOptions.unitSelected
        : undefined,
      unitDisplayType,
      dataChannelTypes: tableOptions.dataChannels,
      inventoryStatusLevel: tableOptions.inventoryStates,
      sortColumnName: tableOptions.sortByColumnId,
      sortDirection: tableOptions.sortByColumnDirection,
      assetSearchExpression: tableOptions.assetSearchExpression,
      page: assetSummaryDataUpdated.pageNumber,
      selectedAssetId: cleanAssetId,
      selectedDataChannelId: cleanDataChannelId,
      disableInitialFetch: tableOptions.disableInitialFetch,
    } as LocationState);
  };
  useEffect(() => {
    updateRouteState();
  }, [assetSummaryDataUpdated.pageNumber]);

  const handleFilterTextAndColumnChange = (filterData: FilterByData) => {
    setTableOptions((prevState) => ({
      ...prevState,
      filterBy: filterData.filterByColumn,
      filterByText: filterData.filterTextValue,
    }));
  };

  const handleGroupByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const column = event.target.value as AssetSummaryGroupingOptions;
    setTableOptions((prevState) => ({
      ...prevState,
      groupByColumn: column,
    }));
  };

  const handleGroupByColumnSortChange = () => {
    const isAscending =
      groupBySortDirectionSelected === ListSortDirection.Ascending;
    setTableOptions((prevState) => ({
      ...prevState,
      groupBySortDirectionSelected: isAscending
        ? ListSortDirection.Descending
        : ListSortDirection.Ascending,
    }));
  };
  const handleUnitChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const unit = event.target.value as UnitDisplayType;
    setUnitDisplayType(unit);
  };
  const handleDataChannelChange = (channels: DataChannelType[]) => {
    setTableOptions((prevState) => ({
      ...prevState,
      dataChannels: channels,
    }));
  };
  const handleInventorySelectedChange = (inventoryLevels: string[]) => {
    setTableOptions((prevState) => ({
      ...prevState,
      inventoryStates: inventoryLevels,
    }));
  };

  const handleSortByColumnDirectionChange = (isDescending: boolean) => {
    setTableOptions((prevState) => ({
      ...prevState,
      sortByColumnDirection: isDescending
        ? ListSortDirection.Descending
        : ListSortDirection.Ascending,
    }));
  };

  const handleSortByColumnIdChange = (columnId: string) => {
    setTableOptions((prevState) => ({
      ...prevState,
      sortByColumnId: columnId,
    }));
  };

  const refetchRecords = () => setLastRefreshDate(new Date());

  const [tooltipTextValues, setTooltipTextValues] = useState<TooltipValues>({
    filterTextValue: tableOptions.filterByText,
    filterByColumn: tableOptions.filterBy,
    groupByColumn: tableOptions.groupByColumn,
    unitSelected: unitDisplayType,
    dataChannelSelected: tableOptions.dataChannels,
    inventoryStateSelected: tableOptions.inventoryStates,
  });

  // This Function makes it so we pass less props (other functions) to get to
  // the <FilterTooltip />'s <StyledClearAllButton />
  const handleClearFilters = () => {
    assetSummaryDataUpdated.setPageNumber(0);
    updateRouteState();
    refetchRecords();
  };

  const handleApplyFilters = () => {
    setTableOptions(() => ({
      assetSearchExpression: tableOptions.assetSearchExpression,
      dataChannels: tableOptions.dataChannels,
      filterBy: tableOptions.filterBy,
      filterByText: tableOptions.filterByText,
      groupByColumn: tableOptions.groupByColumn,
      groupBySortDirectionSelected: tableOptions.groupBySortDirectionSelected,
      inventoryStates: tableOptions.inventoryStates,
      navigationDomainId: tableOptions.navigationDomainId,
      sortByColumnDirection: tableOptions.sortByColumnDirection,
      sortByColumnId: tableOptions.sortByColumnId,
      unitSelected: tableOptions.unitSelected,
      disableInitialFetch: false,
    }));

    // Set the tooltipTextValues using only the filter options that were used
    // to make the api call, not the literal/current values in the TableOptions
    // fields. See also in <FilterTooltip />'s <StyledClearAllButton />.
    setTooltipTextValues({
      filterTextValue: tableOptions.filterByText,
      filterByColumn: tableOptions.filterBy,
      groupByColumn: tableOptions.groupByColumn,
      unitSelected: unitDisplayType,
      dataChannelSelected: tableOptions.dataChannels,
      inventoryStateSelected: tableOptions.inventoryStates,
    });

    // Default to page 0 after Apply button is pressed.
    assetSummaryDataUpdated.setPageNumber(0);

    // the useEffect above would originally updateRouteState via its dependencies
    // when table options changed. Since we have an apply button, we only want
    // to update the route state when the filters are set after pressing the
    // apply button.
    updateRouteState();
    refetchRecords();
  };

  // Refetch the list of assets. Handle a special case where adding/editing a
  // favourite should not trigger a refetch
  useUpdateEffect(() => {
    if (opsNavData?.type === OpsNavItemType.Favourite) {
      const tableOptionToFavouriteProperty = {
        filterBy: 'filterBy',
        filterByText: 'filterText',
        unitSelected: 'displayUnit',
        dataChannels: 'dataChannelTypes',
        inventoryStates: 'inventoryStates',
        groupByColumn: 'groupBy',
        groupBySortDirectionSelected: 'groupBySortDirection',
        sortByColumnId: 'sortColumnName',
        sortByColumnDirection: 'sortDirection',
        assetSearchExpression: 'assetSearchExpression',
        navigationDomainId: 'navigationDomainId',
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

      // Changing/selecting an opsNavData item (favourites, tree, etc.) should
      // always make an api call (refetchRecords).
      if (areFilterValuesDifferent) {
        setTableOptions({ ...initialStateValues, disableInitialFetch: false });
        refetchRecords();
      }
    } else {
      setTableOptions({ ...initialStateValues, disableInitialFetch: false });
      refetchRecords();
    }
  }, [opsNavData]);

  const apiData = assetSummaryDataUpdated;

  const isDownloadButtonDisabled =
    allAssetSummaryDataApi?.isFetching ||
    apiData.responseError ||
    // If the regular paginated API doesn't return records, then there most
    // likely aren't ANY records to be exported
    !apiData.apiResponse?.records?.length;

  return (
    <Wrapper topOffset={topOffset}>
      <PageIntroWrapper>
        <PageIntro
          refetchRecords={refetchRecords}
          filterBy={filterByColumn}
          filterText={filterTextValue}
          groupByColumn={groupByColumn}
          groupBySortDirection={groupBySortDirectionSelected}
          displayUnit={unitSelected}
          dataChannelTypes={dataChannelSelected}
          inventoryStates={inventoryStateSelected}
          sortColumnName={sortByColumnId}
          sortDirection={sortByColumnDirection}
          assetSearchExpression={assetSearchExpression}
          navigationDomainId={navigationDomainId}
          tableStateForDownload={tableStateForDownload}
          allAssetSummaryDataApi={allAssetSummaryDataApi}
          isDownloadButtonDisabled={isDownloadButtonDisabled}
        />
      </PageIntroWrapper>

      <Box pb={1}>
        <TableOptions
          tooltipTextValues={tooltipTextValues}
          setTooltipTextValues={setTooltipTextValues}
          handleClearFilters={handleClearFilters}
          isFetching={assetSummaryDataUpdated.isFetching}
          // handlers
          handleFilterTextAndColumnChange={handleFilterTextAndColumnChange}
          handleGroupByColumnChange={handleGroupByColumnChange}
          handleGroupByColumnSortChange={handleGroupByColumnSortChange}
          handleUnitChange={handleUnitChange}
          handleDataChannelChange={handleDataChannelChange}
          handleInventorySelectedChange={handleInventorySelectedChange}
          handleApplyFilters={handleApplyFilters}
          // dropdown values
          filterByColumn={filterByColumn}
          filterTextValue={filterTextValue}
          groupByColumn={groupByColumn}
          groupBySortDirection={groupBySortDirectionSelected}
          unitSelected={unitDisplayType}
          dataChannelSelected={dataChannelSelected}
          inventoryStateSelected={inventoryStateSelected}
          // drop down options
          dataChannelOptions={dataChannels}
          inventoryStateOptions={inventoryStates}
          setTableOptions={setTableOptions}
          setUnitDisplayType={setUnitDisplayType}
          opsNavData={opsNavData}
          dataChannels={dataChannels}
          inventoryStates={inventoryStates}
          inventoryStatusLevel={inventoryStatusLevel}
          domainId={domainId}
        />
      </Box>

      <BoxWithOverflowHidden py={1}>
        <AssetSummaryTable
          totalRows={apiData.totalRows}
          pageCount={apiData.pageCount}
          isLoadingInitial={apiData.isLoadingInitial}
          isFetching={apiData.isFetching}
          responseError={apiData.responseError}
          apiResponse={apiData.apiResponse}
          allDataApiResponse={allAssetSummaryDataApi.apiResponse}
          // Page size should always be set when rendering the table. It's only
          // set as null when fetching data to be downloaded as a CSV.
          pageSize={apiData.pageSize!}
          pageNumber={apiData.pageNumber}
          setPageNumber={assetSummaryDataUpdated.setPageNumber}
          sortByColumnId={sortByColumnId}
          sortByIsDescending={
            sortByColumnDirection === ListSortDirection.Descending
          }
          unitDisplayType={unitDisplayType}
          setSortColumnId={handleSortByColumnIdChange}
          setIsSortDescending={handleSortByColumnDirectionChange}
          groupByColumn={groupByColumn}
          lastRefreshDate={lastRefreshDate}
          selectedAssetId={location.state?.selectedAssetId}
          selectedDataChannelId={location.state?.selectedDataChannelId}
          updateRouteState={updateRouteState}
          setTableStateForDownload={setTableStateForDownload}
        />
      </BoxWithOverflowHidden>
    </Wrapper>
  );
};

const useUserId = () => {
  const user = useSelector(selectUser);
  const userId =
    user.data?.authenticateAndRetrieveApplicationInfoResult?.userInfo?.userId;
  return userId || ''; // FIXME: this is a bad habit
};

const useDomainId = () => {
  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;
  return domainId || '';
};

const AssetSummaryWithDefaults = (props: any) => {
  const userId = useUserId();
  const domainId = useDomainId();
  const {
    dataChannels,
    inventoryStates,
    unitTypes,
    isLoadingInitial,
  } = useAssetFilters({
    userId,
    domainId,
  });
  const fullProps = {
    ...props,
    userId,
    domainId,
    dataChannels,
    inventoryStates,
    unitTypes,
  };

  return isLoadingInitial ? null : <AssetSummary {...fullProps} />;
};

export default AssetSummaryWithDefaults;
