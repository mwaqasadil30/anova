import Grid from '@material-ui/core/Grid';
import EntityPropertyText from 'components/typography/EntityPropertyText';
import EntityValueText from 'components/typography/EntityValueText';
import React from 'react';
import { ExtraDetail } from '../../types';

interface Props {
  item: ExtraDetail;
}

const DetailsItem = ({ item }: Props) => {
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} md={4} lg={3}>
        <EntityPropertyText>{item.label}</EntityPropertyText>
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        <EntityValueText>{item.value}</EntityValueText>
      </Grid>
    </Grid>
  );
};

export default DetailsItem;
