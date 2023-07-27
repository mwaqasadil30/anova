import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CustomBoxRedesign from 'components/CustomBoxRedesign';
import WorldMapImage from 'components/images/WorldMapImage';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import PageHeader from 'components/PageHeader';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';

const StyledWorldMap = styled(WorldMapImage)`
  position: fixed;
  padding: ${(props) => props.theme.spacing(1)}px;
  padding-top: 100px;
  opacity: 0.7;
  width: 90%;
  max-width: 90%;
  z-index: -1;
`;

const StyledBox = styled(CustomBoxRedesign)`
  min-height: 85px;
  padding: 20px;
`;

const StyledHeaderText = styled(Typography)`
  font-size: 20px;
  font-weight: 600;
`;

const StyledText = styled(Typography)`
  font-size: 14px;
  font-weight: 400;
`;

const StyledHref = styled.a`
  color: ${(props) => props.theme.palette.text.primary};
`;

const ContactSupport = () => {
  const { t } = useTranslation();
  const topOffset = useSelector(selectTopOffset);

  return (
    <div>
      <PageIntroWrapper sticky topOffset={topOffset}>
        <PageHeader dense>
          {t('ui.main.contactSupport', 'Contact Support')}
        </PageHeader>
      </PageIntroWrapper>

      <Box mt={2}>
        <StyledWorldMap />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledText>
              {t(
                'ui.contactSupport.forHardwareAndTranscendSupport',
                'For hardware and Transcend support contact your local tech support team.'
              )}
            </StyledText>
          </Grid>
          <Grid item md={4} xs={6}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <StyledHeaderText>
                  {t('ui.common.europe', 'Europe')}
                </StyledHeaderText>
              </Grid>
              <Grid item xs={12}>
                <StyledBox>
                  <Grid container spacing={0}>
                    <Grid item xs={12}>
                      <StyledText>08:30 - 16:30 CET</StyledText>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledHref
                        href="mailto:support-eu@anova.com"
                        target="_blank"
                      >
                        <StyledText>support-eu@anova.com</StyledText>
                      </StyledHref>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledText>+49 631 205 777 22</StyledText>
                    </Grid>
                  </Grid>
                </StyledBox>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={4} xs={6}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <StyledHeaderText>
                  {t('ui.common.northAmerica', 'North America')}
                </StyledHeaderText>
              </Grid>
              <Grid item xs={12}>
                <StyledBox>
                  <Grid container spacing={0}>
                    <Grid item xs={12}>
                      <StyledText>08:00 - 18:30 ET</StyledText>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledHref
                        href="mailto:techsupport@anova.com"
                        target="_blank"
                      >
                        <StyledText>techsupport@anova.com</StyledText>
                      </StyledHref>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledText>+1 866 626 8425</StyledText>
                    </Grid>
                  </Grid>
                </StyledBox>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={4} xs={6}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <StyledHeaderText>
                  {t('ui.common.asiaPacific', 'Asia-Pacific')}
                </StyledHeaderText>
              </Grid>
              <Grid item xs={12}>
                <StyledBox>
                  <Grid container spacing={0}>
                    <Grid item xs={12}>
                      <StyledText>09:00 - 18:00 GMT+8</StyledText>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledHref
                        href="mailto:asiasupport@anova.com"
                        target="_blank"
                      >
                        <StyledText>asiasupport@anova.com</StyledText>
                      </StyledHref>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledText>{`+60 3 6207 1659 (${t(
                        'ui.contactSupport.office',
                        'Office'
                      )})`}</StyledText>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledText>{`+60 12 921 9932 (${t(
                        'ui.contactSupport.mobile',
                        'Mobile'
                      )})`}</StyledText>
                    </Grid>
                  </Grid>
                </StyledBox>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ContactSupport;
