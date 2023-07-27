import React from 'react';
import MuiLink from '@material-ui/core/Link';
import { DomainInfoRecord } from 'api/admin/api';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import { generatePath, Link } from 'react-router-dom';
import { Cell } from 'react-table';
import routes, { DomainId } from 'apps/admin/routes';
import styled from 'styled-components';

const PaddedValue = styled('span')`
  padding-left: ${({ size }: { size: number }) => 25 * size}px;
`;

const StyledMuiLink = styled(MuiLink)`
  color: ${(props) => props.theme.palette.text.primary};
`;

const NameCell = ({ value, row }: Cell<DomainInfoRecord>) => {
  return (
    <BoldPrimaryText variant="body2">
      <StyledMuiLink
        // @ts-ignore
        component={Link}
        to={generatePath(routes.domainManager.edit, {
          [DomainId]: row.original.domainId,
        })}
        underline="none"
      >
        <PaddedValue size={row.original.domainLevel || 0}>{value}</PaddedValue>
      </StyledMuiLink>
    </BoldPrimaryText>
  );
};

export default NameCell;
