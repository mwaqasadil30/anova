/* eslint-disable indent, react/jsx-indent */
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { ProblemReportActivityLogDto, UserPermissionType } from 'api/admin/api';
import { ReactComponent as EditPencilIcon } from 'assets/icons/pencil.svg';
import { ReactComponent as DeleteTrashIcon } from 'assets/icons/trash.svg';
import Avatar from 'components/Avatar';
import CustomBoxRedesign from 'components/CustomBoxRedesign';
import DeletionWarningDialog from 'components/DeletionWarningDialog';
import FormatDateTime from 'components/FormatDateTime';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import { FieldArray, FieldArrayRenderProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import { isNumber } from 'utils/format/numbers';
import AddNote from './AddNote';

const StyledAuthorName = styled(Typography)`
  font-weight: 500;
  font-size: 16px;
`;

const StyledUserAndDate = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
`;

const StyledNoteText = styled(Typography)`
  font-size: 14px;
  line-height: 22px;
`;

const StyledEmptyNotesText = styled(Typography)`
  font-size: 16px;
  font-weight: 500;
`;

const StyledCancelEditNote = styled(ClearIcon)`
  height: 16px;
  width: 16px;
`;

const StyledConfirmEditNote = styled(CheckIcon)`
  height: 16px;
  width: 16px;
  color: ${(props) => props.theme.custom.domainSecondaryColor};
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? props.theme.custom.domainSecondaryColor
      : props.theme.custom.domainColor};
`;

const StyledEditNoteIcon = styled(EditPencilIcon)`
  height: 14px;
  width: 14px;
`;

const StyledDeleteNoteIcon = styled(DeleteTrashIcon)`
  height: 14px;
  width: 14px;
`;

const StyledGridCreatedByContent = styled(Grid)`
  margin-right: 20px;
  width: 300px;
`;

const DeleteNotePreviewText = styled(Typography)`
  font-size: 14px;
  font-style: italic;
