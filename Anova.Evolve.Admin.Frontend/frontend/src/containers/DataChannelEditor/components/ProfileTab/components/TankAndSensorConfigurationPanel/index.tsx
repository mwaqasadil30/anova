/* eslint-disable indent, react/jsx-indent */
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelReportDTO,
  DataChannelCategory,
  ForecastMode,
  ScalingModeTypeEnum,
  SensorCalibrationInfoDTO,
  UnitConversionModeEnum,
} from 'api/admin/api';
import AccordionDetails from 'components/AccordionDetails';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EditorBox from 'components/EditorBox';
import { StaticAccordion } from 'components/StaticAccordion';
import {
  AdditionalPropertiesAccordion,
  AdditionalPropertiesAccordionDetails,
} from 'containers/DataChannelEditor/styles';
import { IS_DATA_CHANNEL_TANK_AND_SENSOR_CONFIGURATION_EDIT_FEATURE_ENABLED } from 'env';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import { labelWithOptionalText, valueWithOptionalText } from '../../helpers';
import {
  BoxTitle,
  CustomTable,
  PaddedCell,
  PaddedHeadCell,
  StyledAccordionButtonText,
  StyledAccordionSummary,
  StyledAdditionalDetailsAccordionSummary,
  StyledEditButton,
  StyledEditIcon,
  StyledExpandCaret,
  StyledTableBody,
  StyledTableContainer,
  StyledTableHead,
} from '../../styles';
import StyledLabelWithValue from '../StyledLabelWithValue';
import TankAndSensorConfigurationDrawer from '../TankAndSensorConfigurationDrawer';

const AdditionalPropertiesEditorBox = styled(EditorBox)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding: 0;
  box-shadow: none;
`;

const AdditionalPropertiesText = styled(Typography)`
  font-weight: 500;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const StyledAdditionalSettingsAccordion = styled(AdditionalPropertiesAccordion)`
  border-top: 0;
`;
const StyledAdditionalSettingsAccordionDetails = styled(
  AdditionalPropertiesAccordionDetails
)`
  padding: 0 0 16px 0;
`;

const makeData = (rowCount: number) => {
  return [...Array(rowCount)].map((_, i) => ({
    level: i,
    volume: i,
  }));
};

const tableData = makeData(20);

interface Props {
  dataChannelDetails?: DataChannelReportDTO | null;
  sensorCalibration?: SensorCalibrationInfoDTO | null;
  dataChannelId?: string;
  canUpdateDataChannel?: boolean;
  tankType?: UnitConversionModeEnum | null;
  openEventEditorWarningDialog: () => void;
}

