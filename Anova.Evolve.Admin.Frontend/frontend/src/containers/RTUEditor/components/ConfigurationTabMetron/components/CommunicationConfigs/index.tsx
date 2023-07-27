import Grid from '@material-ui/core/Grid';
import GenericDataTable from 'components/GenericDataTable';
import React from 'react';
import { useTable, Column } from 'react-table';
import { useTranslation } from 'react-i18next';
import {
  buildCommunicationMethodGroupTextMapping,
  buildRtuTransportTypeEnumTextMapping,
  buildMetronRTUCommunicationDirectionTextMapping,
} from 'utils/i18n/enum-to-text';
import { MetronCommunicationConfigDTO } from 'api/admin/api';
import ContentGrids, { TableCellInfo } from '../../../common/ContentGrids';
import RemoteValueWithSyncMark from '../RemoteValueWithSyncMark';

type CommunicationConfigsProps = {
  information?: MetronCommunicationConfigDTO;
};
type CommunicationTableType = {
  parameter?: string | null;
  local?: string | null;
  remote?: JSX.Element | null;
};
const CommunicationConfigs = ({ information }: CommunicationConfigsProps) => {
  const { t } = useTranslation();
  const {
    transport,
    carrier,
    ipNetworkAddress,
    direction,
    outgoingSmsInterface,
    smsNetworkAddress,
    local,
    remote,
    inSync,
  } = information || {};

  const rtuTransportTypeEnumTextMapping = buildRtuTransportTypeEnumTextMapping(
    t
  );
  const communicationMethodGroupTextMapping = buildCommunicationMethodGroupTextMapping(
    t
  );

  const buildCommunicationDirectionTextMapping = buildMetronRTUCommunicationDirectionTextMapping(
    t
  );

  const dataByOrder: TableCellInfo[] = [
    {
      label: t('ui.rtu.transport', 'Transport'),
      value:
        transport || transport === 0
          ? rtuTransportTypeEnumTextMapping[transport]
          : '-',
    },
    {
      label: t('ui.rtu.direction', 'Direction'),
      value: direction
        ? buildCommunicationDirectionTextMapping[direction]
        : '-',
    },
    {
      label: t('ui.common.carrier', 'Carrier'),
      value:
        carrier || carrier === 0
          ? communicationMethodGroupTextMapping[carrier]
          : '-',
    },
    {
      label: t('ui.rtu.ipnetworkaddress', 'IP Network Address'),
      value: ipNetworkAddress,
    },
    {
      label: t('ui.rtu.outgoingSMSInterface', 'Outgoing SMS Interface'),
      value: outgoingSmsInterface, // todo: create enum with text mapping
    },
    {
      label: t('ui.rtu.smsNetworkAddress', 'SMS Network Address'),
      value: smsNetworkAddress,
    },
  ];
  const columns = React.useMemo<Column<CommunicationTableType>[]>(
    () => [
      {
        Header: t('ui.common.parameter', 'Parameter') as string,
        accessor: 'parameter',
      },
      {
        Header: t('ui.rtu.local', 'Local') as string,
        accessor: 'local',
      },
      {
        Header: t('ui.rtu.remote', 'Remote') as string,
        accessor: 'remote',
      },
    ],
    []
  );

  const data = React.useMemo(
    () => [
      {
        parameter: t('ui.rtuhorner.apn', 'APN'),
        local: local?.apn || '-',
        remote: (
          <RemoteValueWithSyncMark
            text={remote?.apn || '-'}
            status={inSync?.apn}
          />
        ),
      },
      {
        parameter: t('ui.rtuhorner.apnUser', 'APN User'),
        local: local?.apnUser || '-',
        remote: (
          <RemoteValueWithSyncMark
            text={remote?.apnUser || '-'}
            status={inSync?.apnUser}
          />
        ),
      },
      {
        parameter: t('ui.rtuhorner.apnPassword', 'APN Password'),
        local: local?.apnPassword || '-',
        remote: (
          <RemoteValueWithSyncMark
            text={remote?.apnPassword || '-'}
            status={inSync?.apnPassword}
          />
        ),
      },
      {
        parameter: t('ui.rtuhorner.hostaddress', 'Host Address'),
        local: local?.hostAddress || '-',
        remote: (
          <RemoteValueWithSyncMark
            text={remote?.hostAddress || '-'}
            status={inSync?.hostAddress}
          />
        ),
      },
      {
        parameter: t('ui.rtuhorner.hostport', 'Host Port'),
        local: local?.hostPort?.toString() || '-',
        remote: (
          <RemoteValueWithSyncMark
            text={remote?.hostPort?.toString() || '-'}
            status={inSync?.hostPort}
          />
        ),
      },
      {
        parameter: t('ui.rtuhorner.listenPort', 'Listen Port'),
        local: local?.listenPort?.toString() || '-',
        remote: (
          <RemoteValueWithSyncMark
            text={remote?.listenPort?.toString() || '-'}
            status={inSync?.listenPort}
          />
        ),
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data });
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <ContentGrids dataByOrder={dataByOrder} />
      </Grid>

      <Grid item xs={12}>
        <GenericDataTable<CommunicationTableType>
          tableInstance={tableInstance}
          disableActions={false}
          tableAriaLabelText="Communication table"
          isRecordDisabled={() => false}
          columnIdToAriaLabel={(id) => id}
          getColumnWidth={() => 100}
          handleRowClick={() => {}}
          minWidth={500}
        />
      </Grid>
    </Grid>
  );
};
export default CommunicationConfigs;
