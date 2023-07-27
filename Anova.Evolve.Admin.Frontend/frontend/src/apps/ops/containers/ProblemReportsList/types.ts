import {
  PagingResponseModelOfListOfProblemReport_SummaryDto,
  ProblemReportFilter,
  ProblemReportViewEnum,
  ProblemReport_SummaryDto,
  SortDirectionEnum,
} from 'api/admin/api';
import { ProblemReportStatusFilterEnum } from 'apps/ops/types';
import { Location } from 'history';
import moment from 'moment';
import React from 'react';
import { UseQueryResult } from 'react-query';
import { ColumnInstance, Row } from 'react-table';
import { GetProblemReportsListRequest } from './hooks/useGetProblemReportsListUpdated';

export interface UpdateRouteStateParams {
  assetId?: string;
  problemReportId?: string;
}

export interface TableDataForDownload {
  rows: Row<ProblemReport_SummaryDto>[];
  visibleColumns: ColumnInstance<ProblemReport_SummaryDto>[];
}

export interface ProblemReportsApiHook {
  isLoadingInitial: boolean;
  isFetching: boolean;
  responseError: any;
  apiResponse: PagingResponseModelOfListOfProblemReport_SummaryDto | null;
  setPageNumber: (newPageNumber: number) => void;
  totalRows: number;
  pageSize: number | null;
  pageCount?: number;
  pageNumber: number;
  refetchRecords: () => void;
}

export interface LocationState {
  viewType?: ProblemReportViewEnum;
  filterBy?: ProblemReportFilter;
  filterText?: string | null;
  statusType?: ProblemReportStatusFilterEnum;
  tagIds?: number[] | null;
  sortColumnName?: string | null;
  sortDirection?: SortDirectionEnum;
  assetSearchExpression?: string | null;
  pageNumber?: number;
  selectedAssetId?: string;
  selectedProblemReportId?: ProblemReport_SummaryDto['problemReportId'];
  fromDate?: string | null;
  toDate?: string | null;
}

export interface FilterByData {
  filterByColumn: ProblemReportFilter;
  filterTextValue: string;
}

export interface CustomHookData {
  assetId?: string;
  isUserProblemReportSettingsLoadingInitial?: boolean;
  location?: Location<LocationState>;
  topOffset: number;
  formattedPageSize: number | null;
  getProblemReportsListApi: UseQueryResult<
    PagingResponseModelOfListOfProblemReport_SummaryDto,
    unknown
  >;
  filterByColumn: ProblemReportFilter;
  filterTextValue: string;
  filterOptionsForApi: GetProblemReportsListRequest;
  sortByColumnId: string;
  sortByColumnDirection: SortDirectionEnum;
  getAllProblemReportsListForCsvApi: ProblemReportsApiHook;
  tableStateForDownload: TableDataForDownload | null;
  isDownloadButtonDisabled: boolean;
  selectedTagIds: number[] | null;
  problemReportsListApiData?: PagingResponseModelOfListOfProblemReport_SummaryDto;
  fromDate: moment.Moment;
  toDate: moment.Moment;
  setTableStateForDownload: React.Dispatch<
    React.SetStateAction<TableDataForDownload | null>
  >;
  handlePageNumberChange: (selectedPageNumber: number) => void;
  handleFilterTextAndColumnChange: (filterData: FilterByData) => void;
  handleStatusChange: (
    event: React.ChangeEvent<{
      value: unknown;
    }>
  ) => void;
  handleDeleteTag: (tagId: number) => () => void;
  handleSelectTag: (tagId: number) => void;
  handleSortByChange: (columnId: string, isDescending: boolean) => void;
  handleSubmitAllFilters: () => void;
  handleUpdateFromAndToDates: (
    startDatetime: moment.Moment,
    endDatetime: moment.Moment
  ) => void;
  updateRouteState: ({ problemReportId }: UpdateRouteStateParams) => void;
}
