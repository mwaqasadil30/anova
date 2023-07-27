import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  EditEventNote,
  SaveEventNoteRequest,
  SaveResultType,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import Button from 'components/Button';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import PageSubHeader from 'components/PageSubHeader';
import { Field, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fieldIsRequired } from 'utils/forms/errors';

const StyledButtonText = styled(Typography)`
  font-weight: 600;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

interface FormValues {
  note: string;
}

type AddNoteProps = {
  eventId: number;
  onSave(note?: EditEventNote | null): void;
};
const AddNote = ({ eventId, onSave }: AddNoteProps) => {
  const { t } = useTranslation();

  const saveNote = (
    values: FormValues,
    formikBag: FormikHelpers<FormValues>
  ) => {
    return ApiService.EventService.saveEventNote_SaveEventNote({
      item: {
        eventId,
        subject: '_',
        note: values.note,
      },
    } as SaveEventNoteRequest)
      .then((response) => {
        if (response.saveEventNoteResult?.result === SaveResultType.Success) {
          formikBag.resetForm();
          onSave(response.saveEventNoteResult.editObject);
        }
      })
      .catch((error) => {
        console.error(`Unable to save note: ${error}`);
      });
  };

  return (
    <Formik
      initialValues={{ note: '' }}
      onSubmit={saveNote}
      validate={(values) => {
        const errors = {};
        if (!values.note) {
          // @ts-ignore
          errors.note = fieldIsRequired(t, t('ui.events.note', 'Note'));
        }
        return errors;
      }}
    >
      {({ handleSubmit, isSubmitting }) => {
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PageSubHeader dense>
                {t('ui.ops.eventDetails.addNote', 'Add Note')}
              </PageSubHeader>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    id="note-input"
                    component={CustomTextField}
                    name="note"
                    multiline
                    fullWidth
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box textAlign="right">
                    <Button
                      variant="contained"
                      onClick={() => handleSubmit()}
                      disabled={isSubmitting}
                    >
                      <StyledButtonText>
                        {t('ui.ops.eventDetails.saveNote', 'Save Note')}
                      </StyledButtonText>
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      }}
    </Formik>
  );
};

export default AddNote;
