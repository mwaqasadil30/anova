/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import { RtuDeviceCategory, UserPermissionType } from 'api/admin/api';
import adminRoutes, { RtuDeviceId } from 'apps/admin/routes';
import BackIconButton from 'components/buttons/BackIconButton';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, useParams } from 'react-router-dom';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import {
  selectHasPermission,
  selectCanAccessRtuHistoryTab,
} from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import CallHistoryTab from './components/CallHistoryTab';
import ConfigurationTabHorner from './components/ConfigurationTab';
import ConfigurationTabMetron from './components/ConfigurationTabMetron';
import PacketsTab from './components/PacketsTab';
import PageIntro from './components/PageIntro';
import TransactionDetailsTab from './components/TransactionDetailsTab';
import HistoryTab from './components/HistoryTab';
import { useGetRtuCategoryByRtuDeviceId } from './hooks/useGetRtuCategoryByRtuDeviceId';
import { RTUEditorTab } from './types';

// Styled component to allow setting up overflow: hidden on a parent to prevent
// the table from exceeding the height of the page. The key properties being
// `display: flex` and `height:100%` which allows the overflow: hidden to
// work properly.
const Wrapper = styled.div<{
  $topOffset: number;
  $isFullPageHeight?: boolean;
}>`
  ${(props) =>
    props.$topOffset &&
    `
    display: flex;
    flex-direction: column;
    ${
      props.$isFullPageHeight &&
      `
    height: calc(100vh - ${props.$topOffset}px - 16px);
    `
    }
  `};
`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  style?: any;
}

const overflowStyles = {
  // The `overflow: hidden` prevents making the whole page scrollable (only
  // the table). However, it prevents the box-shadow from showing up
  // which is why we have negative spacing to ensure the box shadow is
  // shown.
  overflow: 'hidden',
};

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rtu-editor-tabpanel-${index}`}
      aria-labelledby={`rtu-editor-tab-${index}`}
      {...other}
    >
      {value === index && <Box height="100%">{children}</Box>}
    </div>
  );
};

const StyledTabPanel = styled(TabPanel)`
  position: relative;
`;

interface RouteParams {
  [RtuDeviceId]: string;
  tabName?: string;
}

const RTUEditor = () => {
  const params = useParams<RouteParams>();

  const hasPermission = useSelector(selectHasPermission);
  const canUpdateRTUHornerEditor = hasPermission(
    UserPermissionType.RTUHornerEditor,
    AccessType.Update
  );

  const canUpdateRTUMetronEditor = hasPermission(
    UserPermissionType.RTUMetron2Editor,
    AccessType.Update
  );

  const [activeTab, setActiveTab] = useState(
    (params.tabName as RTUEditorTab) || RTUEditorTab.PacketsAndCallHistory
  );
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: unknown) => {
    setActiveTab(newValue as RTUEditorTab);
  };

  const topOffset = useSelector(selectTopOffset);

  const getRtuCategoryByRtuDeviceIdApi = useGetRtuCategoryByRtuDeviceId(
    params.rtuDeviceId
  );

  const rtuCategoryApiData = getRtuCategoryByRtuDeviceIdApi.data;

  const isModbusRtu = rtuCategoryApiData === RtuDeviceCategory.Modbus;
  const isMetron2Rtu = rtuCategoryApiData === RtuDeviceCategory.Metron2;
  const isHornerRtu = rtuCategoryApiData === RtuDeviceCategory.Horner;
  const is400SeriesRtu =
    rtuCategoryApiData === RtuDeviceCategory.FourHundredSeries;
  const isFileRtu = rtuCategoryApiData === RtuDeviceCategory.File;
  const isSmsRtu = rtuCategoryApiData === RtuDeviceCategory.SMS;

  // NOTE/TODO: Add permission/rtuCategory checks here for new RTUs that can be
  // accessed in the rtu editor.
  const canAccessPacketsAndCallHistoryTab =
    is400SeriesRtu ||
    isFileRtu ||
    isSmsRtu ||
    isMetron2Rtu ||
    isHornerRtu ||
    isModbusRtu;

  const canAccessConfigurationTab = isHornerRtu || isMetron2Rtu;
  const canAccessTransactionDetailsTab = isHornerRtu;

  const canAccessRtuHistoryTab = useSelector(selectCanAccessRtuHistoryTab);

  const canUpdateRtu = () => {
    if (isHornerRtu) {
      return canUpdateRTUHornerEditor;
    }
    if (isMetron2Rtu) {
      return canUpdateRTUMetronEditor;
    }
    return false;
  };

  const { isLoading, isError } = getRtuCategoryByRtuDeviceIdApi;

  if (isLoading || isError) {
    return (
      <>
        <Box mt={3}>
          <TransitionLoadingSpinner in={isLoading} />
          <TransitionErrorMessage in={!isLoading && isError} />
        </Box>
      </>
    );
  }

  return (
    <Wrapper
      $topOffset={topOffset}
      $isFullPageHeight={activeTab === RTUEditorTab.PacketsAndCallHistory}
    >
      <Route exact path={adminRoutes.rtuManager.edit}>
        <PageIntroWrapper
          sticky
          topOffset={topOffset}
          divider={null}
          verticalPaddingFactor={0}
          zIndex={4}
        >
          <PageIntro
            headerNavButton={<BackIconButton />}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            rtuDeviceId={params.rtuDeviceId}
            rtuTypeId={rtuCategoryApiData}
          />
        </PageIntroWrapper>

        {canAccessPacketsAndCallHistoryTab && (
          <TabPanel
            value={activeTab}
            index={RTUEditorTab.PacketsAndCallHistory}
            style={
              activeTab === RTUEditorTab.PacketsAndCallHistory
                ? {
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    ...overflowStyles,
                  }
                : {}
            }
          >
            {isMetron2Rtu || isHornerRtu || isModbusRtu ? (
              <CallHistoryTab rtuDeviceId={params.rtuDeviceId} />
            ) : (
              <PacketsTab rtuDeviceId={params.rtuDeviceId} />
            )}
          </TabPanel>
        )}

        {/* 
            TODO: 
            The configuration tab will slowly add more RtuTypes and so
            those new editable Rtu types should be added here until they are all
            editable with the configuration tab.
          */}
        {canAccessConfigurationTab && (
          <StyledTabPanel
            value={activeTab}
            index={RTUEditorTab.Configuration}
            style={
              activeTab === RTUEditorTab.Configuration
                ? {
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                  }
                : {}
            }
          >
            {isHornerRtu && (
              <ConfigurationTabHorner
                rtuDeviceId={params.rtuDeviceId}
                canUpdateRtu={canUpdateRtu()}
              />
            )}
            {isMetron2Rtu && (
              <ConfigurationTabMetron
                rtuDeviceId={params.rtuDeviceId}
                canUpdateRtu={canUpdateRtu()}
              />
            )}
          </StyledTabPanel>
        )}

        {canAccessTransactionDetailsTab && (
          <StyledTabPanel
            value={activeTab}
            index={RTUEditorTab.TransactionDetails}
            style={
              activeTab === RTUEditorTab.TransactionDetails
                ? {
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                  }
                : {}
            }
          >
            <TransactionDetailsTab rtuDeviceId={params.rtuDeviceId} />
          </StyledTabPanel>
        )}

        {canAccessRtuHistoryTab && (
          <StyledTabPanel
            value={activeTab}
            index={RTUEditorTab.History}
            style={
              activeTab === RTUEditorTab.History
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
        )}
      </Route>
    </Wrapper>
  );
};
export default RTUEditor;
