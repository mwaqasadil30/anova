import Grid from '@material-ui/core/Grid';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import React from 'react';
import PageIntro from './PageIntro';

interface Props {
  closeDeliveryDrawer: () => void;
}

const DeliveryDrawerDetails = ({ closeDeliveryDrawer }: Props) => {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
          <PageIntro closeDeliveryDrawer={closeDeliveryDrawer} />
        </PageIntroWrapper>
      </Grid>
    </Grid>
  );
};

export default DeliveryDrawerDetails;
