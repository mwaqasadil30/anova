/* eslint-disable indent */
import Typography from '@material-ui/core/Typography';
import { EventStatusType, RtuPacketDTO } from 'api/admin/api';
import FormatDateTime from 'components/FormatDateTime';
import GenericDataTable from 'components/GenericDataTable';
import { isRecordDisabled } from 'containers/RTUManagerList/helpers';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import styled from 'styled-components';
import {
  buildCommunicationMethodGroupTextMapping,
  buildPacketStatusTextMapping,
  buildPacketTypeTextMapping,
} from 'utils/i18n/enum-to-text';
import { caseInsensitive, sortNullableDates } from 'utils/tables';
import {
  columnIdToAriaLabel,
  getColumnWidth,
  PacketColumnId,
} from '../../helpers';

const MonospacedTypography = styled(Typography)`
  font-family: Monospace;
  font-size: 14px;
`;

interface Props {
  initialSortByColumnId: any;
  initialSortByColumnIsDescending: any;
  isCellDisabled: boolean;
  records: RtuPacketDTO[];
  selectedEventStatus: EventStatusType;
  pageIndex: number;
  pageSize: number;
}

const PacketsTable = ({
  initialSortByColumnId,
  initialSortByColumnIsDescending,
  records,
  pageIndex,
  pageSize,
}: Props) => {
  const { t } = useTranslation();

  const communicationMethodGroupTextMapping = buildCommunicationMethodGroupTextMapping(
    t
  );

  const packetTypeTextMapping = buildPacketTypeTextMapping(t);

  const packetStatusTextMapping = buildPacketStatusTextMapping(t);

  const columns: Column<RtuPacketDTO>[] = React.useMemo(
    () => [
      {
        id: PacketColumnId.DeviceId,
        Header: t('ui.common.rtu', 'RTU') as string,
        accessor: PacketColumnId.DeviceId,
      },
      {
        id: PacketColumnId.ChannelNumber,
        Header: t('ui.common.channel', 'Channel') as string,
        accessor: PacketColumnId.ChannelNumber,
      },
      {
        id: PacketColumnId.CommunicationMethod,
        Header: t('ui.packetretrieval.method', 'Method') as string,
        accessor: (row: RtuPacketDTO) => {
          if (row.communicationMethod) {
            return communicationMethodGroupTextMapping[row.communicationMethod];
          }
          return '';
        },
      },
      {
        id: PacketColumnId.Address,
        Header: t('ui.common.address', 'Address') as string,
        accessor: PacketColumnId.Address,
      },
      {
        id: PacketColumnId.ServerTimestamp,
        Header: t(
          'ui.packetretrieval.datesentrcvdbydol',
          'Date Sent/Rcvd by DOL'
        ) as string,
        accessor: PacketColumnId.ServerTimestamp,
        Cell: (cell) => {
          return <FormatDateTime date={cell.value} />;
        },
        sortType: sortNullableDates,
        sortDescFirst: true,
      },
      {
        id: PacketColumnId.RtuTimestamp,
        Header: t(
          'ui.packetretrieval.datesentbyrtu',
          'Date Sent by RTU'
        ) as string,
        accessor: PacketColumnId.RtuTimestamp,
        Cell: (cell) => {
          return <FormatDateTime date={cell.value} />;
        },
        sortType: sortNullableDates,
        sortDescFirst: true,
      },
      {
        id: PacketColumnId.PacketId,
        Header: t('ui.rturequest.packetid', 'Packet Id') as string,
        accessor: PacketColumnId.PacketId,
      },
      {
        id: PacketColumnId.PacketType,
        Header: t('ui.packetretrieval.packettype', 'Packet Type') as string,
        accessor: (row: RtuPacketDTO) => {
          if (row.packetType) {
            return packetTypeTextMapping[row.packetType];
          }
          return '';
        },
      },
      {
        id: PacketColumnId.SequenceNumber,
        Header: t(
          'ui.packetretrieval.sequencenumber',
          'Sequence Number'
        ) as string,
        accessor: PacketColumnId.SequenceNumber,
        sortType: 'number',
      },
      {
        id: PacketColumnId.ProcessState,
        Header: t('ui.packetretrieval.processstate', 'Process State') as string,
        accessor: (row: RtuPacketDTO) => {
          if (row.processState) {
            return packetStatusTextMapping[row.processState];
          }
          return '';
        },
      },
      {
        id: PacketColumnId.Payload,
        Header: t('ui.packetretrieval.originalhex', 'Original Hex') as string,
        accessor: PacketColumnId.Payload,
        Cell: (cell) => {
          return <MonospacedTypography>{cell.value}</MonospacedTypography>;
        },
      },
      {
        id: PacketColumnId.AdditionalInformation,
        Header: t(
          'ui.packetretrieval.additionalinformation',
          'Additional Information'
        ) as string,
        accessor: PacketColumnId.AdditionalInformation,
        Cell: (cell) => {
          return <MonospacedTypography>{cell.value}</MonospacedTypography>;
        },
      },
    ],
    [t, records]
  );

  const tableInstance = useTable<RtuPacketDTO>(
    {
      initialState: {
        sortBy: [
          initialSortByColumnId
            ? {
                id: initialSortByColumnId,
                desc: initialSortByColumnIsDescending,
              }
            : {
                id: PacketColumnId.ServerTimestamp,
                desc: true,
              },
        ],
        pageSize,
        pageIndex,
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
    usePagination,
    useRowSelect
  );

  return (
    <GenericDataTable<RtuPacketDTO>
      tableInstance={tableInstance}
      disableActions
      tableAriaLabelText="rtu packets table"
      isRecordDisabled={isRecordDisabled}
      columnIdToAriaLabel={columnIdToAriaLabel}
      getColumnWidth={getColumnWidth}
      handleRowClick={() => {}}
    />
  );
};

export default PacketsTable;
