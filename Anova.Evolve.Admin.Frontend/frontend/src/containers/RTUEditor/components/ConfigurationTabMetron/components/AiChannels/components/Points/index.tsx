import Grid from '@material-ui/core/Grid';
import GenericDataTable from 'components/GenericDataTable';
import React, { ReactNode } from 'react';
import { useTable, Column } from 'react-table';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { StyledBoxTitle } from 'containers/RTUEditor/components/common/InformationContainer/styles';
import {
  MetronRtuChannelInfoDTO,
  MetronAiChannelConfigDTO,
  MetronAiChannelConfigInSyncDTO,
} from 'api/admin/api';

import RemoteValueWithSyncMark from '../../../RemoteValueWithSyncMark';

export type PointTableType = {
  point?: number | string;
  local?: number | string;
  remote?: ReactNode | null;
};

type PointsProps = {
  information: MetronRtuChannelInfoDTO | null;
};

type MetronObjKey = keyof MetronAiChannelConfigDTO;
type MetronSyncKey = keyof MetronAiChannelConfigInSyncDTO;

const prepareRowsForPointsTable = (
  property: string,
  t: TFunction,
  local?: MetronAiChannelConfigDTO | null,
  remote?: MetronAiChannelConfigDTO | null,
  inSync?: MetronAiChannelConfigInSyncDTO | null
) => {
  const arr = [];
  const notApplicableLabel = t('ui.common.notapplicable', 'N/A');
  for (let i = 1; i <= 10; i++) {
    const propertyName = (property + i) as MetronObjKey;

    arr.push({
      point: i,
      local: local?.[propertyName]?.toString() || notApplicableLabel,
      remote: (
        <RemoteValueWithSyncMark
          text={remote?.[propertyName]?.toString() || notApplicableLabel}
          status={inSync?.[propertyName as MetronSyncKey] as boolean}
        />
      ),
    });
  }
  return arr;
};

const Points = ({ information }: PointsProps) => {
  const { t } = useTranslation();

  const columns: Column<PointTableType>[] = React.useMemo(
    () => [
      {
        Header: t('ui.common.point', 'Point') as string,
        accessor: 'point',
        width: 2,
      },
      {
        Header: t('ui.rtu.local', 'Local') as string,
        accessor: 'local',
        width: 5,
      },
      {
        Header: t('ui.rtu.remote', 'Remote') as string,
        accessor: 'remote',
        width: 5,
      },
    ],
    [t]
  );

  const { inSync, local, remote } = information || {};

  const fallingData: PointTableType[] = React.useMemo(() => {
    return prepareRowsForPointsTable('fallingPoint', t, local, remote, inSync);
  }, [information]);

  const risingData: PointTableType[] = React.useMemo(() => {
    return prepareRowsForPointsTable('risingPoint', t, local, remote, inSync);
  }, [information]);

  const tableInstanceFalling = useTable({ columns, data: fallingData });
  const tableInstanceRising = useTable({ columns, data: risingData });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} lg={6}>
        <StyledBoxTitle>{t('ui.rtumetron.falling', 'Falling')}</StyledBoxTitle>
        <GenericDataTable<PointTableType>
          tableInstance={tableInstanceFalling}
          disableActions={false}
          tableAriaLabelText="Falling table"
          isRecordDisabled={() => false}
          columnIdToAriaLabel={(id) => id}
          getColumnWidth={() => 100}
          handleRowClick={() => {}}
          minWidth={500}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <StyledBoxTitle>{t('ui.rtumetron.rising', 'Rising')}</StyledBoxTitle>
        <GenericDataTable<PointTableType>
          tableInstance={tableInstanceRising}
          disableActions={false}
          tableAriaLabelText="Rising table"
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
export default Points;
