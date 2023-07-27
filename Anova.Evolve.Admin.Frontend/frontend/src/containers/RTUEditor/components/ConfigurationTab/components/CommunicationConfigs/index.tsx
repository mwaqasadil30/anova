import Grid from '@material-ui/core/Grid';
import GenericDataTable from 'components/GenericDataTable';
import React from 'react';
import { useTable, Column } from 'react-table';
import { useTranslation } from 'react-i18next';
import {
  buildCommunicationMethodGroupTextMapping,
  buildRtuTransportTypeEnumTextMapping,
} from 'utils/i18n/enum-to-text';
import { CommunicationTableType } from 'containers/RTUEditor/types';
import {
  DropDownListDtoOfInteger,
  HornerRtuCommunicationConfigDTO,
} from '../../../../../../api/admin/api';
import ContentGrids, { TableCellInfo } from '../../../common/ContentGrids';

type CommunicationConfigsProps = {
  information?: HornerRtuCommunicationConfigDTO;
  carriers?: DropDownListDtoOfInteger[] | null;
};

const CommunicationConfigs = ({ information }: CommunicationConfigsProps) => {
  const { t } = useTranslation();
  const {
    transportType,
    carrierType,
    ipNetworkAddress,
    listenPort,
    localHostAddress,
    localHostPort,
    remoteHostAddress,
    remoteHostPort,
  } = information || {};

  const rtuTransportTypeEnumTextMapping = buildRtuTransportTypeEnumTextMapping(
    t
  );
  const communicationMethodGroupTextMapping = buildCommunicationMethodGroupTextMapping(
    t
  );

  const dataByOrder: TableCellInfo[] = [
    {
      label: t('ui.rtu.transport', 'Transport'),
      value:
        transportType || transportType === 0
          ? rtuTransportTypeEnumTextMapping[transportType]
          : '-',
    },
    {
      label: t('ui.common.carrier', 'Carrier'),
      value:
        carrierType || carrierType === 0
          ? communicationMethodGroupTextMapping[carrierType]
          : '-',
    },
    {
      label: t('ui.rtu.ipnetworkaddress', 'IP Network Address'),
      value: ipNetworkAddress,
    },
    { label: t('ui.rtu.listenport', 'Listen Port'), value: listenPort },
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
        parameter: t('ui.rtuhorner.hostaddress', 'Host Address'),
        local: localHostAddress,
        remote: remoteHostAddress,
      },
      {
        parameter: t('ui.rtu.hostport', 'Host Port'),
        local: localHostPort?.toString(),
        remote: remoteHostPort?.toString(),
      },
    ],
    [localHostAddress]
  );

  const tableInstance = useTable({ columns, data });
  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <ContentGrids dataByOrder={dataByOrder} />
        </Grid>

        <Grid item xs={12} md={8}>
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
    </>
  );
};
export default CommunicationConfigs;
