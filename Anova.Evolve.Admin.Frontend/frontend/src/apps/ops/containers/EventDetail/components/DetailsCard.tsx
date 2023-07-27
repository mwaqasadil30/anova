import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { EventRuleType } from 'api/admin/api';
import routes from 'apps/ops/routes';
import { ReactComponent as MissingDataIcon } from 'assets/icons/missing-data.svg';
import CustomBoxRedesign from 'components/CustomBoxRedesign';
import FormatDateTime from 'components/FormatDateTime';
import FillableTankIcon from 'components/icons/FillableTankicon';
import uniq from 'lodash/uniq';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link } from 'react-router-dom';
import styled from 'styled-components';
import { isNumber } from 'utils/format/numbers';
import { renderImportance } from 'utils/ui/helpers';
import { EventDetails } from '../hooks/useEventDetails';

const StyledImportanceBox = styled(Box)`
  border-radius: ${(props) =>
    `${props.theme.shape.borderRadius}px ${props.theme.shape.borderRadius}px 0 0`};
`;

const StyledDetailsBannerBox = styled(Box)`
  border-radius: ${(props) =>
    `${props.theme.shape.borderRadius}px ${props.theme.shape.borderRadius}px 0 0`};

  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

// const EventImportanceText = styled(Typography)`
//   font-size: 14px;
//   font-weight: 500;
//   padding-top: 1px;
//   color: ${(props) => props.theme.palette.text.primary};
// `;

const EventDateText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const StyledAssetTitleOrName = styled(Typography)`
  font-weight: 600;
  font-size: 14px;
  text-decoration: underline;
  color: ${(props) => props.theme.palette.text.primary};
`;

const DetailLabel = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
`;

const DetailValue = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 500;
`;

const StyledAcknowledgedText = styled(Typography)`
  font-style: italic;
  font-size: 12px;
`;

// Styled Containers
const EventName = (props: React.ComponentProps<typeof Typography>) => (
  <Typography variant="h6" {...props} />
);
// const ImportanceText = (props: React.ComponentProps<typeof Typography>) => (
//   <EventImportanceText variant="subtitle2" {...props} />
// );

const DetailsBox = (props: React.ComponentProps<typeof Box>) => (
  <CustomBoxRedesign minHeight="190px" height="100%" {...props} />
);
const EventDetailsBanner = (props: React.ComponentProps<typeof Box>) => (
  <StyledDetailsBannerBox
    minHeight="28px"
    color="white"
    py={1}
    px={2}
    {...props}
    display="flex"
    alignItems="center"
  />
);

const EventImportanceBanner = (props: React.ComponentProps<typeof Box>) => (
  <StyledImportanceBox
    minHeight="28px"
    color="white"
    py={1}
    px={2}
    {...props}
    display="flex"
    alignItems="center"
  />
);

const DetailLabelsBox = (props: React.ComponentProps<typeof Box>) => (
  <Box p={3} {...props} />
);

