import React from 'react';
import MuiLink from '@material-ui/core/Link';
import { ProductRecord } from 'api/admin/api';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import { generatePath, Link } from 'react-router-dom';
import { Cell } from 'react-table';
import routes from 'apps/admin/routes';

const NameCell = ({ value, row }: Cell<ProductRecord>) => {
  return (
    <BoldPrimaryText variant="body2" aria-label="Name">
      <MuiLink
        component={Link}
        to={generatePath(routes.productManager.edit, {
          productId: row.original.productId,
        })}
        color="inherit"
        underline="none"
      >
        {value}
      </MuiLink>
    </BoldPrimaryText>
  );
};

export default NameCell;
