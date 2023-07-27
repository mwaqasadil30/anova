/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ApiException, DataChannelDTO } from 'api/admin/api';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import DateTimePicker from 'components/forms/form-fields/DateTimePicker';
import { Field, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getDataChannelDTODescription } from 'utils/ui/helpers';
import { ReadingsHookData } from '../../../types';
import { useSaveManualReading } from '../hooks/useSaveManualReading';
import {
  buildValidationSchema,
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import { Values } from './types';

const StyledFieldLabel = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const StyledValueText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

interface Props {
  dataChannel: DataChannelDTO;
  isDialogOpen: boolean;
  dataChannels?: DataChannelDTO[];
  readingsData?: ReadingsHookData;
  selectedDataChannels?: DataChannelDTO[];
  closeDialog: () => void;
  setDataChannelsResult?: (dataChannels: DataChannelDTO[]) => void;
  fetchRecords?: () => void;
}

const ManualReadingEntryDialog = ({
  dataChannel,
  isDialogOpen,
  closeDialog,
  fetchRecords,
}: Props) => {
  const { t } = useTranslation();

  const saveManualReadingApi = useSaveManualReading();
  const { isLoading, error } = saveManualReadingApi;

  const formattedInitialValues = formatInitialValues();

  // (Nov. 3, 2021)
  // Keep this logic below in the meantime, incase we need to manually
  // update some properties.
  // const currentDataChannel = dataChannels?.find(
  //   (dataChannelResult) =>
  //     dataChannelResult.dataChannelId === dataChannel.dataChannelId
  // );
  // const isCurrentDataChannelSelected = selectedDataChannels?.some(
  //   (selectedDataChannel) =>
  //     selectedDataChannel.dataChannelId === dataChannel.dataChannelId
  // );

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    saveManualReadingApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);

    return (
      saveManualReadingApi
        .mutateAsync({
          dataChannelId: dataChannel?.dataChannelId!,
          reading: formattedValuesForApi,
        })
        // Close dialog after successful save
        .then(() => {
          // (Nov. 3, 2021)
          // Keep this logic below in the meantime, incase we need to manually
          // update some properties.
          // const updatedDataChannels = dataChannels?.map(
          //   (dataChannelToUpdate) => {
          //     if (
          //       dataChannelToUpdate.dataChannelId !==
          //       currentDataChannel?.dataChannelId
          //     ) {
          //       return dataChannelToUpdate;
          //     }
          //     return {
          //       ...dataChannelToUpdate,
          //       latestReadingTimestamp:
          //         formattedValuesForApi.readingTime &&
          //         dataChannelToUpdate.latestReadingTimestamp &&
          //         formattedValuesForApi.readingTime >
          //           dataChannelToUpdate.latestReadingTimestamp
          //           ? formattedValuesForApi.readingTime
          //           : dataChannelToUpdate.latestReadingTimestamp,
          //       uomParams: {
          //         ...dataChannelToUpdate.uomParams,
          //         latestReadingValue: formattedValuesForApi.readingValue,
          //       },
          //     } as DataChannelDTO;
          //   }
          // );
          // if (updatedDataChannels) {
          //   setDataChannelsResult?.(updatedDataChannels);
          // }
          // if (isCurrentDataChannelSelected) {
          //   readingsData?.clearCache();
          // }
          fetchRecords?.();
          closeDialog();
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

  const readingValueText = t('ui.manualreading.readingvalue', 'Reading Value');

  const validationSchema = buildValidationSchema(t, {
    readingValueText,
  });

  const mainTitle = t(
    'ui.manualreading.manualReadingEntry',
    'Manual Reading Entry'
  );
  const confirmationButtonText = t('ui.common.save', 'Save');

  return (
    <Formik
      initialValues={formattedInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm }) => {
        return (
          <UpdatedConfirmationDialog
            open={isDialogOpen}
            maxWidth="sm"
            disableBackdropClick
            disableEscapeKeyDown
            mainTitle={mainTitle}
            content={
              <Box m={3} mb={2}>
                <Grid container spacing={2} alignItems="center">
                  {/* Data Channel Description Items */}
                  <Grid item xs={4}>
                    <StyledFieldLabel>
                      {t(
                        'ui.datachannel.datachanneldescription',
                        'Data Channel Description'
                      )}
                    </StyledFieldLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <StyledValueText>
                      {getDataChannelDTODescription(dataChannel)}
                    </StyledValueText>
                  </Grid>

                  {/* Reading Value Items */}
                  <Grid item xs={4}>
                    <StyledFieldLabel>
                      {t('ui.manualreading.readingvalue', 'Reading Value')}
                    </StyledFieldLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="readingValue-input"
                      name="readingValue"
                      type="number"
                      component={CustomTextField}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <StyledValueText>
                      {dataChannel.uomParams?.unit}
                    </StyledValueText>
                  </Grid>

                  {/* Reading Date and Time Items */}
                  <Grid item xs={4}>
                    <StyledFieldLabel>
                      {t('ui.manualreading.readingDate', 'Reading Date')}
                    </StyledFieldLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="readingTime-input"
                      name="readingTime"
                      component={DateTimePicker}
                      ampm
                      PopoverProps={{ id: 'date time popover' }}
                    />
                  </Grid>

                  {/* Reading Time  Items */}
                  {/* <Grid item xs={5}>
                      <StyledFieldLabel>
                        {t('ui.manualreading.readingTime', 'Reading Time')}
                      </StyledFieldLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <StyledValueText>
                        {getDataChannelDTODescription(dataChannel)}
                      </StyledValueText>
                    </Grid> */}
                </Grid>
              </Box>
            }
            confirmationButtonText={confirmationButtonText}
            closeDialog={closeDialog}
            onConfirm={submitForm}
            isDisabled={isLoading || isSubmitting}
            isError={is500Error}
          />
        );
      }}
    </Formik>
  );
};

export default ManualReadingEntryDialog;
