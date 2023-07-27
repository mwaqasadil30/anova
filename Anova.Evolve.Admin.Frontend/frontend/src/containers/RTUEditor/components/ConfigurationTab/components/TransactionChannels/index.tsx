import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HornerRtuTransactionChannelsDTO } from '../../../../../../api/admin/api';
import ContentGrids, { TableCellInfo } from '../../../common/ContentGrids';
import HornerRtuChannelsTable from '../HornerRtuChannelsTable';
import ShowMore from '../ShowMore';

type TransactionChannelsProps = {
  information?: HornerRtuTransactionChannelsDTO;
};

const TransactionChannels = ({ information }: TransactionChannelsProps) => {
  const { t } = useTranslation();

  const hornerRtuTransactionChannels =
    information?.hornerRtuTransactionChannels;

  const totalCount = hornerRtuTransactionChannels?.length || 0;

  const [rowsToDisplay, setRowsToDisplay] = useState(10);

  const dataByOrder: TableCellInfo[] = [
    { label: t('', 'Transaction Message Template'), value: '-' },
  ];

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <ContentGrids dataByOrder={dataByOrder} />
        </Grid>
        <Grid item xs={12}>
          <HornerRtuChannelsTable
            hornerRtuChannels={hornerRtuTransactionChannels}
            rowsToDisplay={rowsToDisplay}
            tableAriaLabel="Transaction Channels Table"
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
export default TransactionChannels;
