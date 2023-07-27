/* eslint-disable indent, react/jsx-indent */
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelRawUnitsDTO,
  DataChannelReportDTO,
  DataChannelScaledUnitsDTO,
  DataChannelTankDimensionsMapPointDTO,
  DataChannelCategory,
  GenerateScalingMapDTO,
  RtuChannelSetpointsSyncTypeEnum,
  ScalingModeTypeEnum,
  SensorCalibrationInfoDTO,
  UnitConversionModeEnum,
} from 'api/admin/api';
import { ValueTupleOfDoubleAndDoubleWithKey } from 'apps/ops/types';
import { ReactComponent as ApplyGearIcon } from 'assets/icons/gear.svg';
import { ReactComponent as SortIcon } from 'assets/icons/mapped-sort-icon.svg';
import Button from 'components/Button';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import EditorBox from 'components/EditorBox';
import FormErrorAlert from 'components/FormErrorAlert';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import FreeSoloAutocomplete from 'components/forms/form-fields/FreeSoloAutocomplete';
import SwitchWithLabel from 'components/forms/form-fields/SwitchWithLabel';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import TextField from 'components/forms/styled-fields/StyledTextField';
import ImportCsvButton from 'components/ImportCsvButton';
import PageSubHeader from 'components/PageSubHeader';
import TableBody from 'components/tables/components/TableBody';
import { useGetGenerateDataChannelMapPoints } from 'containers/DataChannelEditor/hooks/useGetGenerateDataChannelMapPoints';
import {
  AdditionalPropertiesAccordion,
  AdditionalPropertiesAccordionDetails,
  AdditionalPropertiesAccordionSummary,
} from 'containers/DataChannelEditor/styles';
import { Field, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { useUpdateEffect } from 'react-use';
import styled from 'styled-components';
import { isNumber } from 'utils/format/numbers';
import { getScalingModeTypeOptionsForSensorCalibration } from 'utils/i18n/enum-to-text';
import { labelWithOptionalText } from '../../../helpers';
import {
  CustomTable,
  PaddedHeadCell,
  StyledAccordionButtonText,
  StyledExpandCaret,
  StyledFieldLabelText,
  StyledTableContainer,
  StyledTableHead,
} from '../../../styles';
import DetailsBoxWrapper from '../../DetailsBoxWrapper';
import { GenerateFunctionType, Values } from '../types';

const StyledEditorBox = styled(EditorBox)`
  border-radius: 10px 10px 0 0;
`;

const StyledImportErrorDialogText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 500;
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
      `border-bottom: 1px solid #525252;`}
  }
`;

const TableCellWithField = styled(TableCell)`
  vertical-align: top;
`;

const StyledApplyButton = styled(Button)`
  padding: 7px 14px;
`;

const AdditionalPropertiesEditorBox = styled(EditorBox)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

const AdditionalPropertiesText = styled(Typography)`
  font-weight: 500;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const StyledTextField = styled(TextField)`
  & .MuiInput-root {
    height: 44px;
    border: 0;
    border-radius: 0;
  }
  & .MuiInput-root.Mui-focused,
  & .MuiInput-root:hover {
    border: 0;
  }

  & .MuiFormHelperText-root {
    margin-left: 8px;
  }
`;

const StyledAdditionalPropertiesAccordionDetails = styled(
  AdditionalPropertiesAccordionDetails
)`
  padding: 16px 24px 24px 24px;
`;

interface Props {
  values: Values;
  dataChannelDetails?: DataChannelReportDTO | null;
  dataChannelId?: string;
  hasErrorsInAdditionalSettingsExpansionPanel?: boolean;
  sensorCalibration?: SensorCalibrationInfoDTO | null;
  rawUnitsOptions?: DataChannelRawUnitsDTO;
  scaledUnitsOptions?: DataChannelScaledUnitsDTO;
  isSubmitting: boolean;
  getRawUnitsApi: UseQueryResult<DataChannelRawUnitsDTO, unknown>;
  getScaledUnitsApi: UseQueryResult<DataChannelScaledUnitsDTO, unknown>;
  status: FormikProps<Values>['status'];
  setFieldValue: FormikProps<Values>['setFieldValue'];
  setValues: FormikHelpers<Values>['setValues'];
}

