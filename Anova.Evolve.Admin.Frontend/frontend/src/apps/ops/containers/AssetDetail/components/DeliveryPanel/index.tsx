/* eslint-disable indent */
import Accordion from '@material-ui/core/Accordion';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  DataChannelDTO,
  QuickEditEventsDto,
  UserPermissionType,
} from 'api/admin/api';
import {
  StyledEditIcon,
  StyledExpandIcon,
} from 'apps/ops/components/icons/styles';
import { AssetDetailTab } from 'apps/ops/containers/AssetDetail/types';
import routes from 'apps/ops/routes';
import Button from 'components/Button';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import ComponentTitle from 'components/typography/ComponentTitle';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  generatePath,
  matchPath,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import { useGetLastKnownLocation } from '../../hooks/useGetLastKnownLocation';
import { StyledAccordionSummary } from '../../styles';
import DeliveryDrawer from '../DeliveryDrawer';
import EventsDrawer from '../EventsDrawerNewApi';
import ActiveEventRows from './components/ActiveEventRows';
import CustomAccordionSummary from './components/CustomAccordionSummary';
import EventRows from './components/EventRows';
import LastKnownLocation from './components/LastKnownLocation';
import RTURows from './components/RTURows';

const StyledDeliveryPanelAccordion = styled(Accordion)`
  width: inherit;
  height: 100%;
  && {
    border-radius: ${(props) =>
      `0 ${props.theme.shape.borderRadius}px ${props.theme.shape.borderRadius}px 0`};
  }
`;

const StyledClosedDeliveryPanelAccordionSummary = styled(
  StyledAccordionSummary
)`
  padding: 0;
  /* 
    Weird bug: paddingLeft is explicitly required since this
    same component is rendered twice
  */
  padding-left: 0;
  height: 100%;
  align-items: flex-start;
  border-radius: ${(props) =>
    `0 ${props.theme.shape.borderRadius}px ${props.theme.shape.borderRadius}px 0`};

  background-color: ${(props) =>
    props.theme.palette.type === 'light' && '#EBEBEB'};
  && .MuiTypography-root {
    color: ${(props) =>
      props.theme.palette.type === 'light' &&
      props.theme.palette.text.secondary};
  }
`;

const StyledExpandedDeliveryPanelAccordionSummary = styled(
  CustomAccordionSummary
)`
  border-radius: ${(props) => `0 ${props.theme.shape.borderRadius}px 0 0`};

  background-color: ${(props) =>
    props.theme.palette.type === 'light' && '#EBEBEB'};

  && .MuiTypography-root {
    color: ${(props) =>
      props.theme.palette.type === 'light' && props.theme.palette.text.primary};
  }
`;

const StyledWrapper = styled.div`
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: ${(props) =>
    props.theme.palette.type === 'light'
      ? 'rgb(88 88 88 / 20%) -2px 0px 20px 6px'
      : 'rgb(10 10 10 / 20%) -20px 0px 12px -10px'};
  border-radius: ${(props) =>
    `0 ${props.theme.shape.borderRadius}px ${props.theme.shape.borderRadius}px 0`};
`;

interface Props {
  assetId?: string;
  domainId?: string;
  isPublishedAsset?: boolean;
  publishedDomainName?: string | null;
  dataChannelResult: DataChannelDTO[];
  isDeliveryOpen: boolean;
  setIsDeliveryOpen: (isOpen: boolean) => void;
  gpsDataChannelId?: string;
  updateEventsOnAsset: (updatedDataChannels: QuickEditEventsDto[]) => void;
  setActiveTab: (tab: AssetDetailTab) => void;
  fetchRecords: () => void;
}

