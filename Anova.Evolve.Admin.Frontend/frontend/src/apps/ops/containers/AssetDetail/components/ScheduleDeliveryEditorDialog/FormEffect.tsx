import { DataChannelDTO, EvolveForecastReadingResponse } from 'api/admin/api';
import { FormikProps } from 'formik';
import round from 'lodash/round';
import moment from 'moment';
import { useEffect } from 'react';
import { isNumber } from 'utils/format/numbers';
import { formatScheduledDeliveryAmountValue } from '../../helpers';
import { TimeDropdownOption, Values } from './types';

interface Props {
  initialValues: Values;
  values?: Values;
  forecastApiData?: EvolveForecastReadingResponse[] | null | undefined;
  initialSelectedScheduleDeliveryDetails?: EvolveForecastReadingResponse;
  dataChannelForScheduleDelivery?: DataChannelDTO;
  setFormattedTimeDropdownOptions: React.Dispatch<
    React.SetStateAction<TimeDropdownOption[]>
  >;
  setFieldValue: FormikProps<Values>['setFieldValue'];
}

const FormEffect = ({
  initialValues,
  values,
  forecastApiData,
  dataChannelForScheduleDelivery,
  setFormattedTimeDropdownOptions,
  setFieldValue,
}: Props) => {
  // Clear the 'Time and Fill Amount' field if a new 'Date' has been selected
  // by the user, and update the list of options in the 'Time and Fill Amount'
  // dropdown.
  useEffect(() => {
    const updatedTimeDropdownOptions: TimeDropdownOption[] = [];
    const maxProductHeightInScaledUnits =
      dataChannelForScheduleDelivery?.uomParams
        ?.maxProductHeightInScaledUnits || 0;
    const maxProductHeightInDisplayUnits =
      dataChannelForScheduleDelivery?.uomParams
        ?.maxProductHeightInDisplayUnits || 0;

    forecastApiData?.forEach((forecast) => {
      if (moment(forecast.logTime).isSame(moment(values?.date), 'day')) {
        const formattedFillAmount = formatScheduledDeliveryAmountValue(
          maxProductHeightInScaledUnits,
          maxProductHeightInDisplayUnits,
          forecast.estimateScaledValue
        );

        updatedTimeDropdownOptions.push({
          fullDate: forecast?.logTime?.toISOString(),
          time: moment(forecast?.logTime).format('HH:mm'),
          amountToFill: formattedFillAmount || 0,
          unit: dataChannelForScheduleDelivery?.uomParams?.unit,
          fullFormattedStringForOption: `${moment(forecast?.logTime).format(
            'HH:mm'
          )} - ${round(formattedFillAmount || 0, 2)} ${
            dataChannelForScheduleDelivery?.uomParams?.unit
          }`,
        } as TimeDropdownOption);
      }
    });

    if (values?.scheduledTime !== initialValues.scheduledTime) {
      setFieldValue('scheduledTime', undefined);
    }

    setFormattedTimeDropdownOptions(updatedTimeDropdownOptions);
  }, [values?.date]);

  // Clear the amount field if a new date has been selected.
  useEffect(() => {
    if (values?.date !== initialValues.date) {
      setFieldValue('deliveryAmount', '');
    }
  }, [values?.date]);

  // Update the amount field with the new calculated fill amount from the new
  // selected value in the 'Time and Fill Amount' field.
  useEffect(() => {
    if (
      values?.scheduledTime !== initialValues.scheduledTime &&
      values?.scheduledTime
    ) {
      const maxProductHeightInScaledUnits =
        dataChannelForScheduleDelivery?.uomParams
          ?.maxProductHeightInScaledUnits || 0;

      const maxProductHeightInDisplayUnits =
        dataChannelForScheduleDelivery?.uomParams
          ?.maxProductHeightInDisplayUnits || 0;

      const updatedAmountValue = forecastApiData?.find((forecast) => {
        if (
          moment(forecast.logTime).isSame(
            moment(values?.scheduledTime).toDate()
          )
        ) {
          return forecast;
        }
        return null;
      });
      const formattedFillAmount = formatScheduledDeliveryAmountValue(
        maxProductHeightInScaledUnits,
        maxProductHeightInDisplayUnits,
        updatedAmountValue?.estimateScaledValue
      );

      setFieldValue(
        'deliveryAmount',
        isNumber(formattedFillAmount) ? formattedFillAmount : null
      );
      // If a new amount is selected from the "Time and Fill Amount" dropdown
      // AND the autoFill checkbox was set to false (to enable setting the amount
      // manually), then we always disable the amount field by setting.
      // autoFill to true.
      if (!values?.isAutoFill) {
        setFieldValue('isAutoFill', true);
      }
    }
  }, [values?.scheduledTime]);

  return null;
};

export default FormEffect;
