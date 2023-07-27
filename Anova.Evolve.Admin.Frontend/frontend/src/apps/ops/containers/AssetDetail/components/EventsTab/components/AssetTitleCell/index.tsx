import { EvolveAssetSummaryDto } from 'api/admin/api';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Cell } from 'react-table';
import styled from 'styled-components';
import { columnIdToAriaLabel, getColumnWidth } from '../../helpers';

const StyledBoldUnderlinedPrimaryText = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
  font-weight: 500;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-decoration: underline;
`;

const AssetTitleCell = ({ value, column }: Cell<EvolveAssetSummaryDto>) => {
  const ariaLabel = columnIdToAriaLabel(column.id);

  return (
    <StyledBoldUnderlinedPrimaryText
      variant="body2"
      {...(ariaLabel && { 'aria-label': ariaLabel })}
      style={{ width: getColumnWidth(column.id) }}
    >
      {value}
    </StyledBoldUnderlinedPrimaryText>
  );
};

export default AssetTitleCell;
