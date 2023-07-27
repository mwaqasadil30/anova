import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HornerRtuAnalogInputChannelsDTO } from '../../../../../../api/admin/api';
import ContentGrids, { TableCellInfo } from '../../../common/ContentGrids';
import ShowMore from '../ShowMore';
import HornerRtuChannelsTable from '../HornerRtuChannelsTable';

type AiChannelsProps = {
  information?: HornerRtuAnalogInputChannelsDTO;
};

const AiChannels = ({ information }: AiChannelsProps) => {
  const hornerRtuAnalogInputChannels =
    information?.hornerRtuAnalogInputChannels;

  const { t } = useTranslation();

  const totalCount = hornerRtuAnalogInputChannels?.length || 0;

  const [rowsToDisplay, setRowsToDisplay] = useState(10);

  const dataByOrder: TableCellInfo[] = [
    {
      label: t('ui.rtuhorner.detailmessagetemplate', 'Detail Message Template'),
      value: '-',
    },
  ];

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <ContentGrids dataByOrder={dataByOrder} />
        </Grid>

        <Grid item xs={12}>
          <HornerRtuChannelsTable
            hornerRtuChannels={hornerRtuAnalogInputChannels}
            rowsToDisplay={rowsToDisplay}
            tableAriaLabel="AI Channels table"
          />
          <ShowMore
            rowsToDisplay={rowsToDisplay}
            totalCount={totalCount}
            onClick={(showRowCount) => {
              setRowsToDisplay(showRowCount);
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default AiChannels;
