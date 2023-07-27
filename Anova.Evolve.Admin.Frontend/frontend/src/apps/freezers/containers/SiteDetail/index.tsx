/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import CloudIconMessage from 'apps/freezers/components/CloudIconMessage';
import EmphasizedValue from 'apps/freezers/components/EmphasizedValue';
import SectionHeader from 'apps/freezers/components/SectionHeader';
import {
  getDetailsInitialEndDate,
  getDetailsInitialStartDate,
} from 'apps/freezers/helpers';
import routes from 'apps/freezers/routes';
import { ReactComponent as DoorsopenIcon } from 'assets/icons/doorsopen-event.svg';
import { ReactComponent as LowtempIcon } from 'assets/icons/lowtemp-event.svg';
import { ReactComponent as OxygenIcon } from 'assets/icons/oxygen-event.svg';
import AccordionDetails from 'components/AccordionDetails';
import AccordionSummary from 'components/AccordionSummary';
import BackIconButton from 'components/buttons/BackIconButton';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import FormatDateTime from 'components/FormatDateTime';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { StaticAccordion } from 'components/StaticAccordion';
import useDateStateWithTimezone from 'hooks/useDateStateWithTimezone';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { freezerWarning } from 'styles/colours';
import PageIntro from './components/PageIntro';
import { useRetrieveSiteDetails } from './hooks/useRetrieveSiteDetails';

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const FreezerTitle = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const LastUpdatedText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
`;

const DateText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const FreezerCountText = styled(Typography)`
  font-weight: 500;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  display: inline;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const StyledDivider = styled(Divider)`
  min-height: ${(props) => props.theme.spacing(8)}px;
`;

interface RouteParams {
  siteId: string;
}

