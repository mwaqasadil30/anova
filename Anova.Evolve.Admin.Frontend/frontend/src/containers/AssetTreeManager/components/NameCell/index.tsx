import styled from 'styled-components';
import MuiLink from '@material-ui/core/Link';
import { AssetTreeInfoRecord } from 'api/admin/api';
import routes from 'apps/admin/routes';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import React from 'react';
import { generatePath, Link } from 'react-router-dom';
import { Cell } from 'react-table';

const StyledMuiLink = styled(MuiLink)`
  color: ${(props) => props.theme.palette.text.primary};
`;

const NameCell = ({ value, row }: Cell<AssetTreeInfoRecord>) => {
  return (
    <BoldPrimaryText variant="body2" aria-label="Name">
      <StyledMuiLink
        // @ts-ignore
        component={Link}
        to={generatePath(routes.assetTreeManager.edit, {
          assetTreeId: row.original.assetTreeId,
        })}
        underline="none"
      >
        {value}
      </StyledMuiLink>
    </BoldPrimaryText>
  );
};

export default NameCell;
