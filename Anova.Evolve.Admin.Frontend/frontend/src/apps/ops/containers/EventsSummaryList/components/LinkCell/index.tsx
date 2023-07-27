import React from 'react';
import MuiLink from '@material-ui/core/Link';
import { EventInfoRecord } from 'api/admin/api';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import { generatePath, Link } from 'react-router-dom';
import { Cell } from 'react-table';
import routes from 'apps/ops/routes';

const getAriaLabelByColumnId = (id: string) => {
  switch (id) {
    case 'message':
      return 'Message';
    default:
      return '';
  }
};

const LinkCell = ({ value, row, column }: Cell<EventInfoRecord>) => {
  const ariaLabel = getAriaLabelByColumnId(column.id);

  return (
    <BoldPrimaryText
      variant="body2"
      {...(ariaLabel && { 'aria-label': ariaLabel })}
    >
      <MuiLink
        component={Link}
        to={generatePath(routes.events.detail, {
          eventId: row.original.eventId,
        })}
        color="inherit"
        underline="none"
      >
        {value}
      </MuiLink>
    </BoldPrimaryText>
  );
};

export default LinkCell;
