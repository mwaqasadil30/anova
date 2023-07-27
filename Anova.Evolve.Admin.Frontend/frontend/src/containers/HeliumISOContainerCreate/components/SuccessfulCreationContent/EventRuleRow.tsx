import TableRow from '@material-ui/core/TableRow';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import {
  EventImportanceLevelType,
  HeliumISODataChannelEventRules,
} from 'api/admin/api';
import TableCell from 'components/tables/components/TableCell';
import React from 'react';
import styled from 'styled-components';
import { checkmarkGreen, crossRed } from 'styles/colours';
import { eventComparatorTypeTextMapping } from 'utils/i18n/enum-to-text';

const CenteredTableCell = styled(TableCell)`
  text-align: center;
`;

const StyledCheckIcon = styled(CheckIcon)`
  color: ${checkmarkGreen};
  font-size: 20px;
  vertical-align: middle;
`;
const StyledClearIcon = styled(ClearIcon)`
  color: ${crossRed};
  font-size: 20px;
  vertical-align: middle;
`;

interface EventRuleRowProps {
  event: HeliumISODataChannelEventRules;
  importanceLevelTextMapping: Record<EventImportanceLevelType, string>;
}

const EventRuleRow = ({
  event,
  importanceLevelTextMapping,
}: EventRuleRowProps) => {
  const comparatorText = eventComparatorTypeTextMapping[event.eventComparator!];
  const value = event.eventValue;

  const expression = `${comparatorText} ${value}`;

  return (
    <TableRow key={event.dataChannelEventRuleId}>
      <TableCell>{event.description}</TableCell>
      <CenteredTableCell>
        {event.isEnabled ? <StyledCheckIcon /> : <StyledClearIcon />}
      </CenteredTableCell>
      <TableCell>
        {importanceLevelTextMapping[event.eventImportanceLevel!]}
      </TableCell>
      <TableCell>{!!event.eventComparator && expression}</TableCell>
      <TableCell>
        {event.rosters
          ?.map((roster) => roster.rosterName)
          .filter(Boolean)
          .join(', ')}
      </TableCell>
    </TableRow>
  );
};

export default EventRuleRow;
