import React from 'react';
import MuiLink from '@material-ui/core/Link';
import { RtuPollScheduleGroupInfoRecord } from 'api/admin/api';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import { generatePath, Link } from 'react-router-dom';
import { Cell } from 'react-table';
import routes from 'apps/admin/routes';

const NameCell = ({ value, row }: Cell<RtuPollScheduleGroupInfoRecord>) => {
  return (
    <BoldPrimaryText variant="body2" aria-label="Name">
      <MuiLink
        component={Link}
        to={generatePath(routes.pollScheduleManager.edit, {
          pollScheduleId: row.original.rtuPollScheduleGroupId,
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
