/* eslint-disable indent, react/jsx-indent */
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  ScalingModeTypeEnum,
  SensorCalibrationInfoDTO,
  UnitConversionModeEnum,
} from 'api/admin/api';
import { ReactComponent as DoubleArrowIcon } from 'assets/icons/white-double-arrow.svg';
import AccordionDetails from 'components/AccordionDetails';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EditorBox from 'components/EditorBox';
import { StaticAccordion } from 'components/StaticAccordion';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import {
  AdditionalPropertiesAccordion,
  AdditionalPropertiesAccordionDetails,
  AdditionalPropertiesAccordionSummary,
} from 'containers/DataChannelEditor/styles';
import { IS_DATA_CHANNEL_SENSOR_CALIBRATION_EDIT_FEATURE_ENABLED } from 'env';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import { labelWithOptionalText, valueWithOptionalText } from '../../helpers';
import {
  BoxTitle,
  StyledAccordionSummary,
  StyledEditButton,
  StyledEditIcon,
} from '../../styles';
import DetailsBoxWrapper from '../DetailsBoxWrapper';
import SensorCalibrationDrawer from '../SensorCalibrationDrawer';
import StyledLabelWithValue from '../StyledLabelWithValue';

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

const StyledDoubleArrowIcon = styled(DoubleArrowIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
  vertical-align: middle;
`;

const StyledTableBody = styled(TableBody)`
  & > tr > td:not(:last-child),
  & .MuiTableRow-root > .MuiTableCell-body:not(:last-child) {
    ${(props) =>
      props.theme.palette.type === 'dark' && `border-right: 1px solid #525252;`}
  }

  & > tr:not(:last-child) > td,
  & .MuiTableRow-root:not(:last-child) > .MuiTableCell-body {
    ${(props) =>
      props.theme.palette.type === 'dark' &&
      `border-bottom: 1px solid #525252;`};
  }
`;

// Table shown when scaling mode is mapped
const CustomSizedTable = styled(Table)`
  min-width: 500px;
`;

const PaddedHeadCell = styled(TableHeadCell)`
  padding: 12px 16px;
  width: 50%;
`;

const PaddedCell = styled(TableCell)`
  padding: 0px 16px;
`;

const makeData = (rowCount: number) => {
  return [...Array(rowCount)].map((_, i) => ({
    level: i,
    volume: i,
  }));
};

const tableData = makeData(20);

interface Props {
  sensorCalibration?: SensorCalibrationInfoDTO | null;
  dataChannelId?: string;
  canUpdateDataChannel?: boolean;
  tankType?: UnitConversionModeEnum | null;
}

const SensorCalibrationPanel = ({
  sensorCalibration,
  dataChannelId,
  canUpdateDataChannel,
  tankType,
}: Props) => {
  const { t } = useTranslation();

  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const [
    isAdditionalPropertiesExpanded,
    setIsAdditionalPropertiesExpanded,
  ] = React.useState(false);

  const handleToggleAdditionalPropertiesAccordion = (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    setIsAdditionalPropertiesExpanded(newExpanded);
  };

  const [
    isSensorCalibrationDrawerOpen,
    setIsSensorCalibrationDrawerOpen,
  ] = useState(false);

  const closeSensorCalibrationDrawer = () => {
    setIsSensorCalibrationDrawerOpen(false);
  };

  const saveAndExitCallback = () => {
    setIsSensorCalibrationDrawerOpen(false);
  };

  const openSensorCalibrationDrawer = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsSensorCalibrationDrawerOpen(true);
  };

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

  const linearRawMinValueWithUnits = valueWithOptionalText(
    linearRawMinValue,
    linearRawUnit
  );
  const linearRawMaxValueWithUnits = valueWithOptionalText(
    linearRawMaxValue,
    linearRawUnit
  );
  // #endregion linear rawParams

  // #region mapped rawParams
  const mappedRawMinValue =
    sensorCalibration?.mappedSensorCalibrationInfo?.rawParams
      ?.rawUnitsAtScaleMin;
  const mappedRawMaxValue =
    sensorCalibration?.mappedSensorCalibrationInfo?.rawParams
      ?.rawUnitsAtScaleMax;

  const mappedRawMinValueWithUnits = valueWithOptionalText(
    mappedRawMinValue,
    mappedRawUnit
  );
  const mappedRawMaxValueWithUnits = valueWithOptionalText(
    mappedRawMaxValue,
    mappedRawUnit
  );
  // #endregion mapped rawParams

  // #region linear prescalingRawParams
  const linearZeroScaleValue =
    sensorCalibration?.linearSensorCalibrationInfo?.prescalingRawParams
      ?.rawUnitsAtZero;
  const linearFullScaleValue =
    sensorCalibration?.linearSensorCalibrationInfo?.prescalingRawParams
      ?.rawUnitsAtFullScale;

  const linearZeroScaleValueWithUnits = valueWithOptionalText(
    linearZeroScaleValue,
    linearRawUnit
  );
  const linearFullScaleValueWithUnits = valueWithOptionalText(
    linearFullScaleValue,
    linearRawUnit
  );
  // #endregion linear prescalingRawParams

  // #region mapped prescalingRawParams
  const mappedZeroScaleValue =
    sensorCalibration?.mappedSensorCalibrationInfo?.prescalingRawParams
      ?.rawUnitsAtZero;
  const mappedFullScaleValue =
    sensorCalibration?.mappedSensorCalibrationInfo?.prescalingRawParams
      ?.rawUnitsAtFullScale;

  const mappedZeroScaleValueWithUnits = valueWithOptionalText(
    mappedZeroScaleValue,
    mappedRawUnit
  );
  const mappedFullScaleValueWithUnits = valueWithOptionalText(
    mappedFullScaleValue,
    mappedRawUnit
  );
  // #endregion mapped prescalingRawParams

  // #region linear limitsRawParams
  const linearLowLimitValue =
    sensorCalibration?.linearSensorCalibrationInfo?.limitsRawParams
      ?.rawUnitsAtUnderRange;
  const linearHighLimitValue =
    sensorCalibration?.linearSensorCalibrationInfo?.limitsRawParams
      ?.rawUnitsAtOverRange;

  const linearLowLimitValueWithUnits = valueWithOptionalText(
    linearLowLimitValue,
    linearRawUnit
  );
  const linearHighLimitValueWithUnits = valueWithOptionalText(
    linearHighLimitValue,
    linearRawUnit
  );
  // #endregion linear limitsRawParams

  // #region prescaled limitsRawParams with scaled units
  const prescaledLowLimitValue =
    sensorCalibration?.prescaledSensorCalibrationInfo?.limitsRawParams
      ?.rawUnitsAtUnderRange;
  const prescaledHighLimitValue =
    sensorCalibration?.prescaledSensorCalibrationInfo?.limitsRawParams
      ?.rawUnitsAtOverRange;

  const prescaledLowLimitValueWithUnits = valueWithOptionalText(
    prescaledLowLimitValue,
    sensorCalibration?.scaledUnitsAsText
  );
  const prescaledHighLimitValueWithUnits = valueWithOptionalText(
    prescaledHighLimitValue,
    sensorCalibration?.scaledUnitsAsText
  );
  // #endregion prescaled limitsRawParams with scaled units

  const sensorPositionValueWithUnits = valueWithOptionalText(
    sensorCalibration?.linearSensorCalibrationInfo?.sensorPosition,
    sensorCalibration?.scaledUnitsAsText
  );
  const scaledMinValueWithUnits = valueWithOptionalText(
    sensorCalibration?.scaledMin,
    sensorCalibration?.scaledUnitsAsText
  );
  const scaledMaxValueWithUnits = valueWithOptionalText(
    sensorCalibration?.scaledMax,
    sensorCalibration?.scaledUnitsAsText
  );

  return (
    <>
      <Drawer
        anchor="right"
        open={isSensorCalibrationDrawerOpen}
        onClose={closeSensorCalibrationDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <SensorCalibrationDrawer
            sensorCalibration={sensorCalibration}
            dataChannelId={dataChannelId}
            tankType={tankType}
            cancelCallback={closeSensorCalibrationDrawer}
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
                  {t('ui.dataChannel.sensorCalibration', 'Sensor Calibration')}
                </BoxTitle>
              </Grid>

              {canUpdateDataChannel &&
                IS_DATA_CHANNEL_SENSOR_CALIBRATION_EDIT_FEATURE_ENABLED &&
                sensorCalibration?.scalingModeId !==
                  ScalingModeTypeEnum.Mapped && (
                  <Grid item>
                    <StyledEditButton onClick={openSensorCalibrationDrawer}>
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
                  <Grid item>
                    <StyledLabelWithValue
                      label={t('ui.datachannel.scalingmode', 'Scaling Mode')}
                      value={sensorCalibration?.scalingModeAsText}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {isLinearScalingMode && (
                <Grid item md={4} xs={12}>
                  <Grid
                    container
                    spacing={2}
                    direction="column"
                    component={DetailsBoxWrapper}
                  >
                    <Grid item>
                      <StyledLabelWithValue
                        label={t('ui.datachannel.rawunits', 'Raw Units')}
                        value={linearRawUnit}
                      />
                    </Grid>
                    <Grid item>
                      <StyledLabelWithValue
                        label={t('ui.hornermessagetemplate.rawmin', 'Raw Min')}
                        value={linearRawMinValueWithUnits}
                      />
                    </Grid>
                    <Grid item>
                      <StyledLabelWithValue
                        label={t('ui.hornermessagetemplate.rawmax', 'Raw Max')}
                        value={linearRawMaxValueWithUnits}
                      />
                    </Grid>
                    <Grid item>
                      <StyledLabelWithValue
                        label={t(
                          'ui.datachannel.invertRawData',
                          'Invert Raw Data'
                        )}
                        value={formatBooleanToYesOrNoString(
                          sensorCalibration?.linearSensorCalibrationInfo
                            ?.rawParams?.isRawDataInverted,
                          t
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {isMappedScalingMode && (
                <Grid item md={4} xs={12}>
                  <Grid
                    container
                    spacing={2}
                    direction="column"
                    component={DetailsBoxWrapper}
                  >
                    <Grid item>
                      <StyledLabelWithValue
                        label={t('ui.datachannel.rawunits', 'Raw Units')}
                        value={mappedRawUnit}
                      />
                    </Grid>
                    <Grid item>
                      <StyledLabelWithValue
                        label={t('ui.hornermessagetemplate.rawmin', 'Raw Min')}
                        value={mappedRawMinValueWithUnits}
                      />
                    </Grid>
                    <Grid item>
                      <StyledLabelWithValue
                        label={t('ui.hornermessagetemplate.rawmax', 'Raw Max')}
                        value={mappedRawMaxValueWithUnits}
                      />
                    </Grid>
                    <Grid item>
                      <StyledLabelWithValue
                        label={t(
                          'ui.datachannel.invertRawData',
                          'Invert Raw Data'
                        )}
                        value={formatBooleanToYesOrNoString(
                          sensorCalibration?.mappedSensorCalibrationInfo
                            ?.rawParams?.isRawDataInverted,
                          t
                        )}
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
                      label={t('ui.datachannel.scaledunits', 'Scaled Units')}
                      value={sensorCalibration?.scaledUnitsAsText}
                    />
                  </Grid>
                  {isLinearScalingMode && (
                    <Grid item>
                      <StyledLabelWithValue
                        label={t(
                          'ui.datachannel.sensorposition',
                          'Sensor Position'
                        )}
                        value={sensorPositionValueWithUnits}
                      />
                    </Grid>
                  )}
                  <Grid item>
                    <StyledLabelWithValue
                      label={t('ui.datachannel.scaledmin', 'Scaled Min')}
                      value={scaledMinValueWithUnits}
                    />
                  </Grid>
                  <Grid item>
                    <StyledLabelWithValue
                      label={t('ui.datachannel.scaledmax', 'Scaled Max')}
                      value={scaledMaxValueWithUnits}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>

          <AdditionalPropertiesEditorBox p={0}>
            <AdditionalPropertiesAccordion
              square
              expanded={isAdditionalPropertiesExpanded}
              onChange={handleToggleAdditionalPropertiesAccordion}
            >
              <AdditionalPropertiesAccordionSummary
                disableRipple
                aria-controls="advanced-settings-content"
                id="advanced-settings-header"
              >
                <AdditionalPropertiesText>
                  {isAdditionalPropertiesExpanded ? (
                    <span>
                      <StyledDoubleArrowIcon />
                      {t(
                        'ui.dataChannelEditor.hideAdvancedSettings',
                        'Hide Advanced Settings'
                      )}
                    </span>
                  ) : (
                    <span>
                      <StyledDoubleArrowIcon
                        style={{ transform: 'rotate(180deg)' }}
                      />
                      {t(
                        'ui.dataChannelEditor.showAdvancedSettings',
                        'Show Advanced Settings'
                      )}
                    </span>
                  )}
                </AdditionalPropertiesText>
              </AdditionalPropertiesAccordionSummary>
              <AdditionalPropertiesAccordionDetails>
                <Grid container spacing={7}>
                  {/* Linear Scaling Mode - PreScalingRawParams  */}
                  {isLinearScalingMode && (
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
                          <>
                            <Grid item>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.dataChannelEditor.zeroScale',
                                  'Zero Scale'
                                )}
                                value={linearZeroScaleValueWithUnits}
                              />
                            </Grid>
                            <Grid item>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.dataChannelEditor.fullScale',
                                  'Full Scale'
                                )}
                                value={linearFullScaleValueWithUnits}
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  )}

                  {/* Mapped Scaling Mode - PreScalingRawParams */}
                  {isMappedScalingMode && (
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
                          <>
                            <Grid item>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.dataChannelEditor.zeroScale',
                                  'Zero Scale'
                                )}
                                value={mappedZeroScaleValueWithUnits}
                              />
                            </Grid>
                            <Grid item>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.dataChannelEditor.fullScale',
                                  'Full Scale'
                                )}
                                value={mappedFullScaleValueWithUnits}
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  )}

                  {/* Linear Scaling Mode - limitsRawParams/Limits */}
                  {isLinearScalingMode && (
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
                          <>
                            <Grid item>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.dataChannelEditor.lowLimit',
                                  'Low Limit'
                                )}
                                value={linearLowLimitValueWithUnits}
                              />
                            </Grid>
                            <Grid item>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.dataChannelEditor.highLimit',
                                  'High Limit'
                                )}
                                value={linearHighLimitValueWithUnits}
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  )}

                  {/* Prescaled Scaling Mode - limitsRawParams/Limits */}
                  {isPrescaledScalingMode && (
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
                              'ui.dataChannelEditor.enableLimits',
                              'Enable Limits'
                            )}
                            value={formatBooleanToYesOrNoString(
                              sensorCalibration?.prescaledSensorCalibrationInfo
                                ?.limitsRawParams?.useLimits,
                              t
                            )}
                          />
                        </Grid>
                        {sensorCalibration?.prescaledSensorCalibrationInfo
                          ?.limitsRawParams?.useLimits && (
                          <>
                            <Grid item>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.dataChannelEditor.lowLimit',
                                  'Low Limit'
                                )}
                                value={prescaledLowLimitValueWithUnits}
                              />
                            </Grid>
                            <Grid item>
                              <StyledLabelWithValue
                                label={t(
                                  'ui.dataChannelEditor.highLimit',
                                  'High Limit'
                                )}
                                value={prescaledHighLimitValueWithUnits}
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  )}

                  {/* Mapped Scaling Mode - Generate Map Table */}
                  {isMappedScalingMode && (
                    <Grid item xs={isBelowSmBreakpoint ? 12 : 8}>
                      <Grid
                        container
                        spacing={2}
                        direction="column"
                        component={DetailsBoxWrapper}
                      >
                        <Grid item xs={isBelowSmBreakpoint ? 12 : 6}>
                          <StyledLabelWithValue
                            label={t(
                              'ui.dataChannelEditor.generateMap',
                              'Generate Map'
                            )}
                            // TODO: back-end will need to make changes for
                            // this eventually(?)
                            // value={t(
                            //   'enum.generationfunctiontype.manual',
                            //   'Manual'
                            // )}
                            value=""
                          />
                        </Grid>
                        <Grid item>
                          <Grid
                            container
                            spacing={2}
                            direction="column"
                            component={DetailsBoxWrapper}
                          >
                            <Grid item>
                              <TableContainer>
                                <CustomSizedTable>
                                  <TableHead>
                                    <TableRow>
                                      <PaddedHeadCell>
                                        {rawUnitOnTableLabel}
                                      </PaddedHeadCell>
                                      <PaddedHeadCell>
                                        {scaledTableHeadCellLabel}
                                      </PaddedHeadCell>
                                    </TableRow>
                                  </TableHead>

                                  <StyledTableBody>
                                    {tableData.map((_, index) => (
                                      <TableRow
                                        style={{ height: 42 }}
                                        key={index}
                                      >
                                        <PaddedCell padding="none">
                                          {
                                            sensorCalibration
                                              ?.mappedSensorCalibrationInfo
                                              ?.scalingdMap?.[index]?.item1
                                          }
                                        </PaddedCell>

                                        <PaddedCell padding="none">
                                          {
                                            sensorCalibration
                                              ?.mappedSensorCalibrationInfo
                                              ?.scalingdMap?.[index]?.item2
                                          }
                                        </PaddedCell>
                                      </TableRow>
                                    ))}
                                  </StyledTableBody>
                                </CustomSizedTable>
                              </TableContainer>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </AdditionalPropertiesAccordionDetails>
            </AdditionalPropertiesAccordion>
          </AdditionalPropertiesEditorBox>
        </StaticAccordion>
      </Grid>
    </>
  );
};

export default SensorCalibrationPanel;
