/* eslint-disable indent */
import { CallJournalRcmDto, EventStatusType } from 'api/admin/api';
import FormatDateTime from 'components/FormatDateTime';
import { StyledActionColumnText } from 'containers/RTUEditor/styles';
import { isRecordDisabled } from 'containers/RTUManagerList/helpers';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  useExpanded,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import { isNumber } from 'utils/format/numbers';
import {
  buildRtuProtocolTypeEnumTextMapping,
  buildRtuStatusTypeTextMapping,
  buildRtuTransportTypeEnumTextMapping,
} from 'utils/i18n/enum-to-text';
import { caseInsensitive, sortNullableDates } from 'utils/tables';
import {
  CallHistoryColumnId,
  columnIdToAriaLabel,
  getColumnWidth,
} from '../../helpers';
import GenericNestedDataTable from '../GenericNestedDataTable';

interface Props {
  isCellDisabled?: boolean;
  records: CallJournalRcmDto[];
  selectedEventStatus?: EventStatusType;
  pageIndex: number;
  pageSize: number;
}

const CallHistoryTable = ({ records }: Props) => {
  const { t } = useTranslation();

  const rtuStatusTypeTextMapping = buildRtuStatusTypeTextMapping(t);
  const rtuProtocolTypeEnumTextMapping = buildRtuProtocolTypeEnumTextMapping(t);
  const rtuTransportTypeEnumTextMapping = buildRtuTransportTypeEnumTextMapping(
    t
  );

  const columns: Column<CallJournalRcmDto>[] = React.useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }: any) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? (
              <StyledActionColumnText>-</StyledActionColumnText>
            ) : (
              <StyledActionColumnText>+</StyledActionColumnText>
            )}
          </span>
        ),
        // We can override the cell renderer with a SubCell to be used with an expanded row
        SubCell: () => null, // No expander on an expanded row
      },
      {
        id: CallHistoryColumnId.JournalStatus,
        Header: t(
          'enum.rcmcalljournallistfilteroptions.status',
          'Status'
        ) as string,
        accessor: CallHistoryColumnId.JournalStatus,
        Cell: (cell) => {
          const journalStatus = cell.value;

          if (journalStatus && isNumber(journalStatus)) {
            return rtuStatusTypeTextMapping[journalStatus];
          }
          return '';
        },
      },
      {
        id: CallHistoryColumnId.CreatedDate,
        Header: t('ui.common.created', 'Created') as string,
        accessor: CallHistoryColumnId.CreatedDate,
        Cell: (cell) => {
          return <FormatDateTime date={cell.value} />;
        },
        sortType: sortNullableDates,
        sortDescFirst: true,
      },
      {
        id: CallHistoryColumnId.ConnectTimestamp,
        Header: t(
          'ui.rcmcalljournal.timeofconnect',
          'Time of Connect'
        ) as string,
        accessor: CallHistoryColumnId.ConnectTimestamp,
        Cell: (cell) => {
          return <FormatDateTime date={cell.value} />;
        },
        sortType: sortNullableDates,
      },
      {
        id: CallHistoryColumnId.ErrorType,
        Header: t('ui.rcmcalljournal.errortype', 'Error Type') as string,
        accessor: CallHistoryColumnId.ErrorType,
        Cell: (cell) => {
          const errorType = cell.value;

          if (errorType) {
            return errorType;
          }
          return '';
        },
      },
      {
        id: CallHistoryColumnId.ErrorDescription,
        Header: t('ui.rcmcalljournal.errordetails', 'Error Details') as string,
        accessor: CallHistoryColumnId.ErrorDescription,
      },
      {
        id: CallHistoryColumnId.RtuProtocol,
        Header: t('ui.rcmcalljournal.protocol', 'Protocol') as string,
        accessor: CallHistoryColumnId.RtuProtocol,
        Cell: (cell) => {
          const rtuProtocolType = cell.value;

          if (rtuProtocolType && isNumber(rtuProtocolType)) {
            return rtuProtocolTypeEnumTextMapping[rtuProtocolType];
          }
          return '';
        },
      },
      {
        id: CallHistoryColumnId.Transport,
        Header: t('ui.rtu.transport', 'Transport') as string,
        accessor: CallHistoryColumnId.Transport,
        Cell: (cell) => {
          const rtuTransportType = cell.value;

          if (rtuTransportType && isNumber(rtuTransportType)) {
            return rtuTransportTypeEnumTextMapping[rtuTransportType];
          }
          return '';
        },
      },
      {
        id: CallHistoryColumnId.Direction,
        Header: t('ui.rtumodbus.direction', 'Direction') as string,
        accessor: CallHistoryColumnId.Direction,
        Cell: (cell) => {
          const isOutbound = cell.value; // also named: 'Direction"

          if (isOutbound) {
            return t('enum.commdirectiontype.outbound', 'Outbound');
          }
          return t('enum.commdirectiontype.inbound', 'Inbound');
        },
      },
      {
        id: CallHistoryColumnId.ByteCount,
        Header: t('ui.rcmcalljournal.bytecount', 'Byte Count') as string,
        accessor: CallHistoryColumnId.ByteCount,
        sortType: 'number',
      },
      {
        id: CallHistoryColumnId.RemoteAddress,
        Header: t(
          'ui.rcmcalljournal.remoteaddress',
          'Remote Address'
        ) as string,
        accessor: CallHistoryColumnId.RemoteAddress,
      },
      {
        id: CallHistoryColumnId.LocalAddress,
        Header: t('ui.rcmcalljournal.localaddress', 'Local Address') as string,
        accessor: CallHistoryColumnId.LocalAddress,
      },
      {
        id: CallHistoryColumnId.SessionServer,
        Header: t(
          'ui.rcmcalljournal.sessionserver',
          'Session Server'
        ) as string,
        accessor: CallHistoryColumnId.SessionServer,
        Cell: (cell) => {
          const sessionServer = cell.value;

          if (sessionServer) {
            return sessionServer;
          }
          return '';
        },
      },
    ],
    [t, records]
  );

  const tableInstance = useTable<CallJournalRcmDto>(
    {
      initialState: {
        sortBy: [
          {
            id: CallHistoryColumnId.CreatedDate,
            desc: true,
          },
        ],
        // Pagination
        pageSize: 100,
        pageIndex: 0,
      },
      columns,
      data: records,
      disableMultiSort: true,
      disableSortRemove: true,
      sortTypes: {
        alphanumeric: caseInsensitive,
      },
      // Pagination
      autoResetPage: true,
    },
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  return (
    <GenericNestedDataTable<CallJournalRcmDto>
      tableInstance={tableInstance}
      disableActions
      tableAriaLabelText="Call history table"
      isRecordDisabled={isRecordDisabled}
      columnIdToAriaLabel={columnIdToAriaLabel}
      getColumnWidth={getColumnWidth}
      handleRowClick={() => {}}
    />
  );
};

export default CallHistoryTable;
