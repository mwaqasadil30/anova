/* eslint-disable indent */
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MuiLink from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { DataChannelDTO, ScalingModeType } from 'api/admin/api';
import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import { ReactComponent as ImportIcon } from 'assets/icons/import.svg';
import { ReactComponent as DoubleArrowIcon } from 'assets/icons/white-double-arrow.svg';
import Button from 'components/Button';
import CustomThemeProvider from 'components/CustomThemeProvider';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EditorBox from 'components/EditorBox';
import EditorPageIntro from 'components/EditorPageIntro';
import EditorSectionHeader from 'components/EditorSectionHeader';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import { DisplayOnlyField } from 'components/forms/styled-fields/DisplayOnlyValue';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import PageSubHeader from 'components/PageSubHeader';
import { Field, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  buildDataChannelTypeTextMapping,
  buildScalingModeTypeTextMapping,
  getScalingModeTypeOptionsForSensorCalibration,
} from 'utils/i18n/enum-to-text';
// import { useGetSensorCalibration } from '../hooks/useGetSensorCalibration';
import { useSaveSensorCalibration } from '../hooks/useSaveSensorCalibration';
import {
  buildValidationSchema,
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import MappedScalingModeTable from './MappedScalingModeTable';
import { SensorCalibrationValues } from './types';

const Accordion = withStyles((theme) => ({
  root: {
    border: 'none',
    borderTop: '1px solid #E5E5E5',
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
}))(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'transparent',
    border: 'none',
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}))(MuiAccordionDetails);

const ButtonAlignedWithField = styled(Button)`
  margin-top: ${(props) => props.theme.spacing(1)}px;
  height: 46px;
`;

const StyledPageSubHeader = styled(PageSubHeader)`
  font-size: 18px;
`;

