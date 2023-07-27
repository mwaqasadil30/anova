import Grid from '@material-ui/core/Grid';
import GenericDataTable from 'components/GenericDataTable';
import React from 'react';
import { useTable, Column } from 'react-table';
import { useTranslation } from 'react-i18next';
import { StyledBoxTitle } from 'containers/RTUEditor/components/common/InformationContainer/styles';
import { MetronRtuChannelInfoDTO } from 'api/admin/api';

import RemoteValueWithSyncMark from '../../../RemoteValueWithSyncMark';

type ReversePoolProps = {
  information: MetronRtuChannelInfoDTO | null;
};

export type ParametersTableType = {
  parameter?: string | null;
  local?: string | null;
  remote?: JSX.Element | null;
};

const ReversePoll = ({ information }: ReversePoolProps) => {
  const { t } = useTranslation();

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

  const { inSync, local, remote } = information || {};

  const data = React.useMemo(
    () => [
      {
        parameter: t('ui.rtumetron.reversePollDelay', 'Reverse Pool Delay'),
        local: local?.reversePollDelay?.toString() || '-',
        remote: (
          <RemoteValueWithSyncMark
            text={remote?.reversePollDelay?.toString() || '-'}
            status={inSync?.reversePollDelay}
          />
        ),
      },
      {
        parameter: t('ui.rtumetron.alarmHystersis', 'Alarm Hystersis'),
        local: local?.alarmHystersis?.toString() || '-',
        remote: (
          <RemoteValueWithSyncMark
            text={remote?.alarmHystersis?.toString() || '-'}
            status={inSync?.alarmHystersis}
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
        <StyledBoxTitle>
          {t('ui.rtumetron.reversePoll', 'Reverse Poll')}
        </StyledBoxTitle>
        <GenericDataTable<ParametersTableType>
          tableInstance={tableInstance}
          disableActions={false}
          tableAriaLabelText="Reverse Poll table"
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
export default ReversePoll;
