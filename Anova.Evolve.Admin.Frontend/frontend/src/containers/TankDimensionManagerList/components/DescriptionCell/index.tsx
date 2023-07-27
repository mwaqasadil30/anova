import React from 'react';
import MuiLink from '@material-ui/core/Link';
import { TankDimensionInfoRecord } from 'api/admin/api';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import { generatePath, Link } from 'react-router-dom';
import { Cell } from 'react-table';
import routes from 'apps/admin/routes';

const DescriptionCell = ({ value, row }: Cell<TankDimensionInfoRecord>) => {
  return (
    <BoldPrimaryText variant="body2" aria-label="Description">
      <MuiLink
        component={Link}
        to={generatePath(routes.tankDimensionManager.edit, {
          tankDimensionId: row.original.tankDimensionId,
        })}
        color="inherit"
        underline="none"
      >
        {value}
      </MuiLink>
    </BoldPrimaryText>
  );
};

export default DescriptionCell;
