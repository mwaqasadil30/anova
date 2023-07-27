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

interface Props extends PageNumberPaginationProps, PaginationRangeProps {
  shouldShowActions?: boolean;
  shouldDisableActions?: boolean;
}

const TableActionsAndPagination = ({
  totalRows,
  pageIndex,
  pageSize,
  items,
}: Props) => {
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} md={4} />

      <Grid item xs md={4}>
        <Box justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
          <PaginationRange
            totalRows={totalRows}
            pageIndex={pageIndex}
            pageSize={pageSize}
            align={isBelowSmBreakpoint ? 'right' : 'center'}
          />
        </Box>
      </Grid>
      <Grid item xs="auto" md={4}>
        <Box display="flex" justifyContent="flex-end">
          <PageNumberPagination items={items} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default TableActionsAndPagination;