const StyledDoubleArrowIcon = styled(DoubleArrowIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
  color: ${(props) => props.theme.custom.domainSecondaryColor};
  vertical-align: middle;
`;

const BasicInfoEditorBox = styled(EditorBox)`
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;
const AdvancedSettingsEditorBox = styled(EditorBox)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

const AdvancedSettingsText = styled(Typography)`
  font-weight: 500;
  font-size: 14px;
`;

const ApplyTemplateDefaultsText = styled(MuiLink)`
  font-size: 15px;
  cursor: pointer;
  color: ${(props) => props.theme.custom.domainSecondaryColor};
  font-weight: 500;
`;

interface Props {
  dataChannel: DataChannelDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const SensorCalibrationDrawer = ({
  dataChannel,
  isOpen,
  onClose,
  onSaveSuccess,
}: Props) => {
  const { t } = useTranslation();
  const dataChannelTypeTextMapping = buildDataChannelTypeTextMapping(t);
  const scalingModeTypeTextMapping = buildScalingModeTypeTextMapping(t);

  const [
    showApplyTemplateDefaultsDialog,
    setShowApplyTemplateDefaultsDialog,
  ] = useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const handleToggleAccordion = (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    setExpanded(newExpanded);
  };

  // const getApi = useGetSensorCalibration({});
  const saveApi = useSaveSensorCalibration();

  // TODO: Do we need an API call to fetch the initial values? or are we using
  // the data channel the user selected from the table?
  const formattedInitialValues = formatInitialValues(dataChannel);

  const validationSchema = buildValidationSchema();

  const handleSubmit = (
    values: SensorCalibrationValues,
    formikBag: FormikHelpers<SensorCalibrationValues>
  ) => {
    // Clear the error state when submitting
    saveApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);
    return saveApi.mutateAsync(formattedValuesForApi).catch((error) => {
      const formattedErrors = mapApiErrorsToFields(t, error as any);
      if (formattedErrors) {
        formikBag.setErrors(formattedErrors as any);
        formikBag.setStatus({ errors: formattedErrors });
      }
    });
  };

  const cancelCallback = () => {
    onClose();
  };

  const saveAndExitCallback = () => {
    // TODO: May need to update something related to the graph
    onSaveSuccess();
    onClose();
  };

  const closeApplyTemplateDefaultsDialog = () => {
    setShowApplyTemplateDefaultsDialog(false);
  };
  const openApplyTemplateDefaultsDialog = () => {
    setShowApplyTemplateDefaultsDialog(true);
  };
  const applyTemplateDefaults = () => {
    // TODO: Apply the data channel template defaults since the user confirmed
    // in the dialog
    closeApplyTemplateDefaultsDialog();
  };

  const handleApplyGenerateWithFunction = () => {};
  const handleImportGenerateWithFunction = () => {};

  const dataChannelTemplateOptions = [
    {
      label: 'Test',
      value: -1,
    },
  ];
  const scaledUnitsOptions = [
    {
      label: 'Test',
      value: -1,
    },
  ];
  const scalingModeOptions = getScalingModeTypeOptionsForSensorCalibration(t);
  const rawUnitsOptions = [
    {
      label: 'Test',
      value: -1,
    },
  ];
  const generateWithFunctionOptions = [
    {
      label: 'Test',
      value: -1,
    },
  ];

  const mainTitle = t(
    'ui.assetDetail.applyTemplateDefaultsDialog.title',
    'Apply Template Defaults?'
  );

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} variant="temporary">
      <DrawerContent>
        <UpdatedConfirmationDialog
          open={showApplyTemplateDefaultsDialog}
          maxWidth="xs"
          disableBackdropClick
          disableEscapeKeyDown
          mainTitle={mainTitle}
          content={
            <Typography>
              {t(
                'ui.assetDetail.applyTemplateDefaultsDialog.subtitle',
                'This will reset settings to their default values.'
              )}
            </Typography>
          }
          closeDialog={closeApplyTemplateDefaultsDialog}
          onConfirm={applyTemplateDefaults}
          hideCancelButton
        />

        <Formik<SensorCalibrationValues>
          initialValues={formattedInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, submitForm }) => {
            const selectedScalingModeText =
              // @ts-ignore
              scalingModeTypeTextMapping[values.scalingMode];

            return (
              <>
                <CustomThemeProvider forceThemeType="dark">
                  <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                    <EditorPageIntro
                      showSaveOptions
                      isWithinDrawer
                      title={t(
                        'ui.assetDetail.sensorCalibration',
                        'Sensor Calibration'
                      )}
                      isSubmitting={isSubmitting}
                      submissionResult={saveApi.data}
                      submissionError={saveApi.error}
                      cancelCallback={cancelCallback}
                      submitForm={submitForm}
                      saveAndExitCallback={saveAndExitCallback}
                    />
                  </PageIntroWrapper>
                </CustomThemeProvider>

                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12}>
                    <EditorSectionHeader>
                      {t('ui.common.basicInformation', 'Basic Information')}
                    </EditorSectionHeader>
                  </Grid>
                  <Grid item xs={12}>
                    <BasicInfoEditorBox>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={6}>
                          <DisplayOnlyField
                            fieldName={t(
                              'ui.common.description',
                              'Description'
                            )}
                            fieldValue={values.description}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <DisplayOnlyField
                            fieldName={t(
                              'ui.datachannel.datachanneltype',
                              'Data Channel Type'
                            )}
                            fieldValue={
                              dataChannelTypeTextMapping[
                                values.dataChannelType!
                              ]
                            }
                          />
                        </Grid>
                        <Grid item xs={12}>
                          {/* TODO: Could potentially use an autocomplete like the one on quick tank create: levelDataChannelTemplateId-input */}
                          <Field
                            id="dataChannelTemplateId-input"
                            name="dataChannelTemplateId"
                            component={CustomTextField}
                            label={
                              <Grid
                                container
                                alignItems="flex-end"
                                justify="space-between"
                              >
                                <Grid item>
                                  <InputLabel>
                                    {t(
                                      'ui.common.datachanneltemplate',
                                      'Data Channel Template'
                                    )}
                                  </InputLabel>
                                </Grid>
                                <Grid item>
                                  <ApplyTemplateDefaultsText
                                    // @ts-ignore
                                    component="button"
                                    tabIndex={0}
                                    underline="always"
                                    onClick={openApplyTemplateDefaultsDialog}
                                  >
                                    {t(
                                      'ui.assetDetail.applyTemplateDefaults',
                                      'Apply Template Defaults'
                                    )}
                                  </ApplyTemplateDefaultsText>
                                </Grid>
                              </Grid>
                            }
                            select
                            SelectProps={{ displayEmpty: true }}
                          >
                            <MenuItem value="" disabled>
                              <SelectItem />
                            </MenuItem>
                            {dataChannelTemplateOptions?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            id="isVolumetric-input"
                            name="isVolumetric"
                            component={CheckboxWithLabel}
                            Label={{
                              label: t(
                                'ui.datachannel.volumetric',
                                'Volumetric'
                              ),
                            }}
                            type="checkbox"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          {/* TODO: Is this the same dropdown from the unit of measure dropdown on the Data Channel Cards? */}
                          <Field
                            id="scaledUnits-input"
                            name="scaledUnits"
                            component={CustomTextField}
                            label={t('ui.common.scaledunits', 'Scaled Units')}
                            select
                            SelectProps={{ displayEmpty: true }}
                          >
                            <MenuItem value="" disabled>
                              <SelectItem />
                            </MenuItem>
                            {scaledUnitsOptions?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>
                      </Grid>
                    </BasicInfoEditorBox>
                    <AdvancedSettingsEditorBox p={0}>
                      <Accordion
                        square
                        expanded={expanded}
                        onChange={handleToggleAccordion}
                      >
                        <AccordionSummary
                          disableRipple
                          aria-controls="advanced-settings-content"
                          id="advanced-settings-header"
                        >
                          <AdvancedSettingsText>
                            {expanded ? (
                              <span>
                                <StyledDoubleArrowIcon />
                                {t(
                                  'ui.calibrationParameters.hideAdvancedSettings',
                                  'Hide Advanced Settings'
                                )}
                              </span>
                            ) : (
                              <span>
                                <StyledDoubleArrowIcon
                                  style={{ transform: 'rotate(180deg)' }}
                                />
                                {t(
                                  'ui.calibrationParameters.showAdvancedSettings',
                                  'Show Advanced Settings'
                                )}
                              </span>
                            )}
                          </AdvancedSettingsText>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Field
                                id="scalingMode-input"
                                name="scalingMode"
                                component={CustomTextField}
                                label={t(
                                  'ui.datachannel.scalingmode',
                                  'Scaling Mode'
                                )}
                                select
                                SelectProps={{ displayEmpty: true }}
                              >
                                <MenuItem value="" disabled>
                                  <SelectItem />
                                </MenuItem>
                                {scalingModeOptions?.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Grid>
                            <Grid item xs={12}>
                              <Field
                                id="rawUnits-input"
                                name="rawUnits"
                                component={CustomTextField}
                                label={t(
                                  'ui.datachannel.rawunits',
                                  'Raw Units'
                                )}
                                select
                                SelectProps={{ displayEmpty: true }}
                              >
                                <MenuItem value="" disabled>
                                  <SelectItem />
                                </MenuItem>
                                {/* TODO: Get correct options */}
                                {rawUnitsOptions?.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Grid>
                            <Grid item xs={12}>
                              <Field
                                id="enablePrescaling-input"
                                name="enablePrescaling"
                                component={CheckboxWithLabel}
                                Label={{
                                  label: t(
                                    'ui.calibrationParameters.enablePrescaling',
                                    'Enable Prescaling'
                                  ),
                                }}
                                type="checkbox"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Field
                                id="zeroScale-input"
                                name="zeroScale"
                                type="number"
                                component={CustomTextField}
                                label={t(
                                  'ui.datachannel.zeroScale',
                                  'Zero Scale'
                                )}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Field
                                id="fullScale-input"
                                name="fullScale"
                                type="number"
                                component={CustomTextField}
                                label={t(
                                  t('ui.datachannel.fullScale', 'Full Scale')
                                )}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <StyledPageSubHeader dense>
                                {t('ui.common.filter', 'Filter')}
                              </StyledPageSubHeader>
                            </Grid>
                            <Grid item xs={12}>
                              <Field
                                id="enableLimits-input"
                                name="enableLimits"
                                component={CheckboxWithLabel}
                                Label={{
                                  label: t(
                                    'ui.calibrationParameters.enableLimits',
                                    'Enable Limits'
                                  ),
                                }}
                                type="checkbox"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Field
                                id="lowLimit-input"
                                name="lowLimit"
                                type="number"
                                component={CustomTextField}
                                label={t(
                                  'ui.calibrationParameters.lowLimit',
                                  'Low Limit'
                                )}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Field
                                id="highLimit-input"
                                name="highLimit"
                                type="number"
                                component={CustomTextField}
                                label={t(
                                  t(
                                    'ui.calibrationParameters.highLimit',
                                    'High Limit'
                                  )
                                )}
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </AdvancedSettingsEditorBox>
                  </Grid>

                  {values.scalingMode !== ScalingModeType.Prescaled && (
                    <>
                      <Grid item xs={12}>
                        <EditorSectionHeader>
                          {t('ui.datachannel.scalingmode', 'Scaling Mode')}
                          {!!selectedScalingModeText && (
                            <>
                              {' - '}
                              {selectedScalingModeText}
                            </>
                          )}
                        </EditorSectionHeader>
                      </Grid>
                      <Grid item xs={12}>
                        <EditorBox>
                          {values.scalingMode === ScalingModeType.Linear && (
                            <Grid container spacing={3}>
                              <Grid item xs={12}>
                                <StyledPageSubHeader dense>
                                  {t(
                                    'ui.calibrationParameters.rawParameters',
                                    'Raw Parameters'
                                  )}
                                  {/* TODO: Render unit from data channel in parentheses */}
                                </StyledPageSubHeader>
                              </Grid>
                              <Grid item xs={6}>
                                <Field
                                  id="rawParametersSensorMin-input"
                                  name="rawParametersSensorMin"
                                  type="number"
                                  component={CustomTextField}
                                  label={t(
                                    'ui.calibrationParameters.sensorMin',
                                    'Sensor Min'
                                  )}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Field
                                  id="rawParametersSensorMax-input"
                                  name="rawParametersSensorMax"
                                  type="number"
                                  component={CustomTextField}
                                  label={t(
                                    'ui.calibrationParameters.sensorMax',
                                    'Sensor Max'
                                  )}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <StyledPageSubHeader dense>
                                  {t(
                                    'ui.calibrationParameters.scaledParameters',
                                    'Scaled Parameters'
                                  )}
                                  {/* TODO: Render scaled unit in parentheses */}
                                </StyledPageSubHeader>
                              </Grid>
                              <Grid item xs={6}>
                                <Field
                                  id="scaledParametersSensorMin-input"
                                  name="scaledParametersSensorMin"
                                  type="number"
                                  component={CustomTextField}
                                  label={t(
                                    'ui.calibrationParameters.sensorMin',
                                    'Sensor Min'
                                  )}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Field
                                  id="scaledParametersSensorMax-input"
                                  name="scaledParametersSensorMax"
                                  type="number"
                                  component={CustomTextField}
                                  label={t(
                                    'ui.calibrationParameters.sensorMax',
                                    'Sensor Max'
                                  )}
                                />
                              </Grid>
                            </Grid>
                          )}
                          {values.scalingMode === ScalingModeType.Mapped && (
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={6}>
                                {/* TODO: Should this be a regular dropdown, outside of Formik? */}
                                <Field
                                  id="generateWithFunction-input"
                                  name="generateWithFunction"
                                  component={CustomTextField}
                                  label={t(
                                    'ui.datachannel.generatewithfunction',
                                    'Generate With Function'
                                  )}
                                  select
                                  SelectProps={{ displayEmpty: true }}
                                >
                                  <MenuItem value="" disabled>
                                    <SelectItem />
                                  </MenuItem>
                                  {generateWithFunctionOptions?.map(
                                    (option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </MenuItem>
                                    )
                                  )}
                                </Field>
                              </Grid>
                              <Grid item>
                                <InputLabel>&nbsp;</InputLabel>
                                <ButtonAlignedWithField
                                  startIcon={<GearIcon />}
                                  useDomainColorForIcon
                                  onClick={handleApplyGenerateWithFunction}
                                >
                                  {t('ui.datachannel.apply', 'Apply')}
                                </ButtonAlignedWithField>
                              </Grid>
                              <Grid item>
                                <InputLabel>&nbsp;</InputLabel>
                                <ButtonAlignedWithField
                                  startIcon={<ImportIcon />}
                                  useDomainColorForIcon
                                  onClick={handleImportGenerateWithFunction}
                                >
                                  {t('ui.datachannel.import', 'Import')}
                                </ButtonAlignedWithField>
                              </Grid>
                              <Grid item xs={12}>
                                <MappedScalingModeTable />
                              </Grid>
                            </Grid>
                          )}
                        </EditorBox>
                      </Grid>
                    </>
                  )}
                </Grid>
              </>
            );
          }}
        </Formik>
      </DrawerContent>
    </Drawer>
  );
};

export default SensorCalibrationDrawer;
