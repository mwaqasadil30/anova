import {
  AssetListFilterOptions,
  AssetSummaryGroupingOptions,
  DataChannelType,
  EvolveAssetSummaryDto,
  EvolveGetAssetSummaryRecordsByOptionsResponse,
  ListSortDirection,
  UnitType,
} from 'api/admin/api';
import { ColumnInstance, Row } from 'react-table';
import { ApplicationState } from 'redux-app/modules/app/types';
import { UnitDisplayType } from 'types';

export interface UpdateRouteStateParams {
  assetId?: string;
  dataChannelId?: string;
}

export interface TableDataForDownload {
  rows: Row<EvolveAssetSummaryDto>[];
  visibleColumns: ColumnInstance<EvolveAssetSummaryDto>[];
}

export interface AssetSummaryApiHook {
  isLoadingInitial: boolean;
  isFetching: boolean;
  responseError: any;
  apiResponse: EvolveGetAssetSummaryRecordsByOptionsResponse | null;
  setPageNumber: (newPageNumber: number) => void;
  totalRows: number;
  pageSize: number | null;
  pageCount?: number;
  pageNumber: number;
  startTimer: Date | null;
  endTimer: Date | null;
  endPageTimer: Date | null;
  apiDuration: number | null;
  refetchRecords: () => void;
}

export interface TableOptionsData {
  opsNavData?: ApplicationState['opsNavigationData'];
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
  disableInitialFetch: boolean;
}

export interface TableOptionsOutput {
  filterBy: AssetListFilterOptions;
  filterByText: string;
  unitSelected: UnitType;
  dataChannels: DataChannelType[] | undefined;
  inventoryStates: string[] | undefined;
  groupByColumn: AssetSummaryGroupingOptions;
  groupBySortDirectionSelected: ListSortDirection;
  sortByColumnId: string;
  sortByColumnDirection: ListSortDirection;
  assetSearchExpression: string | null | undefined;
  navigationDomainId: string;
  disableInitialFetch: boolean;
}
