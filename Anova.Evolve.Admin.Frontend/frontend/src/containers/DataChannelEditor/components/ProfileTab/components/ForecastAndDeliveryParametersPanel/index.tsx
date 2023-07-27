/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import { DataChannelCategory, DataChannelReportDTO } from 'api/admin/api';
import AccordionDetails from 'components/AccordionDetails';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import { StaticAccordion } from 'components/StaticAccordion';
import { IS_DATA_CHANNEL_FORECAST_AND_DELIVERY_EDIT_FEATURE_ENABLED } from 'env';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import {
  BoxTitle,
  StyledAccordionSummary,
  StyledEditButton,
  StyledEditIcon,
} from '../../styles';
import ForecastAndDeliveryParametersDrawer from '../ForecastAndDeliveryParametersDrawer';
import StyledLabelWithValue from '../StyledLabelWithValue';

interface Props {
  canUpdateDataChannel?: boolean;
  dataChannelDetails: DataChannelReportDTO | null | undefined;
}

const ForecastAndDeliveryParametersPanel = ({
  canUpdateDataChannel,
  dataChannelDetails,
}: Props) => {
  const { t } = useTranslation();

  const forecastAndDeliveryInfo = dataChannelDetails?.forecastDeliveryInfo;

  const [
    isForecastAndDeliveryDrawerOpen,
    setIsForecastAndDeliveryDrawerOpen,
  ] = useState(false);

  const closeForecastAndDeliveryDrawer = () => {
    setIsForecastAndDeliveryDrawerOpen(false);
  };

  const openForecastAndDeliveryDrawer = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsForecastAndDeliveryDrawerOpen(true);
  };

  const saveAndExitCallback = () => {
    closeForecastAndDeliveryDrawer();
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isForecastAndDeliveryDrawerOpen}
        onClose={closeForecastAndDeliveryDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <ForecastAndDeliveryParametersDrawer
            dataChannelDetails={dataChannelDetails}
            forecastAndDeliveryInfo={forecastAndDeliveryInfo}
            cancelCallback={closeForecastAndDeliveryDrawer}
            saveAndExitCallback={saveAndExitCallback}
          />
        </DrawerContent>
      </Drawer>
      <Grid item xs={12}>
        <StaticAccordion>
          <StyledAccordionSummary>
            <Grid
              container
              alignItems="center"
              spacing={0}
              justify="space-between"
            >
              <Grid item>
                <BoxTitle>{t('ui.dataChannel.forecast', 'Forecast')}</BoxTitle>
              </Grid>

              {canUpdateDataChannel &&
                IS_DATA_CHANNEL_FORECAST_AND_DELIVERY_EDIT_FEATURE_ENABLED && (
                  <Grid item>
                    <StyledEditButton onClick={openForecastAndDeliveryDrawer}>
                      <StyledEditIcon />
                    </StyledEditButton>
                  </Grid>
                )}
            </Grid>
          </StyledAccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={2}>
                <StyledLabelWithValue
                  label={t('ui.datachannel.forecastmode', 'Forecast Mode')}
                  value={forecastAndDeliveryInfo?.forecastModeAsText}
                />
              </Grid>
              {dataChannelDetails?.dataChannelTypeId !==
                DataChannelCategory.TotalizedLevel && (
                <Grid item xs={2}>
                  <StyledLabelWithValue
                    label={t(
                      'ui.datachannel.showhighlowforecast',
                      'Show High/Low Forecast'
                    )}
                    value={formatBooleanToYesOrNoString(
                      forecastAndDeliveryInfo?.showHighLowForecast,
                      t
                    )}
                  />
                </Grid>
              )}

              {dataChannelDetails?.dataChannelTypeId !==
                DataChannelCategory.TotalizedLevel && (
                <Grid item xs={2}>
                  <StyledLabelWithValue
                    label={t(
                      'ui.datachannel.reforecastWhenDeliveryScheduled',
                      'Reforecast When Delivery Scheduled'
                    )}
                    value={formatBooleanToYesOrNoString(
                      forecastAndDeliveryInfo?.reforecastWhenDeliveryScheduled,
                      t
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </StaticAccordion>
      </Grid>
    </>
  );
};

export default ForecastAndDeliveryParametersPanel;
