import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import Button from 'components/Button';
import Typography from '@material-ui/core/Typography';
import CustomBoxRedesign from 'components/CustomBoxRedesign';
import {
  EnableReloadSettingsAndMoreImage,
  EnableReloadSettingsDefaultBrowserImage,
  EnableReloadSettingsImage,
  EnableReloadSettingsRestartImage,
  NavigateToDolv3Image,
  ReloadPageIeIconConfirm,
  ReloadPageIeOpenThisPageInIeImage,
  ReloadPageIeReloadInIeImage,
  ReloadPageIeSettingsAndMoreImage,
  UpToDateHelpAndFeedbackImage,
  UpToDateSettingsImage,
  CheckBrowserSettingsImage,
} from 'components/images/dolv3-edge-instructions';
import MsEdgeImage from 'components/images/MicrosoftEdgeImage';
import SilverlightDarkThemeImage from 'components/images/SilverlightDarkThemeImage';
import SilverlightImage from 'components/images/SilverlightImage';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ContactSupport from '../ContactSupport';

const StyledBox = styled(Box)`
  background-color: ${(props) =>
    props.theme.custom.palette.background.defaultAlternate};
`;

const StyledPageHeader = styled(Typography)`
  && {
    font-weight: 600;
    font-size: 26px;
    margin-bottom: 16px;
    color: ${(props) => props.theme.palette.text.primary};
  }
  color: ${(props) => props.theme.palette.text.primary};
`;

const StyledSubHeader = styled(
  ({ fontSize: string, fontWeight: number, ...props }) => (
    <Typography {...props} />
  )
)`
  font-size: ${(props) => (props.fontSize ? props.fontSize : '20px')};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 600)};
  color: ${(props) => props.theme.palette.text.primary};
`;

const StyledDivider = styled(Divider)`
  margin: 12px 0 12px 0;
`;