export const DetailsCard = ({
  acknowledgedBy,
  acknowledgedOn,
  assetName,
  assetId,
  eventMessage,
  eventName,
  dataChannelDescription,
  createdDate,
  readingValue,
  readingTimestamp,
  importance,
  eventRosters,
  eventRuleType,
  percentFull,
}: Partial<EventDetails>) => {
  const { t } = useTranslation();
  // const importanceLevelTextMapping = buildImportanceLevelTextMapping(t);

  const formattedRosters = uniq(eventRosters).sort().join(', ');

  const Details = () => (
    <Grid container spacing={4}>
      <Grid item xs={4} lg={3} xl={2}>
        <DetailLabel>
          {t('ui.ops.eventDetails.dataChannel', 'Data Channel')}
        </DetailLabel>
        <DetailValue aria-label="Data channel type">
          {dataChannelDescription || '-'}
        </DetailValue>
      </Grid>
      <Grid item xs={4} lg={3} xl={2}>
        <DetailLabel>
          {t('ui.ops.eventDetails.readingValue', 'Reading Value')}
        </DetailLabel>
        <DetailValue aria-label="Reading value">{readingValue}</DetailValue>
      </Grid>
      <Grid item xs={4} lg={3} xl={2}>
        <DetailLabel>
          {t('ui.ops.eventDetails.readingTimestamp', 'Reading Timestamp')}
        </DetailLabel>
        <DetailValue aria-label="Reading timestamp">
          <FormatDateTime date={readingTimestamp} />
        </DetailValue>
      </Grid>
      {!!eventRosters?.length && (
        <Grid item xs={4} lg={3} xl={2}>
          <DetailLabel>{t('ui.events.rosters', 'Roster(s)')}</DetailLabel>
          <DetailValue aria-label="Rosters">{formattedRosters}</DetailValue>
        </Grid>
      )}
      <Grid item xs={4} lg={3} xl={2}>
        <DetailLabel>
          {t('ui.ops.eventDetails.acknowledgedByLabel', 'Acknowledged By')}
        </DetailLabel>
        <DetailValue aria-label="Acknowledged by">
          {acknowledgedBy || (
            <StyledAcknowledgedText as="span">
              {t('ui.ops.eventDetails.unacknowledged', 'Unacknowledged')}
            </StyledAcknowledgedText>
          )}
        </DetailValue>
      </Grid>
      <Grid item xs={4} lg={3} xl={2}>
        <DetailLabel>
          {t('ui.events.acknowledgedon', 'Acknowledged On')}
        </DetailLabel>
        <DetailValue aria-label="Acknowledged on">
          {' '}
          {acknowledgedOn ? (
            <FormatDateTime date={acknowledgedOn} />
          ) : (
            <StyledAcknowledgedText as="span">
              {t('ui.ops.eventDetails.unacknowledged', 'Unacknowledged')}
            </StyledAcknowledgedText>
          )}
        </DetailValue>
      </Grid>
      <Grid item xs={4} lg={3} xl={2}>
        <DetailLabel>
          {t('ui.ops.eventDetails.eventMessage', 'Event Message')}
        </DetailLabel>
        <DetailValue aria-label="Event message">{eventMessage}</DetailValue>
      </Grid>
    </Grid>
  );

  const EventImportanceBox = () => (
    <DetailsBox display="flex" flexDirection="column">
      <EventImportanceBanner>
        <Grid container spacing={1} alignItems="center">
          <Grid item>{renderImportance(importance)}</Grid>
          {/* Importance level below might be needed - keeping uncommented */}
          {/* <Grid item>
            <ImportanceText aria-label="Event importance level">
              {importanceLevelTextMapping[importance!]}
            </ImportanceText>
          </Grid> */}
        </Grid>
      </EventImportanceBanner>
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        spacing={1}
        style={{ flex: '1 0 auto' }}
      >
        <Grid item>
          {isNumber(percentFull) && eventRuleType === EventRuleType.Level ? (
            <FillableTankIcon percentFull={percentFull as number} />
          ) : (
            <MissingDataIcon aria-label="Missing data icon" />
          )}
        </Grid>
        <Grid item>
          <EventName aria-label="Event rule description">{eventName}</EventName>
        </Grid>
        <Grid item>
          <EventDateText>
            {t('ui.common.created', 'Created')}:{' '}
            <span aria-label="Event created on">
              <FormatDateTime date={createdDate} />
            </span>
          </EventDateText>
        </Grid>
      </Grid>
    </DetailsBox>
  );

  const EventDetailsBox = () => (
    <DetailsBox>
      <EventDetailsBanner>
        <StyledAssetTitleOrName aria-label="Asset title">
          {assetId ? (
            <MuiLink
              component={Link}
              to={generatePath(routes.assetSummary.detail, {
                assetId,
              })}
              color="inherit"
              underline="always"
            >
              {assetName}
            </MuiLink>
          ) : (
            assetName
          )}
        </StyledAssetTitleOrName>
      </EventDetailsBanner>

      <DetailLabelsBox>
        <Details />
      </DetailLabelsBox>
    </DetailsBox>
  );

  return (
    <Grid container spacing={2} alignItems="stretch">
      <Grid item xs={12} md={4} lg={3}>
        <EventImportanceBox />
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        <EventDetailsBox />
      </Grid>
    </Grid>
  );
};
