import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { EvolveFavourite } from 'api/admin/api';
import opsRoutes from 'apps/ops/routes';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
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
  font-size: ${(props) => props.theme.custom.fontSize.commonFontSize};
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

  const mainTitle = t('ui.favourite.deleteFavourite', 'Delete Favourite');
  const confirmationButtonText = t('ui.common.delete', 'Delete');

  return (
    <UpdatedConfirmationDialog
      open={open}
      maxWidth="xs"
      disableBackdropClick
      disableEscapeKeyDown
      mainTitle={mainTitle}
      content={
        <Box p={2} pb={0}>
          <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12}>
              <StyledTypography>
                {t(
                  'ui.favourite.areYouSureYouWantToRemoveTheFavourite',
                  'Are you sure you want to remove "{{favouriteName}}" from your Favourites?',
                  { favouriteName: favourite.description }
                )}
              </StyledTypography>
            </Grid>
          </Grid>
        </Box>
      }
      confirmationButtonText={confirmationButtonText}
      closeDialog={handleClose}
      onConfirm={handleDelete}
      isDisabled={isFetching}
      isError={error}
    />
  );
};

export default DeleteFavouriteDialog;
