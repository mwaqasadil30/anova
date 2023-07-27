import Grid from '@material-ui/core/Grid';
import EntityPropertyText from 'components/typography/NewEntityPropertyText';
import EntityValueText from 'components/typography/NewEntityValueText';
import React from 'react';
import { ExtraDetail } from '../../types';

interface Props {
  item: ExtraDetail;
}

const DetailsItem = ({ item }: Props) => {
  return (
    <Grid container spacing={1} justify="flex-end">
      <Grid item>
        <EntityPropertyText>{item.label}:</EntityPropertyText>
      </Grid>
      <Grid item>
        <EntityValueText>{item.value}</EntityValueText>
      </Grid>
    </Grid>
  );
};

export default DetailsItem;
