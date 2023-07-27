import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  EditDataChannelOptions,
  LevelDataChannelGeneralInfo,
  ScalingModeType,
} from 'api/admin/api';
import { ReactComponent as PencilIcon } from 'assets/icons/pencil.svg';
import Button from 'components/Button';
import CustomBox from 'components/CustomBox';
import FormErrorDialog from 'components/dialog/FormErrorDialog';
import DrawerContent from 'components/drawers/DrawerContent';
import Menu from 'components/Menu';
import PageSubHeader from 'components/PageSubHeader';
import CalibrationParametersEditor from 'containers/CalibrationParametersEditor';
import { useLoadDefaultValues } from 'containers/DataChannelEditorLegacy/hooks/useLoadDefaultValues';
import { FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';
import { dataChannelToFormValues } from '../ObjectForm/helpers';
import { Values } from '../ObjectForm/types';
import DeleteReadingsForm from './DeleteReadingsForm';
import LinearCalibrationSummaryDetails from './LinearCalibrationSummaryDetails';
import PrescaledCalibrationSummaryDetails from './PrescaledCalibrationSummaryDetails';
import RescaleReadingsForm from './RescaleReadingsForm';

enum CalibrationAction {
  Rescale = 'rescale',
  Delete = 'delete',
}

interface Props {
  values: Values;
  setValues: FormikHelpers<Values>['setValues'];
  options?: EditDataChannelOptions | null;
  dataChannelId?: string;
  scaledUnitsText?: string;
}

const AdvancedCalibrationOptions = ({
  values,
  setValues,
  options,
  dataChannelId,
  scaledUnitsText,
}: Props) => {
  const { t } = useTranslation();

  // Only update specific values since we don't want to override
  // other values the user may have edited
  const updateCalibrationValuesOnForm = (
    dataChannel?: LevelDataChannelGeneralInfo | null
  ) => {
    const formValues = dataChannelToFormValues(dataChannel);
    setValues({
      ...values,
      scalingMode: formValues.scalingMode,
      rawUnits: formValues.rawUnits,
      rawUnitsAtZero: formValues.rawUnitsAtZero,
      rawUnitsAtFullScale: formValues.rawUnitsAtFullScale,
      rawUnitsAtScaledMin: formValues.rawUnitsAtScaledMin,
      rawUnitsAtScaledMax: formValues.rawUnitsAtScaledMax,
      rawUnitsAtUnderRange: formValues.rawUnitsAtUnderRange,
      rawUnitsAtOverRange: formValues.rawUnitsAtOverRange,
      isDataInverted: formValues.isDataInverted,
      scaledMax: formValues.scaledMax,
      scaledMin: formValues.scaledMin,
      lastUpdateUserName: formValues.lastUpdateUserName,
      lastUpdatedDate: formValues.lastUpdatedDate,
    });
  };

  // Actions Menu
  const [
    actionsMenuAnchorEl,
    setActionsMenuAnchorEl,
  ] = useState<HTMLElement | null>(null);
  const handleOpenActionsMenu = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setActionsMenuAnchorEl(event.currentTarget);
  };
  const closeActionsMenu = () => {
    setActionsMenuAnchorEl(null);
  };

  // Selected actions menu item
  const [
    selectedAction,
    setSelectedAction,
  ] = useState<CalibrationAction | null>(null);
  const selectAction = (calibrationAction: CalibrationAction | null) => {
    setSelectedAction(calibrationAction);
    closeActionsMenu();
  };

  // Calibration Parameters drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = (open: boolean) => (
    event?: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setIsDrawerOpen(open);
  };

  // Form error dialog
  const [isFormErrorDialogOpen, setIsFormErrorDialogOpen] = useState(false);
  const handleCloseFormErrorDialog = () => {
    setIsFormErrorDialogOpen(false);
  };

  // Load default values API call
  const domainId = useSelector(selectActiveDomainId);
  const {
    makeRequest: loadDefaultValues,
    isFetching: isLoadingDefaultValues,
    error: loadDefaultValuesError,
    data: loadDefaultValuesUpdatedDataChannel,
  } = useLoadDefaultValues();
  const handleLoadDefaultValues = () => {
    loadDefaultValues({
      domainId,
      dataChannelId,
      dataChannelTemplateId:
        values.dataChannelTemplateInfo?.dataChannelTemplateId,
    });
  };

  // Failed to load default values
  useEffect(() => {
    if (loadDefaultValuesError) {
      setIsFormErrorDialogOpen(true);
    }
  }, [loadDefaultValuesError]);

  // Successfully loaded default values
  useEffect(() => {
    if (loadDefaultValuesUpdatedDataChannel) {
      updateCalibrationValuesOnForm(loadDefaultValuesUpdatedDataChannel);
      closeActionsMenu();
    }
  }, [loadDefaultValuesUpdatedDataChannel]);

  return (
    <>
      <FormErrorDialog
        mainTitle={t(
          'ui.formErrorDialog.operationFailedTitle',
          'Operation Failed!'
        )}
        open={isFormErrorDialogOpen}
        errors={loadDefaultValuesError?.errors?.errors}
        onConfirm={handleCloseFormErrorDialog}
      />
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        // @ts-ignore
        onClose={toggleDrawer(false)}
        variant="temporary"
        disableBackdropClick
      >
        <DrawerContent>
          <CalibrationParametersEditor
            initialValues={{
              scalingMode: values.scalingMode,
              rawUnits: values.rawUnits,
              rawUnitsAtZero: values.rawUnitsAtZero,
              rawUnitsAtFullScale: values.rawUnitsAtFullScale,
              rawUnitsAtScaledMin: values.rawUnitsAtScaledMin,
              rawUnitsAtScaledMax: values.rawUnitsAtScaledMax,
              isDataInverted: values.isDataInverted,
              rawUnitsAtUnderRange: values.rawUnitsAtUnderRange,
              rawUnitsAtOverRange: values.rawUnitsAtOverRange,
              scaledMin: values.scaledMin,
              scaledMax: values.scaledMax,
            }}
            dataChannelId={dataChannelId}
            options={options}
            isInlineForm
            cancelCallback={toggleDrawer(false)}
            saveAndExitCallback={(response) => {
              const { dataChannel } = response;

              updateCalibrationValuesOnForm(dataChannel);
              toggleDrawer(false)();
            }}
          />
        </DrawerContent>
      </Drawer>
      <CustomBox pl={2} py={1} pr={1} borderBottom={0}>
        <Grid container spacing={2} alignItems="center" justify="space-between">
          <Grid item>
            <PageSubHeader dense>
              {t(
                'ui.datachannel.sensorCalibrationSummary',
                'Sensor Calibration Summary'
              )}
            </PageSubHeader>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <Button startIcon={<PencilIcon />} onClick={toggleDrawer(true)}>
                  {t(
                    'ui.datachannel.changeCalibrationParameters',
                    'Change Calibration Parameters'
                  )}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  endIcon={<ExpandMoreIcon />}
                  onClick={handleOpenActionsMenu}
                >
                  {t('ui.datachannel.action_plural', 'Actions')}
                </Button>
                <Menu
                  id="asset-details-ellipsis-menu"
                  anchorEl={actionsMenuAnchorEl}
                  getContentAnchorEl={null}
                  keepMounted
                  open={Boolean(actionsMenuAnchorEl)}
                  onClose={closeActionsMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  {values.dataChannelTemplateInfo?.dataChannelTemplateId && (
                    <MenuItem
                      onClick={handleLoadDefaultValues}
                      disabled={isLoadingDefaultValues}
                    >
                      {t(
                        'enum.readingsactiontype.loadDefaultValues',
                        'Load Default Values'
                      )}
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => selectAction(CalibrationAction.Rescale)}
                  >
                    {t(
                      'enum.readingsactiontype.rescaleexistingdata',
                      'Rescale Existing Data'
                    )}
                  </MenuItem>
                  <MenuItem
                    onClick={() => selectAction(CalibrationAction.Delete)}
                  >
                    {t(
                      'enum.readingsactiontype.deletereadings',
                      'Delete Readings'
                    )}
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CustomBox>
      {selectedAction && (
        <CustomBox p={2} borderBottom={0} grayBackground>
          {selectedAction === CalibrationAction.Rescale && (
            <RescaleReadingsForm
              dataChannelId={dataChannelId}
              onCancel={() => selectAction(null)}
            />
          )}
          {selectedAction === CalibrationAction.Delete && (
            <DeleteReadingsForm
              dataChannelId={dataChannelId}
              onCancel={() => selectAction(null)}
            />
          )}
        </CustomBox>
      )}
      <CustomBox p={2} grayBackground>
        {values.scalingMode === ScalingModeType.Linear && (
          <LinearCalibrationSummaryDetails
            values={values}
            scaledUnitsText={scaledUnitsText}
          />
        )}
        {values.scalingMode === ScalingModeType.Prescaled && (
          <PrescaledCalibrationSummaryDetails
            values={values}
            scaledUnitsText={scaledUnitsText}
          />
        )}
      </CustomBox>
    </>
  );
};

export default AdvancedCalibrationOptions;
