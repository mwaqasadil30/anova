/* eslint-disable indent, react/jsx-indent */
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { ProblemReportActivityLogDto, UserPermissionType } from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import { ReactComponent as EditPencilIcon } from 'assets/icons/pencil.svg';
import { ReactComponent as DeleteTrashIcon } from 'assets/icons/trash.svg';
import Avatar from 'components/Avatar';
import CustomBoxRedesign from 'components/CustomBoxRedesign';
import FormatDateTime from 'components/FormatDateTime';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import { convertToNumber } from 'utils/forms/values';
import { useSaveProblemReportActivityLog } from '../../hooks/useSaveProblemReportActivityLog';
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

interface RouteParams {
  problemReportId?: string;
}

interface NoteProps {
  note: ProblemReportActivityLogDto;
  canDeleteActivityLogs?: boolean | null;
  canUpdateActivityLogs?: boolean | null;
  handleOpenDeleteNoteDialog: (note: ProblemReportActivityLogDto) => void;
}

const Note = ({
  note,
  canDeleteActivityLogs,
  canUpdateActivityLogs,
  handleOpenDeleteNoteDialog,
}: NoteProps) => {
  const queryClient = useQueryClient();

  const params = useParams<RouteParams>();
  const editingProblemReportId = convertToNumber(params.problemReportId);

  const [isEditing, setIsEditing] = useState(false);

  const [activityLogText, setActivityLogText] = useState(note.notes);

  const handleEditNote = () => {
    setIsEditing(true);
  };

  // Edit Activity Log / Note

  const saveActivityLogApi = useSaveProblemReportActivityLog({
    onSuccess: () => {
      queryClient.refetchQueries(APIQueryKey.getProblemReportDetails);
    },
  });

  const handleEditActivityLog = (
    selectedActivityLog?: ProblemReportActivityLogDto
  ) => {
    return saveActivityLogApi
      .mutateAsync({
        problemReportId: editingProblemReportId!,
        problemReportActivityLog: {
          notes: activityLogText,
          problemReportActivityLogId:
            selectedActivityLog?.problemReportActivityLogId,
        } as ProblemReportActivityLogDto,
      })
      .catch((error) => {
        console.error(`Unable to save note: ${error}`);
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
                            handleOpenDeleteNoteDialog(note);
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
  handleOpenDeleteNoteDialog: (note: ProblemReportActivityLogDto) => void;
};

const Notes = ({
  showSystemGeneratedLogEntries,
  notes,
  handleOpenDeleteNoteDialog,
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
              notesToRender?.map((note) => {
                return (
                  <Note
                    key={note.problemReportActivityLogId}
                    note={note}
                    handleOpenDeleteNoteDialog={handleOpenDeleteNoteDialog}
                    canDeleteActivityLogs={canDeleteActivityLogs}
                    canUpdateActivityLogs={canUpdateActivityLogs}
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
                <AddNote />
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
  handleOpenDeleteNoteDialog: (note: ProblemReportActivityLogDto) => void;
}

const ProblemReportNotes = ({
  showSystemGeneratedLogEntries,
  notes,
  handleOpenDeleteNoteDialog,
}: ProblemReportNotesProps) => {
  return (
    <Box>
      <Notes
        showSystemGeneratedLogEntries={showSystemGeneratedLogEntries}
        notes={notes}
        handleOpenDeleteNoteDialog={handleOpenDeleteNoteDialog}
      />
    </Box>
  );
};

export default ProblemReportNotes;
