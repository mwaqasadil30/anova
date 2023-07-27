import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import { useTable, Column } from 'react-table';
import GenericDataTable from 'components/GenericDataTable';
import { MetronConfigurationsDTO } from 'api/admin/api';
import RemoteValueWithSyncMark from '../RemoteValueWithSyncMark';

type ConfigurationProps = {
  configuration?: MetronConfigurationsDTO;
};
type ConfigurationTableType = {
  parameter?: string | null;
  local?: string | null;
  remote?: JSX.Element;
};
enum ConfigurationParameters { // todo: translate
  PowerMode = 'Power Mode',
  CallTime = 'Call Out Time (UTC)',
  CalloutTimeVariance = 'Call Out Time Variance',
  CallPeriod = 'Transmit Interval',
  WakeUpInterval = 'Wake Up Interval',
  ExternalAntenna = 'Antenna',
  BatteryAlarmPoint = 'Battery Alarm',
}

const Configuration = ({ configuration }: ConfigurationProps) => {
  const { t } = useTranslation();

  const { local, remote, inSync } = configuration || {};

  const antennaTypeToText = (type?: boolean) => {
    return type
      ? t('ui.rtu.externalAntenna', 'External')
      : t('ui.rtu.internalAntenna', 'Internal');
  };

  const convertToReadableTime = (minutes?: number | null) => {
    if (!minutes) return '-';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    let result = hours ? `${hours} ${t('ui.common.hours', 'hours')}` : '';
    result += ` ${mins} ${t('ui.common.minutes', 'minutes')}`;

    return result;
  };

  const columns = useMemo<Column<ConfigurationTableType>[]>(
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
        parameter: ConfigurationParameters.PowerMode,
        local: local?.powerMode,
        remote: (
          <RemoteValueWithSyncMark
            text={remote?.powerMode}
            status={inSync?.powerMode}
          />
        ),
      },
      {
        parameter: ConfigurationParameters.CallTime,
        local: convertToReadableTime(local?.callTime),
        remote: (
          <RemoteValueWithSyncMark
            text={convertToReadableTime(remote?.callTime)}
            status={inSync?.callTime}
          />
        ),
      },
      {
        parameter: ConfigurationParameters.CalloutTimeVariance,
        local: convertToReadableTime(local?.calloutTimeVariance),
        remote: (
          <RemoteValueWithSyncMark
            text={convertToReadableTime(remote?.calloutTimeVariance)}
            status={inSync?.calloutTimeVariance}
          />
        ),
      },
      {
        parameter: ConfigurationParameters.CallPeriod,
        local: convertToReadableTime(local?.callPeriod),
        remote: (
          <RemoteValueWithSyncMark
            text={convertToReadableTime(remote?.callPeriod)}
            status={inSync?.callPeriod}
          />
        ),
      },
      {
        parameter: ConfigurationParameters.WakeUpInterval,
        local: convertToReadableTime(local?.wakeUpInterval),
        remote: (
          <RemoteValueWithSyncMark
            text={convertToReadableTime(remote?.wakeUpInterval)}
            status={inSync?.wakeUpInterval}
          />
        ),
      },
      {
        parameter: ConfigurationParameters.ExternalAntenna,
        local: antennaTypeToText(local?.externalAntenna),
        remote: (
          <RemoteValueWithSyncMark
            text={antennaTypeToText(remote?.externalAntenna)}
            status={inSync?.externalAntenna}
          />
        ),
      },
      {
        parameter: ConfigurationParameters.BatteryAlarmPoint,
        local: local?.batteryAlarmPoint?.toString() || '-',
        remote: (
          <RemoteValueWithSyncMark
            text={remote?.batteryAlarmPoint?.toString() || '-'}
            status={inSync?.batteryAlarmPoint}
          />
        ),
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data });
  return (
    <Grid container spacing={2} alignItems="center">
      <GenericDataTable<ConfigurationTableType>
        tableInstance={tableInstance}
        disableActions={false}
        tableAriaLabelText="Configuration table"
        isRecordDisabled={() => false}
        columnIdToAriaLabel={(id) => id}
        getColumnWidth={() => 100}
        handleRowClick={() => {}}
        minWidth={500}
      />
    </Grid>
  );
};
export default Configuration;
