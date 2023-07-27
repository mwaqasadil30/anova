/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {
  DataChannelCategory,
  DataChannelForecastDeliveryInfoDTO,
  DataChannelReportDTO,
  DataChannelSaveForecastDeliveryInfoDTO,
  ForecastMode,
  UnitConversionModeEnum,
} from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import CustomThemeProvider from 'components/CustomThemeProvider';
import EditorBox from 'components/EditorBox';
import EditorPageIntro from 'components/EditorPageIntro';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SwitchWithLabel from 'components/forms/form-fields/SwitchWithLabel';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { useSaveForecastAndDeliveryInfo } from 'containers/DataChannelEditor/hooks/useSaveForecastAndDeliveryInfo';
import { Field, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
import { getForecastModeOptions } from 'utils/i18n/enum-to-text';
import { labelWithOptionalText } from '../../helpers';
import { StyledFieldLabelText } from '../../styles';
import {
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import { Values } from './types';

interface Props {
  dataChannelDetails: DataChannelReportDTO | null | undefined;
  forecastAndDeliveryInfo?: DataChannelForecastDeliveryInfoDTO | null;
  cancelCallback: () => void;
  saveAndExitCallback?: () => void;
}

const ForecastAndDeliveryParametersDrawer = ({
  dataChannelDetails,
  forecastAndDeliveryInfo,
  cancelCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formattedInitialValues = formatInitialValues(forecastAndDeliveryInfo);

  const allForecastModeOptions = getForecastModeOptions(t);

  const ForecastModeOptions =
    dataChannelDetails?.dataChannelTypeId === DataChannelCategory.TotalizedLevel
      ? allForecastModeOptions.filter(
          (forecastOptions) =>
            forecastOptions.value !== ForecastMode.ManualUsageRate
        )
      : allForecastModeOptions;

  const isSimplifiedVolumetricTank =
    dataChannelDetails?.tankSetupInfo?.unitConversionModeId ===
    UnitConversionModeEnum.SimplifiedVolumetric;
  const isVolumetricTank =
    dataChannelDetails?.tankSetupInfo?.unitConversionModeId ===
    UnitConversionModeEnum.Volumetric;
  const isBasicTank =
    dataChannelDetails?.tankSetupInfo?.unitConversionModeId ===
    UnitConversionModeEnum.Basic;

  const queryClient = useQueryClient();
  const updateForecastAndDeliveryInfoApi = useSaveForecastAndDeliveryInfo({
    onSuccess: () => {
      queryClient.invalidateQueries(APIQueryKey.getDataChannelDetailsById);
    },
  });

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    updateForecastAndDeliveryInfoApi.reset();
    const formattedValuesForApi = formatValuesForApi(
      values,
      dataChannelDetails
    );

    return updateForecastAndDeliveryInfoApi
      .mutateAsync({
        ...formattedValuesForApi,
        dataChannelId: dataChannelDetails?.dataChannelId!,
      } as DataChannelSaveForecastDeliveryInfoDTO)
      .then(() => {
        dispatch(enqueueSaveSuccessSnackbar(t));
      })
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const getUnitsTextByTankType = () => {
    if (isBasicTank) {
      return dataChannelDetails?.sensorCalibration?.scaledUnitsAsText;
    }

    if (isSimplifiedVolumetricTank) {
      return dataChannelDetails?.tankSetupInfo?.simplifiedTankSetupInfo
        ?.displayUnitsAsText;
    }

    if (isVolumetricTank) {
      return dataChannelDetails?.tankSetupInfo?.volumetricTankSetupInfo
        ?.displayUnitsAsText;
    }

    return '';
  };

  const unitsText = getUnitsTextByTankType();

  const manualUsageRateLabelWithUnit = labelWithOptionalText(
    t('enum.forecastmodetype.manualusagerate', 'Manual Usage Rate'),
    `${unitsText}${t('report.common.perhour', '/hr')}`
  );

  const totalizedMaxTruckCapacity = labelWithOptionalText(
    t('ui.datachannel.maxTruckCapacity', 'Max Truck Capacity'),
    // Totalized Data Channels are hardcoded to Ins WC
    t('enum.unittype.inswc', 'Ins WC')
  );

  return (
    <Formik<Values>
      initialValues={formattedInitialValues}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, submitForm }) => {
        return (
          <>
            <CustomThemeProvider forceThemeType="dark">
              <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                <EditorPageIntro
                  showSaveOptions
                  title={t(
                    'ui.dataChannel.forecastAndDelivery',
                    'Forecast and Delivery'
                  )}
                  cancelCallback={cancelCallback}
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  submissionResult={updateForecastAndDeliveryInfoApi.data}
                  submissionError={updateForecastAndDeliveryInfoApi.error}
                  saveAndExitCallback={saveAndExitCallback}
                />
              </PageIntroWrapper>
            </CustomThemeProvider>
            <Box mt={3} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <EditorBox>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.datachannel.forecastmode', 'Forecast Mode')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={8}>
                      <Field
                        id="forecastModeTypeId-input"
                        name="forecastModeTypeId"
                        component={CustomTextField}
                        select
                        SelectProps={{ displayEmpty: true }}
                      >
                        <MenuItem value="" disabled>
                          <SelectItem />
                        </MenuItem>
                        {ForecastModeOptions?.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>

                    {/* Only show minFillThreshold if the data channel is a
                    totalizer */}
                    {dataChannelDetails?.dataChannelTypeId ===
                      DataChannelCategory.TotalizedLevel && (
                      <>
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {totalizedMaxTruckCapacity}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="maxTruckCapacity-input"
                            name="maxTruckCapacity"
                            type="number"
                            component={CustomTextField}
                          />
                        </Grid>
                      </>
                    )}

                    {dataChannelDetails?.dataChannelTypeId !==
                      DataChannelCategory.TotalizedLevel && (
                      <>
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t(
                              'ui.datachannel.showhighlowforecast',
                              'Show High/Low Forecast'
                            )}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="showHighLowForecast-input"
                            name="showHighLowForecast"
                            component={SwitchWithLabel}
                            type="checkbox"
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t(
                              'ui.datachannel.reforecastWhenDeliveryScheduled',
                              'Reforecast When Delivery Scheduled'
                            )}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="reforecastWhenDeliveryScheduled-input"
                            name="reforecastWhenDeliveryScheduled"
                            component={SwitchWithLabel}
                            type="checkbox"
                          />
                        </Grid>

                        {values.forecastModeTypeId ===
                          ForecastMode.ManualUsageRate && (
                          <>
                            <Grid item xs={4}>
                              <StyledFieldLabelText>
                                {manualUsageRateLabelWithUnit}
                              </StyledFieldLabelText>
                            </Grid>
                            <Grid item xs={8}>
                              <Field
                                id="manualUsageRate-input"
                                name="manualUsageRate"
                                type="number"
                                component={CustomTextField}
                              />
                            </Grid>
                          </>
                        )}
                      </>
                    )}
                  </Grid>
                </EditorBox>
              </Grid>
            </Grid>
          </>
        );
      }}
    </Formik>
  );
};

export default ForecastAndDeliveryParametersDrawer;
