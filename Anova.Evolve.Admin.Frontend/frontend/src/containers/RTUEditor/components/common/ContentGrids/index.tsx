import React from 'react';
import Grid, { GridSize } from '@material-ui/core/Grid';
import StyledLabelWithValue from '../../../../DataChannelEditor/components/ProfileTab/components/StyledLabelWithValue';

export type TableCellInfo = { label: string; value: any; width?: GridSize };

const ContentGrids = ({ dataByOrder }: { dataByOrder: TableCellInfo[] }) => {
  return (
    <Grid container spacing={3}>
      {dataByOrder.map((info) => (
        <Grid item md={info.width || 3} xs={4} key={info.label}>
          <StyledLabelWithValue label={info.label} value={info.value} />
        </Grid>
      ))}
    </Grid>
  );
};
export default ContentGrids;
