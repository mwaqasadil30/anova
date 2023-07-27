import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import Button from 'components/Button';
import ItemCount from 'components/typography/ItemCount';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  showActions?: boolean;
  disableActions?: boolean;
  totalRows: number;
  actions?: {
    deleteSelected?: () => void;
  };
}

const TableActionsAndPagination = ({
  showActions,
  disableActions,
  totalRows,
  actions = {},
}: Props) => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={4}>
        <Box textAlign="left">
          {showActions ? (
            <Button
              variant="text"
              startIcon={<DeleteIcon />}
              disabled={disableActions}
              onClick={actions.deleteSelected}
            >
              {t('ui.common.deleteselected', 'Delete Selected')}
            </Button>
          ) : (
            <Hidden smDown>&nbsp;</Hidden>
          )}
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box textAlign="center">
          <ItemCount count={totalRows} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default TableActionsAndPagination;
