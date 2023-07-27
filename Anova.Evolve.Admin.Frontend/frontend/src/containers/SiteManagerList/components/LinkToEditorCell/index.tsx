import React from 'react';
import { useTranslation } from 'react-i18next';
import MuiLink from '@material-ui/core/Link';
import { SiteInfoRecord, UserPermissionType } from 'api/admin/api';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import { generatePath, Link } from 'react-router-dom';
import { Cell } from 'react-table';
import routes from 'apps/admin/routes';
import { useSelector } from 'react-redux';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';

const LinkToEditorCell = ({ value, row }: Cell<SiteInfoRecord>) => {
  const { t } = useTranslation();

  const hasPermission = useSelector(selectHasPermission);
  const canReadSite = hasPermission(
    UserPermissionType.SiteGlobal,
    AccessType.Read
  );

  const textContent = value || <em>{t('ui.common.none', 'None')}</em>;

  if (row.isGrouped || !canReadSite) {
    return textContent;
  }

  return (
    <BoldPrimaryText variant="body2">
      <MuiLink
        color="inherit"
        underline="none"
        {...(row?.original?.siteId && {
          component: Link,
          to: generatePath(routes.siteManager.edit, {
            siteId: row.original.siteId,
          }),
        })}
      >
        {textContent}
      </MuiLink>
    </BoldPrimaryText>
  );
};

export default LinkToEditorCell;
