import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import { EventStatusType } from 'api/admin/api';
import BackIconButton from 'components/buttons/BackIconButton';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import PageHeader from 'components/PageHeader';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { gray900 } from 'styles/colours';
import { EventDetails } from '../hooks/useEventDetails';

const StyledChip = styled(Chip)`
  background-color: ${(props) =>
    props.theme.palette.type === 'light'
      ? '#515151'
      : props.theme.palette.background.paper};
  color: ${(props) => props.theme.palette.getContrastText(gray900)};
  border: 0;
  font-weight: 600;
  font-size: 14px;
  padding: 5px 8px;
`;

export const Heading = ({
  eventName,
  dataChannel,
  status,
}: Partial<EventDetails>) => {
  const { t } = useTranslation();
  const topOffset = useSelector(selectTopOffset);
  const title = t(
    'ui.ops.eventDetails.heading',
    '{{name}} - {{channel}} Event',
    { name: eventName, channel: dataChannel }
  );

  return (
    <PageIntroWrapper sticky topOffset={topOffset}>
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <BackIconButton />
        </Grid>
        <Grid item>
          <PageHeader dense>{title}</PageHeader>
        </Grid>

        <Grid item>
          <Box ml={2}>
            {status === EventStatusType.Active ? (
              <StyledChip
                variant="outlined"
                size="small"
                label={t('enum.eventrulestatetype.active', 'Active')}
                aria-label="Event status type"
              />
            ) : (
              <StyledChip
                variant="outlined"
                size="small"
                label={t('enum.eventrulestatetype.inactive', 'Inactive')}
                disabled
                aria-label="Event status type"
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </PageIntroWrapper>
  );
};
