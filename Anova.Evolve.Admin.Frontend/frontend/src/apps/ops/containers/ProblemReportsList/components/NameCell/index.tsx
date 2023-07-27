import MuiLink from '@material-ui/core/Link';
import { ProblemReport_SummaryDto, UserPermissionType } from 'api/admin/api';
import opsRoutes from 'apps/ops/routes';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, Link } from 'react-router-dom';
import { Cell } from 'react-table';
import { selectHasPermission } from 'redux-app/modules/user/selectors';

interface NameCellProps extends Cell<ProblemReport_SummaryDto> {
  onClick?: (assetId?: string) => void;
}

const NameCell = ({ row, value, onClick }: NameCellProps) => {
  const { t } = useTranslation();
  const assetId = row.original?.assetId;

  const hasPermission = useSelector(selectHasPermission);
  const canViewAssetDetails = hasPermission(
    UserPermissionType.ViewTabAssetSummary
  );

  const textContent = value || <em>{t('ui.common.none', 'None')}</em>;

  if (!canViewAssetDetails || !assetId) {
    return textContent;
  }

  return (
    <BoldPrimaryText variant="body2" display="inline">
      <MuiLink
        component={Link}
        to={generatePath(opsRoutes.assetSummary.detail, {
          assetId,
        })}
        onClick={() => onClick?.(assetId)}
        color="inherit"
        underline="always"
      >
        {textContent}
      </MuiLink>
    </BoldPrimaryText>
  );
};

export default NameCell;
