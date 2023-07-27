import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import NavigationPrompt from 'react-router-navigation-prompt';
import styled from 'styled-components';

interface Props {
  isDirty: boolean;
}

enum responseType {
  Exit = 'exit',
}

const StyledText = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
  font-size: ${(props) => props.theme.custom.fontSize.commonFontSize};
  font-weight: 400;
`;

const WarnOnUnsavedChangesDialog = ({ isDirty }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const originPath = location.pathname;

  const [response, setResponse] = useState<responseType>();

  const exit = () => {
    setResponse(responseType.Exit);
  };

  useEffect(() => {
    if (response === responseType.Exit) {
      history.push(originPath);
    }
  }, [history, response]);

  const mainTitle = t('ui.common.saveChanges', 'Save Changes?');
  const confirmationButtonText = t('ui.common.discardExit', 'Discard & Exit');
  const cancelButtonText = t('ui.common.resume', 'Resume');
  return (
    <NavigationPrompt when={isDirty} afterConfirm={exit}>
      {({ isActive, onCancel, onConfirm }) => (
        <UpdatedConfirmationDialog
          open={isActive}
          maxWidth="xs"
          disableBackdropClick
          disableEscapeKeyDown
          mainTitle={mainTitle}
          content={
            <>
              <Box m={2}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justify="center"
                >
                  <Grid item xs={12} md={12} style={{ maxWidth: '350px' }}>
                    <StyledText
                      align="center"
                      style={{
                        fontSize: 14,
                        textAlign: 'center',
                      }}
                    >
                      {t(
                        'ui.common.unsavedChanges',
                        'You have unsaved changes. Would you like to save before exiting?'
                      )}
                    </StyledText>
                  </Grid>
                </Grid>
              </Box>
            </>
          }
          confirmationButtonText={confirmationButtonText}
          cancelButtonText={cancelButtonText}
          closeDialog={onCancel}
          onConfirm={onConfirm}
        />
      )}
    </NavigationPrompt>
  );
};

export default WarnOnUnsavedChangesDialog;
