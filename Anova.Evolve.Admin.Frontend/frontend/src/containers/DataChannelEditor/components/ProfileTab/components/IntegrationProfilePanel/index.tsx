/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  DataChannelCategory,
  DataChannelReportDTO,
  IntegrationInfoDTO,
} from 'api/admin/api';
import { ReactComponent as GreenCircle } from 'assets/icons/green-circle.svg';
import { ReactComponent as RedCircle } from 'assets/icons/red-circle.svg';
import AccordionDetails from 'components/AccordionDetails';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EmptyContentBlock from 'components/EmptyContentBlock';
import { StaticAccordion } from 'components/StaticAccordion';
import { IS_DATA_CHANNEL_CUSTOM_INTEGRATION1_EDIT_FEATURE_ENABLED } from 'env';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  BoxTitle,
  StyledAccordionSummary,
  StyledEditButton,
  StyledEditIcon,
} from '../../styles';
import IntegrationProfilePanelDrawer from '../IntegrationProfilePanelDrawer';
import StyledLabelWithValue from '../StyledLabelWithValue';

const StyledGreenCircle = styled(GreenCircle)`
  height: 8px;
  width: 6px;
`;
const StyledRedCircle = styled(RedCircle)`
  height: 8px;
  width: 6px;
`;

interface Props {
  dataChannelDetails: DataChannelReportDTO | null | undefined;
  integrationInfo?: IntegrationInfoDTO | null;
  canUpdateDataChannel?: boolean;
}

const IntegrationProfilePanel = ({
  dataChannelDetails,
  integrationInfo,
  canUpdateDataChannel,
}: Props) => {
  const { t } = useTranslation();

  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const [
    isIntegrationProfileDrawerOpen,
    setIsIntegrationProfileDrawerOpen,
  ] = useState(false);

  const closeIntegrationProfileDrawer = () => {
    setIsIntegrationProfileDrawerOpen(false);
  };

  const openIntegrationProfileDrawer = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsIntegrationProfileDrawerOpen(true);
  };

  const saveAndExitCallback = () => {
    closeIntegrationProfileDrawer();
  };

  const canDisplayExtraInfo =
    dataChannelDetails?.dataChannelTypeId === DataChannelCategory.Level ||
    dataChannelDetails?.dataChannelTypeId === DataChannelCategory.Pressure ||
    dataChannelDetails?.dataChannelTypeId === DataChannelCategory.OtherAnalog ||
    dataChannelDetails?.dataChannelTypeId ===
      DataChannelCategory.TotalizedLevel ||
    dataChannelDetails?.dataChannelTypeId ===
      DataChannelCategory.VirtualChannel;

  const customIntegration1 = integrationInfo?.customIntegration1;

  return (
    <>
      <Drawer
        anchor="right"
        open={isIntegrationProfileDrawerOpen}
        onClose={closeIntegrationProfileDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <IntegrationProfilePanelDrawer
            canDisplayExtraInfo={canDisplayExtraInfo}
            dataChannelDetails={dataChannelDetails}
            customIntegration1={customIntegration1}
            cancelCallback={closeIntegrationProfileDrawer}
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
                <BoxTitle>
                  {t(
                    'ui.dataChannel.integrationProfile',
                    'Integration Profile'
                  )}
                </BoxTitle>
              </Grid>

              {canUpdateDataChannel &&
                IS_DATA_CHANNEL_CUSTOM_INTEGRATION1_EDIT_FEATURE_ENABLED && (
                  <Grid item>
                    <StyledEditButton onClick={openIntegrationProfileDrawer}>
                      <StyledEditIcon />
                    </StyledEditButton>
                  </Grid>
                )}
            </Grid>
          </StyledAccordionSummary>
          <AccordionDetails>
            <Grid container spacing={isBelowSmBreakpoint ? 5 : 7}>
              {!integrationInfo?.customIntegration1 ? (
                <Grid item xs>
                  <EmptyContentBlock
                    message={t(
                      'ui.dataChannel.integrationNotConfigured',
                      'Integration not configured'
                    )}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item xs={2}>
                    <StyledLabelWithValue
                      // Site Number = shipTo until the api is updated to site number
                      label={t('ui.dataChannel.siteNumber', 'Site Number')}
                      value={customIntegration1?.shipTo}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <StyledLabelWithValue
                      label={t('ui.dataChannel.customer', 'Customer')}
                      value={customIntegration1?.customerName}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <StyledLabelWithValue
                      label={t('ui.common.address', 'Address')}
                      value={customIntegration1?.customerAddress1}
                    />
                  </Grid>

                  {canDisplayExtraInfo && (
                    <>
                      <Grid item xs={2}>
                        <StyledLabelWithValue
                          label={t('ui.apci.tankfunction', 'Tank Function')}
                          value={customIntegration1?.tankFunctionTypeAsText}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <StyledLabelWithValue
                          label={t(
                            'ui.apci.sendtolbshell',
                            'Send Readings To LBShell'
                          )}
                          value={
                            customIntegration1?.isSendEnabled ? (
                              <Grid container spacing={1} alignItems="center">
                                <Grid item xs="auto">
                                  <StyledGreenCircle />
                                </Grid>
                                <Grid item>
                                  {t('ui.common.enabled', 'Enabled')}
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid container spacing={1} alignItems="center">
                                <Grid item xs="auto">
                                  <StyledRedCircle />
                                </Grid>
                                <Grid item>
                                  {t('ui.common.disabled', 'Disabled')}
                                </Grid>
                              </Grid>
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <StyledLabelWithValue
                          label={t(
                            'ui.datachannel.scaledunits',
                            'Scaled Units'
                          )}
                          value={customIntegration1?.airProductsUnitTypeAsText}
                        />
                      </Grid>
                    </>
                  )}
                </>
              )}
            </Grid>
          </AccordionDetails>
        </StaticAccordion>
      </Grid>
    </>
  );
};

export default IntegrationProfilePanel;
