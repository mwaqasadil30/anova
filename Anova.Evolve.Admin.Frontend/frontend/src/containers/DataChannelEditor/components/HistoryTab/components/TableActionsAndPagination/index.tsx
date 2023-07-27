import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from 'components/Button';
import PageNumberPagination, {
  Props as PageNumberPaginationProps,
} from 'components/PageNumberPagination';
import PaginationRange, {
  Props as PaginationRangeProps,
} from 'components/PaginationRange';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends PageNumberPaginationProps, PaginationRangeProps {
  toggleAllRows?: (open: boolean) => void;
}

const TableActionsAndPagination = ({
  totalRows,
  pageIndex,
  pageSize,
  items,
  toggleAllRows,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} md={4}>
        {toggleAllRows && (
          <Box
            display="flex"
            justifyContent={['center', 'center', 'flex-start']}
          >
            <Box p={0.5}>
              <Button
                className="solid-background"
                onClick={() => toggleAllRows(true)}
              >
                {t('ui.table.expandAll', 'Expand all')}
              </Button>
            </Box>
            <Box p={0.5}>
              <Button
                className="solid-background"
                onClick={() => toggleAllRows(false)}
              >
                {t('ui.table.collapseAll', 'Collapse All')}
              </Button>
            </Box>
          </Box>
        )}
      </Grid>
      <Grid item xs={12} md={4}>
        <Box justifyContent={['center', 'center', 'flex-end']}>
          <PaginationRange
            totalRows={totalRows}
            pageIndex={pageIndex}
            pageSize={pageSize}
            align="center"
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box display="flex" justifyContent={['center', 'center', 'flex-end']}>
          <PageNumberPagination items={items} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default TableActionsAndPagination;
