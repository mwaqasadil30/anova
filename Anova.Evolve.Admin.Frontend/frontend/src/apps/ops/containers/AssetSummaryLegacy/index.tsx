/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import {
  AssetListFilterOptions,
  AssetSummaryGroupingOptions,
  DataChannelType,
  ListSortDirection,
  UnitType,
} from 'api/admin/api';
import AssetSummaryApiTimers from 'apps/ops/components/AssetSummaryApiTimers';
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
import { getInitialStateValues } from './helpers';
import { useAssetFilters } from './hooks/useAssetFilters';
import { useAssetSummaryRecordsUpdated } from './hooks/useAssetSummaryRecordsUpdated';
import { UpdateRouteStateParams } from './types';

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

const AssetSummaryLegacy = ({
  userId,
  domainId,
  dataChannels,
  inventoryStates,
}: Props) => {
  const location = useLocation<LocationState | undefined>();
  const history = useHistory();
  const opsNavData = useSelector(selectOpsNavigationData);
  const topOffset = useSelector(selectTopOffset);

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
  });

  const [lastRefreshDate, setLastRefreshDate] = useState<Date>();

  const [unitDisplayType, setUnitDisplayType] = useState<UnitDisplayType>(
    isNumber(location.state?.unitDisplayType)
      ? location.state?.unitDisplayType!
      : UnitDisplayType.Display
  );
  const [tableOptions, setTableOptions] = useState(initialStateValues);
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
  } = tableOptions;

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

      if (areFilterValuesDifferent) {
        setTableOptions(initialStateValues);
      }
    } else {
      setTableOptions(initialStateValues);
    }
  }, [opsNavData]);

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

    history.replace(routes.assetSummary.listVersion2, {
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
    } as LocationState);
  };
  useEffect(() => {
    updateRouteState();
  }, [tableOptions, assetSummaryDataUpdated.pageNumber, unitDisplayType]);

  const handleFilterFormSubmit = (filterData: FilterByData) => {
    setTableOptions((prevState) => ({
      ...prevState,
      filterBy: filterData.filterByColumn,
      filterByText: filterData.filterTextValue,
    }));
    assetSummaryDataUpdated.setPageNumber(0);
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

  const apiData = assetSummaryDataUpdated;

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
        />
      </PageIntroWrapper>

      <AssetSummaryApiTimers
        apiDuration={assetSummaryDataUpdated.apiDuration}
        version={2}
      />

      <Box pb={1}>
        <TableOptions
          // handlers
          handleFilterFormSubmit={handleFilterFormSubmit}
          handleGroupByColumnChange={handleGroupByColumnChange}
          handleGroupByColumnSortChange={handleGroupByColumnSortChange}
          handleUnitChange={handleUnitChange}
          handleDataChannelChange={handleDataChannelChange}
          handleInventorySelectedChange={handleInventorySelectedChange}
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
          pageSize={apiData.pageSize}
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

  return isLoadingInitial ? null : <AssetSummaryLegacy {...fullProps} />;
};

export default AssetSummaryWithDefaults;
