/* eslint-disable indent, react/jsx-indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelSensorInfoDTO,
  ScalingModeType,
  ScalingModeTypeEnum,
  SensorCalibrationInfoDTO,
  UnitConversionModeEnum,
  UnitTypeEnum,
} from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import { ReactComponent as ApplyGearIcon } from 'assets/icons/gear.svg';
import { ReactComponent as ImportIcon } from 'assets/icons/import.svg';
import { ReactComponent as DoubleArrowIcon } from 'assets/icons/white-double-arrow.svg';
import Button from 'components/Button';
import CustomThemeProvider from 'components/CustomThemeProvider';
import EditorBox from 'components/EditorBox';
import EditorPageIntro from 'components/EditorPageIntro';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import FreeSoloAutocomplete from 'components/forms/form-fields/FreeSoloAutocomplete';
import SwitchWithLabel from 'components/forms/form-fields/SwitchWithLabel';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import TextField from 'components/forms/styled-fields/StyledTextField';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import { useGetRawUnits } from 'containers/DataChannelEditor/hooks/useGetRawUnits';
import { useGetScaledUnitsByDataChannelId } from 'containers/DataChannelEditor/hooks/useGetScaledUnitsByDataChannelId';
import { useSaveSensorCalibration } from 'containers/DataChannelEditor/hooks/useSaveSensorCalibration';
import {
  AdditionalPropertiesAccordion,
  AdditionalPropertiesAccordionDetails,
  AdditionalPropertiesAccordionSummary,
} from 'containers/DataChannelEditor/styles';
import { Field, Formik, FormikHelpers } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import styled from 'styled-components';
import {
  buildUnitTypeEnumTextMapping,
  getScalingModeTypeOptionsForSensorCalibration,
} from 'utils/i18n/enum-to-text';
import { labelWithOptionalText } from '../../helpers';
import DetailsBoxWrapper from '../DetailsBoxWrapper';
import {
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import { Values } from './types';

const StyledFieldLabelText = styled(Typography)`
  font-weight: 500;
  font-size: 14px;
`;

const AdditionalPropertiesEditorBox = styled(EditorBox)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
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

const CustomSizedTable = styled(Table)`
  min-width: 500px;
`;

const PaddedHeadCell = styled(TableHeadCell)`
  padding: 12px 16px;
  width: 50%;
`;

const PaddedCell = styled(TableCell)`
  vertical-align: top;
`;

const StyledEditorBox = styled(EditorBox)`
  border-radius: 10px 10px 0 0;
`;

const StyledAdditionalPropertiesAccordionDetails = styled(
  AdditionalPropertiesAccordionDetails
)`
  padding: 16px 24px 24px 24px;
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
  tankType?: UnitConversionModeEnum | null;
  cancelCallback: () => void;
  saveAndExitCallback?: () => void;
}

const SensorCalibrationDrawer = ({
  sensorCalibration,
  dataChannelId,
  tankType,
  cancelCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();

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

  const scalingModeOptions = useMemo(
    () => getScalingModeTypeOptionsForSensorCalibration(t),
    [t]
    // NOTE/TODO: Temporarily removing mapped scaling mode from options
  ).filter((mode) => mode.value !== ScalingModeType.Mapped);

  const getRawUnitsApi = useGetRawUnits();
  const rawUnitsOptions = getRawUnitsApi.data;

  const getScaledUnitsApi = useGetScaledUnitsByDataChannelId(dataChannelId!);
  const scaledUnitsOptions = getScaledUnitsApi.data;

  const scaledUnitsTypeEnumTextMapping = buildUnitTypeEnumTextMapping(t);

  const formattedInitialValues = formatInitialValues(sensorCalibration);

  const queryClient = useQueryClient();
  const updateSensorCalibrationApi = useSaveSensorCalibration({
    onSuccess: () => {
      queryClient.invalidateQueries(APIQueryKey.getDataChannelDetailsById);
    },
  });

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    updateSensorCalibrationApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);
    return updateSensorCalibrationApi
      .mutateAsync({
        ...formattedValuesForApi,
        dataChannelId: dataChannelId!,
      } as DataChannelSensorInfoDTO)
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  return (
    <Formik<Values>
      initialValues={formattedInitialValues}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values, submitForm }) => {
        const isLinearScalingMode =
          sensorCalibration?.scalingModeId === ScalingModeTypeEnum.Linear;
        const isMappedScalingMode =
          sensorCalibration?.scalingModeId === ScalingModeTypeEnum.Mapped;

        const isVolumetricTankType =
          tankType === UnitConversionModeEnum.Volumetric;

        // Scaled Units-related labels
        const getScaledUnitsText = () => {
          if (isVolumetricTankType) {
            return scaledUnitsTypeEnumTextMapping[
              values.scaledUnitsId as UnitTypeEnum
            ];
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

        return (
          <>
            <CustomThemeProvider forceThemeType="dark">
              <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                <EditorPageIntro
                  showSaveOptions
                  title={t(
                    'ui.dataChannel.sensorCalibration',
                    'Sensor Calibration'
                  )}
                  cancelCallback={cancelCallback}
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  submissionResult={updateSensorCalibrationApi.data}
                  submissionError={updateSensorCalibrationApi.error}
                  saveAndExitCallback={saveAndExitCallback}
                  disableSaveAndExit={
                    getScaledUnitsApi.isLoading ||
                    getScaledUnitsApi.isError ||
                    getRawUnitsApi.isLoading ||
                    getRawUnitsApi.isError
                  }
                />
              </PageIntroWrapper>
            </CustomThemeProvider>
            <Box mt={3} />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <StyledEditorBox>
                  <Grid container spacing={2} alignItems="center">
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
                          <StyledFieldLabelText>
                            {rawMinLabel}
                          </StyledFieldLabelText>
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
                          <StyledFieldLabelText>
                            {rawMaxLabel}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="rawUnitsAtScaleMax-input"
                            name="rawUnitsAtScaleMax"
                            type="number"
                            component={CustomTextField}
                          />
                        </Grid>
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
                          disabled={
                            isSubmitting || getScaledUnitsApi.isFetching
                          }
                        />
                      ) : (
                        <Field
                          id="scaledUnitsId-input"
                          name="scaledUnitsId"
                          component={CustomTextField}
                          select
                          SelectProps={{ displayEmpty: true }}
                          disabled={
                            isSubmitting || getScaledUnitsApi.isFetching
                          }
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
                      )}
                    </Grid>

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

                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {scaledMinLabel}
                      </StyledFieldLabelText>
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
                      <StyledFieldLabelText>
                        {scaledMaxLabel}
                      </StyledFieldLabelText>
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
                    <StyledAdditionalPropertiesAccordionDetails>
                      <Grid container spacing={2} alignItems="center">
                        {(values.scalingModeId === ScalingModeTypeEnum.Mapped ||
                          values.scalingModeId ===
                            ScalingModeTypeEnum.Linear) && (
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
                          values.scalingModeId ===
                            ScalingModeTypeEnum.Prescaled) && (
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

                        {values.scalingModeId ===
                          ScalingModeTypeEnum.Mapped && (
                          <>
                            <Grid item xs={4}>
                              <StyledFieldLabelText>
                                {t(
                                  'ui.datachannel.generatewithfunction',
                                  'Generate With Function'
                                )}
                              </StyledFieldLabelText>
                            </Grid>
                            <Grid item xs={8}>
                              <Field
                                id="generateWithFunction-input"
                                name="generateWithFunction"
                                component={CustomTextField}
                                select
                                SelectProps={{ displayEmpty: true }}
                              >
                                <MenuItem value="" disabled>
                                  <SelectItem />
                                </MenuItem>
                                {/* {options?.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))} */}
                              </Field>
                            </Grid>

                            <Grid
                              item
                              container
                              spacing={2}
                              justify="center"
                              alignItems="center"
                            >
                              {/* TODO: Both buttons' onClick actions need to be spec'd */}
                              <Grid item>
                                <Button
                                  onClick={() => {}}
                                  startIcon={<ImportIcon />}
                                >
                                  {t('ui.datachannel.import', 'Import')}
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                  onClick={() => {}}
                                  startIcon={<ApplyGearIcon />}
                                >
                                  {t('ui.datachannel.apply', 'Apply')}
                                </Button>
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
                                                  <Field
                                                    component={CustomTextField}
                                                    type="number"
                                                    TextFieldComponent={
                                                      StyledTextField
                                                    }
                                                    name={`scalingdMap[${index}].item1`}
                                                  />
                                                </PaddedCell>

                                                <PaddedCell padding="none">
                                                  <Field
                                                    component={CustomTextField}
                                                    type="number"
                                                    TextFieldComponent={
                                                      StyledTextField
                                                    }
                                                    name={`scalingdMap[${index}].item2`}
                                                  />
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
                          </>
                        )}
                      </Grid>
                    </StyledAdditionalPropertiesAccordionDetails>
                  </AdditionalPropertiesAccordion>
                </AdditionalPropertiesEditorBox>
              </Grid>
            </Grid>
          </>
        );
      }}
    </Formik>
  );
};

export default SensorCalibrationDrawer;
