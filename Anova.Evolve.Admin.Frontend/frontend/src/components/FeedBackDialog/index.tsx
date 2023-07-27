import Box from '@material-ui/core/Box';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Button from 'components/Button';
import DialogTitle from 'components/dialog/DialogTitle';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import { Field, Formik } from 'formik';
import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fieldMaxLength } from 'utils/forms/errors';
import * as Yup from 'yup';
import { useSaveUserFeedback } from './hooks/useSaveUserFeedback';

enum FeedbackReason {
  NewSuggestion = 'new-suggestion',
  IssueOrBugOrProblem = 'issue-bug-or-problem',
  UnableToLocateFeature = 'unable-to-locate-a-feature',
  Other = 'other',
}

interface Values {
  feedbackMessage: string;
  feedbackSelect: string;
}

const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  return Yup.object().shape({
    feedbackMessage: Yup.string()
      .trim()
      .typeError(translationTexts.feedbackMessageTextRequired)
      .required(translationTexts.feedbackMessageTextRequired)
      .max(1000, fieldMaxLength(t)),
    feedbackSelect: Yup.string()
      .typeError(translationTexts.feedbackSelectTextRequired)
      .required(translationTexts.feedbackSelectTextRequired),
  });
};

interface FeedbackDialogProps {
  openFeedbackDialog: boolean;
  handleFeedbackDialogClose: () => void;
}

const FeedbackDialog = ({
  openFeedbackDialog,
  handleFeedbackDialogClose,
}: FeedbackDialogProps) => {
  const { t } = useTranslation();

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const feedbackMessageTextRequired = t(
    'ui.feedback.pleaseEnterMessage',
    'Please enter a message'
  );
  const feedbackSelectTextRequired = t(
    'ui.feedback.pleaseSelectReason',
    'Please select a reason'
  );

  const validationSchema = buildValidationSchema(t, {
    feedbackSelectTextRequired,
    feedbackMessageTextRequired,
  });

  const saveFeedbackApi = useSaveUserFeedback();

  const handleSave = (values: Values) => {
    // NOTE: Previously we were tracking events on the front end but ad blockers
    // would block the sending of events to application insights

    // ai.appInsights.trackEvent({
    //   name: AnalyticsEvent.SubmittedFeedback,
    //   properties: {
    //     reason: values.feedbackSelect,
    //     message: values.feedbackMessage,
    //   },
    // });

    // Immediately send the track event to make sure we receive the event immediately
    // ai.flush();
    return saveFeedbackApi
      .makeRequest({
        feedbackCategory: values.feedbackSelect,
        feedbackMessage: values.feedbackMessage,
      })
      .then(() => {
        setIsFormSubmitted(true);
      })
      .catch(() => {});
  };

  const closeSubmittedDialog = () => {
    handleFeedbackDialogClose();
    setIsFormSubmitted(false);
  };

  const mainTitle = t('ui.main.submitFeedback', 'Submit Feedback');
  const confirmationButtonText = t('ui.main.submitFeedback', 'Submit Feedback');
  const customErrorMessage = t(
    'ui.feedback.genericError',
    'Unable to submit feedback'
  );
  return (
    <Box m={3}>
      <Formik
        initialValues={
          {
            feedbackSelect: '',
            feedbackMessage: '',
          } as Values
        }
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ isSubmitting, submitForm }) => {
          return (
            <UpdatedConfirmationDialog
              open={openFeedbackDialog}
              maxWidth="sm"
              disableBackdropClick
              disableEscapeKeyDown
              mainTitle={mainTitle}
              content={
                <>
                  {!isFormSubmitted ? (
                    <Box p={2} pb={0}>
                      <Grid
                        container
                        spacing={3}
                        alignItems="center"
                        justify="center"
                      >
                        <Grid item xs={12}>
                          <Field
                            id="feedbackSelect-input"
                            name="feedbackSelect"
                            component={CustomTextField}
                            select
                            SelectProps={{ displayEmpty: true }}
                            label={t('ui.feedback.reason', 'Reason')}
                          >
                            <MenuItem value="" disabled>
                              <SelectItem />
                            </MenuItem>
                            <MenuItem value={FeedbackReason.NewSuggestion}>
                              {t('ui.feedback.newSuggestion', 'New Suggestion')}
                            </MenuItem>
                            <MenuItem
                              value={FeedbackReason.IssueOrBugOrProblem}
                            >
                              {t(
                                'ui.feedback.issueOrBugOrProblem',
                                'Issue / Bug / Problem'
                              )}
                            </MenuItem>
                            <MenuItem
                              value={FeedbackReason.UnableToLocateFeature}
                            >
                              {t(
                                'ui.feedback.unableToLocateFeature',
                                'Unable to locate a feature'
                              )}
                            </MenuItem>
                            <MenuItem value={FeedbackReason.Other}>
                              {t('ui.feedback.other', 'Other')}
                            </MenuItem>
                          </Field>
                        </Grid>

                        <Grid item xs={12}>
                          <Field
                            id="feedbackMessage-input"
                            name="feedbackMessage"
                            component={CustomTextField}
                            label={t('ui.feedback.message', 'Message')}
                            multiline
                            fullWidth
                            rows={8}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    <Box p={2} pb={0}>
                      <Grid
                        container
                        spacing={3}
                        alignItems="center"
                        justify="center"
                      >
                        <Grid item xs={12}>
                          <DialogTitle align="center">
                            {t(
                              'ui.main.thankyouForSubmittingFeedback',
                              'Thank you for submitting your feedback!'
                            )}
                          </DialogTitle>
                        </Grid>

                        <Grid item xs={12}>
                          <DialogActions>
                            <Button
                              variant="contained"
                              onClick={closeSubmittedDialog}
                            >
                              {t('ui.common.close', 'Close')}
                            </Button>
                          </DialogActions>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </>
              }
              confirmationButtonText={confirmationButtonText}
              closeDialog={closeSubmittedDialog}
              onConfirm={submitForm}
              isConfirmationButtonDisabled={isSubmitting}
              isCancelButtonDisabled={isSubmitting}
              isError={!!saveFeedbackApi.error}
              customErrorMessage={customErrorMessage}
            />
          );
        }}
      </Formik>
    </Box>
  );
};

export default FeedbackDialog;
