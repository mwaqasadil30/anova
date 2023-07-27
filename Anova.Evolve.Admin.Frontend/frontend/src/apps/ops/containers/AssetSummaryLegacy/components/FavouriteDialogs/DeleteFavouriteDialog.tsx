import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { EvolveFavourite } from 'api/admin/api';
import opsRoutes from 'apps/ops/routes';
import Button from 'components/Button';
import DialogTitle from 'components/dialog/DialogTitle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  setFetchedFavouritesOn,
  setOpsNavigationItem,
} from 'redux-app/modules/app/actions';
import { selectOpsNavigationData } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { OpsNavItemType } from 'types';
import { useDeleteFavourite } from '../../hooks/useDeleteFavouriteApi';

const StyledTypography = styled(Typography)`
  font-size: 14px;
`;

export interface DeleteFavouriteDialogProps {
  open: boolean;
  favourite: EvolveFavourite;
  handleClose: () => void;
}

const DeleteFavouriteDialog = ({
  open,
  favourite,
  handleClose,
}: DeleteFavouriteDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const opsNavData = useSelector(selectOpsNavigationData);

  const selectedFavouriteId = favourite.favouriteId;

  const { deleteFavourite, error, isFetching } = useDeleteFavourite();

  const handleDelete = () => {
    deleteFavourite(selectedFavouriteId!).then((wasDeleted) => {
      if (wasDeleted) {
        // Re-fetch favourites after a successful deletion
        dispatch(setFetchedFavouritesOn());

        // Clear the ops nav item if the current ops nav item is the favourite
        // that was deleted
        if (
          opsNavData?.type === OpsNavItemType.Favourite &&
          opsNavData.item.favouriteId === selectedFavouriteId
        ) {
          // NOTE: We clear the route state here before clearing the favourite
          // because the route state takes priority over the favourite state.
          // This was causing issues where deleting a favourite would not
          // reset the filters.
          history.push(opsRoutes.assetSummary.list);
          dispatch(setOpsNavigationItem(null));
        }

        // Close the dialog
        handleClose();
      }
    });
  };

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
      <Box m={3}>
        <Box p={2} pb={0}>
          <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12}>
              <DialogTitle>
                {t('ui.favourite.deleteFavourite', 'Delete Favourite')}
              </DialogTitle>
            </Grid>
            <Grid item xs={12}>
              <StyledTypography>
                {t(
                  'ui.favourite.areYouSureYouWantToRemoveTheFavourite',
                  'Are you sure you want to remove "{{favouriteName}}" from your Favourites?',
                  { favouriteName: favourite.description }
                )}
              </StyledTypography>
            </Grid>

            {!isFetching && error && (
              <Grid item xs={12}>
                <StyledTypography variant="body2" color="error">
                  {t('ui.common.failedToDelete', 'Failed to delete')}
                </StyledTypography>
              </Grid>
            )}

            <Grid item>
              <DialogActions>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  disabled={isFetching}
                >
                  {t('ui.common.cancel', 'Cancel')}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDelete}
                  disabled={isFetching}
                >
                  {t('ui.common.delete', 'Delete')}
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DeleteFavouriteDialog;
