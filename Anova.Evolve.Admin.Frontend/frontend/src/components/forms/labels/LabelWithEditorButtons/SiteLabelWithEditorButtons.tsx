import { UserPermissionType } from 'api/admin/api';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import LabelWithEditorButtons from './index';
import { LabelWithEditorButtonsHelperProps } from './types';

const SiteLabelWithEditorButtons = (
  props: LabelWithEditorButtonsHelperProps
) => {
  const { t } = useTranslation();
  const hasPermission = useSelector(selectHasPermission);
  const canCreateSite = hasPermission(
    UserPermissionType.SiteGlobal,
    AccessType.Create
  );
  const canUpdateSite = hasPermission(
    UserPermissionType.SiteGlobal,
    AccessType.Update
  );

  return (
    <LabelWithEditorButtons
      label={t('ui.common.site', 'Site')}
      showAddButton={canCreateSite}
      showEditButton={canUpdateSite}
      {...props}
    />
  );
};

export default SiteLabelWithEditorButtons;
