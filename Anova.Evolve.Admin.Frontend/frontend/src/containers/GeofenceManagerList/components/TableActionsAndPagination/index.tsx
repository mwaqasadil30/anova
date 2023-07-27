import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from 'components/Button';
import ItemCount from 'components/typography/ItemCount';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  shouldShowActions?: boolean;
  shouldDisableActions?: boolean;
  actions?: {
    deleteSelected?: () => void;
  };
  count: number;
}

const TableActionsAndPagination = ({
  shouldShowActions,
  shouldDisableActions,
  actions = {},
  count,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={4}>
        {shouldShowActions && (
          <Box>
            <Button
              variant="text"
              startIcon={<DeleteIcon />}
              onClick={actions.deleteSelected}
              disabled={shouldDisableActions}
              useDomainColorForIcon
            >
              {t('ui.common.deleteselected', 'Delete Selected')}
            </Button>
          </Box>
        )}
      </Grid>
      <Grid item xs={4}>
        <Box textAlign="center">
          <ItemCount count={count} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default TableActionsAndPagination;
