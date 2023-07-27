import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DataChannelCategory, DataChannelDTO } from 'api/admin/api';
import { StyledAccordionDetails } from 'apps/ops/containers/AssetDetail/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { defaultTextColor } from 'styles/colours';

const MajorText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${defaultTextColor};
`;

interface Props {
  dataChannelResult: DataChannelDTO[];
}

const ScheduledDeliveryRows = ({ dataChannelResult }: Props) => {
  const { t } = useTranslation();

  const levelChannels = dataChannelResult.filter(
    (channel: DataChannelDTO) =>
      channel.dataChannelTypeId === DataChannelCategory.Level
  );

  return (
    <div>
      {levelChannels.map((channel: DataChannelDTO) => (
        <>
          <StyledAccordionDetails $header>
            <Grid container justify="center" spacing={0}>
              <MajorText>{channel?.productDescription || <em>-</em>}</MajorText>
            </Grid>
          </StyledAccordionDetails>
          <Box p={2}>
            <MajorText>
              {t('ui.assetdetail.noDeliveryPlanned', 'No delivery planned')}
            </MajorText>
          </Box>

          {/* {!channel.scheduledDeliveries?.length ? (
            <Box px="4px">
        
                  <MajorText>
                    {t(
                      'ui.assetdetail.noDeliveryPlanned',
                      'No delivery planned'
                    )}
                  </MajorText>
          
           
            </Box>
          ) : (
            channel.scheduledDeliveries?.map(
              (delivery: AssetDetailDeliveryScheduleInfo) => (
                <StyledAccordionDetails>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <Grid item>
                      <MinorText>
                        {formatModifiedDate(delivery.scheduledTime)}
                      </MinorText>
                      <MinorText>
                        `${delivery.deliveryAmount} $
                        {channel.isTankDimensionSet
                          ? // TODO: displayUnits or displayDecialPlaces
                            channel.displayUnits
                          : channel.scaledUnitsAsText}
                        `
                      </MinorText>
                    </Grid>
                  </Grid>
                </StyledAccordionDetails>
              )
            )
          )} */}
        </>
      ))}
    </div>
  );
};
export default ScheduledDeliveryRows;
