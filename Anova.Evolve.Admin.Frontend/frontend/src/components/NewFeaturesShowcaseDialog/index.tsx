// Since the layout/design of this changes often, we keep some of the
// previously used styled components so they can be easily + re-used extremely
// quickly (for last minute changes) without comparing previously changes via
// git. This is why we disable the no-unused-vars check.
/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as CaretIcon } from 'assets/icons/caret.svg';
import RightShowcaseImage from 'assets/images/new-date-filter-asset-details.png';
import Button from 'components/Button';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { selectReleaseNotesRouteForCurrentApp } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';

const StyledCaretIcon = styled(CaretIcon)`
  transform: rotate(-90deg);
`;

const StyledSubHeader = styled(Typography)`
  font-size: ${(props) => props.theme.typography.pxToRem(16)};
  line-height: 28px;
`;

const StyledImage = styled.img`
  width: 100%;
`;

const RoundedBox = styled.div`
  /*
    Increased top left and top right border radius since the provided images
    have a larger border radius
  */
  border-radius: 15px 15px 10px 10px;
  margin: 8px 0;
  background: #333333;
`;

const FeatureBox = styled.div`
  padding: 16px 16px 24px;
`;

const FeatureDescription = styled(Typography)`
  color: #fff;
  font-size: 16px;
  text-align: center;
  line-height: 28px;
  font-weight: 500;
`;

interface Props {
  isOpen?: boolean;
  handleClose: () => void;
}

const NewFeaturesShowcaseDialog = ({ isOpen, handleClose }: Props) => {
  const history = useHistory();
  const { t } = useTranslation();
  const theme = useTheme();
  const releaseNotesRoute = useSelector(selectReleaseNotesRouteForCurrentApp);

  const closeDialog = () => {
    handleClose();
  };

  const confirmAndGoToReleaseNotes = () => {
    history.push(releaseNotesRoute);
    closeDialog();
  };

  const mainTitle = (
    <>
      {t(
        'ui.newFeaturesShowcaseDialog.title',
        'Welcome to the new version of Anova Transcend IOT'
      )}{' '}
    </>
  );

  return (
    <UpdatedConfirmationDialog
      open={!!isOpen}
      maxWidth="md"
      disableBackdropClick
      disableEscapeKeyDown
      mainTitle={mainTitle}
      PaperProps={{
        style: {
          backgroundColor:
            theme.palette.type === 'dark' ? '#666666' : '#f8f8f8',
        },
      }}
      content={
        <>
          <Box p={1}>
            <Grid container spacing={3} alignItems="center" justify="center">
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <StyledSubHeader variant="h3" align="center">
                      {t(
                        'ui.newFeaturesShowcaseDialog.subtitle',
                        'Take a look below at some of the new features available for this release.'
                      )}
                    </StyledSubHeader>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <RoundedBox>
                  <Grid container>
                    <Grid item xs={12}>
                      <StyledImage src={RightShowcaseImage} />

                      <FeatureBox>
                        {/*                     
                           // @ts-ignore */}
                        <FeatureDescription component="div">
                          New date filters in Asset Details view will allow for
                          quicker filtering.
                        </FeatureDescription>
                      </FeatureBox>
                    </Grid>
                  </Grid>
                </RoundedBox>
              </Grid>

              <Grid item xs={11}>
                <Box textAlign="center">
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Box textAlign="center">
                        <Button
                          variant="contained"
                          className="brand-yellow"
                          onClick={closeDialog}
                        >
                          {t(
                            'ui.welcome.startUsingTranscend',
                            'Start using Transcend'
                          )}
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box textAlign="center">
                        <Button
                          variant="text"
                          onClick={confirmAndGoToReleaseNotes}
                          endIcon={<StyledCaretIcon />}
                        >
                          {t(
                            'ui.newFeaturesShowcaseDialog.viewReleaseNotes',
                            'View release notes'
                          )}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </>
      }
      hideConfirmationButton
      hideCancelButton
      onConfirm={closeDialog}
    />
  );
};

export default NewFeaturesShowcaseDialog;
