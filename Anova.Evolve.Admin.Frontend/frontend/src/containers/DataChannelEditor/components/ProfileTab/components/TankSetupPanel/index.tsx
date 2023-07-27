/* eslint-disable indent, react/jsx-indent */
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  DataChannelReportDTO,
  DataChannelCategory,
  ScalingModeTypeEnum,
  TankSetupInfoDTO,
  UnitConversionModeEnum,
} from 'api/admin/api';
import AccordionDetails from 'components/AccordionDetails';
import AccordionSummary from 'components/AccordionSummary';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import { StaticAccordion } from 'components/StaticAccordion';
import { IS_DATA_CHANNEL_TANK_SETUP_EDIT_FEATURE_ENABLED } from 'env';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { darkTheme } from 'styles/theme';
import { valueWithOptionalText } from '../../helpers';
import { StyledEditButton, StyledEditIcon } from '../../styles';
import DetailsBoxWrapper from '../DetailsBoxWrapper';
import StyledLabelWithValue from '../StyledLabelWithValue';
import TankSetupDrawer from '../TankSetupDrawer';

const StyledAccordionSummary = styled(AccordionSummary)`
  &.MuiAccordionSummary-root {
    background: #515151;
  }
`;

const BoxTitle = styled(Typography)`
  color: ${darkTheme.palette?.text?.primary};
  font-size: 14px;
`;

interface Props {
  dataChannelDetails: DataChannelReportDTO | null | undefined;
  dataChannelId?: string;
  tankSetupInfo?: TankSetupInfoDTO | null;
  scaledUnits?: string | null;
  canUpdateDataChannel?: boolean;
}