const ScalingContainer = ({
  values,
  dataChannelDetails,
  hasErrorsInAdditionalSettingsExpansionPanel,
  sensorCalibration,
  rawUnitsOptions,
  scaledUnitsOptions,
  isSubmitting,
  getRawUnitsApi,
  getScaledUnitsApi,
  status,
  setFieldValue,
  setValues,
}: Props) => {
  const { t } = useTranslation();

  const isPressureDataChannel =
    dataChannelDetails?.dataChannelTypeId === DataChannelCategory.Pressure;

  useUpdateEffect(() => {
    setFieldValue(
      'rtuChannelSetpointsSyncTypeId',
      values.matchRtuChannel
        ? RtuChannelSetpointsSyncTypeEnum.AutoSync
        : RtuChannelSetpointsSyncTypeEnum.Disabled
    );
  }, [values.matchRtuChannel]);

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

  // Open the Additional Properties accordion/expansion panel if any fields
  // within it have errors after submitting the form
  useEffect(() => {
    if (
      hasErrorsInAdditionalSettingsExpansionPanel ||
      status?.errors?.scalingdMap
    ) {
      setIsAdditionalPropertiesExpanded(true);
    }
  }, [hasErrorsInAdditionalSettingsExpansionPanel, status]);

  const isLinearScalingMode =
    sensorCalibration?.scalingModeId === ScalingModeTypeEnum.Linear;
  const isMappedScalingMode =
    sensorCalibration?.scalingModeId === ScalingModeTypeEnum.Mapped;

  const isVolumetricTankType =
    values.unitConversionModeId === UnitConversionModeEnum.Volumetric;

  // Scaled Units-related labels
  const getScaledUnitsText = () => {
    if (isVolumetricTankType) {
      return values.scaledUnitsAsText;
    }

    if (!isVolumetricTankType && isLinearScalingMode) {
      return values.scaledUnitsAsText;
    }

    if (!isVolumetricTankType && isMappedScalingMode) {
      return values.scaledUnitsAsText;
    }
    return '';
  };

  const scaledUnitsText = getScaledUnitsText();

  const scalingModeOptions = useMemo(
    () => getScalingModeTypeOptionsForSensorCalibration(t),
    [t]
  );

  // const sensorPositionLabel = labelWithOptionalText(
  //   t('ui.datachannel.sensorposition', 'Sensor Position'),
  //   scaledUnitsText
  // );
  const scaledTableHeadCellLabel = labelWithOptionalText(
    t('ui.datachannel.scaled', 'Scaled'),
    scaledUnitsText
  );
  const scaledMinLabel = labelWithOptionalText(
    t('ui.datachannel.scaledmin', 'Scaled Min'),
    scaledUnitsText
  );
  const scaledMaxLabel = labelWithOptionalText(
    t('ui.datachannel.scaledmax', 'Scaled Max'),
    scaledUnitsText
  );

  // Scaled Units labels for Prescaled Mode
  const prescaledLowLimitLabel = labelWithOptionalText(
    t('ui.dataChannelEditor.lowLimit', 'Low Limit'),
    scaledUnitsText
  );
  const prescaledHighLimitLabel = labelWithOptionalText(
    t('ui.dataChannelEditor.highLimit', 'High Limit'),
    scaledUnitsText
  );

  // Raw Units-related labels
  const rawUnitsText = isLinearScalingMode
    ? values.rawUnitsAsText
    : isMappedScalingMode
    ? values.rawUnitsAsText // NOTE: Is this what we use for mapped once its implemented?
    : '';
  const rawMinLabel = labelWithOptionalText(
    t('ui.hornermessagetemplate.rawmin', 'Raw Min'),
    rawUnitsText
  );
  const rawMaxLabel = labelWithOptionalText(
    t('ui.hornermessagetemplate.rawmax', 'Raw Max'),
    rawUnitsText
  );
  const rawZeroScaleLabel = labelWithOptionalText(
    t('ui.dataChannelEditor.zeroScale', 'Zero Scale'),
    rawUnitsText
  );
  const rawFullScaleLabel = labelWithOptionalText(
    t('ui.dataChannelEditor.fullScale', 'Full Scale'),
    rawUnitsText
  );
  const rawLowLimitLabel = labelWithOptionalText(
    t('ui.dataChannelEditor.lowLimit', 'Low Limit'),
    rawUnitsText
  );
  const rawHighLimitLabel = labelWithOptionalText(
    t('ui.dataChannelEditor.highLimit', 'High Limit'),
    rawUnitsText
  );
  const rawUnitOnTableLabel = labelWithOptionalText(
    t('ui.datachannel.raw', 'Raw'),
    rawUnitsText
  );

  const sortMappedTableRawValues = () => {
    const scalingValuesToSort = values.scalingdMap || [];
    const sortedScalings = [...scalingValuesToSort].sort((a, b) => {
      if (isNumber(a.item1) && !isNumber(b.item1)) {
        return -1;
      }
      if (!isNumber(a.item1) && isNumber(b.item1)) {
        return 1;
      }

      return (a.item1 || 0) - (b.item1 || 0);
    });

    setFieldValue('scalingdMap', sortedScalings);
  };

  const [exportedData, setExportedData] = useState<
    ValueTupleOfDoubleAndDoubleWithKey[]
  >();

  useUpdateEffect(() => {
    if (exportedData) {
      setValues({
        ...values,
        scalingdMap: exportedData,
      });
    }
  }, [exportedData]);

  const [isImportCsvErrorDialogOpen, setImportCsvErrorDialogOpen] = useState(
    false
  );
  const openImportCsvErrorDialog = () => {
    setImportCsvErrorDialogOpen(true);
  };
  const closeImportCsvErrorDialog = () => {
    setImportCsvErrorDialogOpen(false);
  };

  const [
    conversionRequest,
    setConversionRequest,
  ] = useState<GenerateScalingMapDTO | null>(null);

  useGetGenerateDataChannelMapPoints(conversionRequest, {
    onSuccess: (data) => {
      const apiData = data.map(
        (dataObject: DataChannelTankDimensionsMapPointDTO) => dataObject
      );

      // Build a list of all the scalings from the CSV
      const scalingsFromCsv = [];
      for (let index = 0; index < data.length; index += 1) {
        const rowData = apiData[index];
        const item1 = rowData?.rawValue;
        const item2 = rowData?.scaledValue;

        if (!isNumber(item1) || !isNumber(item2)) {
          return;
        }

        scalingsFromCsv.push({ item1, item2 });
      }

      setFieldValue('scalingdMap', scalingsFromCsv);
      setConversionRequest(null);
    },
    cacheTime: 0,
    staleTime: 0,
  });

  const areRawOrScaledValuesEmpty =
    // We use the isNumber to make sure 0 (zero) is a valid number, otherwise
    // it becomes falsy (not a number/value) without the isNumber check.
    !isNumber(values?.rawUnitsAtScaleMax) ||
    !isNumber(values?.rawUnitsAtScaleMin) ||
    !isNumber(values?.scaledMax) ||
    !isNumber(values?.scaledMin);

  const isManualOptionSelected =
    values.generateWithFunction === GenerateFunctionType.Manual;

  return (
    <>
      <UpdatedConfirmationDialog
        maxWidth="xs"
        open={isImportCsvErrorDialogOpen}
        onConfirm={closeImportCsvErrorDialog}
        mainTitle={t('ui.datachannel.importError', 'Import Error')}
        content={
          <StyledImportErrorDialogText align="center">
            {t('ui.importCsv.error', 'Could not import file.')}
          </StyledImportErrorDialogText>
        }
        hideCancelButton
      />
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <PageSubHeader dense>
            {t('ui.dataChannel.scaling', 'Scaling')}
          </PageSubHeader>
        </Grid>

        <Grid item xs={12}>
          <StyledEditorBox>
            <Grid container spacing={2} alignItems="center">
              {values.isPrimary && (
                <>
                  <Grid item xs={4}>
                    <StyledFieldLabelText>
                      {t(
                        'ui.dataChannelEditor.matchOnRtuChannel',
                        'Match on RTU Channel'
                      )}
                    </StyledFieldLabelText>
                  </Grid>
                  <Grid item xs={8}>
                    <Field
                      id="rtuChannelSetpointsSyncTypeId-input"
                      name="rtuChannelSetpointsSyncTypeId"
                      type="hidden"
                    />
                    <Field
                      id="matchRtuChannel-input"
                      name="matchRtuChannel"
                      component={SwitchWithLabel}
                      type="checkbox"
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={4}>
                <StyledFieldLabelText>
                  {t('ui.datachannel.scalingmode', 'Scaling Mode')}
                </StyledFieldLabelText>
              </Grid>
              <Grid item xs={8}>
                <Field
                  id="scalingModeId-input"
                  name="scalingModeId"
                  component={CustomTextField}
                  select
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    <SelectItem />
                  </MenuItem>
                  {scalingModeOptions?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>

              {(values.scalingModeId === ScalingModeTypeEnum.Linear ||
                values.scalingModeId === ScalingModeTypeEnum.Mapped) && (
                <>
                  <Grid item xs={4}>
                    <StyledFieldLabelText>
                      {t('ui.datachannel.rawunits', 'Raw Units')}
                    </StyledFieldLabelText>
                  </Grid>
                  <Grid item xs={8}>
                    <Field
                      id="rawUnitsAsText-input"
                      name="rawUnitsAsText"
                      component={FreeSoloAutocomplete}
                      options={rawUnitsOptions?.rawUnits?.map(
                        (rawUnit) => rawUnit.name
                      )}
                      disabled={isSubmitting || getRawUnitsApi.isFetching}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <StyledFieldLabelText>{rawMinLabel}</StyledFieldLabelText>
                  </Grid>
                  <Grid item xs={8}>
                    <Field
                      id="rawUnitsAtScaleMin-input"
                      name="rawUnitsAtScaleMin"
                      type="number"
                      component={CustomTextField}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <StyledFieldLabelText>{rawMaxLabel}</StyledFieldLabelText>
                  </Grid>
                  <Grid item xs={8}>
                    <Field
                      id="rawUnitsAtScaleMax-input"
                      name="rawUnitsAtScaleMax"
                      type="number"
                      component={CustomTextField}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={4}>
                <StyledFieldLabelText>
                  {t('ui.datachannel.scaledunits', 'Scaled Units')}
                </StyledFieldLabelText>
              </Grid>
              <Grid item xs={8}>
                {/* 
                        NOTE: 
                        Volumetric tank types have a fixed list of scaled units (canEdit = false)
                        Non-Volumetric tank types have free-form text + a list of scaled units (canEdit = true) 
                      */}
                {scaledUnitsOptions?.canEdit ? (
                  <Field
                    id="scaledUnitsAsText-input"
                    name="scaledUnitsAsText"
                    component={FreeSoloAutocomplete}
                    options={scaledUnitsOptions?.scaledUnits?.map(
                      (scaledUnit) => scaledUnit.name
                    )}
                    disabled={isSubmitting || getScaledUnitsApi.isFetching}
                  />
                ) : // this logic is confusing, but when canEdit is false, also check
                // if the tank type is volumetric, because volumetric tank types
                // need the scaledUnitsId sent back, while air-products domains and
                // non-volumetric tank types need to send scaledUnitsAsText.
                isVolumetricTankType ? (
                  <Field
                    id="scaledUnitsId-input"
                    name="scaledUnitsId"
                    component={CustomTextField}
                    select
                    SelectProps={{ displayEmpty: true }}
                    disabled={isSubmitting || getScaledUnitsApi.isFetching}
                  >
                    <MenuItem value="" disabled>
                      <SelectItem />
                    </MenuItem>
                    {scaledUnitsOptions?.scaledUnits?.map((option) => (
                      <MenuItem key={option.id!} value={option.id!}>
                        {option.name!}
                      </MenuItem>
                    ))}
                  </Field>
                ) : (
                  <Field
                    id="scaledUnitsAsText-input"
                    name="scaledUnitsAsText"
                    component={CustomTextField}
                    select
                    SelectProps={{ displayEmpty: true }}
                    disabled={isSubmitting || getScaledUnitsApi.isFetching}
                  >
                    <MenuItem value="" disabled>
                      <SelectItem />
                    </MenuItem>
                    {scaledUnitsOptions?.scaledUnits?.map((option) => (
                      <MenuItem key={option.name!} value={option.name!}>
                        {option.name!}
                      </MenuItem>
                    ))}
                  </Field>
                )}
              </Grid>

              <Grid item xs={4}>
                <StyledFieldLabelText>{scaledMinLabel}</StyledFieldLabelText>
              </Grid>
              <Grid item xs={8}>
                <Field
                  id="scaledMin-input"
                  name="scaledMin"
                  type="number"
                  component={CustomTextField}
                />
              </Grid>

              <Grid item xs={4}>
                <StyledFieldLabelText>{scaledMaxLabel}</StyledFieldLabelText>
              </Grid>
              <Grid item xs={8}>
                <Field
                  id="scaledMax-input"
                  name="scaledMax"
                  type="number"
                  component={CustomTextField}
                />
              </Grid>
            </Grid>
          </StyledEditorBox>

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
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    justify="flex-end"
                  >
                    <Grid item>
                      <StyledExpandCaret
                        style={{
                          transform: isAdditionalPropertiesExpanded
                            ? 'rotate(180deg)'
                            : 'none',
                        }}
                      />
                    </Grid>
                    <Grid item>
                      {isAdditionalPropertiesExpanded ? (
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
              </AdditionalPropertiesAccordionSummary>
              <StyledAdditionalPropertiesAccordionDetails>
                <Grid container spacing={2} alignItems="center">
                  {(values.scalingModeId === ScalingModeTypeEnum.Mapped ||
                    values.scalingModeId === ScalingModeTypeEnum.Linear) && (
                    <>
                      <Grid item xs={4}>
                        <StyledFieldLabelText>
                          {t(
                            'ui.dataChannelEditor.enablePrescaling',
                            'Enable Prescaling'
                          )}
                        </StyledFieldLabelText>
                      </Grid>
                      <Grid item xs={8}>
                        <Field
                          id="usePrescaling-input"
                          name="usePrescaling"
                          component={SwitchWithLabel}
                          type="checkbox"
                        />
                      </Grid>
                      {values.usePrescaling && (
                        <>
                          <Grid item xs={4}>
                            <StyledFieldLabelText>
                              {rawZeroScaleLabel}
                            </StyledFieldLabelText>
                          </Grid>
                          <Grid item xs={8}>
                            <Field
                              id="rawUnitsAtZero-input"
                              name="rawUnitsAtZero"
                              type="number"
                              component={CustomTextField}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <StyledFieldLabelText>
                              {rawFullScaleLabel}
                            </StyledFieldLabelText>
                          </Grid>
                          <Grid item xs={8}>
                            <Field
                              id="rawUnitsAtFullScale-input"
                              name="rawUnitsAtFullScale"
                              type="number"
                              component={CustomTextField}
                            />
                          </Grid>
                        </>
                      )}
                    </>
                  )}

                  {(values.scalingModeId === ScalingModeTypeEnum.Linear ||
                    values.scalingModeId === ScalingModeTypeEnum.Prescaled) && (
                    <>
                      <Grid item xs={4}>
                        <StyledFieldLabelText>
                          {t(
                            'ui.dataChannelEditor.enableLimits',
                            'Enable Limits'
                          )}
                        </StyledFieldLabelText>
                      </Grid>
                      <Grid item xs={8}>
                        <Field
                          id="useLimits-input"
                          name="useLimits"
                          component={SwitchWithLabel}
                          type="checkbox"
                        />
                      </Grid>
                      {values.useLimits && (
                        <>
                          <Grid item xs={4}>
                            <StyledFieldLabelText>
                              {values.scalingModeId ===
                              ScalingModeTypeEnum.Prescaled
                                ? prescaledLowLimitLabel
                                : rawLowLimitLabel}
                            </StyledFieldLabelText>
                          </Grid>
                          <Grid item xs={8}>
                            <Field
                              id="rawUnitsAtUnderRange-input"
                              name="rawUnitsAtUnderRange"
                              type="number"
                              component={CustomTextField}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <StyledFieldLabelText>
                              {values.scalingModeId ===
                              ScalingModeTypeEnum.Prescaled
                                ? prescaledHighLimitLabel
                                : rawHighLimitLabel}
                            </StyledFieldLabelText>
                          </Grid>
                          <Grid item xs={8}>
                            <Field
                              id="rawUnitsAtOverRange-input"
                              name="rawUnitsAtOverRange"
                              type="number"
                              component={CustomTextField}
                            />
                          </Grid>
                        </>
                      )}
                    </>
                  )}

                  {values.scalingModeId === ScalingModeTypeEnum.Mapped && (
                    <>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={4}>
                        <StyledFieldLabelText>
                          {t(
                            'ui.datachannel.generatewithfunction',
                            'Generate With Function'
                          )}
                        </StyledFieldLabelText>
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          id="generateWithFunction-input"
                          name="generateWithFunction"
                          component={CustomTextField}
                          select
                        >
                          <MenuItem value={GenerateFunctionType.Manual}>
                            {t('enum.generationfunctiontype.manual', 'Manual')}
                          </MenuItem>
                          <MenuItem
                            value={
                              GenerateFunctionType.HorizontalTankWithFlatEnds
                            }
                          >
                            {t(
                              'enum.generationfunctiontype.horizontaltankwithflatends',
                              'Horizontal Tank With Flat Ends'
                            )}
                          </MenuItem>
                        </Field>
                      </Grid>

                      <Grid item xs={2}>
                        <StyledApplyButton
                          onClick={() => {
                            setConversionRequest({
                              rawUnitsAtScaledMax: values?.rawUnitsAtScaleMax,
                              rawUnitsAtScaledMin: values?.rawUnitsAtScaleMin,
                              scaledMax: values?.scaledMax,
                              scaledMin: values?.scaledMin,
                            } as GenerateScalingMapDTO);
                          }}
                          startIcon={<ApplyGearIcon />}
                          disabled={
                            areRawOrScaledValuesEmpty || isManualOptionSelected
                          }
                          useDomainColorForIcon
                        >
                          {t('ui.datachannel.apply', 'Apply')}
                        </StyledApplyButton>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid
                        item
                        container
                        spacing={2}
                        justify="flex-start"
                        alignItems="center"
                      >
                        <Grid item style={{ padding: '0px 8px' }}>
                          <Button
                            onClick={sortMappedTableRawValues}
                            startIcon={<SortIcon />}
                            useDomainColorForIcon
                          >
                            {t('ui.datachannel.sort', 'Sort')}
                          </Button>
                        </Grid>

                        <Grid item style={{ padding: '0px 8px' }}>
                          <ImportCsvButton
                            setExportedData={setExportedData}
                            openDialog={openImportCsvErrorDialog}
                          />
                        </Grid>
                      </Grid>

                      <Grid item xs>
                        <Grid
                          container
                          spacing={2}
                          direction="column"
                          component={DetailsBoxWrapper}
                        >
                          <Grid item>
                            <Grid
                              container
                              spacing={2}
                              direction="column"
                              component={DetailsBoxWrapper}
                            >
                              {status?.errors?.scalingdMap && (
                                <Grid item>
                                  <FormErrorAlert>
                                    {status?.errors?.scalingdMap &&
                                      t(
                                        'ui.dataChannelEditor.mappedCsvTableError',
                                        'Invalid mapped values'
                                      )}
                                  </FormErrorAlert>
                                </Grid>
                              )}
                              <Grid item>
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
                                      {values.scalingdMap
                                        ?.slice(0, 20)
                                        .map((scaling, index) => {
                                          return (
                                            <TableRow
                                              style={{ height: 42 }}
                                              key={scaling.key}
                                            >
                                              <TableCellWithField padding="none">
                                                <Field
                                                  component={CustomTextField}
                                                  type="number"
                                                  TextFieldComponent={
                                                    StyledTextField
                                                  }
                                                  name={`scalingdMap[${index}].item1`}
                                                />
                                              </TableCellWithField>

                                              <TableCellWithField padding="none">
                                                <Field
                                                  component={CustomTextField}
                                                  type="number"
                                                  TextFieldComponent={
                                                    StyledTextField
                                                  }
                                                  name={`scalingdMap[${index}].item2`}
                                                />
                                              </TableCellWithField>
                                            </TableRow>
                                          );
                                        })}
                                    </StyledTableBody>
                                  </CustomTable>
                                </StyledTableContainer>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}

                  {values.scalingModeId === ScalingModeTypeEnum.Linear &&
                    !isPressureDataChannel && (
                      <>
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t(
                              'ui.datachannel.invertRawData',
                              'Invert Raw Data'
                            )}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="isRawDataInverted-input"
                            name="isRawDataInverted"
                            component={SwitchWithLabel}
                            type="checkbox"
                          />
                        </Grid>
                      </>
                    )}
                  {/* NOTE: Temporarily commented out until the api includes the sensorPosition property */}
                  {/* {values.scalingModeId === ScalingModeTypeEnum.Linear && (
                      <>
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {sensorPositionLabel}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="sensorPosition-input"
                            name="sensorPosition"
                            type="number"
                            component={CustomTextField}
                          />
                        </Grid>
                      </>
                )} */}
                </Grid>
              </StyledAdditionalPropertiesAccordionDetails>
            </AdditionalPropertiesAccordion>
          </AdditionalPropertiesEditorBox>
        </Grid>
      </Grid>
    </>
  );
};

export default ScalingContainer;
