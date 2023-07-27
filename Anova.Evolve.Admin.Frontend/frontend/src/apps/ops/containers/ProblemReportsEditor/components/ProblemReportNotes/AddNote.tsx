import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ProblemReportActivityLogDto } from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import Button from 'components/Button';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import { Field, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { convertToNumber } from 'utils/forms/values';
import { useSaveProblemReportActivityLog } from '../../hooks/useSaveProblemReportActivityLog';
import { buildValidationSchema } from './helpers';

const StyledButtonText = styled(Typography)`
  font-weight: 600;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const StyledAddNoteText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
  font-weight: 400;
`;

interface RouteParams {
  problemReportId?: string;
}

interface FormValues {
  note: ProblemReportActivityLogDto;
}

const AddNote = () => {
  const { t } = useTranslation();
  const params = useParams<RouteParams>();
  const editingProblemReportId = convertToNumber(params.problemReportId);

  const queryClient = useQueryClient();

  const saveApi = useSaveProblemReportActivityLog({
    onSuccess: () => {
      queryClient.refetchQueries(APIQueryKey.getProblemReportDetails);
    },
  });

  const noteText = t('ui.events.note', 'Note');

  const validationSchema = buildValidationSchema(t, {
    noteText,
  });

  const saveNote = (
    values: FormValues,
    formikBag: FormikHelpers<FormValues>
  ) => {
    // Clear the error state when submitting
    saveApi.reset();

    return saveApi
      .mutateAsync({
        problemReportId: editingProblemReportId!,
        problemReportActivityLog: {
          notes: values.note.notes,
        } as ProblemReportActivityLogDto,
      })
      .then((wasSuccessful) => {
        if (wasSuccessful) {
          formikBag.resetForm();
        }
      })
      .catch((error) => {
        console.error(`Unable to save note: ${error}`);
      });
  };

  return (
    <Formik<FormValues>
      initialValues={{
        note: {
          notes: '',
        } as ProblemReportActivityLogDto,
      }}
      onSubmit={saveNote}
      validationSchema={validationSchema}
    >
      {({ handleSubmit, isSubmitting, isValid }) => {
        return (
          <Grid container>
            <Grid item xs={12}>
              <StyledAddNoteText>
                {t('ui.ops.eventDetails.addNote', 'Add Note')}
              </StyledAddNoteText>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    id="note.notes-input"
                    name="note.notes"
                    component={CustomTextField}
                    multiline
                    fullWidth
                    rows={4}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box textAlign="right">
                    <Button
                      variant="outlined"
                      onClick={() => handleSubmit()}
                      disabled={isSubmitting || !isValid}
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