const DeliveryPanel = ({
  assetId,
  domainId,
  isPublishedAsset,
  publishedDomainName,
  dataChannelResult,
  isDeliveryOpen,
  setIsDeliveryOpen,
  gpsDataChannelId,
  updateEventsOnAsset,
  setActiveTab,
  fetchRecords,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const theme = useTheme();
  const isBelowMdBreakpoint = useMediaQuery(theme.breakpoints.down('md'));

  const hasPermission = useSelector(selectHasPermission);
  const canViewEvents = hasPermission(UserPermissionType.ViewTabEvents);
  const canReadEvents = hasPermission(
    UserPermissionType.DataChannelFullEditOfEvents,
    AccessType.Read
  );
  const canUpdateEvents = hasPermission(
    UserPermissionType.DataChannelFullEditOfEvents,
    AccessType.Update
  );

  const handleChange = () => {
    setIsDeliveryOpen(!isDeliveryOpen);
  };

  // Delivery Drawer
  const [isDeliveryDrawerOpen, setIsDeliveryDrawerOpen] = useState(false);

  const closeDeliveryDrawer = () => {
    setIsDeliveryDrawerOpen(false);
  };

  const doesMatchQuickEditEventsPath = !!matchPath(location.pathname, {
    path: routes.assetSummary.detailQuickEditEvents,
    exact: true,
    strict: false,
  });

  // Events Drawer
  const isEventDrawerOpen =
    doesMatchQuickEditEventsPath && (canReadEvents || canUpdateEvents);
  const closeEventDrawer = () => {
    // Use history.replace so the user doesn't have to constantly hit the back
    // button if they've open/closed the events drawer many times.
    history.replace(match.url);
  };
  const saveAndCloseEventsDrawer = (
    updatedDataChannels: QuickEditEventsDto[]
  ) => {
    closeEventDrawer();
    updateEventsOnAsset(updatedDataChannels);
  };

  const openEventDrawer = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (assetId) {
      const newPathname = generatePath(
        routes.assetSummary.detailQuickEditEvents,
        { assetId }
      );
      // See comment above in `closeEventDrawer` about using history.replace
      history.replace(newPathname);
    }
  };

  const getLastKnownLocationApi = useGetLastKnownLocation({
    dataChannelId: gpsDataChannelId,
  });

  const isFetchingLocation = getLastKnownLocationApi?.isFetching;
  const lastKnownLocation = getLastKnownLocationApi?.data;

  let activeEventsLength = 0;
  dataChannelResult.forEach((dc) => {
    dc.uomParams?.eventRules?.forEach((event) => {
      if (event.isActive) {
        activeEventsLength += 1;
      }
    });
  });

  return (
    <StyledWrapper
      style={{
        overflowY: isDeliveryOpen ? 'auto' : 'inherit',
      }}
    >
      {/* Delivery drawer */}
      <Drawer
        anchor="right"
        open={isDeliveryDrawerOpen}
        onClose={closeDeliveryDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <DeliveryDrawer closeDeliveryDrawer={closeDeliveryDrawer} />
        </DrawerContent>
      </Drawer>
      {/* Events drawer */}
      <Drawer
        anchor="right"
        open={isEventDrawerOpen}
        onClose={closeEventDrawer}
        variant="temporary"
        PaperProps={{
          style: {
            width: isBelowMdBreakpoint ? '100%' : 1150,
            maxWidth: isBelowMdBreakpoint ? '100%' : 1150,
          },
        }}
      >
        <Box px={4} pb={4}>
          {assetId && (
            <EventsDrawer
              assetId={assetId}
              domainId={domainId}
              cancelCallback={closeEventDrawer}
              saveAndExitCallback={saveAndCloseEventsDrawer}
              isPublishedAsset={isPublishedAsset}
              canUpdateEvents={canUpdateEvents}
            />
          )}
        </Box>
      </Drawer>
      <Grid
        container
        direction="column"
        style={{
          height: '100%',
        }}
      >
        <StyledDeliveryPanelAccordion
          elevation={0}
          defaultExpanded
          expanded={isDeliveryOpen}
          onChange={handleChange}
        >
          {!isDeliveryOpen ? (
            <StyledClosedDeliveryPanelAccordionSummary
              aria-controls="vertical-panel-content"
              id="vertical-panel-header"
            >
              <Grid
                container
                direction="column"
                spacing={1}
                alignItems="center"
                justify="center"
              >
                <Grid item>
                  <StyledExpandIcon
                    style={{
                      transform: 'rotate(270deg)',
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <ComponentTitle
                    style={{
                      writingMode: 'vertical-lr',
                      lineHeight: 0.8,
                    }}
                  >
                    {t('ui.assetdetail.eventsdelivery', 'Events & Delivery')}
                  </ComponentTitle>
                </Grid>
              </Grid>
            </StyledClosedDeliveryPanelAccordionSummary>
          ) : (
            // Fragments can't be used within `Accordion`
            <Box
              bgcolor="background.paper"
              style={{
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              {lastKnownLocation ? (
                <>
                  <StyledExpandedDeliveryPanelAccordionSummary
                    aria-controls="mobileassetlocation-panel-content"
                    id="mobileassetlocation-panel-header"
                    title={t(
                      'ui.assetdetail.mobileassetlocation',
                      'Last Known Location'
                    )}
                    showExpandIcon
                  />
                  <LastKnownLocation
                    lastKnownLocation={lastKnownLocation}
                    isFetchingLocation={isFetchingLocation}
                  />
                  <CustomAccordionSummary
                    aria-controls="rtu-panel-content"
                    id="rtu-panel-header"
                    title={t('ui.datachannel.datasource', 'Data Source')}
                    showExpandIcon
                  />
                  <RTURows
                    isPublishedAsset={isPublishedAsset}
                    publishedDomainName={publishedDomainName}
                    dataChannels={dataChannelResult}
                    fetchRecords={fetchRecords}
                  />
                </>
              ) : (
                <>
                  <StyledExpandedDeliveryPanelAccordionSummary
                    aria-controls="rtu-panel-content"
                    id="rtu-panel-header"
                    title={t('ui.datachannel.datasource', 'Data Source')}
                    showExpandIcon
                  />
                  <RTURows
                    isPublishedAsset={isPublishedAsset}
                    publishedDomainName={publishedDomainName}
                    dataChannels={dataChannelResult}
                    fetchRecords={fetchRecords}
                  />
                </>
              )}

              {canViewEvents && (
                <>
                  {activeEventsLength > 0 && (
                    <>
                      <CustomAccordionSummary
                        aria-controls="active-events-panel-content"
                        id="active-events-panel-header"
                        title={`${t(
                          'ui.common.active.events',
                          'Active Events'
                        )} (${activeEventsLength})`}
                        showExpandIcon
                      />
                      <ActiveEventRows
                        dataChannelResult={dataChannelResult}
                        setActiveTab={setActiveTab}
                      />
                    </>
                  )}

                  {(canReadEvents || canUpdateEvents) && (
                    <>
                      <CustomAccordionSummary
                        aria-controls="events-panel-content"
                        id="events-panel-header"
                        title={t('ui.common.events.profile', 'Event Profile')}
                        showExpandIcon
                        rightContent={
                          !isPublishedAsset && (
                            <Button onClick={openEventDrawer}>
                              <StyledEditIcon />
                            </Button>
                          )
                        }
                      />

                      <EventRows dataChannelResult={dataChannelResult} />
                    </>
                  )}
                </>
              )}

              {/* <ScheduledDeliveryRows dataChannelResult={dataChannelResult} /> */}
            </Box>
          )}
        </StyledDeliveryPanelAccordion>
      </Grid>
    </StyledWrapper>
  );
};
export default DeliveryPanel;
