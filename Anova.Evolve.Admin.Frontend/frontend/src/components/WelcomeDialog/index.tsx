/* eslint-disable jsx-a11y/media-has-caption */
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Button from 'components/Button';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import Checkbox from 'components/forms/styled-fields/Checkbox';
import { WELCOME_VIDEO_URL } from 'env';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { confirmWelcomeDialog } from 'redux-app/modules/user/actions';
import styled from 'styled-components';
import { useSetShowPreviewPage } from './hooks/useSetShowPreviewPage';

const StyledCheckboxText = styled(Typography)`
  font-size: 15px;
`;

const StyledVideo = styled.video`
  ${(props) => props.theme.breakpoints.down(768)} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.up(768)} {
    height: 340px;
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    height: 472px;
    width: 100%;
  }
`;

interface Props {
  isOpen?: boolean;
  handleClose: () => void;
}

const WelcomeDialog = ({ isOpen, handleClose }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleCloseWelcomeDialog = () => {
    dispatch(confirmWelcomeDialog());
    handleClose();
  };

  const setShowPreviewPageApi = useSetShowPreviewPage();

  const confirmDontShowAgainAndClose = () => {
    if (isChecked) {
      setShowPreviewPageApi.makeRequest({ showPreviewPage: false });
    }
    handleCloseWelcomeDialog();
  };

  const dontShowAgainCheckBox = (
    <FormControlLabel
      control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
      label={
        <StyledCheckboxText>
          {t('ui.welcome.doNotShowAgain', 'Do not show again')}
        </StyledCheckboxText>
      }
      labelPlacement="end"
    />
  );
  const startTranscendButton = (
    <Box textAlign="center">
      <Button variant="contained" onClick={confirmDontShowAgainAndClose}>
        {t('ui.welcome.startUsingTranscend', 'Start using Transcend')}
      </Button>
    </Box>
  );

  const mainTitle = t(
    'ui.welcome.title',
    'Welcome to the Transcend IoT Platform'
  );

  return (
    <UpdatedConfirmationDialog
      open={!!isOpen}
      maxWidth="md"
      disableBackdropClick
      disableEscapeKeyDown
      mainTitle={mainTitle}
      content={
        <>
          <Box p={1} mt={1}>
            <Grid container spacing={3} alignItems="center" justify="center">
              <Grid item xs={11}>
                <Box textAlign="center">
                  <StyledVideo
                    controls
                    preload="metadata"
                    poster="https://ucarecdn.com/903981ab-a134-49ee-917e-73db0a708850/-/preview/1162x693/-/setfill/ffffff/-/format/jpeg/-/progressive/yes/"
                  >
                    <source src={WELCOME_VIDEO_URL} type="video/mp4" />
                    {t(
                      'ui.common.cannotPlayVideo',
                      'Sorry, your browser does not support embedded videos.'
                    )}
                  </StyledVideo>
                </Box>
              </Grid>

              <Grid item xs={11}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justify="flex-start"
                >
                  <Hidden mdUp>
                    <Grid item xs={12} md={4}>
                      <Box textAlign="center">{dontShowAgainCheckBox}</Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      {startTranscendButton}
                    </Grid>
                  </Hidden>

                  <Hidden smDown>
                    <Grid item xs={4}>
                      {dontShowAgainCheckBox}
                    </Grid>
                    <Grid item xs={4}>
                      {startTranscendButton}
                    </Grid>
                  </Hidden>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </>
      }
      hideConfirmationButton
      hideCancelButton
      onConfirm={confirmDontShowAgainAndClose}
    />
  );
};

export default WelcomeDialog;
