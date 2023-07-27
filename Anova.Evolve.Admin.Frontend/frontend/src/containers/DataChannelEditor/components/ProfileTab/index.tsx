/* eslint-disable indent */

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelReportDTO,
  DomainIntegrationProfileId,
  UserPermissionType,
} from 'api/admin/api';
import adminRoutes from 'apps/admin/routes';
import { ReactComponent as WarningTriangle } from 'assets/icons/warning-triangle.svg';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import FormatDateTime from 'components/FormatDateTime';
import { useGetDataChannelEventsByDataChannelId } from 'containers/DataChannelEditor/hooks/useGetDataChannelEventsByDataChannelId';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory, useLocation } from 'react-router';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import {
  DataChannelEditorLocationState,
  DataChannelEditorTab,
} from '../../types';
import DigitalSensorCalibrationPanel from './components/DigitalSensorCalibrationPanel';
import EventsPanel from './components/EventsPanel';
import ForecastAndDeliveryParametersPanel from './components/ForecastAndDeliveryParametersPanel';
import GeneralInformationPanel from './components/GeneralInformationPanel';
import IntegrationProfilePanel from './components/IntegrationProfilePanel';
import IntegrationProfilePanelWithTable from './components/IntegrationProfilePanelWithTable';
import TankAndSensorConfigurationPanel from './components/TankAndSensorConfigurationPanel';

const StyledLabelText = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
`;

const StyledValueText = styled(Typography)`
  font-size: 14px;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const StyledWarningTriangleIcon = styled(WarningTriangle)`
  height: 20px;
  width: 20px;
  margin: 3px 0 -3px 0;
`;

const StyledDialogMessageText = styled(Typography)`
  font-size: 14px;
`;

interface Props {
  dataChannelDetails?: DataChannelReportDTO | null;
  setShouldSubmitEventForm: (data: boolean) => void;
}

