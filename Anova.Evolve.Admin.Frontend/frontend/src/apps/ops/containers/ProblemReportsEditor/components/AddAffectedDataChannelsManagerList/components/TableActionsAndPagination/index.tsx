import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import PageNumberPagination, {
  Props as PageNumberPaginationProps,
} from 'components/PageNumberPagination';
import PaginationRange, {
  Props as PaginationRangeProps,
} from 'components/PaginationRange';
import React from 'react';

interface Props extends PageNumberPaginationProps, PaginationRangeProps {}

const TableActionsAndPagination = ({
  totalRows,
  pageIndex,
  pageSize,
  items,
}: Props) => {
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} md={4} />
      <Grid item xs={4} md={4}>
        <Box justifyContent={['center', 'center', 'flex-end']}>
          <PaginationRange
            totalRows={totalRows}
            pageIndex={pageIndex}
            pageSize={pageSize}
            align="center"
          />
        </Box>
      </Grid>
      <Grid item xs md={4}>
        <Box display="flex" justifyContent={['center', 'center', 'flex-end']}>
          <PageNumberPagination items={items} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default TableActionsAndPagination;
