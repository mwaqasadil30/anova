/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import { SortDirectionEnum } from 'api/admin/api';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import React from 'react';
import { CustomHookData } from '../../types';
import ProblemReportsTable from '../ProblemReportsTable';
import TableOptions from '../TableOptions';

interface ProblemReportsTableAndTableOptionsProps {
  problemReportsListDetails: CustomHookData;
}

const ProblemReportsTableAndTableOptions = ({
  problemReportsListDetails,
}: ProblemReportsTableAndTableOptionsProps) => {
  const {
    handleFilterTextAndColumnChange,
    handleStatusChange,
    handleSelectTag,
    handleDeleteTag,
    selectedTagIds,
    filterByColumn,
    filterTextValue,
    filterOptionsForApi,
    handleSubmitAllFilters,
    getProblemReportsListApi,
    problemReportsListApiData,
    getAllProblemReportsListForCsvApi,
    formattedPageSize,
    handlePageNumberChange,
    sortByColumnId,
    sortByColumnDirection,
    handleSortByChange,
    location,
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
          // handlers
          handleFilterTextAndColumnChange={handleFilterTextAndColumnChange}
          handleStatusTypeChange={handleStatusChange}
          handleSelectTag={handleSelectTag}
          handleDeleteTag={handleDeleteTag}
          selectedTagIds={selectedTagIds}
          filterByColumn={filterByColumn}
          filterTextValue={filterTextValue}
          statusSelected={filterOptionsForApi.statusType}
          handleSubmitAllFilters={handleSubmitAllFilters}
          isFetching={getProblemReportsListApi.isFetching}
        />
      </Box>

      <BoxWithOverflowHidden py={1}>
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
          statusType={filterOptionsForApi.statusType}
          fromDate={fromDate}
          toDate={toDate}
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

export default ProblemReportsTableAndTableOptions;
