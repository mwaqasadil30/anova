import {
  ProblemReportFilter,
  ProblemReportViewEnum,
  SortDirectionEnum,
} from 'api/admin/api';
import { ProblemReportStatusFilterEnum } from 'apps/ops/types';
import moment from 'moment';
import { ApplicationState } from 'redux-app/modules/app/types';
import { OpsNavItemType } from 'types';
import { EMPTY_GUID } from 'utils/api/constants';
import { isNumber } from 'utils/format/numbers';
import { ProblemReportsColumnId } from './components/ProblemReportsTable/helpers';

export const defaultFilterByColumn = ProblemReportFilter.ShipTo;
export const defaultStatusType = ProblemReportStatusFilterEnum.Open;
export const defaultViewType = ProblemReportViewEnum.Basic;

export const enumToProblemReportAccessorMap = {
  [ProblemReportFilter.ShipTo]: ProblemReportsColumnId.ShipTo,
  [ProblemReportFilter.Rtu]: ProblemReportsColumnId.RtuId,
  [ProblemReportFilter.AssetTitle]: ProblemReportsColumnId.AssetTitle,
  [ProblemReportFilter.Owner]: ProblemReportsColumnId.Owner,
  [ProblemReportFilter.PlantStatus]: ProblemReportsColumnId.PlantStatus,
  // NOTE: the user filters problem reports by the problemNumber, not the problemReportId
  // The 'problemId' table column shows the ProblemNumber
  [ProblemReportFilter.ProblemId]: ProblemReportsColumnId.ProblemNumber,
  [ProblemReportFilter.Distribution]: ProblemReportsColumnId.DistributionNote,
};

export const stringToProblemReportEnum = Object.keys(
  enumToProblemReportAccessorMap
).reduce<Record<string, ProblemReportFilter>>((prev, key) => {
  prev[
    enumToProblemReportAccessorMap[Number(key) as ProblemReportFilter]
  ] = Number(key) as ProblemReportFilter;
  return prev;
}, {});

interface GetInitialStateValuesOptions {
  opsNavData: ApplicationState['opsNavigationData'];
  defaultDomainId?: string;
  // Other defaults
  viewType?: ProblemReportViewEnum;
  filterBy?: ProblemReportFilter;
  filterByText?: string | null;
  statusType?: ProblemReportStatusFilterEnum;
  tagIds?: number[] | null;
  sortByColumnId?: string | null;
  sortByColumnDirection?: SortDirectionEnum;
  pageNumber?: number;
  fromDate: moment.Moment | null;
  toDate: moment.Moment | null;
}

export const getInitialStateValues = ({
  opsNavData,
  defaultDomainId,
  // Defaults that will override
  viewType,
  filterBy,
  filterByText,
  statusType,
  tagIds,
  sortByColumnId,
  sortByColumnDirection,
  pageNumber,
  fromDate,
  toDate,
}: GetInitialStateValuesOptions) => {
  const defaultInitialValues = {
    viewType: defaultViewType,
    filterBy: defaultFilterByColumn,
    filterByText: '',
    statusType: defaultStatusType,
    tagIds: null,
    // groupBySortDirectionSelected: ListSortDirection.Ascending,
    // openDate is sorted by descending by default
    sortByColumnId: ProblemReportsColumnId.OpenDate,
    sortByColumnDirection: SortDirectionEnum.Descending,
    assetSearchExpression: '',
    navigationDomainId: defaultDomainId || EMPTY_GUID,
    pageNumber: 0,
    fromDate: moment().subtract(7, 'days').startOf('day'),
    toDate: moment(),
  };

  // Defaults that take priority over all other properties
  const overridingDefaults = {
    ...(isNumber(viewType) && { viewType }),
    ...(isNumber(filterBy) && { filterBy }),
    ...(filterByText && { filterByText }),
    ...(statusType && { statusType }),
    ...(tagIds && { tagIds }),
    ...(sortByColumnId && { sortByColumnId }),
    ...(isNumber(sortByColumnDirection) && { sortByColumnDirection }),
    ...(tagIds && { tagIds }),
    ...(isNumber(pageNumber) && { pageNumber }),
    ...(fromDate && { fromDate }),
    ...(toDate && { toDate }),
  };

  if (opsNavData?.type === OpsNavItemType.Favourite) {
    const favouriteItem = opsNavData.item;

    return {
      ...defaultInitialValues,
      assetSearchExpression:
        favouriteItem.assetSearchExpression ||
        defaultInitialValues.assetSearchExpression,
      ...overridingDefaults,
    };
  }

  if (opsNavData?.type === OpsNavItemType.AssetGroup) {
    const groupItem = opsNavData.item;

    return {
      ...defaultInitialValues,
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
      assetSearchExpression: treeItem.searchExpression,
      ...overridingDefaults,
    };
  }

  return { ...defaultInitialValues, ...overridingDefaults };
};

interface GetPageSizeInput {
  customPageSize?: number | null;
  currentStatusType?: ProblemReportStatusFilterEnum;
  domainItemsPerPage?: number;
}

export const getPageSize = ({
  customPageSize,
  currentStatusType,
  domainItemsPerPage,
}: GetPageSizeInput) => {
  if (
    customPageSize !== undefined &&
    (currentStatusType === ProblemReportStatusFilterEnum.Closed ||
      currentStatusType === ProblemReportStatusFilterEnum.Both)
  ) {
    return customPageSize;
  }

  if (currentStatusType === ProblemReportStatusFilterEnum.Open) {
    return null;
  }

  return domainItemsPerPage || 50;
};
