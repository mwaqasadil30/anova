import { ApplicationState } from 'redux-app/modules/app/types';
import {
  AssetListFilterOptions,
  UnitType,
  AssetSummaryGroupingOptions,
  DataChannelType,
  ListSortDirection,
} from 'api/admin/api';
import { OpsNavItemType, UnitDisplayType } from 'types';
import { EMPTY_GUID } from 'utils/api/constants';
import { isNumber } from 'utils/format/numbers';

export const defaultFilterByColumn = AssetListFilterOptions.Asset;
export const defaultGroupByColumn = AssetSummaryGroupingOptions.Asset;
export const defaultUnitDisplayType = UnitDisplayType.Display;

export const enumToAccessorMap = {
  [AssetSummaryGroupingOptions.None]: '',
  [AssetSummaryGroupingOptions.Asset]: 'assetId',
  [AssetSummaryGroupingOptions.CustomerName]: 'customerName',
  [AssetSummaryGroupingOptions.Location]: 'assetLocation',
};

interface GetInitialStateValuesOptions {
  opsNavData: ApplicationState['opsNavigationData'];
  defaultDataChannels?: DataChannelType[];
  defaultInventoryStates?: string[];
  inventoryStatusQuery?: string[];
  defaultDomainId?: string;

  // Other defaults
  filterBy?: AssetListFilterOptions;
  filterByText?: string | null;
  unitSelected?: UnitType;
  unitDisplayType?: UnitDisplayType;
  dataChannels?: DataChannelType[] | null;
  inventoryStates?: string[] | null;
  groupByColumn?: AssetSummaryGroupingOptions;
  groupBySortDirectionSelected?: ListSortDirection;
  sortByColumnId?: string | null;
  sortByColumnDirection?: ListSortDirection;
  tagIds?: number[] | null;
}

export const getInitialStateValues = ({
  opsNavData,
  defaultDataChannels,
  defaultInventoryStates,
  inventoryStatusQuery,
  defaultDomainId,
  // Defaults that will override
  filterBy,
  filterByText,
  unitSelected,
  unitDisplayType,
  dataChannels,
  inventoryStates,
  groupByColumn,
  groupBySortDirectionSelected,
  sortByColumnId,
  sortByColumnDirection,
  tagIds,
}: GetInitialStateValuesOptions) => {
  const defaultInitialValues = {
    filterBy: defaultFilterByColumn,
    filterByText: '',
    unitSelected: UnitType.Default,
    unitDisplayType: defaultUnitDisplayType,
    dataChannels: defaultDataChannels,
    inventoryStates: inventoryStatusQuery || defaultInventoryStates,
    groupByColumn: defaultGroupByColumn,
    groupBySortDirectionSelected: ListSortDirection.Ascending,
    sortByColumnId: 'assetTitle',
    sortByColumnDirection: ListSortDirection.Ascending,
    assetSearchExpression: '',
    navigationDomainId: defaultDomainId || EMPTY_GUID,
    tagIds: null,
  };

  // Defaults that take priority over all other properties
  const overridingDefaults = {
    ...(isNumber(filterBy) && { filterBy }),
    ...(filterByText && { filterByText }),
    ...(isNumber(unitSelected) && { unitSelected }),
    ...(unitDisplayType && { unitDisplayType }),
    ...(dataChannels && { dataChannels }),
    ...(inventoryStates && { inventoryStates }),
    ...(isNumber(groupByColumn) && { groupByColumn }),
    ...(isNumber(groupBySortDirectionSelected) && {
      groupBySortDirectionSelected,
    }),
    ...(sortByColumnId && { sortByColumnId }),
    ...(isNumber(sortByColumnDirection) && { sortByColumnDirection }),
    ...(tagIds && { tagIds }),
  };

  if (opsNavData?.type === OpsNavItemType.Favourite) {
    const favouriteItem = opsNavData.item;

    return {
      ...defaultInitialValues,
      filterBy:
        typeof favouriteItem.filterBy === 'number'
          ? favouriteItem.filterBy
          : defaultInitialValues.filterBy,
      filterByText:
        favouriteItem.filterText || defaultInitialValues.filterByText,
      unitSelected:
        typeof favouriteItem.displayUnit === 'number'
          ? favouriteItem.displayUnit
          : defaultInitialValues.unitSelected,
      // TypeScript says that dataChannels and inventoryStates always get
      // overridden by `overridingDefaults` which doesn't seem to be true which
      // is why these lines are ts-ignored
      // @ts-ignore
      dataChannels:
        favouriteItem.dataChannelTypes || defaultInitialValues.dataChannels,
      // @ts-ignore
      inventoryStates:
        favouriteItem.inventoryStates || defaultInitialValues.inventoryStates,
      groupByColumn:
        typeof favouriteItem.groupBy === 'number'
          ? favouriteItem.groupBy
          : defaultInitialValues.groupByColumn,
      groupBySortDirectionSelected:
        favouriteItem.groupBySortDirection ||
        defaultInitialValues.groupBySortDirectionSelected,
      sortByColumnId:
        favouriteItem.sortColumnName || defaultInitialValues.sortByColumnId,
      sortByColumnDirection:
        favouriteItem.sortDirection ||
        defaultInitialValues.sortByColumnDirection,
      assetSearchExpression:
        favouriteItem.assetSearchExpression ||
        defaultInitialValues.assetSearchExpression,
      navigationDomainId:
        favouriteItem.navigationDomainId ||
        defaultInitialValues.navigationDomainId,
      ...overridingDefaults,
    };
  }

  if (opsNavData?.type === OpsNavItemType.AssetGroup) {
    const groupItem = opsNavData.item;

    return {
      ...defaultInitialValues,
      navigationDomainId:
        groupItem.navigationDomainId || defaultInitialValues.navigationDomainId,
      assetSearchExpression:
        groupItem.assetSearchExpression ||
        defaultInitialValues.assetSearchExpression,
      ...overridingDefaults,
    };
  }

  if (opsNavData?.type === OpsNavItemType.AssetTree) {
    const treeItem = opsNavData.nodes[opsNavData.nodes.length - 1];

    return {
      ...defaultInitialValues,
      navigationDomainId:
        treeItem.navigationDomainId || defaultInitialValues.navigationDomainId,
      assetSearchExpression: treeItem.searchExpression,
      // @ts-ignore
      dataChannels:
        treeItem.dataChannelTypes || defaultInitialValues.dataChannels,
      ...overridingDefaults,
    };
  }

  return { ...defaultInitialValues, ...overridingDefaults };
};
