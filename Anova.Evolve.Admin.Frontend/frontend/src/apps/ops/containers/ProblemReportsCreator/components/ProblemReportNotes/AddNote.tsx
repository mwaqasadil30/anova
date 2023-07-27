import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from 'components/Button';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import { FieldArrayRenderProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUsername } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';

const StyledButtonText = styled(Typography)`
  font-weight: 600;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const StyledAddNoteText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
  font-weight: 400;
`;

interface AddNoteProps {
  arrayHelpers: FieldArrayRenderProps;
}

const AddNote = ({ arrayHelpers }: AddNoteProps) => {
  const { t } = useTranslation();

  const activeUserName = useSelector(selectUsername);

  const [activityLogText, setActivityLogText] = useState<string>();

  const saveNote = () => {
    arrayHelpers.push({
      notes: activityLogText,
      isSystem: false,
      createdByUserName: activeUserName,
      createdDate: new Date(),
    });
  };

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
            <StyledTextField
              value={activityLogText}
              onChange={(event) => {
                setActivityLogText(event.target.value);
              }}
              multiline
              fullWidth
              rows={5}
            />
          </Grid>

          <Grid item xs={12}>
            <Box textAlign="right">
              <Button
                variant="outlined"
                onClick={() => {
                  saveNote();
                  setActivityLogText('');
                }}
                disabled={!activityLogText}
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
};

export default AddNote;