const ProfileTab = ({
  dataChannelDetails,
  setShouldSubmitEventForm,
}: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();

  const hasPermission = useSelector(selectHasPermission);
  const canUpdateDataChannel = hasPermission(
    UserPermissionType.DataChannelGlobal,
    AccessType.Update
  );

  const canViewEvents = hasPermission(UserPermissionType.ViewTabEvents);
  const canReadEvents = hasPermission(
    UserPermissionType.DataChannelFullEditOfEvents,
    AccessType.Read
  );
  const canUpdateEvents = hasPermission(
    UserPermissionType.DataChannelFullEditOfEvents,
    AccessType.Update
  );

  // Keep track of the currently selected tab in the location state
  useEffect(() => {
    history.replace(location.pathname, {
      tab: DataChannelEditorTab.Profile,
    } as DataChannelEditorLocationState);
  }, []);

  const isNonAirProductsIntegration =
    dataChannelDetails?.integrationInfo?.domainIntegrationProfileTypeId ===
    DomainIntegrationProfileId.Default;
  const isAirProductsIntegration =
    dataChannelDetails?.integrationInfo?.domainIntegrationProfileTypeId ===
    DomainIntegrationProfileId.APCI;

  const hasLastUpdatedByInfo =
    dataChannelDetails?.lastUpdatedDate &&
    dataChannelDetails?.lastUpdateUserName;
  const hasCreatedByInfo =
    dataChannelDetails?.createdDate && dataChannelDetails?.createdByName;

  const getDataChannelEventsApi = useGetDataChannelEventsByDataChannelId(
    dataChannelDetails?.dataChannelId!
  );

  const dataChannelEventsApiData = getDataChannelEventsApi?.data;

  const inventoryEvents = dataChannelEventsApiData?.inventoryEvents;
  const levelEvents = dataChannelEventsApiData?.levelEvents;
  const scheduledDeliveryEvents =
    dataChannelEventsApiData?.deliveryScheduleEvents;
  const usageRateEvent = dataChannelEventsApiData?.usageRateEvent;
  const missingDataEvent = dataChannelEventsApiData?.missingDataEvent;

  const hasEvents =
    !!inventoryEvents?.length ||
    !!levelEvents?.length ||
    !!scheduledDeliveryEvents?.length ||
    !!usageRateEvent ||
    !!missingDataEvent;

  // Event editor warning confirmation dialog
  const [
    isEventEditorWarningDialogOpen,
    setEventEditorWarningDialogOpen,
  ] = useState(false);
  const openEventEditorWarningDialog = () => {
    if (hasEvents && canViewEvents && (canReadEvents || canUpdateEvents)) {
      setEventEditorWarningDialogOpen(true);
    }
  };
  const closeEventEditorWarningDialog = () => {
    setEventEditorWarningDialogOpen(false);
    if (hasEvents && canViewEvents && (canReadEvents || canUpdateEvents)) {
      history.push(
        generatePath(adminRoutes.dataChannelManager.eventEdit, {
          dataChannelId: dataChannelDetails?.dataChannelId!,
        })
      );
      // Set the state to let the event editor page to programatically submit
      // its form to show the user if there are any validation errors.
      setShouldSubmitEventForm(true);
    }
  };

  return (
    <Box mt={3}>
      <UpdatedConfirmationDialog
        maxWidth="xs"
        open={isEventEditorWarningDialogOpen}
        onConfirm={closeEventEditorWarningDialog}
        mainTitle={
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <StyledWarningTriangleIcon />
            </Grid>
            <Grid item>
              {t(
                'ui.dataChannelEditor.pleaseReviewEventRules',
                'Please review event rules'
              )}
            </Grid>
          </Grid>
        }
        content={
          <StyledDialogMessageText align="center">
            {t(
              'ui.dataChannelEditor.eventEditorWarningMessage',
              'You have made changes that could invalidate the existing event rule values. You will now be presented with the Event Edit view to review and correct event rules.'
            )}
          </StyledDialogMessageText>
        }
        hideCancelButton
      />

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <GeneralInformationPanel
            dataChannelDetails={dataChannelDetails}
            canUpdateDataChannel={canUpdateDataChannel}
          />
        </Grid>

        {dataChannelDetails?.sensorCalibration && (
          <Grid item xs={12}>
            <TankAndSensorConfigurationPanel
              dataChannelDetails={dataChannelDetails}
              sensorCalibration={dataChannelDetails?.sensorCalibration}
              canUpdateDataChannel={canUpdateDataChannel}
              dataChannelId={dataChannelDetails?.dataChannelId}
              tankType={dataChannelDetails?.tankSetupInfo?.unitConversionModeId}
              openEventEditorWarningDialog={openEventEditorWarningDialog}
            />
          </Grid>
        )}

        {dataChannelDetails?.digitalInputSensorCalibration && (
          <Grid item xs={12}>
            <DigitalSensorCalibrationPanel
              dataChannelDetails={dataChannelDetails}
              openEventEditorWarningDialog={openEventEditorWarningDialog}
              digitalInputSensorCalibration={
                dataChannelDetails?.digitalInputSensorCalibration
              }
              canUpdateDataChannel={canUpdateDataChannel}
            />
          </Grid>
        )}

        {dataChannelDetails?.forecastDeliveryInfo && (
          <Grid item xs={12}>
            <ForecastAndDeliveryParametersPanel
              canUpdateDataChannel={canUpdateDataChannel}
              dataChannelDetails={dataChannelDetails}
            />
          </Grid>
        )}

        {isNonAirProductsIntegration &&
          dataChannelDetails?.integrationInfo?.integration && (
            <>
              <Grid item xs={12}>
                {/* Non-airProducts integration profile panel */}
                <IntegrationProfilePanelWithTable
                  dataChannelDetails={dataChannelDetails}
                  integrationInfo={dataChannelDetails?.integrationInfo}
                  canUpdateDataChannel={canUpdateDataChannel}
                />
              </Grid>
            </>
          )}

        {isAirProductsIntegration && (
          <Grid item xs={12}>
            {/* AirProducts (APCI) customIntegration1 profile panel */}
            <IntegrationProfilePanel
              dataChannelDetails={dataChannelDetails}
              integrationInfo={dataChannelDetails?.integrationInfo}
              canUpdateDataChannel={canUpdateDataChannel}
            />
          </Grid>
        )}

        {canViewEvents && (canReadEvents || canUpdateEvents) && (
          <Grid item xs={12}>
            <EventsPanel
              dataChannelDetails={dataChannelDetails}
              eventsApiData={dataChannelEventsApiData}
              canUpdateDataChannel={canUpdateDataChannel}
            />
          </Grid>
        )}

        {(hasLastUpdatedByInfo || hasCreatedByInfo) && (
          <Grid item xs={12}>
            <Grid container spacing={1}>
              {hasLastUpdatedByInfo && (
                <Grid item xs={12}>
                  <Grid container spacing={1} justify="flex-end">
                    <Grid item>
                      <StyledLabelText>
                        {t('ui.common.lastUpdated', 'Last Updated')}:
                      </StyledLabelText>
                    </Grid>
                    <Grid item>
                      <StyledValueText>
                        <FormatDateTime
                          date={dataChannelDetails?.lastUpdatedDate}
                        />{' '}
                        {t('ui.common.lowercaseBy', 'by')}{' '}
                        {dataChannelDetails?.lastUpdateUserName}
                      </StyledValueText>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {hasCreatedByInfo && (
                <Grid item xs={12}>
                  <Grid container spacing={1} justify="flex-end">
                    <Grid item>
                      <StyledLabelText>
                        {t('ui.common.created', 'Created')}:
                      </StyledLabelText>
                    </Grid>
                    <Grid item>
                      <StyledValueText>
                        <FormatDateTime
                          date={dataChannelDetails?.createdDate}
                        />{' '}
                        {t('ui.common.lowercaseBy', 'by')}{' '}
                        {dataChannelDetails?.createdByName}
                      </StyledValueText>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ProfileTab;
