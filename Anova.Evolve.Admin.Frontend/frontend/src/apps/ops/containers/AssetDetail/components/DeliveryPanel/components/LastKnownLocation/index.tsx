/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { GpsLocationDTO } from 'api/admin/api';
import {
  AccordionDetailsWrapper,
  CardDateText,
  CardMajorText,
  StyledAccordionDetails,
} from 'apps/ops/containers/AssetDetail/styles';
import { ReactComponent as LastKnownLocationIcon } from 'assets/icons/last-known-location-marker-solid.svg';
import MinorText from 'components/typography/MinorText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectCurrentIanaTimezoneId } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { formatModifiedDatetime } from 'utils/format/dates';

const StyledLastKnownLocationIcon = styled(LastKnownLocationIcon)`
  color: ${(props) => props.theme.custom.palette.dataChannelIcon};
`;

const CardMajorTextWithWrapping = styled(CardMajorText)`
  white-space: normal;
  padding-right: 1em;
`;

interface Props {
  lastKnownLocation?: GpsLocationDTO | null;
  isFetchingLocation?: boolean;
}

const LastKnownLocation = ({
  lastKnownLocation,
  isFetchingLocation,
}: Props) => {
  const { t } = useTranslation();

  const ianaTimezoneId = useSelector(selectCurrentIanaTimezoneId);

  const latestReadingTimestamp = formatModifiedDatetime(
    lastKnownLocation?.logTime,
    ianaTimezoneId
  );
  const displayLat = lastKnownLocation?.latitude?.toFixed(4);
  const displayLng = lastKnownLocation?.longitude?.toFixed(4);

  let joinedAddress = lastKnownLocation?.address
    ? lastKnownLocation?.address
    : [
        lastKnownLocation?.city,
        lastKnownLocation?.prov_State,
        lastKnownLocation?.country,
      ]
        .filter(Boolean)
        .join(', ');
  if (!joinedAddress.length) {
    joinedAddress = lastKnownLocation?.bodyOfWater
      ? `${lastKnownLocation?.bodyOfWater} (${displayLat}, ${displayLng})`
      : [displayLat, displayLng].filter(Boolean).join(', ');
  }

  return (
    <div
      aria-label="Last known location details"
      style={{ position: 'relative' }}
    >
      {!lastKnownLocation && !isFetchingLocation ? (
        <StyledAccordionDetails>
          <MinorText>
            {t(
              'ui.assetdetail.lastKnownLocationUnknown',
              'Unable to retrieve last known location'
            )}
          </MinorText>
        </StyledAccordionDetails>
      ) : (
        <AccordionDetailsWrapper>
          <Box padding="16px 10px">
            <Grid container spacing={1} justify="space-between">
              <Grid item xs={3} container alignItems="center" justify="center">
                {lastKnownLocation && !isFetchingLocation && (
                  <StyledLastKnownLocationIcon />
                )}
              </Grid>

              <Grid item xs={9} style={{ margin: '0 auto' }}>
                <CardMajorTextWithWrapping aria-controls="Last known location address">
                  {joinedAddress}
                </CardMajorTextWithWrapping>
                <CardDateText
                  title={latestReadingTimestamp}
                  aria-label="Latest reading timestamp"
                >
                  {latestReadingTimestamp || <>&nbsp;</>}
                </CardDateText>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetailsWrapper>
      )}
    </div>
  );
};
export default LastKnownLocation;
