import React from 'react';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Button from 'components/Button';
import PageNumberPagination, {
  Props as PageNumberPaginationProps,
} from 'components/PageNumberPagination';
import PaginationRange, {
  Props as PaginationRangeProps,
} from 'components/PaginationRange';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { useTranslation } from 'react-i18next';

interface Props extends PageNumberPaginationProps, PaginationRangeProps {
  shouldShowActions?: boolean;
  shouldDisableActions?: boolean;
  actions?: {
    deleteSelected?: () => void;
  };
}

const TableActionsAndPagination = ({
  shouldShowActions,
  shouldDisableActions,
  totalRows,
  pageIndex,
  pageSize,
  items,
  actions = {},
}: Props) => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} md={4}>
        <Box textAlign={['center', 'center', 'left']}>
          {shouldShowActions ? (
            <Button
              variant="text"
              startIcon={<DeleteIcon />}
              onClick={actions.deleteSelected}
              disabled={shouldDisableActions}
              useDomainColorForIcon
            >
              {t('ui.common.deleteselected', 'Delete Selected')}
            </Button>
          ) : (
            <Hidden smDown>&nbsp;</Hidden>
          )}
        </Box>
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
