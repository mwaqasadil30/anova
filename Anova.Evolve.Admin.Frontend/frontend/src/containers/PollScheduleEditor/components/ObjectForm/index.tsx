/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {
  EditRtuPollSchedule,
  RetrieveRtuPollScheduleGroupEditComponentsResult,
  RTUPollScheduleType,
} from 'api/admin/api';
import { ReactComponent as AddOutlinedDarkIcon } from 'assets/icons/add-outlined-dark.svg';
import { ReactComponent as RemoveOutlinedDarkIcon } from 'assets/icons/icon-remove.svg';
import Alert from 'components/Alert';
import Button from 'components/Button';
import EditorBox from 'components/EditorBox';
import FormLinearProgress from 'components/FormLinearProgress';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import TimeField from 'components/forms/form-fields/TimeField';
import FormikEffect from 'components/forms/FormikEffect';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableBodyRow from 'components/tables/components/TableBodyRow';
import TableCell from 'components/tables/components/TableCell';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import {
  FastField,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik';
import { TFunction } from 'i18next';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fadedTextColor } from 'styles/colours';
import { getPollScheduleTypeOptions } from 'utils/i18n/enum-to-text';
import * as Yup from 'yup';
import { Values } from './types';

const StyledTableCell = styled(TableCell)`
  width: 50%;
`;

const fieldIsRequired = (t: TFunction, field: string) =>
  t('validate.common.isrequired', '{{field}} is required.', { field });

const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const invalidTimeText = t(
    'validate.timeField.invalidFormat',
    'Invalid Time Format'
  );

  return Yup.object().shape({
    name: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.nameText))
      .required(fieldIsRequired(t, translationTexts.nameText)),
    timeZoneId: Yup.number()
      .typeError(fieldIsRequired(t, translationTexts.timezoneText))
      .required(fieldIsRequired(t, translationTexts.timezoneText)),
    offsetTime: Yup.date().nullable(),
    // TODO: Formik and Yup have issues with array validation, this doesn't
    // seem to be run in some cases...
    rtuPollSchedules: Yup.array().of(
      Yup.object().shape({
        scheduledPollTime: Yup.date()
          .typeError(invalidTimeText)
          .required(invalidTimeText),
      })
    ),
  });
};

const defaultDate = moment('2000-01-01').startOf('day'); // Midnight

const defaultInitialValues = {
  name: '',
  timeZoneId: '',
  offsetTime: defaultDate,
  typeOfSchedule: RTUPollScheduleType.Interval,
  minDataAge: 0,
  interval: 0,
};

const defaultPollSchedule = {
  scheduledPollTime: defaultDate, // Midnight
  isEnabled: true,
};

const formatTimeStringToDate = (timeString?: string | null) => {
  return timeString
    ? moment(timeString, moment.HTML5_FMT.TIME_SECONDS)
    : moment(defaultDate, moment.HTML5_FMT.TIME_SECONDS);
};

const formatTimeStringScheduleToDate = (schedule: EditRtuPollSchedule) => {
  // Special formats: https://momentjs.com/docs/#/parsing/special-formats/
  return {
    ...schedule,
    scheduledPollTime: formatTimeStringToDate(schedule.scheduledPollTime),
  };
};

const formatInitialValues = (values: any) => {
  return {
    ...values,
    ...(!values.name && { name: '' }),
    ...(!values.timeZoneId && { timeZoneId: '' }),
    ...(!values.typeOfSchedule && {
      typeOfSchedule: RTUPollScheduleType.Interval,
    }),
    // NOTE: This is the result of using @material-ui/pickers which uses a date
    // instead of a string for their "time" input
    ...((!values.offsetTime || typeof values.offsetTime === 'string') && {
      offsetTime: formatTimeStringToDate(values.offsetTime),
    }),
    ...(!values.rtuPollSchedules || values.rtuPollSchedules.length === 0
      ? {
          rtuPollSchedules: [defaultPollSchedule],
        }
      : {
          rtuPollSchedules: values.rtuPollSchedules.map(
            (schedule: EditRtuPollSchedule) =>
              formatTimeStringScheduleToDate(schedule)
          ),
        }),
  };
};

interface Props {
  initialValues: any;
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  submissionResult?: any;
  isInlineForm?: boolean;
  onSubmit: (values: Values, formikBag: FormikHelpers<Values>) => void;
  handleFormChange: (formik: FormikProps<Values>) => void;
  timezones: RetrieveRtuPollScheduleGroupEditComponentsResult['timezones'];
}