const TankSetupPanel = ({
  dataChannelDetails,
  dataChannelId,
  tankSetupInfo,
  scaledUnits,
  canUpdateDataChannel,
}: Props) => {
  const { t } = useTranslation();

  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const [isTankSetupDrawerOpen, setIsTankSetupDrawerOpen] = useState(false);

  const closeTankSetupDrawer = () => {
    setIsTankSetupDrawerOpen(false);
  };

  const openTankSetupDrawer = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsTankSetupDrawerOpen(true);
  };

  const saveAndExitCallback = () => {
    setIsTankSetupDrawerOpen(false);
  };

  const isBasicTank =
    tankSetupInfo?.unitConversionModeId === UnitConversionModeEnum.Basic;

  const isSimplifiedVolumetricTank =
    tankSetupInfo?.unitConversionModeId ===
    UnitConversionModeEnum.SimplifiedVolumetric;

  const isVolumetricTank =
    tankSetupInfo?.unitConversionModeId === UnitConversionModeEnum.Volumetric;

  const graphedMinForAllTanks = () => {
    if (isBasicTank) {
      // NOTE: Basic Tank Types use scaled units
      return valueWithOptionalText(tankSetupInfo?.graphMin, scaledUnits);
    }
    if (isSimplifiedVolumetricTank) {
      return valueWithOptionalText(
        tankSetupInfo?.graphMin,
        tankSetupInfo?.simplifiedTankSetupInfo?.displayUnitsAsText
      );
    }
    if (isVolumetricTank) {
      return valueWithOptionalText(
        tankSetupInfo?.graphMin,
        tankSetupInfo?.volumetricTankSetupInfo?.displayUnitsAsText
      );
    }
    return '';
  };

  const graphedMaxForAllTanks = () => {
    if (isBasicTank) {
      // NOTE: Basic Tank uses scaled units
      return valueWithOptionalText(tankSetupInfo?.graphMax, scaledUnits);
    }
    if (isSimplifiedVolumetricTank) {
      return valueWithOptionalText(
        tankSetupInfo?.graphMax,
        tankSetupInfo?.simplifiedTankSetupInfo?.displayUnitsAsText
      );
    }
    if (isVolumetricTank) {
      return valueWithOptionalText(
        tankSetupInfo?.graphMax,
        tankSetupInfo?.volumetricTankSetupInfo?.displayUnitsAsText
      );
    }
    return '';
  };

  const basicTankMaxProductCapacityValueWithUnits = valueWithOptionalText(
    tankSetupInfo?.basicTankSetupInfo?.maxProductHeight,
    scaledUnits
  );

  const simplifiedTankMaxProductCapacityValueWithUnits = valueWithOptionalText(
    tankSetupInfo?.simplifiedTankSetupInfo?.maxProductHeight,
    scaledUnits
  );

  const simplifiedTankDisplayMaxProductCapacityValueWithUnits = valueWithOptionalText(
    tankSetupInfo?.simplifiedTankSetupInfo?.displayMaxProductHeight,
    tankSetupInfo?.simplifiedTankSetupInfo?.displayUnitsAsText
  );

  const volumetricTankDisplayMaxProductCapacityValueWithUnits = valueWithOptionalText(
    tankSetupInfo?.volumetricTankSetupInfo?.displayMaxProductHeight,
    tankSetupInfo?.volumetricTankSetupInfo?.displayUnitsAsText
  );

  const volumetricTankCalcMaxProductHeightValueWithUnits = valueWithOptionalText(
    tankSetupInfo?.volumetricTankSetupInfo?.calculatedMaxProductHeight,
    tankSetupInfo?.volumetricTankSetupInfo?.displayUnitsAsText
  );

  const isMappedScalingMode =
    dataChannelDetails?.sensorCalibration?.scalingModeId ===
    ScalingModeTypeEnum.Mapped;

  return (
    <>
      <Drawer
        anchor="right"
        open={isTankSetupDrawerOpen}
        onClose={closeTankSetupDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <TankSetupDrawer
            dataChannelDetails={dataChannelDetails}
            dataChannelId={dataChannelId}
            scaledUnits={scaledUnits}
            tankSetupInfo={tankSetupInfo}
            cancelCallback={closeTankSetupDrawer}
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
                  {t('ui.dataChannel.tankSetup', 'Tank Setup')}
                </BoxTitle>
              </Grid>

              {canUpdateDataChannel &&
                // Show edit button only if scaling mode is NOT mapped
                !isMappedScalingMode &&
                IS_DATA_CHANNEL_TANK_SETUP_EDIT_FEATURE_ENABLED && (
                  <Grid item>
                    <StyledEditButton onClick={openTankSetupDrawer}>
                      <StyledEditIcon />
                    </StyledEditButton>
                  </Grid>
                )}
            </Grid>
          </StyledAccordionSummary>
          <AccordionDetails>
            <Grid container spacing={isBelowSmBreakpoint ? 5 : 7}>
              <Grid item md={4} xs={12}>
                <Grid
                  container
                  spacing={2}
                  direction="column"
                  component={DetailsBoxWrapper}
                >
                  {dataChannelDetails?.dataChannelTypeId ===
                    DataChannelCategory.Level && (
                    <>
                      {dataChannelDetails?.tankSetupInfo?.tankTypeInfo
                        ?.isTankProfileSet ? (
                        <Grid item>
                          <StyledLabelWithValue
                            label={t(
                              'ui.tankSetup.tankProfile',
                              'Tank Profile'
                            )}
                            value={
                              dataChannelDetails?.tankSetupInfo?.tankTypeInfo
                                ?.tankDimensionDescription
                            }
                          />
                        </Grid>
                      ) : (
                        <Grid item>
                          <StyledLabelWithValue
                            label={t('ui.datachannel.tanktype', 'Tank Type')}
                            value={
                              dataChannelDetails?.tankSetupInfo?.tankTypeInfo
                                ?.tankTypeAsText
                            }
                          />
                        </Grid>
                      )}
                    </>
                  )}

                  {dataChannelDetails?.dataChannelTypeId ===
                    DataChannelCategory.TotalizedLevel && (
                    <Grid item>
                      <StyledLabelWithValue
                        label={t('ui.datachannel.tanktype', 'Tank Type')}
                        value={
                          dataChannelDetails?.tankSetupInfo?.tankTypeInfo
                            ?.tankTypeAsText
                        }
                      />
                    </Grid>
                  )}

                  <Grid item>
                    <StyledLabelWithValue
                      label={t(
                        'ui.dataChannel.unitsConversionMode',
                        'Units Conversion Mode'
                      )}
                      value={tankSetupInfo?.unitConversionModeAsText}
                    />
                  </Grid>

                  {/* Product shifts to the second grid item when tank is Basic */}
                  {!isBasicTank && (
                    <Grid item>
                      <StyledLabelWithValue
                        label={t('ui.common.product', 'Product')}
                        value={
                          dataChannelDetails?.tankSetupInfo?.productName
                            ? dataChannelDetails?.tankSetupInfo.productName
                            : '-'
                        }
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>

              {isBasicTank && (
                <Grid item md={4} xs={12}>
                  <Grid
                    container
                    spacing={2}
                    direction="column"
                    component={DetailsBoxWrapper}
                  >
                    <Grid item>
                      <StyledLabelWithValue
                        label={t('ui.common.product', 'Product')}
                        value={
                          dataChannelDetails?.tankSetupInfo?.productName
                            ? dataChannelDetails?.tankSetupInfo.productName
                            : '-'
                        }
                      />
                    </Grid>
                    <Grid item>
                      <StyledLabelWithValue
                        label={t(
                          'ui.datachannel.maxProductCapacity',
                          'Max Product Capacity'
                        )}
                        value={basicTankMaxProductCapacityValueWithUnits}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {isSimplifiedVolumetricTank && (
                <Grid item md={4} xs={12}>
                  <Grid
                    container
                    spacing={2}
                    direction="column"
                    component={DetailsBoxWrapper}
                  >
                    <Grid item>
                      <StyledLabelWithValue
                        label={t(
                          'ui.datachannel.maxProductCapacity',
                          'Max Product Capacity'
                        )}
                        value={simplifiedTankMaxProductCapacityValueWithUnits}
                      />
                    </Grid>
                    <Grid item>
                      <StyledLabelWithValue
                        label={t(
                          'ui.datachannel.displayunits',
                          'Display Units'
                        )}
                        value={
                          tankSetupInfo?.simplifiedTankSetupInfo
                            ?.displayUnitsAsText
                        }
                      />
                    </Grid>
                    <Grid item>
                      <StyledLabelWithValue
                        label={t(
                          'ui.datachannel.displayMaxProductCapacity',
                          'Display Max Product Capacity'
                        )}
                        value={
                          simplifiedTankDisplayMaxProductCapacityValueWithUnits
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {isVolumetricTank && (
                <Grid item md={4} xs={12}>
                  <Grid
                    container
                    spacing={2}
                    direction="column"
                    component={DetailsBoxWrapper}
                  >
                    <Grid item>
                      <StyledLabelWithValue
                        label={t(
                          'ui.datachannel.displayunits',
                          'Display Units'
                        )}
                        value={
                          tankSetupInfo?.volumetricTankSetupInfo
                            ?.displayUnitsAsText
                        }
                      />
                    </Grid>
                    <Grid item>
                      <StyledLabelWithValue
                        label={t(
                          'ui.datachannel.displayMaxProductCapacity',
                          'Display Max Product Capacity'
                        )}
                        value={
                          volumetricTankDisplayMaxProductCapacityValueWithUnits
                        }
                      />
                    </Grid>
                    <Grid item>
                      <StyledLabelWithValue
                        label={t(
                          'ui.datachannel.calculatedMaxProductHeight',
                          'Calculated Max Product Height'
                        )}
                        value={volumetricTankCalcMaxProductHeightValueWithUnits}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              <Grid item md={4} xs={12}>
                <Grid
                  container
                  spacing={2}
                  direction="column"
                  component={DetailsBoxWrapper}
                >
                  <Grid item>
                    <StyledLabelWithValue
                      label={t('ui.datachannel.graphmin', 'Graph Min')}
                      value={graphedMinForAllTanks()}
                    />
                  </Grid>
                  <Grid item>
                    <StyledLabelWithValue
                      label={t('ui.datachannel.graphmax', 'Graph Max')}
                      value={graphedMaxForAllTanks()}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </StaticAccordion>
      </Grid>
    </>
  );
};

export default TankSetupPanel;
