import { UserPermissionType } from 'api/admin/api';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import LabelWithEditorButtons from './index';
import { LabelWithEditorButtonsHelperProps } from './types';

const ProductLabelWithEditorButtons = (
  props: LabelWithEditorButtonsHelperProps
) => {
  const { t } = useTranslation();
  const hasPermission = useSelector(selectHasPermission);
  const canCreateProduct = hasPermission(
    UserPermissionType.ProductAccess,
    AccessType.Create
  );
  const canUpdateProduct = hasPermission(
    UserPermissionType.ProductAccess,
    AccessType.Update
  );

  const { hideLabelText } = props;

  return (
    <LabelWithEditorButtons
      label={hideLabelText ? ' ' : t('ui.common.product', 'Product')}
      showAddButton={canCreateProduct}
      showEditButton={canUpdateProduct}
      {...props}
    />
  );
};

export default ProductLabelWithEditorButtons;
