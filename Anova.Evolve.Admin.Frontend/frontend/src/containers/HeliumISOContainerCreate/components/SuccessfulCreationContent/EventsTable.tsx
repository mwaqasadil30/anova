import Box from '@material-ui/core/Box';
import { TableProps as MuiTableProps } from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import { HeliumISODataChannel } from 'api/admin/api';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableCell from 'components/tables/components/TableCell';
import TableContainer from 'components/tables/components/TableContainer';
import TableGroupedRow from 'components/tables/components/TableGroupedRow';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { buildImportanceLevelTextMapping } from 'utils/i18n/enum-to-text';
import EventRuleRow from './EventRuleRow';

const StyledTableHeadCell = styled(TableHeadCell)`
  padding: 7px 16px;
`;

const StyledTableCell = styled(TableCell)`
  color: ${(props) => props.theme.palette.text.primary};
  font-size: 14px;
`;

const DataChannelDescriptionTableCell = styled(StyledTableCell)`
  font-weight: 600;
`;

interface Props {
  dataChannels?: HeliumISODataChannel[];
  eventRules?: HeliumISODataChannel['eventRules'] | null;
  TableProps: MuiTableProps;
}

const EventsTable = ({ dataChannels, eventRules, TableProps }: Props) => {
  const { t } = useTranslation();

  const importanceLevelTextMapping = buildImportanceLevelTextMapping(t);
  const shouldShowDataChannels = dataChannels !== undefined;

  return (
    <TableContainer>
      <Box
        component={Table}
        minWidth={500}
        aria-label="Helium Events table"
        {...TableProps}
      >
        <TableHead>
          <TableRow>
            <StyledTableHeadCell>
              {t('ui.common.description', 'Description')}
            </StyledTableHeadCell>
            <StyledTableHeadCell>
              {t('ui.common.enabled', 'Enabled')}
            </StyledTableHeadCell>
            <StyledTableHeadCell>
              {t('ui.events.importance', 'Importance')}
            </StyledTableHeadCell>
            <StyledTableHeadCell>
              {t('ui.datachannel.expression', 'Expression')}
            </StyledTableHeadCell>
            <StyledTableHeadCell>
              {t('ui.main.roster', 'Roster')}
            </StyledTableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shouldShowDataChannels ? (
            !dataChannels?.length ? (
              <TableRow>
                <StyledTableCell colSpan={5}>
                  {t('ui.datachannel.empty', 'No Data Channels found')}
                </StyledTableCell>
              </TableRow>
            ) : (
              dataChannels?.map((channel) => (
                <>
                  <TableGroupedRow>
                    <DataChannelDescriptionTableCell
                      colSpan={5}
                      role="rowgroup"
                      dense
                    >
                      {channel.description}
                    </DataChannelDescriptionTableCell>
                  </TableGroupedRow>
                  {!channel.eventRules?.length ? (
                    <TableRow>
                      <StyledTableCell colSpan={5}>
                        {t('ui.eventRules.empty', 'No Event Rules found')}
                      </StyledTableCell>
                    </TableRow>
                  ) : (
                    channel.eventRules?.map((event) => (
                      <EventRuleRow
                        event={event}
                        importanceLevelTextMapping={importanceLevelTextMapping}
                      />
                    ))
                  )}
                </>
              ))
            )
          ) : !eventRules?.length ? (
            <TableRow>
              <StyledTableCell colSpan={5}>
                {t('ui.eventRules.empty', 'No Event Rules found')}
              </StyledTableCell>
            </TableRow>
          ) : (
            eventRules?.map((event) => (
              <EventRuleRow
                event={event}
                importanceLevelTextMapping={importanceLevelTextMapping}
              />
            ))
          )}
        </TableBody>
      </Box>
    </TableContainer>
  );
};

export default EventsTable;
