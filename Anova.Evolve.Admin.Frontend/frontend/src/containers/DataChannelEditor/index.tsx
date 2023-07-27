/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import adminRoutes from 'apps/admin/routes';
import BackIconButton from 'components/buttons/BackIconButton';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import GenericPageWrapper from 'components/GenericPageWrapper';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import DataChannelEventEditor from 'containers/DataChannelEventEditor';
import { IS_DATA_CHANNEL_EVENTS_EDIT_FEATURE_ENABLED } from 'env';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, useLocation, useParams } from 'react-router-dom';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import HistoryTab from './components/HistoryTab';
import PageIntro from './components/PageIntro';
import ProfileTab from './components/ProfileTab';
import { useGetDataChannelDetailsById } from './hooks/useGetDataChannelDetails';
import { DataChannelEditorTab } from './types';

const overflowStyles = {
  // The `overflow: hidden` prevents making the whole page scrollable (only
  // the table). However, it prevents the box-shadow from showing up
  // which is why we have negative spacing to ensure the box shadow is
  // shown.
  overflow: 'hidden',
  paddingLeft: 8,
  paddingRight: 8,
  marginLeft: -8,
  marginRight: 8,
};

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`datachannel-editor-tabpanel-${index}`}
      aria-labelledby={`datachannel-editor-tab-${index}`}
      {...other}
    >
      {value === index && <Box height="100%">{children}</Box>}
    </div>
  );
};
const StyledTabPanel = styled(TabPanel)`
  position: relative;
`;

interface LocationState {
  tab: DataChannelEditorTab;
  selectedDataChannelIdsForEventsTable?: string[];
  selectedDataChannelIdsForForecastTable?: string[];
  selectedDataChannelIdsForHistoryTable?: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  style?: any;
}

interface RouteParams {
  dataChannelId: string;
}

const DataChannelEditor = () => {
  const location = useLocation<LocationState | undefined>();
  const params = useParams<RouteParams>();

  // TODO: Use permissions
  // const hasPermission = useSelector(selectHasPermission);

  const [shouldSubmitEventForm, setShouldSubmitEventForm] = useState(false);
  const [activeTab, setActiveTab] = useState(
    location.state?.tab || DataChannelEditorTab.Profile
  );
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: unknown) => {
    setActiveTab(newValue as DataChannelEditorTab);
  };

  const getApi = useGetDataChannelDetailsById(params.dataChannelId);

  // // Redirect away from the current tab if the user doesn't have permission to
  // // view the tab
  // // TODO: Is this needed for the data channel editor?
  // useEffect(() => {
  //   if (
  //     (activeTab === DataChannelEditorTab.Profile && !canViewProfile) ||
  //     (activeTab === DataChannelEditorTab.History && !canViewHistory)
  //   ) {
  //     setActiveTab(DataChannelEditorTab.Profile);
  //   }
  // }, [activeTab, canViewProfile, canViewHistory]);

  const topOffset = useSelector(selectTopOffset);

  return (
    <GenericPageWrapper
      $topOffset={topOffset}
      $isFullPageHeight={activeTab !== DataChannelEditorTab.Profile}
    >
      <TransitionLoadingSpinner in={getApi.isLoading} />
      <TransitionErrorMessage in={!getApi.isLoading && getApi.isError} />

      <DefaultTransition
        in={!getApi.isLoading && getApi.isSuccess}
        unmountOnExit
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Box height="100%">
          {!getApi.isLoading && getApi.isSuccess && (
            <>
              <Route exact path={adminRoutes.dataChannelManager.edit}>
                <PageIntroWrapper
                  sticky
                  topOffset={topOffset}
                  divider={null}
                  verticalPaddingFactor={0}
                  zIndex={4}
                >
                  <PageIntro
                    dataChannelDetails={getApi.data}
                    headerNavButton={<BackIconButton />}
                    activeTab={activeTab}
                    handleTabChange={handleTabChange}
                  />
                </PageIntroWrapper>

                {/* TODO: Do we need permissions on this tab? */}
                <TabPanel
                  value={activeTab}
                  index={DataChannelEditorTab.Profile}
                >
                  <ProfileTab
                    dataChannelDetails={getApi.data}
                    setShouldSubmitEventForm={setShouldSubmitEventForm}
                  />
                </TabPanel>

                {/* TODO: Do we need permissions on this tab? */}
                <StyledTabPanel
                  value={activeTab}
                  index={DataChannelEditorTab.History}
                  style={
                    activeTab === DataChannelEditorTab.History
                      ? {
                          display: 'flex',
                          flexDirection: 'column',
                          flexGrow: 1,
                          ...overflowStyles,
                        }
                      : {}
                  }
                >
                  <HistoryTab />
                </StyledTabPanel>
              </Route>
              {IS_DATA_CHANNEL_EVENTS_EDIT_FEATURE_ENABLED && (
                <Route path={adminRoutes.dataChannelManager.eventEdit}>
                  <DataChannelEventEditor
                    dataChannelDetails={getApi.data}
                    shouldSubmitEventForm={shouldSubmitEventForm}
                    setShouldSubmitEventForm={setShouldSubmitEventForm}
                  />
                </Route>
              )}
            </>
          )}
        </Box>
      </DefaultTransition>
    </GenericPageWrapper>
  );
};
export default DataChannelEditor;