`;

interface NoteProps {
  note: ProblemReportActivityLogDto;
  noteIndex: number;
  canDeleteActivityLogs?: boolean | null;
  canUpdateActivityLogs?: boolean | null;
  handleOpenDeleteNoteDialog: (
    note: ProblemReportActivityLogDto,
    noteIndex: number
  ) => void;
  arrayHelpers: FieldArrayRenderProps;
}

const Note = ({
  note,
  noteIndex,
  canDeleteActivityLogs,
  canUpdateActivityLogs,
  handleOpenDeleteNoteDialog,
  arrayHelpers,
}: NoteProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [activityLogText, setActivityLogText] = useState(note.notes);

  const handleEditNote = () => {
    setIsEditing(true);
  };

  const handleEditActivityLog = (
    selectedActivityLog?: ProblemReportActivityLogDto
  ) => {
    arrayHelpers.replace(noteIndex, {
      ...selectedActivityLog,
      notes: activityLogText,
    });
  };

  return (
    <Box marginTop={3}>
      <Grid container spacing={1}>
        <Grid item xs={12} md="auto">
          <StyledGridCreatedByContent container spacing={2} alignItems="center">
            <Grid item>
              <Avatar>{note.createdByUserName?.charAt(0).toUpperCase()}</Avatar>
            </Grid>
            <Grid item xs>
              <StyledAuthorName aria-label="Note author username" noWrap>
                {note?.createdByFirstName} {note?.createdByLastName}
              </StyledAuthorName>
              <StyledUserAndDate aria-label="Note author username" noWrap>
                {note.createdByUserName}
              </StyledUserAndDate>
              <StyledUserAndDate aria-label="Note create date">
                <FormatDateTime date={note.createdDate} />
              </StyledUserAndDate>
            </Grid>
          </StyledGridCreatedByContent>
        </Grid>
        <Grid item xs={12} md>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justify="space-between"
          >
            <Grid item xs>
              <Box marginTop={{ xs: 1, md: 0 }}>
                {isEditing ? (
                  <StyledTextField
                    value={activityLogText}
                    onChange={(event) => {
                      setActivityLogText(event.target.value);
                    }}
                    multiline
                    fullWidth
                    rows={5}
                  />
                ) : (
                  <StyledNoteText aria-label="Note text">
                    {note.notes}
                  </StyledNoteText>
                )}
              </Box>
            </Grid>
            <Grid item xs="auto">
              <Grid container spacing={1} alignItems="center">
                {isEditing ? (
                  <>
                    <Grid item>
                      <IconButton
                        aria-label="Cancel edit note"
                        onClick={() => {
                          setIsEditing(false);
                        }}
                      >
                        <StyledCancelEditNote />
                      </IconButton>
                    </Grid>

                    <Grid item>
                      <IconButton
                        aria-label="Confirm edit note"
                        onClick={() => {
                          setIsEditing(false);
                          handleEditActivityLog(note);
                        }}
                      >
                        <StyledConfirmEditNote />
                      </IconButton>
                    </Grid>
                  </>
                ) : (
                  <>
                    {canUpdateActivityLogs && (
                      <Grid item>
                        <IconButton
                          aria-label="Edit note"
                          onClick={() => {
                            handleEditNote();
                          }}
                        >
                          <StyledEditNoteIcon />
                        </IconButton>
                      </Grid>
                    )}
                    {canDeleteActivityLogs && (
                      <Grid item>
                        <IconButton
                          aria-label="Delete note"
                          onClick={() => {
                            handleOpenDeleteNoteDialog(note, noteIndex);
                          }}
                        >
                          <StyledDeleteNoteIcon />
                        </IconButton>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

type NotesProps = {
  showSystemGeneratedLogEntries: boolean;
  notes?: ProblemReportActivityLogDto[] | null;
  handleOpenDeleteNoteDialog: (
    note: ProblemReportActivityLogDto,
    noteIndex: number
  ) => void;
  arrayHelpers: FieldArrayRenderProps;
};

const Notes = ({
  showSystemGeneratedLogEntries,
  notes,
  handleOpenDeleteNoteDialog,
  arrayHelpers,
}: NotesProps) => {
  const { t } = useTranslation();
  const hasPermission = useSelector(selectHasPermission);

  const canDeleteActivityLogs = hasPermission(
    UserPermissionType.ProblemReportActivityLog,
    AccessType.Delete
  );

  const canUpdateActivityLogs = hasPermission(
    UserPermissionType.ProblemReportActivityLog,
    AccessType.Update
  );

  const notesToRender = showSystemGeneratedLogEntries
    ? notes
    : notes?.filter((note) => note.isSystem === false);

  return (
    <>
      <CustomBoxRedesign pt={1} pb={2} px={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {!notesToRender?.length ? (
              <Box px={1} pt={2} pb={0}>
                <StyledEmptyNotesText align="center">
                  {t(
                    'ui.problemReportEditorActivityLogs.empty',
                    'No activity log found'
                  )}
                </StyledEmptyNotesText>
              </Box>
            ) : (
              notesToRender?.map((note, index) => {
                return (
                  <Note
                    key={note.problemReportActivityLogId}
                    note={note}
                    noteIndex={index}
                    handleOpenDeleteNoteDialog={handleOpenDeleteNoteDialog}
                    canDeleteActivityLogs={canDeleteActivityLogs}
                    canUpdateActivityLogs={canUpdateActivityLogs}
                    arrayHelpers={arrayHelpers}
                  />
                );
              })
            )}
          </Grid>
          {canUpdateActivityLogs && (
            <>
              {notesToRender?.length !== 0 && (
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              )}
              <Grid item xs={12}>
                <AddNote arrayHelpers={arrayHelpers} />
              </Grid>
            </>
          )}
        </Grid>
      </CustomBoxRedesign>
    </>
  );
};

interface ProblemReportNotesProps {
  showSystemGeneratedLogEntries: boolean;
  notes?: ProblemReportActivityLogDto[] | null;
}

const ProblemReportNotes = ({
  showSystemGeneratedLogEntries,
  notes,
}: ProblemReportNotesProps) => {
  const [
    selectedNote,
    setSelectedNote,
  ] = useState<ProblemReportActivityLogDto | null>();
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>();

  // Delete Activity Log / Note
  const [isDeleteNoteDialogOpen, setIsDeleteNoteDialogOpen] = React.useState(
    false
  );

  const handleOpenDeleteNoteDialog = (
    note: ProblemReportActivityLogDto,
    noteIndex: number
  ) => {
    setIsDeleteNoteDialogOpen(true);
    setSelectedNoteIndex(noteIndex);
    setSelectedNote(note);
  };

  const handleCloseDeleteNoteDialog = () => {
    setIsDeleteNoteDialogOpen(false);
    setSelectedNoteIndex(null);
    setSelectedNote(null);
  };

  return (
    <FieldArray
      name="activityLog"
      render={(arrayHelpers) => {
        return (
          <>
            <DeletionWarningDialog
              open={isDeleteNoteDialogOpen}
              handleCancel={handleCloseDeleteNoteDialog}
              handleConfirm={() => {
                if (isNumber(selectedNoteIndex)) {
                  arrayHelpers.remove(selectedNoteIndex!);
                  handleCloseDeleteNoteDialog();
                }
              }}
              recordCount={1}
            >
              <DeleteNotePreviewText>
                {selectedNote?.notes}
              </DeleteNotePreviewText>
            </DeletionWarningDialog>
            <Box>
              <Notes
                showSystemGeneratedLogEntries={showSystemGeneratedLogEntries}
                notes={notes}
                handleOpenDeleteNoteDialog={handleOpenDeleteNoteDialog}
                arrayHelpers={arrayHelpers}
              />
            </Box>
          </>
        );
      }}
    />
  );
};

export default ProblemReportNotes;
