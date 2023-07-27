/* eslint-disable indent */
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import Grid from '@material-ui/core/Grid';
import {
  DigitalInputSensorCalibrationInfoDTO,
  DataChannelReportDTO,
} from 'api/admin/api';
import AccordionDetails from 'components/AccordionDetails';
import { StaticAccordion } from 'components/StaticAccordion';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import {
  BoxTitle,
  StyledEditButton,
  StyledAccordionSummary,
  StyledEditIcon,
} from '../../styles';
import StyledLabelWithValue from '../StyledLabelWithValue';
import DigitalSensorCalibrationDrawer from '../DigitalSensorCalibrationDrawer';

interface Props {
  dataChannelDetails: DataChannelReportDTO | null | undefined;
  digitalInputSensorCalibration?: DigitalInputSensorCalibrationInfoDTO | null;
  canUpdateDataChannel?: boolean;
  openEventEditorWarningDialog: () => void;
}

const DigitalSensorCalibrationPanel = ({
  dataChannelDetails,
  digitalInputSensorCalibration,
  canUpdateDataChannel,
  openEventEditorWarningDialog,
}: Props) => {
  const { t } = useTranslation();

  const [
    isDigitalSensorCalibrationDrawerOpen,
    setIsDigitalSensorCalibrationDrawerOpen,
  ] = useState(false);

  const closeDigitalSensorCalibrationDrawer = () => {
    setIsDigitalSensorCalibrationDrawerOpen(false);
  };

  const openDigitalSensorCalibrationDrawer = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDigitalSensorCalibrationDrawerOpen(true);
  };

  const saveAndExitCallback = () => {
    closeDigitalSensorCalibrationDrawer();
  };

  const filteredDigitalStateProfiles = digitalInputSensorCalibration?.digitalStateProfiles?.filter(
    (profile) => profile.isConfigured
  );

  return (
    <>
      <Drawer
        anchor="right"
        open={isDigitalSensorCalibrationDrawerOpen}
        onClose={closeDigitalSensorCalibrationDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <DigitalSensorCalibrationDrawer
            dataChannelDetails={dataChannelDetails}
            cancelCallback={closeDigitalSensorCalibrationDrawer}
            digitalInputSensorCalibration={digitalInputSensorCalibration}
            saveAndExitCallback={saveAndExitCallback}
            openEventEditorWarningDialog={openEventEditorWarningDialog}
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
                  {t('ui.dataChannel.digitalSetup', 'Digital Setup')}
                </BoxTitle>
              </Grid>

              {canUpdateDataChannel && (
                <Grid item>
                  <StyledEditButton
                    onClick={openDigitalSensorCalibrationDrawer}
                  >
                    <StyledEditIcon />
                  </StyledEditButton>
                </Grid>
              )}
            </Grid>
          </StyledAccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item md={2} xs={4}>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <StyledLabelWithValue
                      label={t(
                        'ui.datachannel.invertRawData',
                        'Invert Raw Data'
                      )}
                      value={formatBooleanToYesOrNoString(
                        digitalInputSensorCalibration?.isRawDataInverted,
                        t
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={2} xs={4}>
                <Grid container spacing={2} direction="column">
                  {filteredDigitalStateProfiles?.map((digitalProfile) => {
                    return (
                      <Grid item>
                        <StyledLabelWithValue
                          showZeroNumberValue
                          label={t(
                            'ui.datachannel.stateIndexValue',
                            'State {{index}} Value',
                            {
                              index: digitalProfile.index,
                            }
                          )}
                          value={digitalProfile.value}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>

              <Grid item md={2} xs={4}>
                <Grid container spacing={2} direction="column">
                  {filteredDigitalStateProfiles?.map((digitalProfile) => {
                    return (
                      <Grid item>
                        <StyledLabelWithValue
                          label={t(
                            'ui.datachannel.stateIndexText',
                            'State {{index}} Text',
                            {
                              index: digitalProfile.index,
                            }
                          )}
                          value={digitalProfile.text}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </StaticAccordion>
      </Grid>
    </>
  );
};

export default DigitalSensorCalibrationPanel;