const TankAndSensorConfigurationPanel = ({
  dataChannelDetails,
  sensorCalibration,
  dataChannelId,
  canUpdateDataChannel,
  openEventEditorWarningDialog,
}: Props) => {
  const { t } = useTranslation();

  const [
    isAdditionalSettingsExpanded,
    setIsAdditionalSettingsExpanded,
  ] = React.useState(false);

  const handleToggleAdditionalSettingsAccordion = (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    setIsAdditionalSettingsExpanded(newExpanded);
  };

  const [
    isDeliverySettingsExpanded,
    setIsDeliverySettingsExpanded,
  ] = React.useState(false);

  const handleToggleDeliverySettingsAccordion = (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    setIsDeliverySettingsExpanded(newExpanded);
  };

  const [
    isTankAndSensorConfigurationDrawerOpen,
    setIsTankAndSensorConfigurationDrawerOpen,
  ] = useState(false);

  const closeTankAndSensorConfigurationDrawer = () => {
    setIsTankAndSensorConfigurationDrawerOpen(false);
  };

  const saveAndExitCallback = () => {
    setIsTankAndSensorConfigurationDrawerOpen(false);
  };

  const openTankAndSensorConfigurationDrawer = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsTankAndSensorConfigurationDrawerOpen(true);
  };
  const isLevelDataChannel =
    dataChannelDetails?.dataChannelTypeId === DataChannelCategory.Level;
  const isPressureDataChannel =
    dataChannelDetails?.dataChannelTypeId === DataChannelCategory.Pressure;

  const getFormattedPanelTitle = () => {
    if (isPressureDataChannel) {
      return t('ui.dataChannel.sensorConfiguration', 'Sensor Configuration');
    }
    return t(
      'ui.dataChannel.tankAndSensorConfiguration',
      'Tank and Sensor Configuration'
    );
  };

  const formattedPanelTitle = getFormattedPanelTitle();

  const isTotalizedDataChannelType =
    dataChannelDetails?.dataChannelTypeId ===
    DataChannelCategory.TotalizedLevel;

  // #region sensor calibration-related logic
  const isLinearScalingMode =
    sensorCalibration?.scalingModeId === ScalingModeTypeEnum.Linear;

  const isMappedScalingMode =
    sensorCalibration?.scalingModeId === ScalingModeTypeEnum.Mapped;

  const isPrescaledScalingMode =
    sensorCalibration?.scalingModeId === ScalingModeTypeEnum.Prescaled;

  // Raw Units-related labels
  const rawUnitsText = isLinearScalingMode
    ? sensorCalibration?.linearSensorCalibrationInfo?.rawParams?.rawUnitsAsText
    : isMappedScalingMode
    ? sensorCalibration?.mappedSensorCalibrationInfo?.rawParams?.rawUnitsAsText
    : '';
  const rawUnitOnTableLabel = labelWithOptionalText(
    t('ui.datachannel.raw', 'Raw'),
    rawUnitsText
  );
  const scaledTableHeadCellLabel = labelWithOptionalText(
    t('ui.datachannel.scaled', 'Scaled'),
    sensorCalibration?.scaledUnitsAsText
  );

  const linearRawUnit =
    sensorCalibration?.linearSensorCalibrationInfo?.rawParams?.rawUnitsAsText;
  const mappedRawUnit =
    sensorCalibration?.mappedSensorCalibrationInfo?.rawParams?.rawUnitsAsText;

  // #region linear rawParams
  const linearRawMinValue =
    sensorCalibration?.linearSensorCalibrationInfo?.rawParams
      ?.rawUnitsAtScaleMin;
  const linearRawMaxValue =
    sensorCalibration?.linearSensorCalibrationInfo?.rawParams
      ?.rawUnitsAtScaleMax;

  const linearRawMinAndMaxWithUnits = valueWithOptionalText(
    linearRawMinValue,
    linearRawUnit,
    linearRawMaxValue
  );
  // #endregion linear rawParams

  // #region mapped rawParams
  const mappedRawMinValue =
    sensorCalibration?.mappedSensorCalibrationInfo?.rawParams
      ?.rawUnitsAtScaleMin;
  const mappedRawMaxValue =
    sensorCalibration?.mappedSensorCalibrationInfo?.rawParams
      ?.rawUnitsAtScaleMax;

  const mappedRawMinAndMaxWithUnits = valueWithOptionalText(
    mappedRawMinValue,
    mappedRawUnit,
    mappedRawMaxValue
  );
  // #endregion mapped rawParams

  // #region linear prescalingRawParams
  const linearZeroScaleValue =
    sensorCalibration?.linearSensorCalibrationInfo?.prescalingRawParams
      ?.rawUnitsAtZero;
  const linearFullScaleValue =
    sensorCalibration?.linearSensorCalibrationInfo?.prescalingRawParams
      ?.rawUnitsAtFullScale;

  const linearZeroAndFullScaleValueWithUnits = valueWithOptionalText(
    linearZeroScaleValue,
    linearRawUnit,
    linearFullScaleValue
  );
  // #endregion linear prescalingRawParams

  // #region mapped prescalingRawParams
  const mappedZeroScaleValue =
    sensorCalibration?.mappedSensorCalibrationInfo?.prescalingRawParams
      ?.rawUnitsAtZero;
  const mappedFullScaleValue =
    sensorCalibration?.mappedSensorCalibrationInfo?.prescalingRawParams
      ?.rawUnitsAtFullScale;

  const mappedZeroAndFullScaleValueWithUnits = valueWithOptionalText(
    mappedZeroScaleValue,
    mappedRawUnit,
    mappedFullScaleValue
  );
  // #endregion mapped prescalingRawParams

  // #region linear limitsRawParams
  const linearLowLimitValue =
    sensorCalibration?.linearSensorCalibrationInfo?.limitsRawParams
      ?.rawUnitsAtUnderRange;
  const linearHighLimitValue =
    sensorCalibration?.linearSensorCalibrationInfo?.limitsRawParams
      ?.rawUnitsAtOverRange;

  const linearLowAndHighLimitValueWithUnits = valueWithOptionalText(
    linearLowLimitValue,
    linearRawUnit,
    linearHighLimitValue
  );
  // #endregion linear limitsRawParams

  // #region prescaled limitsRawParams with scaled units
  const prescaledLowLimitValue =
    sensorCalibration?.prescaledSensorCalibrationInfo?.limitsRawParams
      ?.rawUnitsAtUnderRange;
  const prescaledHighLimitValue =
    sensorCalibration?.prescaledSensorCalibrationInfo?.limitsRawParams
      ?.rawUnitsAtOverRange;

  const prescaledLowAndHighLimitValueWithUnits = valueWithOptionalText(
    prescaledLowLimitValue,
    sensorCalibration?.scaledUnitsAsText,
    prescaledHighLimitValue
  );
  // #endregion prescaled limitsRawParams with scaled units

  const sensorPositionValueWithUnits = valueWithOptionalText(
    sensorCalibration?.linearSensorCalibrationInfo?.sensorPosition,
    sensorCalibration?.scaledUnitsAsText
  );
  const scaledMinAndMaxWithUnits = valueWithOptionalText(
    sensorCalibration?.scaledMin,
    sensorCalibration?.scaledUnitsAsText,
    sensorCalibration?.scaledMax
  );

  // #endregion sensor calibration-related logic

  // #region tank setup-related logic
  const tankSetupInfo = dataChannelDetails?.tankSetupInfo;
  const scaledUnits = dataChannelDetails?.sensorCalibration?.scaledUnitsAsText;

  const isBasicTank =
    tankSetupInfo?.unitConversionModeId === UnitConversionModeEnum.Basic;

  const isSimplifiedVolumetricTank =
    tankSetupInfo?.unitConversionModeId ===
    UnitConversionModeEnum.SimplifiedVolumetric;

  const isVolumetricTank =
    tankSetupInfo?.unitConversionModeId === UnitConversionModeEnum.Volumetric;

  const graphedMinAndMaxForAllTanks = () => {
    if (isBasicTank) {
      // NOTE: Basic Tank Types use scaled units
      return valueWithOptionalText(
        tankSetupInfo?.graphMin,
        scaledUnits,
        tankSetupInfo?.graphMax
      );
    }
    if (isSimplifiedVolumetricTank) {
      return valueWithOptionalText(
        tankSetupInfo?.graphMin,
        tankSetupInfo?.simplifiedTankSetupInfo?.displayUnitsAsText,
        tankSetupInfo?.graphMax
      );
    }
    if (isVolumetricTank) {
      return valueWithOptionalText(
        tankSetupInfo?.graphMin,
        tankSetupInfo?.volumetricTankSetupInfo?.displayUnitsAsText,
        tankSetupInfo?.graphMax
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

  // const volumetricTankCalcMaxProductHeightValueWithUnits = valueWithOptionalText(
  //   tankSetupInfo?.volumetricTankSetupInfo?.calculatedMaxProductHeight,
  //   tankSetupInfo?.volumetricTankSetupInfo?.displayUnitsAsText
  // );
  // #endregion tank setup-related logic

  // #region forecast and delivery-related logic
  const forecastAndDeliveryInfo = dataChannelDetails?.forecastDeliveryInfo;

  const totalizerDataChannelMaxTruckCapacityValueWithUnitsByTankType = () => {
    // Totalizer Data Channel Types
    if (
      isTotalizedDataChannelType &&
      dataChannelDetails?.tankSetupInfo === null
    ) {
      return valueWithOptionalText(
        forecastAndDeliveryInfo?.displayMaxTruckCapacity,
        // Totalized Data Channels are hardcoded to Ins WC
        t('enum.unittype.inswc', 'Ins WC')
      );
    }

    // This logic apparently will most likely not run
    if (isTotalizedDataChannelType && isBasicTank) {
      // NOTE: Basic Tank Types use scaled units
      return valueWithOptionalText(
        forecastAndDeliveryInfo?.displayMaxTruckCapacity,
        dataChannelDetails?.sensorCalibration?.scaledUnitsAsText
      );
    }
    if (isTotalizedDataChannelType && isSimplifiedVolumetricTank) {
      return valueWithOptionalText(
        forecastAndDeliveryInfo?.displayMaxTruckCapacity,
        dataChannelDetails?.tankSetupInfo?.simplifiedTankSetupInfo
          ?.displayUnitsAsText
      );
    }
    if (isTotalizedDataChannelType && isVolumetricTank) {
      return valueWithOptionalText(
        forecastAndDeliveryInfo?.displayMaxTruckCapacity,
        dataChannelDetails?.tankSetupInfo?.volumetricTankSetupInfo
          ?.displayUnitsAsText
      );
    }

    return '';
  };

  const manualUsageRateValueWithUnitsByTankType = () => {
    if (isBasicTank) {
      // NOTE: Basic Tank Types use scaled units
      return valueWithOptionalText(
        forecastAndDeliveryInfo?.manualUsageRate,
        `${dataChannelDetails?.sensorCalibration?.scaledUnitsAsText}${t(
          'report.common.perhour',
          '/hr'
        )}`
      );
    }
    if (isSimplifiedVolumetricTank) {
      return valueWithOptionalText(
        forecastAndDeliveryInfo?.manualUsageRate,
        `${
          dataChannelDetails?.tankSetupInfo?.simplifiedTankSetupInfo
            ?.displayUnitsAsText
        }${t('report.common.perhour', '/hr')}`
      );
    }
    if (isVolumetricTank) {
      return valueWithOptionalText(
        forecastAndDeliveryInfo?.manualUsageRate,
        `${
          dataChannelDetails?.tankSetupInfo?.volumetricTankSetupInfo
            ?.displayUnitsAsText
        }${t('report.common.perhour', '/hr')}`
      );
    }
    return '';
  };

  const minDeliveryAmountValueWithUnitsByTankType = () => {
    if (isBasicTank) {
      // NOTE: Basic Tank Types use scaled units
      return valueWithOptionalText(
        forecastAndDeliveryInfo?.displayMinFillThreshold,
        dataChannelDetails?.sensorCalibration?.scaledUnitsAsText
      );
    }
    if (isSimplifiedVolumetricTank) {
      return valueWithOptionalText(
        forecastAndDeliveryInfo?.displayMinFillThreshold,
        dataChannelDetails?.tankSetupInfo?.simplifiedTankSetupInfo
          ?.displayUnitsAsText
      );
    }
    if (isVolumetricTank) {
      return valueWithOptionalText(
        forecastAndDeliveryInfo?.displayMinFillThreshold,
        dataChannelDetails?.tankSetupInfo?.volumetricTankSetupInfo
          ?.displayUnitsAsText
      );
    }
    return '';
  };

  const maxTruckCapacityValueWithUnitsByTankType = () => {
    if (!isTotalizedDataChannelType && isBasicTank) {
      // NOTE: Basic Tank Types use scaled units
      return valueWithOptionalText(
        forecastAndDeliveryInfo?.displayMaxTruckCapacity,
        dataChannelDetails?.sensorCalibration?.scaledUnitsAsText
      );
    }
    if (!isTotalizedDataChannelType && isSimplifiedVolumetricTank) {
      return valueWithOptionalText(
        forecastAndDeliveryInfo?.displayMaxTruckCapacity,
        dataChannelDetails?.tankSetupInfo?.simplifiedTankSetupInfo
          ?.displayUnitsAsText
      );
    }
    if (!isTotalizedDataChannelType && isVolumetricTank) {
      return valueWithOptionalText(
        forecastAndDeliveryInfo?.displayMaxTruckCapacity,
        dataChannelDetails?.tankSetupInfo?.volumetricTankSetupInfo
          ?.displayUnitsAsText
      );
    }
    return '';
  };

  // #endregion forecast and delivery-related logic

  const showEditButtonForDataChannelTypes =
    isLevelDataChannel || isPressureDataChannel;

  return (
    <>
      <Drawer
        anchor="right"
        open={isTankAndSensorConfigurationDrawerOpen}
        onClose={closeTankAndSensorConfigurationDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <TankAndSensorConfigurationDrawer
            dataChannelDetails={dataChannelDetails}
            dataChannelId={dataChannelId}
            cancelCallback={closeTankAndSensorConfigurationDrawer}
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
                <BoxTitle>{formattedPanelTitle}</BoxTitle>
              </Grid>

              {canUpdateDataChannel &&
                showEditButtonForDataChannelTypes &&
                IS_DATA_CHANNEL_TANK_AND_SENSOR_CONFIGURATION_EDIT_FEATURE_ENABLED && (
                  <Grid item>
                    <StyledEditButton
                      onClick={openTankAndSensorConfigurationDrawer}
                    >
                      <StyledEditIcon />
                    </StyledEditButton>
                  </Grid>
                )}
            </Grid>
          </StyledAccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      {!isPressureDataChannel && (
                        <Grid item md={2} xs={3}>
                          <StyledLabelWithValue
                            label={t(
                              'ui.dataChannel.unitsConversionMode',
                              'Units Conversion Mode'
                            )}
                            value={tankSetupInfo?.unitConversionModeAsText}
                          />
                        </Grid>
                      )}

                      {isLevelDataChannel && (
                        <>
                          {isVolumetricTank ? (
                            <Grid item md={2} xs={3}>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.tankSetup.tankProfile',
                                  'Tank Profile'
                                )}
                                value={
                                  dataChannelDetails?.tankSetupInfo
                                    ?.tankTypeInfo?.tankDimensionDescription
                                }
                              />
                            </Grid>
                          ) : (
                            <Grid item md={2} xs={3}>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.datachannel.tanktype',
                                  'Tank Type'
                                )}
                                value={
                                  dataChannelDetails?.tankSetupInfo
                                    ?.tankTypeInfo?.tankTypeAsText
                                }
                              />
                            </Grid>
                          )}
                        </>
                      )}

                      {isTotalizedDataChannelType && (
                        <Grid item xs={4}>
                          <StyledLabelWithValue
                            label={t('ui.datachannel.tanktype', 'Tank Type')}
                            value={
                              dataChannelDetails?.tankSetupInfo?.tankTypeInfo
                                ?.tankTypeAsText
                            }
                          />
                        </Grid>
                      )}

                      <Grid item md={2} xs={3}>
                        <StyledLabelWithValue
                          label={t('ui.common.product', 'Product')}
                          value={
                            dataChannelDetails?.tankSetupInfo?.productName
                              ? dataChannelDetails?.tankSetupInfo.productName
                              : '-'
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item md={2} xs={3}>
                    <StyledLabelWithValue
                      label={t('ui.datachannel.scalingmode', 'Scaling Mode')}
                      value={sensorCalibration?.scalingModeAsText}
                    />
                  </Grid>

                  {isLinearScalingMode && (
                    <>
                      <Grid item md={2} xs={3}>
                        <StyledLabelWithValue
                          label={t(
                            'ui.datachannel.rawMinAndMax',
                            'Raw Min - Max'
                          )}
                          value={linearRawMinAndMaxWithUnits}
                        />
                      </Grid>
                    </>
                  )}

                  {isMappedScalingMode && (
                    <>
                      <Grid item md={2} xs={3}>
                        <StyledLabelWithValue
                          label={t(
                            'ui.datachannel.rawMinAndMax',
                            'Raw Min - Max'
                          )}
                          value={mappedRawMinAndMaxWithUnits}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item md={2} xs={3}>
                    <StyledLabelWithValue
                      label={t(
                        'ui.datachannel.scaledMinAndMax',
                        'Scaled Min - Max'
                      )}
                      value={scaledMinAndMaxWithUnits}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <AdditionalPropertiesEditorBox p={0}>
                  <StyledAdditionalSettingsAccordion
                    square
                    expanded={isAdditionalSettingsExpanded}
                    onChange={handleToggleAdditionalSettingsAccordion}
                  >
                    <StyledAdditionalDetailsAccordionSummary
                      disableRipple
                      aria-controls="advanced-settings-content"
                      id="additional-settings-header"
                    >
                      <AdditionalPropertiesText>
                        <Grid
                          container
                          spacing={1}
                          alignItems="center"
                          justify="flex-end"
                        >
                          <Grid item>
                            <StyledExpandCaret
                              style={{
                                transform: isAdditionalSettingsExpanded
                                  ? 'rotate(180deg)'
                                  : 'none',
                              }}
                            />
                          </Grid>
                          <Grid item>
                            {isAdditionalSettingsExpanded ? (
                              <StyledAccordionButtonText>
                                {t(
                                  'ui.dataChannelEditor.hideAdditionalSettings',
                                  'Hide Additional Settings'
                                )}
                              </StyledAccordionButtonText>
                            ) : (
                              <StyledAccordionButtonText>
                                {t(
                                  'ui.dataChannelEditor.showAdditionalSettings',
                                  'Show Additional Settings'
                                )}
                              </StyledAccordionButtonText>
                            )}
                          </Grid>
                        </Grid>
                      </AdditionalPropertiesText>
                    </StyledAdditionalDetailsAccordionSummary>
                    <StyledAdditionalSettingsAccordionDetails>
                      <Grid container spacing={3} style={{ padding: 0 }}>
                        {/* Linear Scaling Mode - PreScalingRawParams  */}
                        {isLinearScalingMode && (
                          <>
                            <Grid item md={2} xs={3}>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.dataChannelEditor.enablePrescaling',
                                  'Enable Prescaling'
                                )}
                                value={formatBooleanToYesOrNoString(
                                  sensorCalibration?.linearSensorCalibrationInfo
                                    ?.prescalingRawParams?.usePrescaling,
                                  t
                                )}
                              />
                            </Grid>
                            {sensorCalibration?.linearSensorCalibrationInfo
                              ?.prescalingRawParams?.usePrescaling && (
                              <Grid item md={2} xs={3}>
                                <StyledLabelWithValue
                                  label={t(
                                    'ui.dataChannelEditor.zeroToFullScale',
                                    'Zero - Full Scale'
                                  )}
                                  value={linearZeroAndFullScaleValueWithUnits}
                                />
                              </Grid>
                            )}
                          </>
                        )}

                        {/* Linear Scaling Mode - limitsRawParams/Limits */}
                        {isLinearScalingMode && (
                          <>
                            <Grid item md={2} xs={3}>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.dataChannelEditor.enableLimits',
                                  'Enable Limits'
                                )}
                                value={formatBooleanToYesOrNoString(
                                  sensorCalibration?.linearSensorCalibrationInfo
                                    ?.limitsRawParams?.useLimits,
                                  t
                                )}
                              />
                            </Grid>
                            {sensorCalibration?.linearSensorCalibrationInfo
                              ?.limitsRawParams?.useLimits && (
                              <Grid item md={2} xs={3}>
                                <StyledLabelWithValue
                                  label={t(
                                    'ui.dataChannelEditor.lowToHighLimit',
                                    'Low - High Limit'
                                  )}
                                  value={linearLowAndHighLimitValueWithUnits}
                                />
                              </Grid>
                            )}
                            {!isPressureDataChannel && (
                              <>
                                <Grid item md={2} xs={3}>
                                  <StyledLabelWithValue
                                    label={t(
                                      'ui.datachannel.invertRawData',
                                      'Invert Raw Data'
                                    )}
                                    value={formatBooleanToYesOrNoString(
                                      sensorCalibration
                                        ?.linearSensorCalibrationInfo?.rawParams
                                        ?.isRawDataInverted,
                                      t
                                    )}
                                  />
                                </Grid>
                                <Grid item md={2} xs={3}>
                                  <StyledLabelWithValue
                                    label={t(
                                      'ui.datachannel.sensorposition',
                                      'Sensor Position'
                                    )}
                                    value={sensorPositionValueWithUnits}
                                  />
                                </Grid>
                              </>
                            )}
                          </>
                        )}

                        {/* Mapped Scaling Mode - PreScalingRawParams */}
                        {isMappedScalingMode && (
                          <>
                            <Grid item md={2} xs={3}>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.dataChannelEditor.enablePrescaling',
                                  'Enable Prescaling'
                                )}
                                value={formatBooleanToYesOrNoString(
                                  sensorCalibration?.mappedSensorCalibrationInfo
                                    ?.prescalingRawParams?.usePrescaling,
                                  t
                                )}
                              />
                            </Grid>
                            {sensorCalibration?.mappedSensorCalibrationInfo
                              ?.prescalingRawParams?.usePrescaling && (
                              <Grid item md={2} xs={3}>
                                <StyledLabelWithValue
                                  label={t(
                                    'ui.dataChannelEditor.zeroToFullScale',
                                    'Zero - Full Scale'
                                  )}
                                  value={mappedZeroAndFullScaleValueWithUnits}
                                />
                              </Grid>
                            )}
                          </>
                        )}

                        {/* Prescaled Scaling Mode - limitsRawParams/Limits */}
                        {isPrescaledScalingMode && (
                          <>
                            <Grid item md={2} xs={3}>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.dataChannelEditor.enableLimits',
                                  'Enable Limits'
                                )}
                                value={formatBooleanToYesOrNoString(
                                  sensorCalibration
                                    ?.prescaledSensorCalibrationInfo
                                    ?.limitsRawParams?.useLimits,
                                  t
                                )}
                              />
                            </Grid>
                            {sensorCalibration?.prescaledSensorCalibrationInfo
                              ?.limitsRawParams?.useLimits && (
                              <Grid item md={2} xs={3}>
                                <StyledLabelWithValue
                                  label={t(
                                    'ui.dataChannelEditor.lowToHighLimit',
                                    'Low - High Limit'
                                  )}
                                  value={prescaledLowAndHighLimitValueWithUnits}
                                />
                              </Grid>
                            )}
                          </>
                        )}

                        {/* Mapped Scaling Mode - Generate Map Table */}
                        {isMappedScalingMode && (
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item lg={7} sm={9} xs={12}>
                                <StyledTableContainer>
                                  <CustomTable>
                                    <StyledTableHead>
                                      <TableRow>
                                        <PaddedHeadCell>
                                          {rawUnitOnTableLabel}
                                        </PaddedHeadCell>
                                        <PaddedHeadCell>
                                          {scaledTableHeadCellLabel}
                                        </PaddedHeadCell>
                                      </TableRow>
                                    </StyledTableHead>

                                    <StyledTableBody>
                                      {tableData.map((_, index) => (
                                        <TableRow
                                          style={{ height: 42 }}
                                          key={index}
                                        >
                                          <PaddedCell>
                                            {
                                              sensorCalibration
                                                ?.mappedSensorCalibrationInfo
                                                ?.scalingdMap?.[index]?.item1
                                            }
                                          </PaddedCell>

                                          <PaddedCell>
                                            {
                                              sensorCalibration
                                                ?.mappedSensorCalibrationInfo
                                                ?.scalingdMap?.[index]?.item2
                                            }
                                          </PaddedCell>
                                        </TableRow>
                                      ))}
                                    </StyledTableBody>
                                  </CustomTable>
                                </StyledTableContainer>
                              </Grid>
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                    </StyledAdditionalSettingsAccordionDetails>
                  </StyledAdditionalSettingsAccordion>
                </AdditionalPropertiesEditorBox>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={3}>
                  {isBasicTank && !isPressureDataChannel && (
                    <Grid item md={2} xs={3}>
                      <StyledLabelWithValue
                        label={t(
                          'ui.datachannel.maxProductCapacity',
                          'Max Product Capacity'
                        )}
                        value={basicTankMaxProductCapacityValueWithUnits}
                      />
                    </Grid>
                  )}
                  {isSimplifiedVolumetricTank && (
                    <>
                      <Grid item md={2} xs={3}>
                        <StyledLabelWithValue
                          label={t(
                            'ui.datachannel.maxProductCapacity',
                            'Max Product Capacity'
                          )}
                          value={simplifiedTankMaxProductCapacityValueWithUnits}
                        />
                      </Grid>
                      <Grid item md={2} xs={3}>
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
                    </>
                  )}
                  {isVolumetricTank && (
                    <>
                      <Grid item md={2} xs={3}>
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
                      {/* NOTE: Temporarily removed */}
                      {/* <Grid item md={2} xs={3}>
                      <StyledLabelWithValue
                        label={t(
                          'ui.datachannel.calculatedMaxProductHeight',
                          'Calculated Max Product Height'
                        )}
                        value={volumetricTankCalcMaxProductHeightValueWithUnits}
                      />
                    </Grid> */}
                    </>
                  )}
                  <Grid item md={2} xs={3}>
                    <StyledLabelWithValue
                      label={t(
                        'ui.datachannel.graphMinAndMax',
                        'Graph Min - Max'
                      )}
                      value={graphedMinAndMaxForAllTanks()}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {!isPressureDataChannel && (
                <Grid item xs={12}>
                  <AdditionalPropertiesEditorBox p={0}>
                    <StyledAdditionalSettingsAccordion
                      square
                      expanded={isDeliverySettingsExpanded}
                      onChange={handleToggleDeliverySettingsAccordion}
                    >
                      <StyledAdditionalDetailsAccordionSummary
                        disableRipple
                        aria-controls="delivery-settings-content"
                        id="delivery-settings-header"
                      >
                        <AdditionalPropertiesText>
                          <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            justify="flex-end"
                          >
                            <Grid item>
                              <StyledExpandCaret
                                style={{
                                  transform: isDeliverySettingsExpanded
                                    ? 'rotate(180deg)'
                                    : 'none',
                                }}
                              />
                            </Grid>
                            <Grid item>
                              {isDeliverySettingsExpanded ? (
                                <StyledAccordionButtonText>
                                  {t(
                                    'ui.dataChannelEditor.hideDeliverySettings',
                                    'Hide Delivery Settings'
                                  )}
                                </StyledAccordionButtonText>
                              ) : (
                                <StyledAccordionButtonText>
                                  {t(
                                    'ui.dataChannelEditor.showDeliverySettings',
                                    'Show Delivery Settings'
                                  )}
                                </StyledAccordionButtonText>
                              )}
                            </Grid>
                          </Grid>
                        </AdditionalPropertiesText>
                      </StyledAdditionalDetailsAccordionSummary>
                      <StyledAdditionalSettingsAccordionDetails>
                        <Grid container spacing={3} style={{ padding: 0 }}>
                          {/* Linear Scaling Mode - PreScalingRawParams  */}
                          {isTotalizedDataChannelType && (
                            <Grid item md={2} xs={3}>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.dataChannelEditor.maxTruckCapacity',
                                  'Max Truck Capacity'
                                )}
                                value={totalizerDataChannelMaxTruckCapacityValueWithUnitsByTankType()}
                              />
                            </Grid>
                          )}

                          {!isTotalizedDataChannelType && (
                            <>
                              {forecastAndDeliveryInfo?.forecastModeTypeId ===
                                ForecastMode.ManualUsageRate && (
                                <Grid item md={2} xs={3}>
                                  <StyledLabelWithValue
                                    label={t(
                                      'enum.forecastmodetype.manualusagerate',
                                      'Manual Usage Rate'
                                    )}
                                    value={manualUsageRateValueWithUnitsByTankType()}
                                  />
                                </Grid>
                              )}
                              <Grid item md={2} xs={3}>
                                <StyledLabelWithValue
                                  label={t(
                                    'ui.dataChannelEditor.minDeliveryAmountToDetermineFill',
                                    'Min Delivery Amount To Determine Fill'
                                  )}
                                  value={minDeliveryAmountValueWithUnitsByTankType()}
                                />
                              </Grid>
                              <Grid item md={2} xs={3}>
                                <StyledLabelWithValue
                                  label={t(
                                    'ui.dataChannelEditor.maxTruckCapacity',
                                    'Max Truck Capacity'
                                  )}
                                  value={maxTruckCapacityValueWithUnitsByTankType()}
                                />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </StyledAdditionalSettingsAccordionDetails>
                    </StyledAdditionalSettingsAccordion>
                  </AdditionalPropertiesEditorBox>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </StaticAccordion>
      </Grid>
    </>
  );
};

export default TankAndSensorConfigurationPanel;
