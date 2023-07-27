import { UserPermissionType } from 'api/admin/api';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import LabelWithEditorButtons from './index';
import { LabelWithEditorButtonsHelperProps } from './types';

const TankDimensionLabelWithEditorButtons = (
  props: LabelWithEditorButtonsHelperProps
) => {
  const { t } = useTranslation();
  const hasPermission = useSelector(selectHasPermission);
  const canCreate = hasPermission(
    UserPermissionType.TankDimensionAccess,
    AccessType.Create
  );
  const canUpdate = hasPermission(
    UserPermissionType.TankDimensionAccess,
    AccessType.Update
  );

  const { hideLabelText } = props;

  return (
    <LabelWithEditorButtons
      label={
        hideLabelText ? ' ' : t('ui.common.tankdimension', 'Tank Dimension')
      }
      showAddButton={canCreate}
      showEditButton={canUpdate}
      {...props}
    />
  );
};

export default TankDimensionLabelWithEditorButtons;
