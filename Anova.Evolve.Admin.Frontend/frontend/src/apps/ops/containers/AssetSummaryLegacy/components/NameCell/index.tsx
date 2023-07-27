import MuiLink from '@material-ui/core/Link';
import { AssetSummaryModel, UserPermissionType } from 'api/admin/api';
import opsRoutes from 'apps/ops/routes';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, Link } from 'react-router-dom';
import { Cell } from 'react-table';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';

const StyledBoldPrimaryText = styled(BoldPrimaryText)<{
  $isGroupedRow?: boolean;
  $isRegularCell?: boolean;
}>`
  ${(props) =>
    props.$isGroupedRow &&
    `
  && {
    font-weight: 600;
  };
  `}

  ${(props) =>
    props.$isRegularCell &&
    `
    && {
      font-weight: 400
    }
  `}
`;

interface NameCellProps extends Cell<AssetSummaryModel> {
  onClick?: (assetId?: string) => void;
  isGroupedRow?: boolean;
  isRegularCell?: boolean;
}

const NameCell = ({
  row,
  value,
  onClick,
  isGroupedRow,
  isRegularCell,
}: NameCellProps) => {
  const { t } = useTranslation();
  const groupedRowsAssetId = row.subRows[0]?.original.assetId;
  const ungroupedRowsAssetId = row.original?.assetId;

  const hasPermission = useSelector(selectHasPermission);
  const canViewAssetDetails = hasPermission(
    UserPermissionType.ViewTabAssetSummary
  );

  const assetId = groupedRowsAssetId || ungroupedRowsAssetId;

  const textContent = value || <em>{t('ui.common.none', 'None')}</em>;

  if (!canViewAssetDetails) {
    return textContent;
  }

  return (
    <StyledBoldPrimaryText
      variant="body2"
      display="inline"
      $isGroupedRow={isGroupedRow}
      $isRegularCell={isRegularCell}
    >
      <MuiLink
        component={Link}
        to={generatePath(opsRoutes.assetSummary.detail, {
          assetId,
        })}
        onClick={() => onClick?.(assetId)}
        color="inherit"
        underline="none"
      >
        {textContent}
      </MuiLink>
    </StyledBoldPrimaryText>
  );
};

export default NameCell;
