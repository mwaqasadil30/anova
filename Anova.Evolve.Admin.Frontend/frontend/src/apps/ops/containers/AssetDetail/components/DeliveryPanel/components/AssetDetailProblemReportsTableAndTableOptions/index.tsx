/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import { SortDirectionEnum } from 'api/admin/api';
import ProblemReportsTable from 'apps/ops/containers/ProblemReportsList/components/ProblemReportsTable';
import { CustomHookData } from 'apps/ops/containers/ProblemReportsList/types';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import React from 'react';
import TableOptions from './components/TableOptions';

interface AssetDetailProblemReportsTableAndTableOptionsProps {
  problemReportsListDetails: CustomHookData;
}

const AssetDetailProblemReportsTableAndTableOptions = ({
  problemReportsListDetails,
}: AssetDetailProblemReportsTableAndTableOptionsProps) => {
  const {
    filterByColumn,
    filterTextValue,
    filterOptionsForApi,
    getProblemReportsListApi,
    problemReportsListApiData,
    getAllProblemReportsListForCsvApi,
    formattedPageSize,
    sortByColumnId,
    sortByColumnDirection,
    location,
    handlePageNumberChange,
    handleFilterTextAndColumnChange,
    handleSortByChange,
    handleStatusChange,
    handleSubmitAllFilters,
    updateRouteState,
    setTableStateForDownload,
    fromDate,
    toDate,
    handleUpdateFromAndToDates,
  } = problemReportsListDetails;

  return (
    <>
      <Box pb={1}>
        <TableOptions
          filterByColumn={filterByColumn}
          filterTextValue={filterTextValue}
          statusSelected={filterOptionsForApi.statusType}
          isFetching={getProblemReportsListApi.isFetching}
          handleFilterTextAndColumnChange={handleFilterTextAndColumnChange}
          handleSubmitAllFilters={handleSubmitAllFilters}
          handleStatusTypeChange={handleStatusChange}
        />
      </Box>

      <BoxWithOverflowHidden py={1} height="400px">
        <ProblemReportsTable
          totalRows={problemReportsListApiData?.paging?.totalCount || 0}
          pageCount={problemReportsListApiData?.paging?.totalPages}
          isLoadingInitial={getProblemReportsListApi.isLoading}
          isFetching={getProblemReportsListApi.isFetching}
          responseError={getProblemReportsListApi.error}
          apiResponse={problemReportsListApiData}
          // CSV
          allDataApiResponse={getAllProblemReportsListForCsvApi.apiResponse}
          // Page size should always be set when rendering the table. It's only
          // set as null when fetching data to be downloaded as a CSV.
          pageSize={formattedPageSize!}
          pageNumber={filterOptionsForApi.pageNumber}
          handlePageNumberChange={handlePageNumberChange}
          sortByColumnId={sortByColumnId}
          sortByIsDescending={
            sortByColumnDirection === SortDirectionEnum.Descending
          }
          fromDate={fromDate}
          toDate={toDate}
          statusType={filterOptionsForApi.statusType}
          handleSortByChange={handleSortByChange}
          selectedProblemReportId={location?.state?.selectedProblemReportId}
          updateRouteState={updateRouteState}
          setTableStateForDownload={setTableStateForDownload}
          handleUpdateFromAndToDates={handleUpdateFromAndToDates}
        />
      </BoxWithOverflowHidden>
    </>
  );
};

export default AssetDetailProblemReportsTableAndTableOptions;
