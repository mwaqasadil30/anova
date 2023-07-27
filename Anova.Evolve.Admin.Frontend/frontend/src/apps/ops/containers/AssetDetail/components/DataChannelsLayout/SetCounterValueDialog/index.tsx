/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ApiException, DataChannelDTO } from 'api/admin/api';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import { Field, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getDataChannelDTODescription } from 'utils/ui/helpers';
import { ReadingsHookData } from '../../../types';
import { useSaveChannelCounterValue } from '../hooks/useSaveChannelCounterValue';
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

const SetCounterValueDialog = ({
  dataChannel,
  isDialogOpen,
  closeDialog,
  fetchRecords,
}: Props) => {
  const { t } = useTranslation();

  const saveChannelCounterValueApi = useSaveChannelCounterValue();
  const { isLoading, error } = saveChannelCounterValueApi;

  const formattedInitialValues = formatInitialValues();

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    saveChannelCounterValueApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);

    return (
      saveChannelCounterValueApi
        .mutateAsync({
          rtuDeviceId: dataChannel?.rtuDeviceId!,
          channelNumber: dataChannel.channelNumber!,
          counterValue: formattedValuesForApi.counterValue!,
        })
        // Close dialog after successful save
        .then(() => {
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

  const counterValueText = t(
    'ui.setcountervalue.countervalue',
    'Counter Value'
  );

  const validationSchema = buildValidationSchema(t, {
    counterValueText,
  });

  const mainTitle = t('ui.assetdetail.setcountervalue', 'Set Counter Value');

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
            maxWidth="xs"
            disableBackdropClick
            disableEscapeKeyDown
            mainTitle={mainTitle}
            content={
              <Box m={3} mb={2}>
                <Grid container spacing={2} alignItems="center">
                  {/* Data Channel Description Items */}
                  <Grid item xs={5}>
                    <StyledFieldLabel>
                      {t(
                        'ui.datachannel.datachanneldescription',
                        'Data Channel Description'
                      )}
                    </StyledFieldLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <StyledValueText>
                      {getDataChannelDTODescription(dataChannel)}
                    </StyledValueText>
                  </Grid>

                  {/* Counter Value Items */}
                  <Grid item xs={5}>
                    <StyledFieldLabel>
                      {t('ui.setcountervalue.countervalue', 'Counter Value')}
                    </StyledFieldLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <Field
                      id="counterValue-input"
                      name="counterValue"
                      type="number"
                      component={CustomTextField}
                    />
                  </Grid>
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

export default SetCounterValueDialog;
