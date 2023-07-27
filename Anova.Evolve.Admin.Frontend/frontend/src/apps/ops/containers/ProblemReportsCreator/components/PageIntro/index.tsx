/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { UserPermissionType } from 'api/admin/api';
import Alert from 'components/Alert';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import PageHeader from 'components/PageHeader';
import WarnOnUnsavedChangesDialog from 'components/WarnOnUnsavedChangesDialog';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';

const StyledOpenChip = styled(Chip)`
  background-color: ${(props) => props.theme.palette.text.secondary};
  color: ${(props) =>
    props.theme.palette.getContrastText(props.theme.palette.text.primary)};
  border: 0;
  font-weight: 600;
  font-size: 14px;
  padding: 5px 8px;
`;

enum SaveType {
  Save = 'save',
  SaveAndExit = 'save-and-exit',
}

interface Props {
  submitForm?: any;
  isCreating: boolean;
  isSubmitting?: boolean;
  submissionResult?: any;
  submissionError?: any;
  headerNavButton?: React.ReactNode;
  isInlineForm?: boolean;
  problemNumber?: string | null;
  isFormDirty?: boolean;
  cancelCallback: () => void;
  saveCallback?: (response: any) => void;
  saveAndExitCallback?: (response: any) => void;
}

const PageIntro = ({
  isCreating,
  isSubmitting,
  submitForm,
  submissionResult,
  submissionError,
  headerNavButton,
  isInlineForm,
  problemNumber,
  isFormDirty,
  cancelCallback,
  saveCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const isBelowMdBreakpoint = useMediaQuery(theme.breakpoints.down('md'));

  const hasPermission = useSelector(selectHasPermission);
  const canCreateProblemReportEditor = hasPermission(
    UserPermissionType.ProblemReportEditorAccess,
    AccessType.Create
  );
  const canUpdateProblemReportDetail = hasPermission(
    UserPermissionType.ProblemReportEditorAccess,
    AccessType.Update
  );
  const showSaveOptions =
    (isCreating && canCreateProblemReportEditor) ||
    (!isCreating && canUpdateProblemReportDetail);

  const [saveType, setSaveType] = useState<SaveType>();

  const cancel = () => {
    cancelCallback();
  };

  const submit = () => {
    submitForm?.().then(() => {
      setSaveType(SaveType.SaveAndExit);
    });
  };

  useEffect(() => {
    if (!submissionResult || isSubmitting) {
      return;
    }

    if (saveType === SaveType.Save) {
      saveCallback?.(submissionResult);
    } else if (saveType === SaveType.SaveAndExit) {
      saveAndExitCallback?.(submissionResult);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [submissionResult, saveType, history, isSubmitting]);

  return (
    <Box>
      <WarnOnUnsavedChangesDialog isDirty={isFormDirty || false} />
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item xs={isInlineForm ? 'auto' : 12} lg>
          <Grid container spacing={1} alignItems="center">
            {headerNavButton && <Grid item>{headerNavButton}</Grid>}
            <Grid item>
              <PageHeader dense>
                {problemNumber
                  ? `${t('ui.common.problemreport', 'Problem Report')} -
                    ${problemNumber}`
                  : t('ui.common.problemreport', 'Problem Report')}
              </PageHeader>
            </Grid>
            <Grid item>
              <Box ml={2}>
                <StyledOpenChip
                  variant="outlined"
                  size="small"
                  label={t('enum.problemReportStatus.new', 'New')}
                  aria-label="Problem report status type"
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {showSaveOptions && (
          <Grid item xs={isInlineForm ? 'auto' : 12} lg="auto">
            <Box
              clone
              justifyContent={['space-between', 'space-between', 'flex-end']}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid
                  item
                  {...(isBelowMdBreakpoint && !isInlineForm && { xs: true })}
                >
                  <CancelButton
                    onClick={cancel}
                    fullWidth
                    useDomainColorForIcon
                    disabled={isSubmitting}
                  />
                </Grid>
                {!isInlineForm && (
                  <Grid
                    item
                    {...(isBelowMdBreakpoint && !isInlineForm && { xs: true })}
                  >
                    <SaveAndExitButton
                      variant="contained"
                      fullWidth
                      onClick={submit}
                      useDomainColorForIcon
                      disabled={isSubmitting}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        )}

        <DefaultTransition in={!!submissionError} unmountOnExit>
          <Grid item xs={12}>
            <Alert variant="filled" severity="error">
              {t('ui.common.unableToSave', 'Unable to save')}
            </Alert>
          </Grid>
        </DefaultTransition>
      </Grid>
    </Box>
  );
};

export default PageIntro;
