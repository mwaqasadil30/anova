/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Alert from 'components/Alert';
import CancelButton from 'components/buttons/CancelButton';
import LoadingButton from 'components/buttons/LoadingButton';
import ConfirmationDialog from 'components/dialog/ConfirmationDialog';
import KeyboardDatePicker from 'components/forms/form-fields/KeyboardDatePicker';
import TimeField from 'components/forms/form-fields/TimeField';
import FieldGroup from 'components/forms/styled-fields/FieldGroup';
import { useRescaleReadings } from 'containers/DataChannelEditorLegacy/hooks/useRescaleReadings';
import { Field, Formik, FormikHelpers } from 'formik';
import { TFunction } from 'i18next';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { defaultTextColor } from 'styles/colours';
import { parseResponseError } from 'utils/api/handlers';
import { fieldIsRequired } from 'utils/forms/errors';
import * as Yup from 'yup';

const StyledTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  color: ${defaultTextColor};
`;

const StyledLabel = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
  color: ${defaultTextColor};
`;

interface Values {
  startDate: string;
  startTime: string;
}

const formatInitialValues = (): Values => {
  return {
    startDate: moment().startOf('day').toISOString(),
    startTime: moment().startOf('day').toISOString(),
  };
};

const buildValidationSchema = (t: TFunction) => {
  const requiredText = t('validate.common.required', 'Required');
  return Yup.object().shape({
    startDate: Yup.string()
      .typeError(fieldIsRequired(t, requiredText))
      .required(fieldIsRequired(t, requiredText)),
    startTime: Yup.string()
      .typeError(fieldIsRequired(t, requiredText))
      .required(fieldIsRequired(t, requiredText)),
  });
};

interface Props {
  dataChannelId?: string;
  submissionError?: any;
  onCancel: () => void;
}

const RescaleReadingsForm = ({
  dataChannelId,
  submissionError,
  onCancel,
}: Props) => {
  const { t } = useTranslation();
  const formattedInitialValues = formatInitialValues();
  const validationSchema = buildValidationSchema(t);

  // Success/error confirmation Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const domainId = useSelector(selectActiveDomainId);
  const rescaleReadingsApi = useRescaleReadings();

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    const formattedTime = moment(values.startTime);
    const formattedDate = moment(values.startDate).set({
      hour: formattedTime.get('hour'),
      minutes: formattedTime.get('minutes'),
      seconds: formattedTime.get('seconds'),
    });

    return rescaleReadingsApi
      .makeRequest({
        dataChannelId,
        domainId,
        startTime: formattedDate.toDate(),
      })
      .catch((error) => {
        const errorResult = parseResponseError(error);
        if (errorResult) {
          formikBag.setErrors(errorResult.errors);
          formikBag.setStatus({ errors: errorResult.errors });
        }
      })
      .finally(() => {
        openDialog();
      });
  };

  return (
    <>
      <ConfirmationDialog
        open={isDialogOpen}
        disableBackdropClick
        disableEscapeKeyDown
        mainTitle={
          !rescaleReadingsApi.error && rescaleReadingsApi.data
            ? t(
                'ui.rescaleReadings.successfullyRescaled',
                'Readings successfully rescaled!'
              )
            : t(
                'ui.rescaleReadings.failedToRescale',
                'Failed to rescale readings!'
              )
        }
        onConfirm={closeDialog}
      />
      <Formik
        // NOTE: Using `enableReinitialize` could cause the resetForm method to
        // not work. Instead, we're resetting the form by re-fetching the
        // required data to edit the form, and unmounting then mounting the form
        // again so that the initialValues passed from the parent are used
        // correctly
        initialValues={formattedInitialValues}
        validateOnChange
        validateOnBlur
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, submitForm }) => {
          return (
            <>
              <Fade in={!!submissionError} unmountOnExit>
                <div>
                  <Alert severity="error">
                    {t('ui.common.unableToSave', 'Unable to save')}
                  </Alert>
                </div>
              </Fade>
              <Grid
                container
                spacing={3}
                alignItems="center"
                justify="space-between"
              >
                <Grid item xs={12} md="auto">
                  <StyledTitle>
                    {t(
                      'enum.readingsactiontype.rescaleexistingdata',
                      'Rescale Existing Data'
                    )}
                  </StyledTitle>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Box mr={1}>
                        <StyledLabel>
                          {t('ui.datachannel.begindate', 'Begin Date')}
                        </StyledLabel>
                      </Box>
                    </Grid>
                    <Grid item>
                      <FieldGroup>
                        <Field
                          id="startDate-input"
                          name="startDate"
                          component={KeyboardDatePicker}
                          KeyboardButtonProps={{
                            'aria-label': 'change start date',
                          }}
                          PopoverProps={{ id: 'start date popover' }}
                        />
                        <Field
                          id="startTime-input"
                          name="startTime"
                          component={TimeField}
                          InputProps={{
                            style: {
                              height: 40,
                            },
                          }}
                          style={{ width: 140 }}
                        />
                      </FieldGroup>
                    </Grid>
                    <Grid item>
                      <LoadingButton
                        variant="contained"
                        onClick={submitForm}
                        disabled={isSubmitting || !isValid}
                        isLoading={isSubmitting}
                      >
                        {t('ui.datachannel.execute', 'Execute')}
                      </LoadingButton>
                    </Grid>
                    <Grid item>
                      <CancelButton
                        onClick={onCancel}
                        disabled={isSubmitting}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default RescaleReadingsForm;
