/* eslint-disable indent, react/jsx-indent */
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { DataChannelDTO, ForecastMode, SupportedUOMType } from 'api/admin/api';
import CustomThemeProvider from 'components/CustomThemeProvider';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EditorBox from 'components/EditorBox';
import EditorPageIntro from 'components/EditorPageIntro';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { Field, Formik, FormikHelpers } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getForecastModeTypeOptions,
  getSupportedUOMTypeOptionsForTankSetup,
} from 'utils/i18n/enum-to-text';
// import { useGetTankSetup } from '../hooks/useGetTankSetup';
import { useSaveTankSetup } from '../hooks/useSaveTankSetup';
import {
  buildValidationSchema,
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import { SetupTankValues } from './types';

interface Props {
  dataChannel: DataChannelDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const TankSetupDrawerForm = ({
  // dataChannel,
  isOpen,
  onClose,
  onSaveSuccess,
}: Props) => {
  const { t } = useTranslation();
  const { forecastModeTypeOptions, supportedUOMTypeOptions } = useMemo(
    () => ({
      forecastModeTypeOptions: getForecastModeTypeOptions(t),
      supportedUOMTypeOptions: getSupportedUOMTypeOptionsForTankSetup(t),
    }),
    [t]
  );

  // const getApi = useGetTankSetup({});
  const saveApi = useSaveTankSetup();

  // TODO: Do we need an API call to fetch the initial values? or are we using
  // the data channel the user selected from the table?
  // dataChannel
  const formattedInitialValues = formatInitialValues();

  const validationSchema = buildValidationSchema();

  const handleSubmit = (
    values: SetupTankValues,
    formikBag: FormikHelpers<SetupTankValues>
  ) => {
    // Clear the error state when submitting
    saveApi.reset();
    // TODO: Pass in values
    const formattedValuesForApi = formatValuesForApi();
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

  const tankTypeOptions = [
    {
      label: 'Test',
      value: -1,
    },
  ];
  const tankProfileOptions = [
    {
      label: 'Test',
      value: -1,
    },
  ];
  const productOptions = [
    {
      label: 'Test',
      value: -1,
    },
  ];
  const displayUnitsOptions = [
    {
      label: 'Test',
      value: -1,
    },
  ];
  const rtuFrontPanelDisplayOptions = [
    {
      label: 'Test',
      value: -1,
    },
  ];

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} variant="temporary">
      <DrawerContent>
        <Formik<SetupTankValues>
          initialValues={formattedInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, submitForm }) => {
            const usesTankTypeDropdown =
              values.tankLevelMode === SupportedUOMType.Basic ||
              values.tankLevelMode === SupportedUOMType.BasicWithPercentFull ||
              values.tankLevelMode === SupportedUOMType.SimplifiedVolumetric;

            const productField = (
              <Field
                id="productId-input"
                name="productId"
                component={CustomTextField}
                label={t('ui.common.product', 'Product')}
                select
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value="" disabled>
                  <SelectItem />
                </MenuItem>
                {productOptions?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
            );

            const maxProductHeightField = (
              <Field
                id="maxProductHeight-input"
                name="maxProductHeight"
                type="number"
                component={CustomTextField}
                // TODO: Render unit in parentheses beside label
                label={t(
                  'ui.datachannel.maxproductheight',
                  'Max Product Height'
                )}
              />
            );

            const displayUnitsField = (
              <Field
                id="displayUnits-input"
                name="displayUnits"
                component={CustomTextField}
                label={t('ui.datachannel.displayunits', 'Display Units')}
                select
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value="" disabled>
                  <SelectItem />
                </MenuItem>
                {displayUnitsOptions?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
            );

            return (
              <>
                <CustomThemeProvider forceThemeType="dark">
                  <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                    <EditorPageIntro
                      showSaveOptions
                      isWithinDrawer
                      title={t('ui.assetDetail.tankSetup', 'Tank Setup')}
                      isSubmitting={isSubmitting}
                      submissionResult={saveApi.data}
                      submissionError={saveApi.error}
                      cancelCallback={cancelCallback}
                      submitForm={submitForm}
                      saveAndExitCallback={saveAndExitCallback}
                    />
                  </PageIntroWrapper>
                </CustomThemeProvider>

                <Box mt={3} />

                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12}>
                    <EditorBox>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12}>
                          <Field
                            id="tankLevelMode-input"
                            name="tankLevelMode"
                            component={CustomTextField}
                            label={t(
                              'ui.tankSetup.tankLevelMode',
                              'Tank Level Mode'
                            )}
                            select
                            SelectProps={{ displayEmpty: true }}
                          >
                            <MenuItem value="" disabled>
                              <SelectItem />
                            </MenuItem>
                            {supportedUOMTypeOptions?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>
                        <Grid item xs={12}>
                          {usesTankTypeDropdown ? (
                            <Field
                              id="tankType-input"
                              name="tankType"
                              component={CustomTextField}
                              label={t('ui.datachannel.tanktype', 'Tank Type')}
                              select
                              SelectProps={{ displayEmpty: true }}
                            >
                              <MenuItem value="" disabled>
                                <SelectItem />
                              </MenuItem>
                              {tankTypeOptions?.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Field>
                          ) : (
                            <Field
                              id="tankProfile-input"
                              name="tankProfile"
                              component={CustomTextField}
                              label={t(
                                'ui.tankSetup.tankProfile',
                                'Tank Profile'
                              )}
                              select
                              SelectProps={{ displayEmpty: true }}
                            >
                              <MenuItem value="" disabled>
                                <SelectItem />
                              </MenuItem>
                              {tankProfileOptions?.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Field>
                          )}
                        </Grid>
                        {(values.tankLevelMode === SupportedUOMType.Basic ||
                          values.tankLevelMode ===
                            SupportedUOMType.BasicWithPercentFull) && (
                          <>
                            <Grid item xs={6}>
                              {productField}
                            </Grid>
                            <Grid item xs={6}>
                              {maxProductHeightField}
                            </Grid>
                          </>
                        )}
                        {values.tankLevelMode ===
                          SupportedUOMType.Volumetric && (
                          <>
                            <Grid item xs={12}>
                              {productField}
                            </Grid>
                            <Grid item xs={6}>
                              {displayUnitsField}
                            </Grid>
                            <Grid item xs={6}>
                              {maxProductHeightField}
                            </Grid>
                          </>
                        )}
                        {values.tankLevelMode ===
                          SupportedUOMType.SimplifiedVolumetric && (
                          <>
                            <Grid item xs={6}>
                              {productField}
                            </Grid>
                            <Grid item xs={6}>
                              {displayUnitsField}
                            </Grid>
                            {/* TODO: Set up these fields? */}
                            {/* <Grid item xs={6}>
                              {maxProductHeightScaledUnitsField}
                            </Grid>
                            <Grid item xs={6}>
                              {maxProductHeightDisplayUnitsField}
                            </Grid> */}
                          </>
                        )}
                        <Grid item xs={12}>
                          <Field
                            id="specifyMinAndMaxDeliveryAmounts-input"
                            name="specifyMinAndMaxDeliveryAmounts"
                            component={CheckboxWithLabel}
                            Label={{
                              label: t(
                                'ui.tankSetup.specifyMinAndMaxDeliveryAmounts',
                                'Specify Min and Max Delivery Amounts'
                              ),
                            }}
                            type="checkbox"
                          />
                        </Grid>
                        {values.specifyMinAndMaxDeliveryAmounts && (
                          <>
                            <Grid item xs={6}>
                              <Field
                                id="minDeliveryAmounts-input"
                                name="minDeliveryAmounts"
                                type="number"
                                component={CustomTextField}
                                // TODO: Render unit in parentheses beside label
                                label={t(
                                  'ui.tankSetup.minDeliveryAmounts',
                                  'Min Delivery Amounts'
                                )}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Field
                                id="maxDeliveryAmounts-input"
                                name="maxDeliveryAmounts"
                                type="number"
                                component={CustomTextField}
                                // TODO: Render unit in parentheses beside label
                                label={t(
                                  'ui.tankSetup.maxDeliveryAmounts',
                                  'Max Delivery Amounts'
                                )}
                              />
                            </Grid>
                          </>
                        )}
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid
                          item
                          xs={
                            // Make the field full-width if we aren't showing
                            // the usage rate field beside the forecast mode
                            // dropdown
                            values.forecastMode === ForecastMode.ManualUsageRate
                              ? 6
                              : 12
                          }
                        >
                          <Field
                            id="forecastMode-input"
                            name="forecastMode"
                            component={CustomTextField}
                            label={t(
                              'ui.datachannel.forecastmode',
                              'Forecast Mode'
                            )}
                            select
                            SelectProps={{ displayEmpty: true }}
                          >
                            <MenuItem value="" disabled>
                              <SelectItem />
                            </MenuItem>
                            {forecastModeTypeOptions?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>
                        {values.forecastMode ===
                          ForecastMode.ManualUsageRate && (
                          <Grid item xs={6}>
                            <Field
                              id="usageRate-input"
                              name="usageRate"
                              type="number"
                              component={CustomTextField}
                              // TODO: Render unit per hour in parentheses beside label
                              label={t(
                                'ui.datachanneleventrule.usagerate',
                                'Usage Rate'
                              )}
                            />
                          </Grid>
                        )}
                        {values.forecastMode === ForecastMode.NoForecast && (
                          <>
                            <Grid item xs={12}>
                              <Grid container spacing={1}>
                                <Grid item xs={12}>
                                  <Field
                                    id="showHighLowForecast-input"
                                    name="showHighLowForecast"
                                    component={CheckboxWithLabel}
                                    Label={{
                                      label: t(
                                        'ui.datachannel.showhighlowforecast',
                                        'Show High/Low Forecast'
                                      ),
                                    }}
                                    type="checkbox"
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Field
                                    id="showScheduledDeliveriesInForecast-input"
                                    name="showScheduledDeliveriesInForecast"
                                    component={CheckboxWithLabel}
                                    Label={{
                                      label: t(
                                        'ui.datachannel.isdeliveryforecasted',
                                        'Show Scheduled Deliveries in Forecast'
                                      ),
                                    }}
                                    type="checkbox"
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                        )}
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            id="rtuFrontPanelDisplay-input"
                            name="rtuFrontPanelDisplay"
                            component={CustomTextField}
                            label={t(
                              'ui.tankSetup.rtuFrontPanelDisplay',
                              'RTU Front Panel Display'
                            )}
                            select
                            SelectProps={{ displayEmpty: true }}
                          >
                            <MenuItem value="" disabled>
                              <SelectItem />
                            </MenuItem>
                            {rtuFrontPanelDisplayOptions?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>
                      </Grid>
                    </EditorBox>
                  </Grid>
                </Grid>
              </>
            );
          }}
        </Formik>
      </DrawerContent>
    </Drawer>
  );
};

export default TankSetupDrawerForm;
