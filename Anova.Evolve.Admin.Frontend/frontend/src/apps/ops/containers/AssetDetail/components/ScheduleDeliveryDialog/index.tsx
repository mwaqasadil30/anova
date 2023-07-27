/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import {
  ApiException,
  DataChannelDTO,
  EvolveForecastReadingResponse,
  ScheduledDeliveryDto,
} from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import Button from 'components/Button';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import KeyboardDatePicker from 'components/forms/form-fields/KeyboardDatePicker';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import { Field, Formik, FormikHelpers } from 'formik';
import round from 'lodash/round';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { selectCurrentTimezone } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { formatScheduledDeliveryAmountValue } from '../../helpers';
import FormEffect from './FormEffect';
import {
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import { useSaveScheduledDelivery } from './hooks/useSaveScheduledDelivery';
import { TimeDropdownOption, Values } from './types';

const StyledDeleteButton = styled(Button)`
  color: #f03737;
  &[class*='MuiButton-outlined'] {
    border: 1px solid #f03737;
  }
`;

const StyledFieldLabel = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const StyledValueText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

interface Props {
  isDialogOpen: boolean;
  selectedDataChannels?: DataChannelDTO[];
  closeDialog: () => void;
  setDataChannelsResult?: (dataChannels: DataChannelDTO[]) => void;
  initialSelectedScheduleDeliveryDetails?: EvolveForecastReadingResponse;
  dataChannelForScheduleDelivery?: DataChannelDTO;
  forecastApiData?: EvolveForecastReadingResponse[] | null | undefined;
  refetchRecords: () => void;
}

const ScheduleDeliveryDialog = ({
  isDialogOpen,
  closeDialog,
  initialSelectedScheduleDeliveryDetails,
  dataChannelForScheduleDelivery,
  forecastApiData,
  refetchRecords,
}: Props) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const currentTimeZone = useSelector(selectCurrentTimezone).timezone
    ?.displayName;

  const saveScheduledDeliveryApi = useSaveScheduledDelivery({
    onSuccess: () => {
      queryClient.invalidateQueries(APIQueryKey.retrieveScheduledDeliveries);
    },
  });
  const { isLoading, error } = saveScheduledDeliveryApi;

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    saveScheduledDeliveryApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);

    return (
      saveScheduledDeliveryApi
        .mutateAsync({
          dataChannelId: dataChannelForScheduleDelivery?.dataChannelId,
          deliveryAmount: formattedValuesForApi.deliveryAmount,
          isAutoFill: formattedValuesForApi.isAutoFill,
          scheduledTime: formattedValuesForApi.scheduledTime,
          deliveryScheduleId: undefined,
          lateGracePeriodInMinutes:
            formattedValuesForApi.lateGracePeriodInMinutes,
          timeCompleted: undefined,
        } as ScheduledDeliveryDto)
        // Close dialog after successful save
        .then(() => {
          closeDialog();
          refetchRecords();
        })
        .catch((apiError) => {
          const formattedErrors = mapApiErrorsToFields(t, apiError as any);
          if (formattedErrors) {
            formikBag.setErrors(formattedErrors as any);
            formikBag.setStatus({ errors: formattedErrors });
          }
        })
    );
  };

  // NOTE: Error handling with react query example below
  // #error #instanceof #ApiException #error.status
  const is500Error =
    !!error && error instanceof ApiException && error.status >= 500;

  // TODO: Check how user is creating/scheduling once api+UX is implemented
  const isCreatingScheduleDelivery = true;

  const mainTitle = isCreatingScheduleDelivery
    ? t('ui.scheduleddelivery.scheduledelivery', 'Schedule Delivery')
    : t('ui.scheduleddelivery.editDelivery', 'Edit Delivery');

  const timeDropdownOptions: TimeDropdownOption[] = [];

  forecastApiData?.forEach((forecast) => {
    if (
      moment(forecast.logTime).isSame(
        moment(initialSelectedScheduleDeliveryDetails?.logTime),
        'day'
      )
    ) {
      timeDropdownOptions.push({
        fullDate: forecast?.logTime?.toISOString(),
        time: moment(forecast?.logTime).format('HH:mm'),
        amountToFill: forecast.estimateScaledValue || 0,
        unit: dataChannelForScheduleDelivery?.uomParams?.unit,
        fullFormattedStringForOption: `${moment(forecast?.logTime).format(
          'HH:mm'
        )} - ${round(forecast.estimateScaledValue || 0, 2)} ${
          dataChannelForScheduleDelivery?.uomParams?.unit
        }`,
      } as TimeDropdownOption);
    }
  });

  const [
    formattedTimeDropdownOptions,
    setFormattedTimeDropdownOptions,
  ] = useState<TimeDropdownOption[]>(timeDropdownOptions);

  const maxProductHeightInScaledUnits =
    dataChannelForScheduleDelivery?.uomParams?.maxProductHeightInScaledUnits ||
    0;
  const maxProductHeightInDisplayUnits =
    dataChannelForScheduleDelivery?.uomParams?.maxProductHeightInDisplayUnits ||
    0;

  const formattedInitialValues = formatInitialValues({
    date: initialSelectedScheduleDeliveryDetails?.logTime,
    scheduledTime: initialSelectedScheduleDeliveryDetails?.logTime?.toISOString(),
    isAutoFill: true,
    deliveryAmount: formatScheduledDeliveryAmountValue(
      maxProductHeightInScaledUnits,
      maxProductHeightInDisplayUnits,
      initialSelectedScheduleDeliveryDetails?.estimateScaledValue
    ),
  });

  const firstSelectableForecastDate = moment(
    forecastApiData?.[0]?.logTime
  ).toDate();
  const lastSelectableForecastDate = moment(
    forecastApiData?.[forecastApiData?.length - 1]?.logTime
  ).toDate();

  return (
    <Formik
      initialValues={formattedInitialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        initialValues,
        values,
        isSubmitting,
        submitForm,
        setFieldValue,
        resetForm,
      }) => {
        return (
          <>
            <FormEffect
              initialValues={initialValues}
              values={values}
              forecastApiData={forecastApiData}
              initialSelectedScheduleDeliveryDetails={
                initialSelectedScheduleDeliveryDetails
              }
              dataChannelForScheduleDelivery={dataChannelForScheduleDelivery}
              setFormattedTimeDropdownOptions={setFormattedTimeDropdownOptions}
              setFieldValue={setFieldValue}
            />
            <UpdatedConfirmationDialog
              open={isDialogOpen}
              maxWidth="sm"
              disableBackdropClick
              disableEscapeKeyDown
              mainTitle={mainTitle}
              content={
                <Box m={3} mb={2}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                      <StyledFieldLabel>
                        {t('ui.common.timezone', 'Time Zone')}
                      </StyledFieldLabel>
                    </Grid>
                    <Grid item xs={8}>
                      <StyledValueText>{currentTimeZone}</StyledValueText>
                    </Grid>

                    <Grid item xs={4}>
                      <StyledFieldLabel>
                        {t('ui.common.date', 'Date')}
                      </StyledFieldLabel>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="date-input"
                        name="date"
                        component={KeyboardDatePicker}
                        KeyboardButtonProps={{
                          'aria-label': 'change schedule delivery date',
                        }}
                        PopoverProps={{ id: 'schedule delivery date popover' }}
                        ampm
                        minDate={firstSelectableForecastDate}
                        maxDate={lastSelectableForecastDate}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <StyledFieldLabel>
                        {t(
                          'ui.scheduleddelivery.timeAndFillAmount',
                          'Time and Fill Amount'
                        )}
                      </StyledFieldLabel>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        component={CustomTextField}
                        id="scheduledTime-input"
                        name="scheduledTime"
                        select
                        SelectProps={{ displayEmpty: true }}
                      >
                        <MenuItem value="">
                          <SelectItem />
                        </MenuItem>

                        {formattedTimeDropdownOptions?.map(
                          (option?: TimeDropdownOption) => (
                            <MenuItem
                              key={option?.fullFormattedStringForOption}
                              value={option?.fullDate}
                            >
                              {option?.fullFormattedStringForOption}
                            </MenuItem>
                          )
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={4}>
                      <StyledFieldLabel>
                        {t('ui.scheduleddelivery.autofill', 'Auto Fill')}
                      </StyledFieldLabel>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="isAutoFill-input"
                        name="isAutoFill"
                        type="checkbox"
                        component={CheckboxWithLabel}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <StyledFieldLabel>
                        {t('ui.scheduleddelivery.amount', 'Amount')}
                      </StyledFieldLabel>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="deliveryAmount-input"
                        name="deliveryAmount"
                        type="number"
                        component={CustomTextField}
                        disabled={values.isAutoFill}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <StyledValueText>
                        {dataChannelForScheduleDelivery?.uomParams?.unit}
                      </StyledValueText>
                    </Grid>

                    <Grid item xs={4}>
                      <StyledFieldLabel>
                        {t(
                          'ui.scheduleddelivery.deliverywindow',
                          'Delivery Window'
                        )}
                      </StyledFieldLabel>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="lateGracePeriodInMinutes-input"
                        name="lateGracePeriodInMinutes"
                        type="number"
                        component={CustomTextField}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <StyledValueText>
                        {t('ui.common.mins', 'Min(s)')}
                      </StyledValueText>
                    </Grid>

                    <Grid item xs={12}>
                      <Box textAlign="center">
                        <Grid
                          container
                          spacing={1}
                          alignItems="center"
                          justify="center"
                        >
                          {!isCreatingScheduleDelivery && (
                            <Grid item>
                              <Box textAlign="center">
                                <StyledDeleteButton
                                  variant="outlined"
                                  // TODO: Add delete function with closeDialog
                                  onClick={closeDialog}
                                  disabled={isLoading || isSubmitting}
                                >
                                  {t('ui.common.delete', 'Delete')}
                                </StyledDeleteButton>
                              </Box>
                            </Grid>
                          )}
                          <Grid item>
                            <Box textAlign="center">
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  closeDialog();
                                  // If the user modifies the initial date picker value and cancels/closes
                                  // the dialog and proceeds to click a date past the 90 day forecast,
                                  // the date becomes unchanged from their modified option, so we
                                  // reset the form to always get the new date on graph click.
                                  resetForm();
                                }}
                                disabled={isLoading || isSubmitting}
                              >
                                {t('ui.common.cancel', 'Cancel')}
                              </Button>
                            </Box>
                          </Grid>
                          <Grid item>
                            <Box textAlign="center">
                              <Button
                                variant="contained"
                                className="brand-yellow"
                                onClick={submitForm}
                                disabled={
                                  isLoading ||
                                  isSubmitting ||
                                  !values.scheduledTime
                                }
                              >
                                {t('ui.common.save', 'Save')}
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              }
              hideConfirmationButton
              hideCancelButton
              isError={is500Error}
            />
          </>
        );
      }}
    </Formik>
  );
};

export default ScheduleDeliveryDialog;
