/* eslint-disable indent */
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { EventRuleType, EvolveRosterInfo } from 'api/admin/api';
import { ReactComponent as AddIcon } from 'assets/icons/icon-add.svg';
import { ReactComponent as RemoveOutlinedDarkIcon } from 'assets/icons/icon-remove.svg';
import Alert from 'components/Alert';
import Button from 'components/Button';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import FormikEffect from 'components/forms/FormikEffect';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import MessageBlock from 'components/MessageBlock';
import PageHeader from 'components/PageHeader';
import { DCEditorEventRule } from 'containers/DataChannelEditorLegacy/components/ObjectForm/types';
import {
  Field,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { defaultTextColor } from 'styles/colours';
import * as Yup from 'yup';
import { Values } from './types';

const TitleText = styled(Typography)`
  font-size: 15px;
  color: ${defaultTextColor};
`;

const StyledEmptyText = styled(Typography)`
  font-weight: 500;
  color: ${defaultTextColor};
`;

const buildValidationSchema = () => {
  return Yup.object().shape({});
};

const defaultRoster = {
  rosterId: '',
};

interface FormProps
  extends Pick<
    FormikProps<Values>,
    | 'isSubmitting'
    | 'isValid'
    | 'errors'
    | 'touched'
    | 'setFieldTouched'
    | 'values'
    | 'setFieldValue'
  > {
  eventRule: DCEditorEventRule;
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  eventRuleType?: EventRuleType;
  rosters?: EvolveRosterInfo[] | null;
  handleFormChange: (formik: FormikProps<Values>) => void;
}

const EventRuleForm = ({
  eventRule,
  // isSubmitting,
  submissionError,
  values,
  eventRuleType,
  rosters,
}: // setFieldValue,

FormProps) => {
  const { t } = useTranslation();

  const isLevelEventRule = eventRuleType === EventRuleType.Level;
  const isUsageRateRule = eventRuleType === EventRuleType.UsageRate;
  const isScheduledDeliveryRule = [
    EventRuleType.ScheduledDeliveryMissed,
    EventRuleType.ScheduledDeliveryTooEarly,
    EventRuleType.ScheduledDeliveryTooLate,
  ].includes(eventRuleType!);
  const isMissingDataRule = eventRuleType === EventRuleType.MissingData;

  return (
    <Form>
      <Grid container spacing={2}>
        {/*
          TODO: Find a better way to handle errors + loading state. At the
          moment the shift is too jarring where the error appears and takes up
          space pushing the loading spinner down
        */}
        <Fade in={!!submissionError} unmountOnExit>
          <Grid item xs={12}>
            <Alert severity="error">
              {t('ui.datachanneleventrule.saveError', 'Unable to save event')}
            </Alert>
          </Grid>
        </Fade>

        <Grid item xs={12}>
          <PageHeader dense>
            {t('ui.datachanneleventrule.rosters', 'Rosters')}
          </PageHeader>
        </Grid>

        <Grid item xs={12}>
          <TitleText>
            {isLevelEventRule &&
              t('ui.datachanneleventrule.levelEvent', 'Level Event')}

            {isUsageRateRule &&
              t('ui.datachanneleventrule.usagerate', 'Usage Rate')}

            {isScheduledDeliveryRule &&
              t(
                'ui.datachanneleventrule.scheduledDeliveryEvent',
                'Scheduled Delivery Event'
              )}

            {isMissingDataRule &&
              t(
                'ui.datachanneleventrule.missingDataEvent',
                'Missing Data Event'
              )}

            <span aria-label="Event description">
              {': '}
              {eventRule.description}
            </span>
          </TitleText>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <FieldArray
              name="rosters"
              render={(arrayHelpers) => (
                <>
                  {!values?.rosters?.length ? (
                    <Grid item xs={12}>
                      <MessageBlock height="initial">
                        <StyledEmptyText>
                          {t(
                            'ui.datachanneleventrule.noRostersAdded',
                            'No rosters added'
                          )}
                        </StyledEmptyText>
                      </MessageBlock>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      {values?.rosters?.map((roster, index) => {
                        return (
                          <Grid
                            key={index}
                            container
                            spacing={3}
                            alignItems="center"
                          >
                            <Grid item xs>
                              <Field
                                id={`rosters.${index}.rosterId-input`}
                                name={`rosters.${index}.rosterId`}
                                component={CustomTextField}
                                select
                                SelectProps={{ displayEmpty: true }}
                              >
                                <MenuItem value="">
                                  <SelectItem />
                                </MenuItem>
                                {rosters?.map((rosterOption) => (
                                  <MenuItem
                                    key={rosterOption.rosterId}
                                    value={rosterOption.rosterId}
                                  >
                                    {rosterOption.description}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Grid>
                            <Grid item>
                              <Button
                                variant="text"
                                startIcon={<RemoveOutlinedDarkIcon />}
                                onClick={() => {
                                  arrayHelpers.remove(index);
                                }}
                              >
                                {t('ui.common.remove', 'Remove')}
                              </Button>
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Button
                      variant="text"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        arrayHelpers.push(defaultRoster);
                      }}
                    >
                      {t('ui.datachanneleventrule.addRoster', 'Add Roster')}
                    </Button>
                  </Grid>
                </>
              )}
            />
          </Grid>
        </Grid>
      </Grid>
    </Form>
  );
};

const formatInitialValues = (eventRule: DCEditorEventRule): Values => {
  return {
    rosters: eventRule.rosters || [],
  };
};

interface Props {
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  eventRule: DCEditorEventRule;
  rosters?: EvolveRosterInfo[] | null;
  onSubmit: (values: Values, formikBag: FormikHelpers<Values>) => void;
  handleFormChange: (formik: FormikProps<Values>) => void;
}

const EventRuleFormWrapper = ({
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  eventRule,
  rosters,
  onSubmit,
  submissionError,
}: Props) => {
  const formattedInitialValues = formatInitialValues(eventRule);
  const validationSchema = buildValidationSchema();

  return (
    <Formik<Values>
      // NOTE: Using `enableReinitialize` could cause the resetForm method to
      // not work. Instead, we're resetting the form by re-fetching the
      // required data to edit the form, and unmounting then mounting the form
      // again so that the initialValues passed from the parent are used
      // correctly
      initialValues={formattedInitialValues}
      enableReinitialize
      validateOnChange
      validateOnBlur
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps) => (
        <>
          <FormikEffect
            onChange={handleFormChange}
            // NOTE: Adding additional props here like isValid may cause the
            // restoring of tabbed form values to screw up. Just something to
            // be aware of if values stop being restored properly
            isValid={formikProps.isValid}
            restoreTouchedFields={restoreTouchedFields}
            restoreInitialValues={restoreInitialValues}
          />
          <EventRuleForm
            eventRule={eventRule}
            eventRuleType={eventRule.eventRuleType}
            rosters={rosters}
            {...formikProps}
            restoreInitialValues={restoreInitialValues}
            handleFormChange={handleFormChange}
            restoreTouchedFields={restoreTouchedFields}
            submissionError={submissionError}
          />
        </>
      )}
    </Formik>
  );
};

export default EventRuleFormWrapper;