const ObjectForm = ({
  initialValues,
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  onSubmit,
  submissionError,
  submissionResult,
  timezones,
  isInlineForm,
}: Props) => {
  const { t } = useTranslation();

  const pollTypeOptions = getPollScheduleTypeOptions(t);

  const formInitialValues = initialValues || defaultInitialValues;
  const formattedInitialValues = formatInitialValues(formInitialValues);

  const nameText = t('ui.common.name', 'Name');
  const timezoneText = t('ui.common.timezone', 'Time Zone');
  const scheduledPollTimesText = t(
    'ui.pollSchedule.specifiedPollTime',
    'Specified Poll Times'
  );
  const validationSchema = buildValidationSchema(t, {
    timezoneText,
    nameText,
    scheduledPollTimesText,
  });

  return (
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
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, values }) => (
        <>
          <FormikEffect
            onChange={handleFormChange}
            isValid={isValid}
            restoreTouchedFields={restoreTouchedFields}
            restoreInitialValues={restoreInitialValues}
          />

          <Form>
            <Grid container spacing={3}>
              <Fade in={!!submissionError} unmountOnExit>
                <Grid item xs={12}>
                  <Alert severity="error">
                    {t(
                      'ui.pollSchedule.error',
                      'Unable to save poll schedule group'
                    )}
                  </Alert>
                </Grid>
              </Fade>

              <Grid item xs={12}>
                <FormLinearProgress in={isSubmitting} />
              </Grid>
              <Grid item xs={12}>
                <EditorBox>
                  <Grid container spacing={8}>
                    <Grid item xs={12} md={isInlineForm ? undefined : 6}>
                      <Grid container spacing={5}>
                        <Grid item xs={12}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <FastField
                                component={CustomTextField}
                                name="name"
                                label={nameText}
                                required
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={6}>
                          <FastField
                            component={CustomTextField}
                            name="minDataAge"
                            label={t(
                              'ui.pollSchedule.minimumDataAge',
                              'Minimum Data Age (Mins)'
                            )}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Field
                                component={CustomTextField}
                                name="timeZoneId"
                                label={t('ui.common.timezone', 'Time Zone')}
                                select
                                required
                                SelectProps={{ displayEmpty: true }}
                              >
                                <MenuItem value="" disabled>
                                  <span style={{ color: fadedTextColor }}>
                                    {t('ui.common.select', 'Select')}
                                  </span>
                                </MenuItem>
                                {timezones?.map((timezone) => (
                                  <MenuItem
                                    key={timezone.timezoneId}
                                    value={timezone.timezoneId}
                                  >
                                    {timezone.displayName}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={isInlineForm ? undefined : 6}>
                      <Grid container spacing={5}>
                        <Grid item xs={12}>
                          <Field
                            component={CustomTextField}
                            name="typeOfSchedule"
                            label={t(
                              'ui.pollSchedule.type',
                              'Poll Schedule Type'
                            )}
                            select
                            required
                          >
                            {pollTypeOptions?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>

                        {values.typeOfSchedule ===
                        RTUPollScheduleType.Interval ? (
                          <>
                            <Grid item xs={6}>
                              <Field
                                component={CustomTextField}
                                name="interval"
                                label={t(
                                  'ui.pollSchedule.pollInterval',
                                  'Poll Interval (Mins)'
                                )}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Field
                                component={TimeField}
                                name="offsetTime"
                                label={t(
                                  'ui.pollSchedule.pollOffset',
                                  'Poll Offset'
                                )}
                              />
                            </Grid>
                          </>
                        ) : (
                          <Grid item xs={12}>
                            {submissionResult?.errors?.rtuPollSchedules && (
                              <Grid item xs={12}>
                                <Box mb={2}>
                                  <Alert severity="error">
                                    {/* TODO: Use correct validation message */}
                                    {t(
                                      'ui.pollSchedule.duplicatePollsError',
                                      'Cannot have duplicate poll times'
                                    )}
                                  </Alert>
                                </Box>
                              </Grid>
                            )}
                            <FieldArray
                              name="rtuPollSchedules"
                              render={(arrayHelpers) => (
                                <TableContainer>
                                  <Table aria-label="asset information table">
                                    <TableHead>
                                      <TableHeadRow>
                                        <TableHeadCell dense>
                                          {t(
                                            'ui.pollSchedule.specifiedPollTimes',
                                            'Specified Poll Times'
                                          )}
                                        </TableHeadCell>
                                      </TableHeadRow>
                                    </TableHead>
                                    <TableBody>
                                      {values.rtuPollSchedules?.map(
                                        (pollSchedule, index) => (
                                          <TableBodyRow>
                                            <StyledTableCell>
                                              <Grid
                                                container
                                                alignItems="center"
                                                spacing={4}
                                              >
                                                <Grid item xs={5}>
                                                  <Field
                                                    component={TimeField}
                                                    name={`rtuPollSchedules[${index}].scheduledPollTime`}
                                                  />
                                                </Grid>
                                                <Grid item xs={3}>
                                                  <Field
                                                    component={
                                                      CheckboxWithLabel
                                                    }
                                                    name={`rtuPollSchedules[${index}].isEnabled`}
                                                    type="checkbox"
                                                    Label={{
                                                      label: t(
                                                        'ui.common.enabled',
                                                        'Enabled'
                                                      ),
                                                    }}
                                                  />
                                                </Grid>
                                                {index !== 0 && (
                                                  <Grid item xs={3}>
                                                    <Button
                                                      variant="text"
                                                      startIcon={
                                                        <RemoveOutlinedDarkIcon />
                                                      }
                                                      onClick={() =>
                                                        arrayHelpers.remove(
                                                          index
                                                        )
                                                      }
                                                    >
                                                      {t(
                                                        'ui.common.remove',
                                                        'Remove'
                                                      )}
                                                    </Button>
                                                  </Grid>
                                                )}
                                              </Grid>
                                            </StyledTableCell>
                                          </TableBodyRow>
                                        )
                                      )}

                                      <TableBodyRow>
                                        <StyledTableCell>
                                          <Button
                                            variant="text"
                                            startIcon={<AddOutlinedDarkIcon />}
                                            onClick={() =>
                                              arrayHelpers.push(
                                                defaultPollSchedule
                                              )
                                            }
                                          >
                                            {t(
                                              'ui.pollSchedule.addSchedule',
                                              'Add Schedule'
                                            )}
                                          </Button>
                                        </StyledTableCell>
                                      </TableBodyRow>
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              )}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </EditorBox>
              </Grid>
            </Grid>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default ObjectForm;
