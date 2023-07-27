import React from 'react';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Button from 'components/Button';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { useTranslation } from 'react-i18next';
import PaginationRange, {
  Props as PaginationRangeProps,
} from 'components/PaginationRange';
import { Props as PageNumberPaginationProps } from 'components/PageNumberPagination';

interface Props extends PageNumberPaginationProps, PaginationRangeProps {
  showActions?: boolean;
  disableActions?: boolean;
  totalRows: number;
  handleRemoveDataChannels: () => void;
}

const TableActionsAndPagination = ({
  showActions,
  disableActions,
  totalRows,
  pageIndex,
  pageSize,
  handleRemoveDataChannels,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Box py="4px">
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={4}>
          {showActions ? (
            <Button
              variant="text"
              startIcon={<DeleteIcon />}
              disabled={disableActions}
              onClick={handleRemoveDataChannels}
            >
              {t('ui.common.deleteselected', 'Delete Selected')}
            </Button>
          ) : (
            <Hidden smDown>&nbsp;</Hidden>
          )}
        </Grid>
        <Grid item xs={4}>
          <Box textAlign="center">
            <PaginationRange
              totalRows={totalRows}
              pageIndex={pageIndex}
              pageSize={pageSize}
              align="inherit"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TableActionsAndPagination;
