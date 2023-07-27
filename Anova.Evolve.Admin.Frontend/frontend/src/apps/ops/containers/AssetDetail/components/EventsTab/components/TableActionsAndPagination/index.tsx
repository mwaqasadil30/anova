import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PageNumberPagination, {
  Props as PageNumberPaginationProps,
} from 'components/PageNumberPagination';
import PaginationRange, {
  Props as PaginationRangeProps,
} from 'components/PaginationRange';
import PageCount from 'components/typography/PageCount';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends PageNumberPaginationProps, PaginationRangeProps {
  shouldShowActions?: boolean;
  shouldDisableActions?: boolean;
  showPaginationControls?: boolean;
}

const TableActionsAndPagination = ({
  totalRows,
  pageIndex,
  pageSize,
  items,
  showPaginationControls,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box p={0.5}>
      {!showPaginationControls ? (
        <Box textAlign="center">
          <PageCount>
            {t('ui.common.itemCount', `{{count}} items`, {
              count: totalRows,
            })}
          </PageCount>
        </Box>
      ) : (
        <Grid container spacing={1} alignItems="center">
          {totalRows <= pageSize ? (
            <Grid item xs style={{ textAlign: 'center' }}>
              <PageCount>
                {t('ui.common.itemCount', `{{count}} items`, {
                  count: totalRows,
                })}
              </PageCount>
            </Grid>
          ) : (
            <>
              {!isBelowSmBreakpoint && <Grid item xs={12} md={4} />}
              <Grid item xs md={4}>
                <Box justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                  <PaginationRange
                    totalRows={totalRows}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    align={isBelowSmBreakpoint ? 'left' : 'center'}
                  />
                </Box>
              </Grid>
              <Grid item xs="auto" md={4}>
                <Box
                  display="flex"
                  justifyContent={['center', 'center', 'flex-end']}
                >
                  <PageNumberPagination items={items} />
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default TableActionsAndPagination;
