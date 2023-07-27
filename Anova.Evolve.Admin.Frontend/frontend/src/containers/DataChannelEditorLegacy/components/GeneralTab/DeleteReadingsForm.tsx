/* eslint-disable indent */
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
import { useDeleteReadings } from 'containers/DataChannelEditorLegacy/hooks/useDeleteReadings';
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
  endDate: string;
  endTime: string;
}

const formatInitialValues = (): Values => {
  return {
    startDate: moment().startOf('day').toISOString(),
    startTime: moment().startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
    endTime: moment().endOf('day').toISOString(),
  };
};

const buildValidationSchema = (t: TFunction) => {
  const requiredText = t('validate.common.required', 'Required');
  return Yup.object().shape({
    startDate: Yup.string().typeError(requiredText).required(requiredText),
    startTime: Yup.string().typeError(requiredText).required(requiredText),
    endDate: Yup.string().typeError(requiredText).required(requiredText),
    endTime: Yup.string().typeError(requiredText).required(requiredText),
  });
};

interface Props {
  dataChannelId?: string;
  submissionError?: any;
  onCancel: () => void;
}

const DeleteReadingsForm = ({
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
  const deleteReadingsApi = useDeleteReadings();

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    const formattedStartTime = moment(values.startTime);
    const formattedStartDatetime = moment(values.startDate).set({
      hour: formattedStartTime.get('hour'),
      minutes: formattedStartTime.get('minutes'),
      seconds: formattedStartTime.get('seconds'),
    });
    const formattedEndTime = moment(values.endTime);
    const formattedEndDatetime = moment(values.endDate).set({
      hour: formattedEndTime.get('hour'),
      minutes: formattedEndTime.get('minutes'),
      seconds: formattedEndTime.get('seconds'),
    });

    return deleteReadingsApi
      .makeRequest({
        dataChannelId,
        domainId,
        startTime: formattedStartDatetime.toDate(),
        endTime: formattedEndDatetime.toDate(),
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
          !deleteReadingsApi.error && deleteReadingsApi.data
            ? t(
                'ui.deleteReadings.successfullyDeleted',
                'Readings successfully deleted!'
              )
            : t(
                'ui.deleteReadings.failedToDelete',
                'Failed to delete readings!'
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
                      'enum.readingsactiontype.deletereadings',
                      'Delete Readings'
                    )}
                  </StyledTitle>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <StyledLabel>
                            {t('ui.datachannel.begindate', 'Begin Date')}
                          </StyledLabel>
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
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <StyledLabel>
                            {t('ui.datachannel.enddate', 'End Date')}
                          </StyledLabel>
                        </Grid>
                        <Grid item>
                          <FieldGroup>
                            <Field
                              id="endDate-input"
                              name="endDate"
                              component={KeyboardDatePicker}
                              KeyboardButtonProps={{
                                'aria-label': 'change end date',
                              }}
                              PopoverProps={{ id: 'end date popover' }}
                            />
                            <Field
                              id="endTime-input"
                              name="endTime"
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
                </Grid>
              </Grid>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default DeleteReadingsForm;
