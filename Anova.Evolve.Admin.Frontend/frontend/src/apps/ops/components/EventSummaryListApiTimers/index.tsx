import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import routes from 'apps/ops/routes';
import Button from 'components/Button';
import FilterBox from 'components/FilterBox';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectIsUserSystemAdmin } from 'redux-app/modules/user/selectors';
import { tableHeaderColor, white } from 'styles/colours';
import styled from 'styled-components';

const StyledFilterBox = styled(FilterBox)`
  background: ${tableHeaderColor};
  color: ${white};
  padding: 8px 16px;
`;

interface Props {
  apiDuration: number | null;
  version: 1 | 2;
}

const EventSummaryListApiTimers = ({ apiDuration, version }: Props) => {
  const isSystemAdmin = useSelector(selectIsUserSystemAdmin);

  if (!isSystemAdmin) {
    return null;
  }

  return (
    <Box mb={2}>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <Button
            variant="outlined"
            component={Link}
            to={routes.events.list}
            // @ts-ignore
            target="_blank"
          >
            Go to version {version === 2 ? '1' : '2'}
          </Button>
        </Grid>
        <Grid item xs>
          <StyledFilterBox>
            <Typography>
              Get Event Summary List Version {version} API Duration:{' '}
              {apiDuration ? `${apiDuration / 1000} seconds` : 'Pending'}
            </Typography>
          </StyledFilterBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventSummaryListApiTimers;
