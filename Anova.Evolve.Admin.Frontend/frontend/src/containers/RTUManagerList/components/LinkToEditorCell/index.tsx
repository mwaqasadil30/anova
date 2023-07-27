import React from 'react';
import { useTranslation } from 'react-i18next';
import MuiLink from '@material-ui/core/Link';
import { RTUInfoRecord } from 'api/admin/api';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import { generatePath, Link } from 'react-router-dom';
import { Cell } from 'react-table';
import routes from 'apps/admin/routes';

const LinkToEditorCell = ({ value, row }: Cell<RTUInfoRecord>) => {
  const { t } = useTranslation();
  return (
    <BoldPrimaryText variant="body2">
      <MuiLink
        color="inherit"
        underline="none"
        {...(row?.original?.rtuId && {
          component: Link,
          to: generatePath(routes.rtuManager.edit, {
            rtuId: row.original.rtuId,
          }),
        })}
      >
        {value || <em>{t('ui.common.none', 'None')}</em>}
      </MuiLink>
    </BoldPrimaryText>
  );
};

export default LinkToEditorCell;
