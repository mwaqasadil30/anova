import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  AssetListFilterOptions,
  AssetSummaryGroupingOptions,
  DataChannelType,
  EvolveFavourite,
  ListSortDirection,
  SaveResultType,
} from 'api/admin/api';
import Button from 'components/Button';
import CloseIconButton from 'components/buttons/CloseIconButton';
import DialogTitle from 'components/dialog/DialogTitle';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import { Field, Formik, FormikHelpers } from 'formik';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFetchedFavouritesOn,
  setOpsNavigationItem,
} from 'redux-app/modules/app/actions';
import {
  selectActiveDomain,
  selectOpsNavigationData,
} from 'redux-app/modules/app/selectors';
import { selectUserId } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { OpsNavItemType } from 'types';
import { formatValidationErrors } from 'utils/format/errors';
import { fieldIsRequired, fieldMaxLength } from 'utils/forms/errors';
import * as Yup from 'yup';
import { useSaveFavourite } from '../../hooks/useSaveFavouriteApi';

const StyledCloseIconButton = styled(CloseIconButton)`
  position: absolute;
  top: 16px;
  right: 16px;
`;

interface Values {
  description?: string | null;
  isDefaultFavorite: boolean;
}

const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  return Yup.object().shape({
    description: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.descriptionText))
      .required(fieldIsRequired(t, translationTexts.descriptionText))
      .max(256, fieldMaxLength(t)),
  });
};

interface FilterProps {
  filterBy?: AssetListFilterOptions;
  filterText?: string | null;
  groupByColumn?: AssetSummaryGroupingOptions;
  groupBySortDirection?: ListSortDirection;
  displayUnit?: any;
  dataChannelTypes?: DataChannelType[] | null;
  inventoryStates?: string[] | null;
  sortColumnName?: string | null;
  sortDirection?: ListSortDirection;
  assetSearchExpression?: string | null;
  navigationDomainId?: string | null;
}

interface FavouriteEditorDialogProps extends FilterProps {
  open: boolean;
  hasError?: boolean;
  favourite: EvolveFavourite | null;
  handleClose: () => void;
}

const FavouriteEditorDialog = ({
  open,
  favourite,
  handleClose,
  // filters
  filterBy,
  filterText,
  groupByColumn,
  groupBySortDirection,
  displayUnit,
  dataChannelTypes,
  inventoryStates,
  sortColumnName,
  sortDirection,
  assetSearchExpression,
  navigationDomainId,
}: FavouriteEditorDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const activeDomain = useSelector(selectActiveDomain);
  const activeUserId = useSelector(selectUserId);
  const opsNavData = useSelector(selectOpsNavigationData);

  const { saveFavourite, isFetching, error } = useSaveFavourite();

  const isCreating = !favourite;

  const descriptionText = t('ui.common.name', 'Name');

  const validationSchema = buildValidationSchema(t, {
    descriptionText,
  });

  const handleSave = (values: Values, formikBag: FormikHelpers<Values>) => {
    const editingFavouriteObject = {
      ...favourite,
      ...values,
      domainId: activeDomain?.domainId,
      userId: activeUserId,
      filterBy,
      filterText,
      groupBy: groupByColumn,
      groupBySortDirection,
      displayUnit,
      dataChannelTypes,
      inventoryStates,
      sortColumnName,
      sortDirection,
      assetSearchExpression,
      navigationDomainId,
      ...(isCreating && {
        favouriteId: 0,
      }),
    } as EvolveFavourite;

    return saveFavourite(editingFavouriteObject)
      .then((saveResult) => {
        const validationErrors = saveResult?.editObject?.validationErrors;
        const formattedValidationErrors = formatValidationErrors(
          validationErrors
        );

        // Handle any errors from the back-end
        if (
          formattedValidationErrors &&
          Object.keys(formattedValidationErrors).length > 0
        ) {
          formikBag.setErrors(formattedValidationErrors);
          return;
        }

        if (saveResult?.result === SaveResultType.Success) {
          // Re-fetch favourites after a successful save
          dispatch(setFetchedFavouritesOn());

          // Update the current ops nav item after creating a new favourite, or
          // after editing the current active favourite (if a favourite is
          // selected)
          const savedFavouriteId = saveResult.editObject?.favouriteId;
          const isEditingCurrentFavourite =
            opsNavData?.type === OpsNavItemType.Favourite &&
            opsNavData.item.favouriteId === savedFavouriteId;
          if (isCreating || isEditingCurrentFavourite) {
            dispatch(
              setOpsNavigationItem(
                EvolveFavourite.fromJS({
                  ...editingFavouriteObject,
                  favouriteId: savedFavouriteId,
                })
              )
            );
          }

          handleClose();
        }
      })
      .catch();
  };

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
      <Box m={3}>
        <StyledCloseIconButton onClick={handleClose} />
        <Formik
          initialValues={
            {
              description: favourite?.description,
              isDefaultFavorite: favourite?.isDefaultFavorite || false,
            } as Values
          }
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ isSubmitting, submitForm }) => {
            return (
              <Box p={2} pb={0}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justify="center"
                >
                  <Grid item xs={12}>
                    {opsNavData?.type === OpsNavItemType.Favourite ? (
                      <DialogTitle align="center">
                        {t('ui.main.editFavourite', 'Edit Favourite')}
                      </DialogTitle>
                    ) : (
                      <DialogTitle align="center">
                        {t('ui.main.addfavourite', 'Add Favourite')}
                      </DialogTitle>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="description-input"
                      component={CustomTextField}
                      required
                      name="description"
                      label={t('ui.common.name', 'Name')}
                      initialValues
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      component={CheckboxWithLabel}
                      id="isDefaultFavorite-input"
                      name="isDefaultFavorite"
                      type="checkbox"
                      Label={{
                        label: t('ui.favourite.setAsDefault', 'Set as default'),
                      }}
                    />
                  </Grid>

                  {!isFetching && error && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="error">
                        {t('ui.common.failedToSave', 'Failed to save')}
                      </Typography>
                    </Grid>
                  )}

                  <Grid item>
                    <DialogActions>
                      <Button
                        variant="outlined"
                        onClick={handleClose}
                        disabled={isSubmitting}
                      >
                        {t('ui.common.cancel', 'Cancel')}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={submitForm}
                        disabled={isSubmitting}
                      >
                        {t('ui.common.save', 'Save')}
                      </Button>
                    </DialogActions>
                  </Grid>
                </Grid>
              </Box>
            );
          }}
        </Formik>
      </Box>
    </Dialog>
  );
};

export default FavouriteEditorDialog;
