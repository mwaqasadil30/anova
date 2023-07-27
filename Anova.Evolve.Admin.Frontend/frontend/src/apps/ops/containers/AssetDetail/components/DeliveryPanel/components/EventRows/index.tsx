/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { DataChannelDTO, EventRuleModel } from 'api/admin/api';
import {
  AccordionDetailsWrapper,
  StyledAccordionDetails,
} from 'apps/ops/containers/AssetDetail/styles';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import MajorText from 'components/typography/MajorText';
import MinorText from 'components/typography/MinorText';

import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { getDataChannelDTODescription } from 'utils/ui/helpers';
import { formatEvents } from '../../helpers';

const StyledTypography = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 400;
`;

const NarrowAccordionDetails = styled(StyledAccordionDetails)`
  padding: 1px 24px;
`;

interface Props {
  dataChannelResult: DataChannelDTO[];
}

const EventRows = ({ dataChannelResult }: Props) => {
  const { t } = useTranslation();

  const dataChannelsWithEnabledEvents = dataChannelResult.filter(
    (dataChannel) => dataChannel.uomParams?.eventRules?.length
  );

  const renderRows = (
    dataChannel: DataChannelDTO,
    enabledEvents: EventRuleModel[] | undefined | null
  ) => (
    <Fragment key={dataChannel.dataChannelId!}>
      <StyledAccordionDetails $header>
        <Grid container justify="flex-start" spacing={0}>
          <MajorText
            aria-label="Data channel description"
            style={{ padding: '6px 24px' }}
          >
            {getDataChannelDTODescription(dataChannel)}
          </MajorText>
        </Grid>
      </StyledAccordionDetails>

      <AccordionDetailsWrapper $isEventProfile>
        {enabledEvents?.map((event) => {
          return (
            <NarrowAccordionDetails key={event.dataChannelEventRuleId!}>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                spacing={1}
              >
                <Grid item xs>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={0}
                  >
                    <Grid item>
                      <Box py={0.5}>
                        <StyledTypography aria-label="Event description">
                          {event?.description}{' '}
                          {formatEvents(dataChannel, event, t)}
                        </StyledTypography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </NarrowAccordionDetails>
          );
        })}
      </AccordionDetailsWrapper>
    </Fragment>
  );

  return (
    <div aria-label="Events accordion details">
      {dataChannelsWithEnabledEvents.length > 0 ? (
        dataChannelsWithEnabledEvents.map((dataChannel: DataChannelDTO) =>
          renderRows(dataChannel, dataChannel.uomParams?.eventRules)
        )
      ) : (
        <StyledAccordionDetails>
          <MinorText>
            {t('ui.assetdetail.noEventsConfigured', 'No events configured')}
          </MinorText>
        </StyledAccordionDetails>
      )}
    </div>
  );
};
export default EventRows;