const AccessDolv3 = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <div>
      <Box mt={2}>
        <CustomBoxRedesign p={4}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <StyledPageHeader variant="h1">
                {t('ui.main.accessDolv3', 'Access DOLV3 in Microsoft Edge')}
              </StyledPageHeader>
              <StyledSubHeader fontWeight={500} variant="h2">
                {t(
                  'ui.main.forUsersWithoutIe',
                  'For Users Without Internet Explorer'
                )}
              </StyledSubHeader>
              <Typography>
                {t(
                  'ui.main.dolv3IsDesignedToWorkWithIe',
                  'DOLV3 is designed to work with Internet Explorer. This step-by-step tutorial explains how users without Internet Explorer can access DOLV3 in Microsoft Edge using Internet Explorer Mode.'
                )}
              </Typography>
            </Grid>
          </Grid>
          <StyledDivider />
          <Box p={1}>
            <Grid container spacing={0}>
              <Grid item xs={1}>
                {theme.palette.type === 'dark' ? (
                  <SilverlightDarkThemeImage />
                ) : (
                  <SilverlightImage />
                )}
              </Grid>
              <Grid item xs={11}>
                <Box mb={1}>
                  <StyledSubHeader variant="h2">
                    {t(
                      'ui.main.makeSureSilverlight',
                      'Make sure Silverlight is installed on your computer'
                    )}
                  </StyledSubHeader>
                </Box>
                <Box mb={1}>
                  <Typography>
                    {t(
                      'ui.main.ifYouDoNotHaveSilverlight',
                      'If you do not have Silverlight installed when you navigate to the DOLV3 website you will be prompted to download Microsoft Silverlight. You can download Silverlight by clicking the button below:'
                    )}
                  </Typography>
                </Box>
                <Box mb={1}>
                  <Button
                    variant="contained"
                    href="https://sldownload2.blob.core.windows.net/sldownloadcontainer2/Silverlight_x64.exe"
                  >
                    {t(
                      'ui.main.downloadSilverlight',
                      'Download Microsoft Silverlight'
                    )}
                  </Button>
                </Box>
                <Box mb={1}>
                  <Typography>
                    {t(
                      'ui.main.onceSilverlightHasBeenDownloaded',
                      'Once Silverlight has been downloaded, please run the program, and install the plugin.'
                    )}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <StyledDivider />
          <Box p={1}>
            <Grid container spacing={0}>
              <Grid item xs={1}>
                <MsEdgeImage />
              </Grid>

              <Grid item xs={11}>
                <Box mb={1}>
                  <StyledSubHeader variant="h2">
                    {t('ui.main.configureMsEdge', 'Configure Microsoft Edge')}
                  </StyledSubHeader>
                </Box>
                <Box mb={1}>
                  <Typography>
                    {t(
                      'ui.main.pleaseConfigureMsEdge',
                      'Please follow the steps below to configure your Microsoft Edge Browser.'
                    )}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box my={2}>
                  <StyledSubHeader fontSize="18px" variant="h3">
                    {t(
                      'ui.main.openMsEdge',
                      '1. Open the Microsoft Edge browser'
                    )}
                  </StyledSubHeader>
                </Box>
                <Box my={2}>
                  <StyledSubHeader fontSize="18px" variant="h3">
                    {t(
                      'ui.main.ensureMsEdgeUpToDate',
                      '2. Ensure your browser is up to date'
                    )}
                  </StyledSubHeader>
                </Box>
                <StyledBox p={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box my={2}>
                        <Typography>
                          {t(
                            'ui.main.clickOnSettingsAndMore',
                            'a. Click on the “Settings and more” Menu button (top-right corner)'
                          )}
                        </Typography>
                      </Box>
                      <UpToDateSettingsImage />
                    </Grid>
                    <Grid item xs={6}>
                      <Box my={2}>
                        <Typography>
                          {t(
                            'ui.main.hoverOverHelpAndFeedback',
                            'b. Hover over the "Help and feedback" menu item (near the bottom) and click “About Microsoft Edge”. Edge will automatically check for updates.'
                          )}
                        </Typography>
                      </Box>
                      <UpToDateHelpAndFeedbackImage />
                    </Grid>
                  </Grid>
                </StyledBox>
                <Box my={3}>
                  <StyledSubHeader fontSize="18px" variant="h3">
                    {t(
                      'ui.main.enableReloadInInternetExplorer',
                      '3. Enable Reload in Internet Explorer mode'
                    )}
                  </StyledSubHeader>
                </Box>
                <StyledBox p={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box my={2}>
                        <Typography>
                          {t(
                            'ui.main.clickOnSettingsAndMore',
                            'a. Click on the “Settings and more” Menu button (top-right corner)'
                          )}
                        </Typography>
                      </Box>
                      <EnableReloadSettingsAndMoreImage />
                    </Grid>
                    <Grid item xs={6}>
                      <Box my={2}>
                        <Typography>
                          {t(
                            'ui.main.clickOnSettingsNearBottom',
                            'b. Click on “Settings” (near the bottom)'
                          )}
                        </Typography>
                      </Box>
                      <EnableReloadSettingsImage />
                    </Grid>
                    <Grid item xs={12}>
                      <Box my={2}>
                        <Typography>
                          {t(
                            'ui.main.clickOnDefaultBrowser',
                            'c. On the Settings page, click on “Default browser”'
                          )}
                        </Typography>
                      </Box>
                      <EnableReloadSettingsDefaultBrowserImage />
                    </Grid>
                    <Grid item xs={12}>
                      <Box my={2}>
                        <Typography>
                          {t(
                            'ui.main.clickOnRestart',
                            'd. Click on “Restart” for the settings to take effect. This will close Edge and restart the browser (not the computer).'
                          )}
                        </Typography>
                      </Box>
                      <EnableReloadSettingsRestartImage />
                    </Grid>
                  </Grid>
                </StyledBox>
                <Box my={2}>
                  <StyledSubHeader fontSize="18px" variant="h3">
                    {t(
                      'ui.main.navigateToDolv3',
                      '4. Ensure your browser is up to date'
                    )}
                  </StyledSubHeader>
                </Box>
                <StyledBox p={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box my={2}>
                        <Typography>
                          {t(
                            'ui.main.clickOnSettingsAndMore',
                            'a. Click on the “Settings and more” Menu button (top-right corner)'
                          )}
                        </Typography>
                      </Box>
                      <NavigateToDolv3Image />
                    </Grid>
                  </Grid>
                </StyledBox>
                <Box my={2}>
                  <StyledSubHeader fontSize="18px" variant="h3">
                    {t(
                      'ui.main.reloadThePageInIeMode',
                      '5. Reload the page in Internet Explorer mode '
                    )}
                  </StyledSubHeader>
                </Box>
                <StyledBox p={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box my={2}>
                        <Typography>
                          {t(
                            'ui.main.clickOnSettingsAndMore',
                            'a. Click on the “Settings and more” Menu button (top-right corner)'
                          )}
                        </Typography>
                      </Box>
                      <ReloadPageIeSettingsAndMoreImage />
                    </Grid>
                    <Grid item xs={6}>
                      <Box my={2}>
                        <Typography>
                          {t(
                            'ui.main.clickReloadInIeMode',
                            'b. Click “Reload in Internet Explorer mode” (near the bottom)'
                          )}
                        </Typography>
                      </Box>
                      <ReloadPageIeReloadInIeImage />
                      <Box my={2}>
                        <Typography>
                          {t(
                            'ui.main.siteReloadIcon',
                            'The site reloads and an icon confirms you are in Internet Explorer mode'
                          )}
                        </Typography>
                      </Box>
                      <ReloadPageIeIconConfirm />
                    </Grid>
                  </Grid>
                </StyledBox>
                <StyledBox mt={4} p={4}>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Box my={2}>
                        <ReloadPageIeOpenThisPageInIeImage />
                      </Box>
                    </Grid>
                    <Grid item xs={8}>
                      <Box my={2}>
                        <Typography>
                          {t(
                            'ui.main.openInIeNextTimeToggle',
                            `On the popup, enable the option "Open this page in Internet Explorer mode next time" to run DOLV3 in
                            Internet Explorer mode for the next 30 days. Repeat step 5 once the 30 days expire.`
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </StyledBox>
                <Box my={2}>
                  <StyledSubHeader fontSize="18px" variant="h3">
                    {t(
                      'ui.main.checkBrowserScaling',
                      '6. Check browser scaling'
                    )}
                  </StyledSubHeader>
                </Box>
                <StyledBox p={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <CheckBrowserSettingsImage />
                    </Grid>
                    <Grid item xs={4}>
                      <Box my={2}>
                        <Typography>
                          {t(
                            'ui.main.dolv3OneHundredPercentZoom',
                            'DOLV3 is designed to work at a browser zoom level of 100%, if the screens are not rendering properly please check your zoom level.'
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </StyledBox>
              </Grid>
            </Grid>
          </Box>
        </CustomBoxRedesign>
        <Box px={8} my={4}>
          <ContactSupport />
        </Box>
      </Box>
    </div>
  );
};

export default AccessDolv3;
