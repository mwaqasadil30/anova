import Grid from '@material-ui/core/Grid';
import { EditAssetCustomPropertyItem, UserPermissionType } from 'api/admin/api';
import CustomPropertyField from 'components/forms/form-fields/CustomPropertyField';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';

interface Props {
  isSubmitting?: boolean;
  customProperties?: EditAssetCustomPropertyItem[] | null;
  fieldNamePrefix?: string;
}

const CustomProperties = ({
  customProperties,
  fieldNamePrefix,
  isSubmitting,
}: Props) => {
  const hasPermission = useSelector(selectHasPermission);

  const canUpdateCustomProperties = hasPermission(
    UserPermissionType.AssetCustomProperties,
    AccessType.Update
  );

  const fieldNameWithDefaultPrefix = fieldNamePrefix || 'customProperties';
  return (
    <Grid container spacing={3} alignItems="center">
      {customProperties?.map((customProperty, index) => (
        <Grid item xs={12} md={6} key={index}>
          <CustomPropertyField
            property={customProperty}
            name={`${fieldNameWithDefaultPrefix}[${index}].value`}
            disabled={!canUpdateCustomProperties || isSubmitting}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default CustomProperties;
