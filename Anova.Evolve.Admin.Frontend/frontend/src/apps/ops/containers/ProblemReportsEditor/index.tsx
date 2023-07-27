/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  ProblemReportActivityLogDto,
  ProblemReportStatusEnum,
  UserPermissionType,
} from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import routes from 'apps/ops/routes';
import AddButton from 'components/buttons/AddButton';
import BackIconButton from 'components/buttons/BackIconButton';
import CircularProgress from 'components/CircularProgress';
import Fade from 'components/common/animations/DefaultTransition';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import DeletionWarningDialog from 'components/DeletionWarningDialog';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EntityDetails from 'components/EntityDetails';
import StyledSwitchWithLabel from 'components/forms/styled-fields/StyledSwitchWithLabel';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import PageSubHeader from 'components/PageSubHeader';
import { Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useHistory, useParams } from 'react-router';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import { convertToNumber } from 'utils/forms/values';
import AddAffectedDataChannelDialog from './components/AddDataChannelDialog';
import AffectedDataChannelsTable from './components/AffectedDataChannelsTable';
import ObjectForm from './components/ObjectForm';
import {
  buildValidationSchema,
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './components/ObjectForm/helpers';
import type { Values } from './components/ObjectForm/types';
import PageIntro from './components/PageIntro';
import ProblemReportActions from './components/ProblemReportActions';
import ProblemReportNotes from './components/ProblemReportNotes';
import SendEmailDrawerForm from './components/SendEmailDrawerForm';
import { useCloseOrReopenProblemReport } from './hooks/useCloseOrReopenProblemReport';
import { useDeleteProblemReportActivityLog } from './hooks/useDeleteProblemReportActivityLog';
import { useGetProblemReportDetailsById } from './hooks/useGetProblemReportDetails';
import { useSaveProblemReportDetails } from './hooks/useSaveProblemReportDetails';

const ShowGeneratedEntriesText = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
`;

const DeleteNotePreviewText = styled(Typography)`
  font-size: 14px;
  font-style: italic;
`;

const StyledDialogMessage = styled(Typography)`
  font-size: 14px;
  font-weight: 400;
`;

const StyledGrid = styled(Grid)`
  && {
    padding: 0px 8px 8px 8px;
  }
`;

interface RouteParams {
  problemReportId?: string;
}

interface Props {
  isInlineForm?: boolean;
}

const ProblemReportEditor = ({ isInlineForm }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams<RouteParams>();
  const dispatch = useDispatch();

  const hasPermission = useSelector(selectHasPermission);
  const canUpdateProblemReport = hasPermission(
    UserPermissionType.ProblemReportEditorAccess,
    AccessType.Update
  );

  const queryClient = useQueryClient();

  const editingProblemReportId = convertToNumber(params.problemReportId);

  const isCreating = !editingProblemReportId;

  const getApi = useGetProblemReportDetailsById(editingProblemReportId!);
  const saveApi = useSaveProblemReportDetails();

  const editProblemReportError = getApi.error;
  const problemReportData = getApi.data;

  const refetchEditData = () => {
    // Clear the error state when submitting
    saveApi.reset();
    if (!isCreating) {
      // NOTE:
      // Remove clears the cache, and forces the getApi hook to refetch the data
      // This allows the cancel button to refetch & show the loading spinner
      // to fetch the latest data on the server
      getApi.remove();
    }
  };

  const handleSubmit = (
    currentValues: Values,
    formikBag: FormikHelpers<Values>
  ) => {
    // Clear the error state when submitting
    saveApi.reset();

    const formattedValuesForApi = formatValuesForApi(currentValues);

    return saveApi
      .mutateAsync({
        problemReportId: editingProblemReportId!,
        problemReport: formattedValuesForApi,
      })
      .then(() => {
        formikBag.resetForm({ values: currentValues });
        dispatch(enqueueSaveSuccessSnackbar(t));
      })
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const saveCallback = (response: any) => {
    if (response?.problemReportId) {
      const editRoutePath = generatePath(routes.problemReports.edit, {
        problemReportId: response.problemReportId,
      });
      history.replace(editRoutePath);
    }
  };

  const isLoadingEditData = getApi.isLoading;
  const hasFetchingError = getApi.isError;

  const formattedInitialValues = formatInitialValues(
    problemReportData?.problemReport
  );
  const isPriorityFieldDisabled = !problemReportData?.problemReport
    ?.statusInformation?.customerPriorityTypeId;

  const descriptionText = t('ui.common.description', 'Description');
  const workOrderNumberText = t(
    'ui.problemreport.workordernumber',
    'Work Order #'
  );

  const validationSchema = buildValidationSchema(t, {
    descriptionText,
    workOrderNumberText,
  });

  const topOffset = useSelector(selectTopOffset);

  // Close Problem Report "Pr" Dialog

  const [
    isCloseProblemReportDialogOpen,
    setIsCloseProblemReportDialogOpen,
  ] = React.useState(false);

  const handleOpenReopenOrCloseProblemReportDialog = () => {
    setIsCloseProblemReportDialogOpen(true);
  };

  const handleCloseReopenOrCloseProblemReportDialog = () => {
    setIsCloseProblemReportDialogOpen(false);
  };

  // Show notes "Activity Log"
  const [
    showSystemGeneratedLogEntries,
    setShowSystemGeneratedLogEntries,
  ] = useState(false);

  const toggleSystemGeneratedLogEntries = () => {
    setShowSystemGeneratedLogEntries((prevState) => !prevState);
  };

  // Activity Log || Notes
  const [
    selectedNote,
    setSelectedNote,
  ] = useState<ProblemReportActivityLogDto | null>();

  // Delete Activity Log / Note

  const deleteProblemReportNoteApi = useDeleteProblemReportActivityLog({
    onSuccess: () => {
      queryClient.refetchQueries(APIQueryKey.getProblemReportDetails);
    },
  });

  const [isDeleteNoteDialogOpen, setIsDeleteNoteDialogOpen] = React.useState(
    false
  );

  const handleOpenDeleteNoteDialog = (note: ProblemReportActivityLogDto) => {
    setIsDeleteNoteDialogOpen(true);
    setSelectedNote(note);
  };

  const handleCloseDeleteNoteDialog = () => {
    setIsDeleteNoteDialogOpen(false);
    setSelectedNote(null);
  };

  const deleteSelectedNote = () => {
    deleteProblemReportNoteApi
      .mutateAsync({
        // NOTE/TODO: update hardcoded activitylog Id
        problemReportActivityLogId: selectedNote?.problemReportActivityLogId!,
        problemReportId: params.problemReportId!,
      })
      .then(() => {
        handleCloseDeleteNoteDialog();
      })
      .catch(() => {});
  };

  const problemReportStatusType =
    problemReportData?.problemReport?.statusTypeId;

  const problemReportIdAsNumber = Number(params.problemReportId);
  const isOpenProblemReport =
    problemReportStatusType === ProblemReportStatusEnum.Open;

  const formattedProblemReportStatusTypeForApi = isOpenProblemReport
    ? 'close'
    : 'reopen';

  // Reopen / close Problem report api

  const closeOrReopenProblemReportApi = useCloseOrReopenProblemReport({
    onSuccess: () => {
      queryClient.invalidateQueries(APIQueryKey.getProblemReportDetails);
    },
  });
  const closeOrReopenProblemReport = () => {
    return closeOrReopenProblemReportApi
      .mutateAsync({
        problemReportId: problemReportIdAsNumber,
        status: formattedProblemReportStatusTypeForApi,
      })
      .then(() => {
        handleCloseReopenOrCloseProblemReportDialog();
      });
  };
  const isCloseOrReopenApiLoading = closeOrReopenProblemReportApi.isLoading;
  const closeOrReopenApiHasError = closeOrReopenProblemReportApi.isError;

  // Add affected data channels table Dialog
  const [
    isAddAffectedDataChannelsDialogOpen,
    setIsAddAffectedDataChannelsDialogOpen,
  ] = React.useState(false);

  const handleOpenAddAffectedDataChannelsDialog = () => {
    setIsAddAffectedDataChannelsDialogOpen(true);
  };

  const handleCloseAddAffectedDataChannelsDialog = () => {
    setIsAddAffectedDataChannelsDialogOpen(false);
  };

  const activityLogs = getApi.data?.activityLog;
  const affectedDataChannels = getApi.data?.affectedDataChannels;

  const formattedAffectedDataChannelsCount =
    affectedDataChannels && affectedDataChannels?.length > 0
      ? affectedDataChannels?.length
      : 0;

  const [isSendEmailDrawerOpen, setIsSendEmailDrawerOpen] = useState(false);

  const closeSendEmailDrawer = () => {
    setIsSendEmailDrawerOpen(false);
  };

  const openSendEmailDrawer = () => {
    setIsSendEmailDrawerOpen(true);
  };

  const saveAndExitCallback = () => {
    setIsSendEmailDrawerOpen(false);
  };

  if (isLoadingEditData || hasFetchingError) {
    return (
      <>
        <PageIntroWrapper sticky {...(isInlineForm && { topOffset: 0 })}>
          <PageIntro
            isCreating={isCreating}
            isSubmitting={isLoadingEditData}
            cancelCallback={refetchEditData}
            headerNavButton={<BackIconButton />}
            isInlineForm={isInlineForm}
          />
        </PageIntroWrapper>

        <Box mt={3}>
          <TransitionLoadingSpinner in={isLoadingEditData} />
          <TransitionErrorMessage in={!isLoadingEditData && hasFetchingError} />
        </Box>
      </>
    );
  }

  return (
    <>
      <Drawer
        anchor="right"
        open={isSendEmailDrawerOpen}
        onClose={closeSendEmailDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <SendEmailDrawerForm
            cancelCallback={closeSendEmailDrawer}
            saveAndExitCallback={saveAndExitCallback}
          />
        </DrawerContent>
      </Drawer>
      <Formik<Values>
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
        {({
          isSubmitting,
          submitForm,
          values,
          resetForm,
          setFieldValue,
          dirty,
        }) => {
          return (
            <>
              <PageIntroWrapper
                topOffset={topOffset}
                sticky
                {...(isInlineForm && { topOffset: 0 })}
              >
                <PageIntro
                  isCreating={isCreating}
                  isSubmitting={isSubmitting || getApi.isFetching}
                  submissionResult={saveApi.data}
                  submissionError={saveApi.error}
                  cancelCallback={() => {
                    resetForm();
                    refetchEditData();
                  }}
                  submitForm={() => {
                    return submitForm();
                  }}
                  headerNavButton={<BackIconButton />}
                  saveCallback={saveCallback}
                  isInlineForm={isInlineForm}
                  problemNumber={values.problemNumber}
                  isProblemReportClosed={values.statusTypeId}
                  isFormDirty={dirty}
                />
              </PageIntroWrapper>

              <Box mt={2} mb={1}>
                <Fade in={isLoadingEditData} unmountOnExit>
                  <div>
                    {isLoadingEditData && (
                      <MessageBlock>
                        <CircularProgress />
                      </MessageBlock>
                    )}
                  </div>
                </Fade>

                <Fade in={!editProblemReportError && !isLoadingEditData}>
                  <div>
                    {!editProblemReportError && !isLoadingEditData && (
                      <Grid
                        container
                        spacing={2}
                        direction="column"
                        justify="space-between"
                        alignItems="stretch"
                      >
                        <Grid item xs={12} style={{ padding: '0 8px 0 8px' }}>
                          <ProblemReportActions
                            problemReportStatusType={problemReportStatusType}
                            handleOpenCloseProblemReportDialog={
                              handleOpenReopenOrCloseProblemReportDialog
                            }
                            openSendEmailDrawer={openSendEmailDrawer}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <ObjectForm
                            isSubmitting={isSubmitting}
                            setFieldValue={setFieldValue}
                            formValues={values}
                            isPriorityFieldDisabled={isPriorityFieldDisabled}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </div>
                </Fade>
              </Box>
            </>
          );
        }}
      </Formik>

      <Grid container spacing={2} alignItems="center">
        <StyledGrid item xs={12}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justify="space-between"
          >
            <Grid item xs>
              <PageSubHeader dense>
                {t(
                  'ui.problemreport.affectedDataChannelsCount',
                  'Affected Data Channels ({{count}})',
                  {
                    count: formattedAffectedDataChannelsCount,
                  }
                )}
              </PageSubHeader>
            </Grid>
            <Grid item xs="auto">
              <AddButton
                variant="text"
                onClick={() => {
                  handleOpenAddAffectedDataChannelsDialog();
                }}
                disabled={!canUpdateProblemReport}
              >
                {t('ui.common.addNew', 'Add New')}
              </AddButton>
            </Grid>
          </Grid>
        </StyledGrid>
        <StyledGrid item xs={12}>
          <AffectedDataChannelsTable
            affectedDataChannels={affectedDataChannels}
            isFetching={getApi.isFetching}
            canUpdateProblemReport={canUpdateProblemReport}
          />
        </StyledGrid>
      </Grid>

      {/* Notes "Activity Log" section */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <PageSubHeader dense>
            {t('ui.problemreport.activitylog', 'Activity Log')}
          </PageSubHeader>
        </Grid>
        <Grid item xs="auto">
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <ShowGeneratedEntriesText>
                {t(
                  'ui.problemreport.showsystemgeneratedlogentries',
                  'Show System Generated Log Entries'
                )}
              </ShowGeneratedEntriesText>
            </Grid>
            <Grid item>
              <StyledSwitchWithLabel
                onChange={toggleSystemGeneratedLogEntries}
                checked={showSystemGeneratedLogEntries}
              />
            </Grid>
          </Grid>
        </Grid>
        <StyledGrid item xs={12}>
          <ProblemReportNotes
            showSystemGeneratedLogEntries={showSystemGeneratedLogEntries}
            notes={activityLogs}
            handleOpenDeleteNoteDialog={handleOpenDeleteNoteDialog}
          />
        </StyledGrid>
        <Grid item xs={12}>
          {problemReportData && !isCreating && (
            <Box py={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <EntityDetails details={problemReportData} />
                </Grid>
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Notes Deletion Dialog */}
      <DeletionWarningDialog
        open={isDeleteNoteDialogOpen}
        handleCancel={handleCloseDeleteNoteDialog}
        handleConfirm={deleteSelectedNote}
        hasError={deleteProblemReportNoteApi.isError}
        errorMessage={t('ui.common.failedToDelete', 'Failed to delete')}
        isDeleting={deleteProblemReportNoteApi.isLoading}
        recordCount={1}
      >
        <DeleteNotePreviewText>{selectedNote?.notes}</DeleteNotePreviewText>
      </DeletionWarningDialog>

      {/* Close / Reopen Problem Report Dialog */}
      <UpdatedConfirmationDialog
        maxWidth="xs"
        open={isCloseProblemReportDialogOpen}
        mainTitle={
          isOpenProblemReport
            ? t('ui.problemreport.closeProblemReport', 'Close Problem Report?')
            : t(
                'ui.problemreport.reopenProblemReport',
                'Reopen Problem Report?'
              )
        }
        content={
          <StyledDialogMessage>
            {isOpenProblemReport
              ? t(
                  'ui.problemreport.closeProblemReportMessage',
                  'Are you sure you would like to close this Problem Report?'
                )
              : t(
                  'ui.problemreport.reopenProblemReportMessage',
                  'Are you sure you would like to reopen this Problem Report?'
                )}
          </StyledDialogMessage>
        }
        confirmationButtonText={
          isOpenProblemReport
            ? t('ui.common.close', 'Close')
            : t('ui.problemReport.reopen', 'Reopen')
        }
        onConfirm={closeOrReopenProblemReport}
        closeDialog={handleCloseReopenOrCloseProblemReportDialog}
        isLoading={isCloseOrReopenApiLoading}
        isError={closeOrReopenApiHasError}
      />

      <AddAffectedDataChannelDialog
        open={isAddAffectedDataChannelsDialogOpen}
        handleClose={handleCloseAddAffectedDataChannelsDialog}
      />
    </>
  );
};

export default ProblemReportEditor;
