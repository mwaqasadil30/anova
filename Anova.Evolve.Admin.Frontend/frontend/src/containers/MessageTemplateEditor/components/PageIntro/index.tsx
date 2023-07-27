/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { MessageTemplateDto, UserPermissionType } from 'api/admin/api';
import Alert from 'components/Alert';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import SaveButton from 'components/buttons/SaveButton';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import PageHeader from 'components/PageHeader';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import { SaveCallbackFunction } from '../../types';

enum SaveType {
  Save = 'save',
  SaveAndExit = 'save-and-exit',
}

interface Props {
  submitForm?: any;
  isCreating: boolean;
  isSubmitting?: boolean;
  submissionResult?: MessageTemplateDto;
  submissionError?: any;
  headerNavButton?: React.ReactNode;
  isInlineForm?: boolean;
  cancelCallback: () => void;
  saveCallback?: SaveCallbackFunction;
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
  cancelCallback,
  saveCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const hasPermission = useSelector(selectHasPermission);
  const canCreateMessageTemplate = hasPermission(
    UserPermissionType.EventMessageTemplates,
    AccessType.Create
  );
  const canUpdateMessageTemplate = hasPermission(
    UserPermissionType.EventMessageTemplates,
    AccessType.Update
  );
  const showSaveOptions =
    (isCreating && canCreateMessageTemplate) ||
    (!isCreating && canUpdateMessageTemplate);

  const [saveType, setSaveType] = useState<SaveType>();

  const cancel = () => {
    cancelCallback();
  };

  const submit = () => {
    submitForm?.().then(() => {
      setSaveType(SaveType.Save);
    });
  };

  const submitAndGoToListPage = () => {
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
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item xs={isInlineForm ? 'auto' : 12} md>
          <Grid container spacing={1} alignItems="center">
            {headerNavButton && <Grid item>{headerNavButton}</Grid>}
            <Grid item>
              <PageHeader dense>
                {isCreating
                  ? t(
                      'ui.messageTemplateEditor.addMessageTemplate',
                      'Add Message Template'
                    )
                  : t(
                      'ui.messageTemplateEditor.editMessageTemplate',
                      'Edit Message Template'
                    )}
              </PageHeader>
            </Grid>
          </Grid>
        </Grid>
        {showSaveOptions && (
          <Grid item xs={isInlineForm ? 'auto' : 12} md="auto">
            <Box
              clone
              justifyContent={['space-between', 'space-between', 'flex-end']}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid
                  item
                  {...(isBelowSmBreakpoint && !isInlineForm && { xs: true })}
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
                    {...(isBelowSmBreakpoint && !isInlineForm && { xs: true })}
                  >
                    <SaveButton
                      fullWidth
                      onClick={submit}
                      useDomainColorForIcon
                      disabled={isSubmitting}
                    />
                  </Grid>
                )}
                <Grid
                  item
                  {...(isBelowSmBreakpoint && !isInlineForm && { xs: true })}
                >
                  <SaveAndExitButton
                    variant="contained"
                    fullWidth
                    onClick={submitAndGoToListPage}
                    disabled={isSubmitting}
                  />
                </Grid>
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
