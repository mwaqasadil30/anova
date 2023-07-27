import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import {
  AssetListFilterOptions,
  AssetSummaryGroupingOptions,
  DataChannelType,
  EvolveFavourite,
  ListSortDirection,
  SaveResultType,
} from 'api/admin/api';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
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
import { OpsNavItemType } from 'types';
import { formatValidationErrors } from 'utils/format/errors';
import { fieldIsRequired, fieldMaxLength } from 'utils/forms/errors';
import * as Yup from 'yup';
import { useSaveFavourite } from '../../hooks/useSaveFavouriteApi';

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

  const mainTitle =
    opsNavData?.type === OpsNavItemType.Favourite
      ? t('ui.main.editFavourite', 'Edit Favourite')
      : t('ui.main.addfavourite', 'Add Favourite');
  const confirmationButtonText = t('ui.common.save', 'Save');

  return (
    <Formik
      initialValues={
        {
          description: favourite?.description,
          isDefaultFavorite: favourite?.isDefaultFavorite || false,
        } as Values
      }
      validationSchema={validationSchema}
      onSubmit={handleSave}
      enableReinitialize
    >
      {({ submitForm, isSubmitting }) => {
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
                  alignItems="center"
                  justify="center"
                >
                  <Grid item xs={12}>
                    <Field
                      id="description-input"
                      name="description"
                      component={CustomTextField}
                      required
                      label={t('ui.common.name', 'Name')}
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
                </Grid>
              </Box>
            }
            confirmationButtonText={confirmationButtonText}
            closeDialog={handleClose}
            onConfirm={submitForm}
            isDisabled={isFetching || isSubmitting}
            isError={!!error.length}
          />
        );
      }}
    </Formik>
  );
};

export default FavouriteEditorDialog;
