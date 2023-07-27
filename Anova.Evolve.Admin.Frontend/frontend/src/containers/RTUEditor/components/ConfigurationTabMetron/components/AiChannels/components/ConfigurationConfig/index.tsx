import Grid from '@material-ui/core/Grid';
import GenericDataTable from 'components/GenericDataTable';
import React from 'react';
import { useTable, Column } from 'react-table';
import { useTranslation } from 'react-i18next';
import { StyledBoxTitle } from 'containers/RTUEditor/components/common/InformationContainer/styles';
import { MetronRtuChannelInfoDTO } from 'api/admin/api';
import { buildMetronRTOChannelInputSignalTypeTextMapping } from 'utils/i18n/enum-to-text';
import { ReactComponent as BlackCheckmarkIcon } from 'assets/icons/black-checkmark.svg';
import ContentGrids, {
  TableCellInfo,
} from '../../../../../common/ContentGrids';
import RemoteValueWithSyncMark from '../../../RemoteValueWithSyncMark';

type ConfigurationConfigProps = {
  information: MetronRtuChannelInfoDTO | null;
};

export type ParametersTableType = {
  parameter?: string | null;
  local?: string | JSX.Element | null;
  remote?: string | JSX.Element | null;
};

const ConfigurationConfig = ({ information }: ConfigurationConfigProps) => {
  const { t } = useTranslation();
  const channelInputSignalTypeTextMapping = buildMetronRTOChannelInputSignalTypeTextMapping(
    t
  );

  const { description, decimalPlaces, inSync, local, remote } =
    information || {};

  const dataByOrder: TableCellInfo[] = [
    {
      label: t('ui.rtu.description', 'Description'),
      value: description || '-',
      width: 3,
    },
    {
      label: t('ui.rtu.desimalPlaces', 'Desimal Places'),
      value: decimalPlaces || '-',
      width: 3,
    },
  ];

  const columns = React.useMemo<Column<ParametersTableType>[]>(() => {
    return [
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
    ];
  }, []);

  const remoteSensorLoopVoltage = remote?.sensorLoopVoltage
    ? `${remote.sensorLoopVoltage} ${t('ui.rtumetron.volts', 'Volts')}`
    : '-';

  const data = React.useMemo(
    () => [
      {
        parameter: t('ui.rtumetron.frontPanelText', 'Front Panel Text'),
        local: local?.frontPanelText || '-',
        remote: (
          <RemoteValueWithSyncMark
            text={remote?.frontPanelText || '-'}
            status={inSync?.frontPanelText}
          />
        ),
      },
      {
        parameter: t('ui.rtumetron.scaledMin', 'Scaled Min'),
        local:
          local?.scaledMin || local?.scaledMin === 0
            ? `${local.scaledMin} inH2O`
            : '-',
        remote: (
          <RemoteValueWithSyncMark
            text={
              remote?.scaledMin || remote?.scaledMin === 0
                ? `${remote.scaledMin} inH2O`
                : '-'
            }
            status={inSync?.scaledMin}
          />
        ),
      },
      {
        parameter: t('ui.rtumetron.scaledMax', 'Scaled Max'),
        local:
          local?.scaledMax || local?.scaledMax === 0
            ? `${local.scaledMax} inH2O`
            : '-',
        remote: (
          <RemoteValueWithSyncMark
            text={
              remote?.scaledMax || remote?.scaledMax === 0
                ? `${remote.scaledMax} inH2O`
                : '-'
            }
            status={inSync?.scaledMax}
          />
        ),
      },
      {
        parameter: t('ui.rtumetron.inputSignalType', 'Input Signal Type'),
        local: local?.inputSignalType
          ? channelInputSignalTypeTextMapping[local.inputSignalType]
          : '-',
        remote: (
          <RemoteValueWithSyncMark
            text={
              remote?.inputSignalType
                ? channelInputSignalTypeTextMapping[remote.inputSignalType]
                : '-'
            }
            status={inSync?.inputSignalType}
          />
        ),
      },
      {
        parameter: t('ui.rtumetron.sensorLoopVoltage', 'Sensor Loop Voltage'),
        local: local?.sensorLoopVoltage
          ? `${local.sensorLoopVoltage} ${t('ui.rtumetron.volts', 'Volts')}`
          : '-',
        remote: (
          <RemoteValueWithSyncMark
            text={remoteSensorLoopVoltage}
            status={inSync?.metron2SensorLoopVoltage}
          />
        ),
      },
      {
        parameter: t('ui.rtumetron.settleTime', 'Settle Time'),
        local:
          local?.settleTime || local?.settleTime === 0
            ? `${local.settleTime} ${t('ui.rtumetron.seconds', 'seconds')}`
            : '-',
        remote: (
          <RemoteValueWithSyncMark
            text={
              remote?.settleTime || remote?.settleTime === 0
                ? `${remote.settleTime} ${t('ui.rtumetron.seconds', 'seconds')}`
                : '-'
            }
            status={inSync?.settleTime}
          />
        ),
      },
      {
        parameter: t('ui.rtumetron.settleTime', 'Settle Time'),
        local: local?.enable ? <BlackCheckmarkIcon /> : '-',
        remote: (
          <RemoteValueWithSyncMark
            text={remote?.enable ? <BlackCheckmarkIcon /> : '-'}
            status={inSync?.enable}
          />
        ),
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data });
  return (
    <Grid container spacing={2} alignItems="center">
      <StyledBoxTitle>
        {t('ui.common.configuration', 'Configuration')}
      </StyledBoxTitle>
      <Grid item xs={12}>
        <ContentGrids dataByOrder={dataByOrder} />
      </Grid>
      <Grid item xs={12}>
        <GenericDataTable<ParametersTableType>
          tableInstance={tableInstance}
          disableActions={false}
          tableAriaLabelText="Channel configuration table"
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
export default ConfigurationConfig;
