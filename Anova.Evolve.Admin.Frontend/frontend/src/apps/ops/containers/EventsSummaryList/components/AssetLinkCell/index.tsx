import MuiLink from '@material-ui/core/Link';
import { DomainEventsDto, EventInfoRecord } from 'api/admin/api';
import routes from 'apps/ops/routes';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import React from 'react';
import { generatePath, Link } from 'react-router-dom';
import { Cell } from 'react-table';
import styled from 'styled-components';
import { columnIdToAriaLabel, getColumnWidth } from '../../helpers';

const StyledBoldDarkText = styled(BoldPrimaryText)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

interface AssetLinkCellProps extends Cell<EventInfoRecord | DomainEventsDto> {
  onClick?: () => void;
}

const AssetLinkCell = ({ value, row, column, onClick }: AssetLinkCellProps) => {
  const ariaLabel = columnIdToAriaLabel(column.id);

  return (
    <StyledBoldDarkText
      variant="body2"
      {...(ariaLabel && { 'aria-label': ariaLabel })}
      style={{ width: getColumnWidth(column.id) }}
    >
      <MuiLink
        component={Link}
        to={generatePath(routes.assetSummary.detail, {
          assetId: row.original.assetId!,
        })}
        onClick={onClick}
        color="inherit"
        underline="always"
      >
        {value}
      </MuiLink>
    </StyledBoldDarkText>
  );
};

export default AssetLinkCell;
