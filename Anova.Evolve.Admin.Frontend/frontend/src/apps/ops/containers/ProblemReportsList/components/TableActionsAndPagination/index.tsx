import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import PageNumberPagination, {
  Props as PageNumberPaginationProps,
} from 'components/PageNumberPagination';
import PaginationRange, {
  Props as PaginationRangeProps,
} from 'components/PaginationRange';
import ItemCount from 'components/typography/ItemCount';
import DateRangePickerWithOptions from 'components/DateRangePickerWithOptions';
import DateRangeForm from 'components/DateRangeForm';
import { ProblemReportStatusFilterEnum } from 'apps/ops/types';
import FilterBox from 'components/FilterBox';
import styled from 'styled-components';

const StyledFilterBox = styled(FilterBox)`
  background-color: ${(props) =>
    props.theme.palette.type === 'light' ? '#FFFFFF' : '#515151'};
`;

interface Props extends PageNumberPaginationProps, PaginationRangeProps {
  shouldShowActions?: boolean;
  shouldDisableActions?: boolean;
  isEmptyCase?: boolean;
  statusType: ProblemReportStatusFilterEnum;
  isFetching?: boolean;
  fromDate: moment.Moment;
  toDate: moment.Moment;
  handleUpdateFromAndToDates: (
    startDatetime: moment.Moment,
    endDatetime: moment.Moment
  ) => void;
}

const TableActionsAndPagination = ({
  totalRows,
  pageIndex,
  pageSize,
  items,
  isEmptyCase,
  statusType,
  isFetching,
  fromDate,
  toDate,
  handleUpdateFromAndToDates,
}: Props) => {
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('md'));

  const isOpenStatusTypeSelected =
    statusType === ProblemReportStatusFilterEnum.Open;

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justify={isOpenStatusTypeSelected ? undefined : 'space-between'}
      style={{ minHeight: 40 }}
    >
      {/* Do not show the date range picker if `statusType` is Open */}
      {!isOpenStatusTypeSelected && (
        <Grid item xs>
          <DateRangePickerWithOptions
            isFetching={isFetching}
            startDate={fromDate}
            endDate={toDate}
            onSubmit={handleUpdateFromAndToDates}
            customRangeComponent={
              <StyledFilterBox p={4}>
                <DateRangeForm
                  isFetching={isFetching}
                  initialStartDate={fromDate}
                  initialEndDate={toDate}
                  onSubmit={handleUpdateFromAndToDates}
                />
              </StyledFilterBox>
            }
          />
        </Grid>
      )}

      {!isEmptyCase && (
        <>
          <Grid item xs={isOpenStatusTypeSelected ? 12 : 'auto'}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs>
                {pageSize !== null ? (
                  <Box
                    justifyContent={{
                      xs: 'flex-start',
                      md: 'flex-end',
                    }}
                  >
                    <PaginationRange
                      totalRows={totalRows}
                      pageIndex={pageIndex}
                      pageSize={pageSize}
                      align={isBelowSmBreakpoint ? 'right' : 'center'}
                    />
                  </Box>
                ) : (
                  <Box textAlign="center">
                    <ItemCount count={totalRows} />
                  </Box>
                )}
              </Grid>
              {pageSize !== null && (
                <Grid item xs="auto">
                  <Box display="flex" justifyContent="flex-end">
                    <PageNumberPagination items={items} />
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default TableActionsAndPagination;
