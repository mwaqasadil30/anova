/* eslint-disable indent, react/jsx-indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import {
  DataChannelDisplayUnitDTO,
  DataChannelReportDTO,
  DataChannelTankAndSensorConfigDTO,
  DataChannelCategory,
  UnitConversionModeEnum,
} from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import CustomThemeProvider from 'components/CustomThemeProvider';
import EditorPageIntro from 'components/EditorPageIntro';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { useGetDisplayUnitsByUnitConversionMode } from 'containers/DataChannelEditor/hooks/useGetDisplayUnitsByUnitConversionMode';
import { useGetRawUnits } from 'containers/DataChannelEditor/hooks/useGetRawUnits';
import { useGetScaledUnitsByDataChannelId } from 'containers/DataChannelEditor/hooks/useGetScaledUnitsByDataChannelId';
import { useSavePressureTankAndSensorConfig } from 'containers/DataChannelEditor/hooks/useSavePressureTankAndSensorConfig';
import { useSaveTankAndSensorConfig } from 'containers/DataChannelEditor/hooks/useSaveTankAndSensorConfig';
import { Formik, FormikHelpers } from 'formik';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
import {
  buildUnitConversionModeTextMapping,
  getTankDimensionTypeOptions,
  getUnitConversionModeEnumOptionsForTankSetupInfo,
} from 'utils/i18n/enum-to-text';
import DeliverySettingsContainer from './components/DeliverySettingsContainer';
import ReadingAndDisplayContainer from './components/ReadingAndDisplayContainer';
import ScalingContainer from './components/ScalingContainer';
import TankSetupContainer from './components/TankSetupContainer';
import {
  buildValidationSchema,
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import TankSetupInfoFormEffect from './TankSetupInfoFormEffect';
import { Values } from './types';

interface Props {
  dataChannelDetails?: DataChannelReportDTO | null;
  dataChannelId?: string;
  cancelCallback: () => void;
  saveAndExitCallback?: () => void;
  openEventEditorWarningDialog: () => void;
}

const TankAndSensorConfigurationDrawer = ({
  dataChannelDetails,
  dataChannelId,
  cancelCallback,
  saveAndExitCallback,
  openEventEditorWarningDialog,
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [hasFormSubmitted, setHasFormSubmitted] = useState(false);

  const sensorCalibration = dataChannelDetails?.sensorCalibration;
  const tankSetupInfo = dataChannelDetails?.tankSetupInfo;

  const isLevelDataChannel =
    dataChannelDetails?.dataChannelTypeId === DataChannelCategory.Level;

  const isTotalizedDataChannel =
    dataChannelDetails?.dataChannelTypeId ===
    DataChannelCategory.TotalizedLevel;

  const isPressureDataChannel =
    dataChannelDetails?.dataChannelTypeId === DataChannelCategory.Pressure;

  const getRawUnitsApi = useGetRawUnits();
  const rawUnitsOptions = getRawUnitsApi.data;

  const getScaledUnitsApi = useGetScaledUnitsByDataChannelId(dataChannelId!);
  const scaledUnitsOptions = getScaledUnitsApi.data;

  const formattedInitialValues = formatInitialValues(dataChannelDetails);

  const queryClient = useQueryClient();
  const updateTankAndSensorConfigApi = useSaveTankAndSensorConfig({
    onSuccess: () => {
      queryClient.invalidateQueries(APIQueryKey.getDataChannelDetailsById);
    },
  });
  const updatePressureTankAndSensorConfigApi = useSavePressureTankAndSensorConfig(
    {
      onSuccess: () => {
        queryClient.invalidateQueries(APIQueryKey.getDataChannelDetailsById);
      },
    }
  );

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    setHasFormSubmitted(false);
    updateTankAndSensorConfigApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);

    const updateApi = isPressureDataChannel
      ? updatePressureTankAndSensorConfigApi
      : updateTankAndSensorConfigApi;

    return updateApi
      .mutateAsync({
        ...formattedValuesForApi,
        dataChannelId: dataChannelId!,
      } as DataChannelTankAndSensorConfigDTO)
      .then(() => {
        dispatch(enqueueSaveSuccessSnackbar(t));
        setHasFormSubmitted(true);
      })
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  // #region Tank setup
  const [
    displayUnitRequest,
    setDisplayUnitRequest,
  ] = useState<UnitConversionModeEnum>();

  const displayUnitApi = useGetDisplayUnitsByUnitConversionMode(
    displayUnitRequest
  );

  const [displayUnitOptions, setDisplayUnitOptions] = useState<
    DataChannelDisplayUnitDTO[]
  >([]);

  const allUnitConversionModeEnumOptions = getUnitConversionModeEnumOptionsForTankSetupInfo(
    t
  );
  const unitConversionModeTextMapping = buildUnitConversionModeTextMapping(t);
  const tankTypeOptions = useMemo(() => getTankDimensionTypeOptions(t), [t]);

  // #endregion Tank setup

  const rawUnitsText = t('ui.datachannel.raw', 'Raw');
  const scaledUnitsText = t('ui.datachannel.scaled', 'Scaled');
  const validationSchema = buildValidationSchema(t, {
    rawUnitsText,
    scaledUnitsText,
  });

  const getFormattedPanelTitle = () => {
    if (isPressureDataChannel) {
      return t('ui.dataChannel.sensorConfiguration', 'Sensor Configuration');
    }
    return t('ui.dataChannel.tankAndSensor', 'Tank and Sensor');
  };

  const formattedPanelTitle = getFormattedPanelTitle();

  return (
    <Formik<Values>
      initialValues={formattedInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        initialValues,
        values,
        errors,
        status,
        setFieldValue,
        setValues,
        submitForm,
      }) => {
        const hasErrorsInAdditionalSettingsExpansionPanel =
          !!errors.usePrescaling ||
          !!errors.rawUnitsAtZero ||
          !!errors.rawUnitsAtFullScale ||
          !!errors.useLimits ||
          !!errors.rawUnitsAtUnderRange ||
          !!errors.rawUnitsAtOverRange;
        return (
          <>
            {/* NOTE: Additional Tank setup-related field business logic is included in this form effect */}
            <TankSetupInfoFormEffect
              values={values}
              initialValues={initialValues}
              dataChannelId={dataChannelId}
              displayUnitApi={displayUnitApi}
              hasFormSubmitted={hasFormSubmitted}
              setFieldValue={setFieldValue}
              setDisplayUnitOptions={setDisplayUnitOptions}
              setDisplayUnitRequest={setDisplayUnitRequest}
              openEventEditorWarningDialog={openEventEditorWarningDialog}
            />

            <CustomThemeProvider forceThemeType="dark">
              <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                <EditorPageIntro
                  showSaveOptions
                  title={formattedPanelTitle}
                  cancelCallback={cancelCallback}
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  submissionResult={
                    updateTankAndSensorConfigApi.data ||
                    updatePressureTankAndSensorConfigApi.data
                  }
                  submissionError={
                    updateTankAndSensorConfigApi.error ||
                    updatePressureTankAndSensorConfigApi.error
                  }
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TankSetupContainer
                  values={values}
                  dataChannelDetails={dataChannelDetails}
                  isTotalizedDataChannel={isTotalizedDataChannel}
                  isLevelDataChannel={isLevelDataChannel}
                  tankSetupInfo={tankSetupInfo}
                  tankTypeOptions={tankTypeOptions}
                  unitConversionModeTextMapping={unitConversionModeTextMapping}
                  allUnitConversionModeEnumOptions={
                    allUnitConversionModeEnumOptions
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <ScalingContainer
                  values={values}
                  dataChannelDetails={dataChannelDetails}
                  dataChannelId={dataChannelId}
                  hasErrorsInAdditionalSettingsExpansionPanel={
                    hasErrorsInAdditionalSettingsExpansionPanel
                  }
                  sensorCalibration={sensorCalibration}
                  rawUnitsOptions={rawUnitsOptions}
                  scaledUnitsOptions={scaledUnitsOptions}
                  isSubmitting={isSubmitting}
                  getRawUnitsApi={getRawUnitsApi}
                  getScaledUnitsApi={getScaledUnitsApi}
                  status={status}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
                />
              </Grid>

              <Grid item xs={12}>
                <ReadingAndDisplayContainer
                  values={values}
                  isSubmitting={isSubmitting}
                  displayUnitApi={displayUnitApi}
                  displayUnitOptions={displayUnitOptions}
                  dataChannelDetails={dataChannelDetails}
                />
              </Grid>

              {isLevelDataChannel && (
                <Grid item xs={12}>
                  <DeliverySettingsContainer
                    values={values}
                    dataChannelDetails={dataChannelDetails}
                  />
                </Grid>
              )}
            </Grid>
          </>
        );
      }}
    </Formik>
  );
};

export default TankAndSensorConfigurationDrawer;