const SiteDetail = () => {
  const { t } = useTranslation();
  const { siteId } = useParams<RouteParams>();

  // NOTE: No default is supplied here.
  const [startDate, setStartDate] = useDateStateWithTimezone(() =>
    getDetailsInitialStartDate()
  );
  const [endDate, setEndDate] = useDateStateWithTimezone(() =>
    getDetailsInitialEndDate()
  );

  const updateStartAndEndDates = (
    startDatetime: moment.Moment,
    endDatetime: moment.Moment
  ) => {
    setStartDate(startDatetime);
    setEndDate(endDatetime);
  };

  const retrieveSiteDetails = useRetrieveSiteDetails({
    siteId,
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
  });

  const siteDetailsData = retrieveSiteDetails.data;

  const doesSiteHaveFreezers = !!siteDetailsData?.freezers?.length;

  return (
    <div>
      <PageIntroWrapper sticky>
        <PageIntro
          headerNavButton={<BackIconButton />}
          startDate={startDate}
          endDate={endDate}
          siteName={siteDetailsData?.siteName}
          isFetching={retrieveSiteDetails.isFetching}
          onDateRangeSubmit={updateStartAndEndDates}
        />
      </PageIntroWrapper>

      <TransitionLoadingSpinner in={retrieveSiteDetails.isFetching} />
      <TransitionErrorMessage
        in={!retrieveSiteDetails.isFetching && retrieveSiteDetails.isError}
      />

      <DefaultTransition
        in={!retrieveSiteDetails.isFetching && retrieveSiteDetails.isSuccess}
        unmountOnExit
      >
        <div>
          {!doesSiteHaveFreezers &&
          !retrieveSiteDetails.isFetching &&
          retrieveSiteDetails.isSuccess ? (
            <CloudIconMessage />
          ) : (
            <>
              <Box py={2} px={1}>
                <Grid container>
                  <Grid item xs={12}>
                    <FreezerCountText>
                      {t(
                        'ui.freezers.siteDetails.freezerCount',
                        '{{count}} Freezer',
                        {
                          count: siteDetailsData?.freezers?.length,
                        }
                      )}
                    </FreezerCountText>
                  </Grid>
                </Grid>
              </Box>
              <Grid container direction="row" alignItems="center" spacing={2}>
                {siteDetailsData?.freezers?.map((freezer) => {
                  return (
                    <Grid item xs={12} key={freezer.freezerId!}>
                      <StyledLink
                        to={generatePath(routes.freezers.detail, {
                          freezerId: freezer.assetId!,
                        })}
                      >
                        <StaticAccordion>
                          <AccordionSummary>
                            <Grid
                              container
                              alignItems="center"
                              spacing={0}
                              justify="space-between"
                            >
                              <Grid item>
                                <Grid
                                  container
                                  alignItems="center"
                                  spacing={1}
                                  justify="space-between"
                                >
                                  <Grid item>
                                    <FreezerTitle>
                                      {freezer.freezerName}
                                    </FreezerTitle>
                                  </Grid>
                                </Grid>
                              </Grid>

                              <Grid item>
                                <Grid
                                  container
                                  spacing={1}
                                  justify="space-between"
                                >
                                  <Grid item>
                                    <LastUpdatedText>
                                      {t(
                                        'ui.freezer.siteDetails.lastUpdated',
                                        'Last Updated'
                                      )}
                                      :
                                    </LastUpdatedText>
                                  </Grid>
                                  <Grid item>
                                    <DateText>
                                      <FormatDateTime
                                        date={freezer.lastUpdate}
                                      />
                                    </DateText>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container spacing={3}>
                              <Grid item xs={12} md>
                                <SectionHeader>
                                  {t(
                                    'ui.freezer.siteDetails.general',
                                    'General'
                                  )}
                                </SectionHeader>
                                <Grid container justify="space-between">
                                  <Grid item xs="auto">
                                    <EmphasizedValue
                                      value={freezer.cycleRunTime}
                                      valueType="time"
                                      label={t(
                                        'ui.freezer.siteDetails.general.runtime',
                                        'Cycle Run Time'
                                      )}
                                    />
                                  </Grid>
                                  <Grid item xs="auto">
                                    <EmphasizedValue
                                      value={freezer.cycleIdleTime}
                                      valueType="time"
                                      label={t(
                                        'ui.freezer.siteDetails.general.idletime',
                                        'Cycle Idle Time'
                                      )}
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <EmphasizedValue
                                      value={freezer.workingPercent}
                                      valueType="percentage"
                                      valueColor={freezerWarning}
                                      label={t(
                                        'ui.freezer.siteDetails.general.workingtime',
                                        'Working'
                                      )}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>

                              <Hidden smDown>
                                <Grid item xs="auto">
                                  <StyledDivider orientation="vertical" />
                                </Grid>
                              </Hidden>

                              <Hidden mdUp>
                                <Grid item xs={12}>
                                  <Divider />
                                </Grid>
                              </Hidden>

                              <Grid item xs={12} md>
                                <SectionHeader>
                                  {t('ui.freezer.siteDetails.Events', 'Events')}
                                </SectionHeader>
                                <Grid container justify="space-between">
                                  <Grid item xs="auto">
                                    <EmphasizedValue
                                      value={freezer.oxygenCount}
                                      icon={<OxygenIcon />}
                                      label={t(
                                        'ui.freezer.siteDetails.events.oxygen',
                                        'Oxygen'
                                      )}
                                    />
                                  </Grid>
                                  <Grid item xs="auto">
                                    <EmphasizedValue
                                      value={freezer.lowTemperatureCount}
                                      icon={<LowtempIcon />}
                                      label={t(
                                        'ui.freezer.siteDetails.events.lowTemperature',
                                        'Low Temp.'
                                      )}
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <EmphasizedValue
                                      value={freezer.doorsOpenCount}
                                      icon={<DoorsopenIcon />}
                                      label={t(
                                        'ui.freezer.siteDetails.events.doorsOpen',
                                        'Doors Open'
                                      )}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </StaticAccordion>
                      </StyledLink>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
        </div>
      </DefaultTransition>
    </div>
  );
};

export default SiteDetail;
