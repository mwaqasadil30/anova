/* eslint-disable indent, react/jsx-indent */
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelEventRulesDTO,
  DataChannelReportDTO,
  RtuPriorityLevelTypeEnum,
  UnitConversionModeEnum,
  UserPermissionType,
} from 'api/admin/api';
import adminRoutes from 'apps/admin/routes';
import AccordionDetails from 'components/AccordionDetails';
import Button from 'components/Button';
import { StaticAccordion } from 'components/StaticAccordion';
import { IS_DATA_CHANNEL_EVENTS_EDIT_FEATURE_ENABLED } from 'env';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router';
import { selectIsActiveDomainApciEnabled } from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import {
  BoxTitle,
  StyledAccordionSummary,
  StyledExpandCaret,
} from '../../styles';
import InventoryEventsTable from './components/InventoryEventsTable';
import MissingDataEventTable from './components/MissingDataEventTable';
import ScheduledDeliveryEventsTable from './components/ScheduledDeliveryEventsTable';
import UsageRateEventTable from './components/UsageRateEventTable';

const StyledAccordionDetails = styled(AccordionDetails)`
  padding: 16px;
`;

const StyledEventEditButton = styled(Button)`
  height: 28px;
`;

const StyledEventGroupTitleText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
`;

const StyledEmptyEventRuleGroupText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 500;
`;

const StyledEventButtonText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 400;
`;

const StyledEventGroupText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 500;
`;

const StyledEmptyEventRulesText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 400;
`;

interface Props {
  dataChannelDetails: DataChannelReportDTO | null | undefined;
  eventsApiData?: DataChannelEventRulesDTO | undefined;
  canUpdateDataChannel?: boolean;
}

const EventsPanel = ({
  canUpdateDataChannel,
  dataChannelDetails,
  eventsApiData,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const hasPermission = useSelector(selectHasPermission);
  const canUpdateEvents = hasPermission(
    UserPermissionType.DataChannelFullEditOfEvents,
    AccessType.Update
  );

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  const dataChannelEventsApiData = eventsApiData;

  const inventoryEvents = dataChannelEventsApiData?.inventoryEvents;
  const levelEvents = dataChannelEventsApiData?.levelEvents;
  const scheduledDeliveryEvents =
    dataChannelEventsApiData?.deliveryScheduleEvents;
  const usageRateEvent = dataChannelEventsApiData?.usageRateEvent;
  const missingDataEvent = dataChannelEventsApiData?.missingDataEvent;

  const goToEventEditor = (event: React.MouseEvent) => {
    event.stopPropagation();
    history.push(
      generatePath(adminRoutes.dataChannelManager.eventEdit, {
        dataChannelId: dataChannelDetails?.dataChannelId!,
      })
    );
  };

  const getFormattedScaledUnitsText = () => {
    const isBasicTank =
      dataChannelDetails?.tankSetupInfo?.unitConversionModeId ===
      UnitConversionModeEnum.Basic;
    const isSimplifiedTank =
      dataChannelDetails?.tankSetupInfo?.unitConversionModeId ===
      UnitConversionModeEnum.SimplifiedVolumetric;
    const isVolumetricTank =
      dataChannelDetails?.tankSetupInfo?.unitConversionModeId ===
      UnitConversionModeEnum.Volumetric;

    if (isBasicTank) {
      return `(${dataChannelDetails?.sensorCalibration?.scaledUnitsAsText})`;
    }
    if (isSimplifiedTank) {
      return `(${dataChannelDetails?.tankSetupInfo?.simplifiedTankSetupInfo?.displayUnitsAsText})`;
    }
    if (isVolumetricTank) {
      return `(${dataChannelDetails?.tankSetupInfo?.volumetricTankSetupInfo?.displayUnitsAsText})`;
    }
    return '';
  };
  const formattedScaledUnitsText = getFormattedScaledUnitsText();

  const hasEvents =
    !!inventoryEvents?.length ||
    !!levelEvents?.length ||
    !!scheduledDeliveryEvents?.length ||
    !!usageRateEvent ||
    !!missingDataEvent;

  const defaultSetpointList = ['-'];

  const levelSetpointList = dataChannelEventsApiData?.setpointSelectionLists
    ?.levelSetpoints?.length
    ? defaultSetpointList.concat(
        dataChannelEventsApiData?.setpointSelectionLists?.levelSetpoints
      )
    : defaultSetpointList;

  const localSetpointList = dataChannelEventsApiData?.setpointSelectionLists
    ?.localSetpoints?.length
    ? dataChannelEventsApiData?.setpointSelectionLists?.localSetpoints
    : [];

  const combinedSelectableLevelAndLocalSetpointList = levelSetpointList.concat(
    localSetpointList
  );

  const usageRateSetpointList = dataChannelEventsApiData?.setpointSelectionLists
    ?.usageRateSetpoints?.length
    ? defaultSetpointList.concat(
        dataChannelEventsApiData?.setpointSelectionLists?.usageRateSetpoints
      )
    : defaultSetpointList;

  const canAccessEventEditor =
    canUpdateDataChannel &&
    canUpdateEvents &&
    IS_DATA_CHANNEL_EVENTS_EDIT_FEATURE_ENABLED;

  const isMaster =
    dataChannelDetails?.dataSourceInfo?.rtuDataSourceTypeInfo
      ?.rtuPriorityLevelTypeId === RtuPriorityLevelTypeEnum.Master;

  return (
    <>
      <Grid item xs={12}>
        <StaticAccordion>
          <StyledAccordionSummary>
            <Grid container alignItems="center" justify="space-between">
              <Grid item>
                <BoxTitle>{t('ui.common.events', 'Events')}</BoxTitle>
              </Grid>

              {canAccessEventEditor && (
                <Grid item>
                  <StyledEventEditButton
                    onClick={goToEventEditor}
                    aria-label="Event editor"
                  >
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <StyledEventButtonText>
                          {t(
                            'ui.dataChannelEditor.openEventEditor',
                            'Open Event Editor'
                          )}
                        </StyledEventButtonText>
                      </Grid>
                      <Grid item style={{ paddingTop: '2px' }}>
                        <StyledExpandCaret
                          style={{
                            transform: 'rotate(270deg)',
                          }}
                        />
                      </Grid>
                    </Grid>
                  </StyledEventEditButton>
                </Grid>
              )}
            </Grid>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Grid container direction="column">
                  <Grid item>
                    <StyledEventGroupTitleText>
                      {t('ui.common.eventrulegroup', 'Event Rule Group')}
                    </StyledEventGroupTitleText>
                  </Grid>
                  <Grid item>
                    {dataChannelEventsApiData?.eventRuleGroupAsText ? (
                      <StyledEventGroupText>
                        {dataChannelEventsApiData?.eventRuleGroupAsText}
                      </StyledEventGroupText>
                    ) : (
                      <StyledEmptyEventRuleGroupText>
                        {t('ui.common.notSelected', 'Not Selected')}
                      </StyledEmptyEventRuleGroupText>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              {/* 
                Only show the "no event rules..." text if there are no events 
                AND there is an event rule group, otherwise, if there is an
                event group, AND there are events, show the events.
              */}
              {!hasEvents && dataChannelEventsApiData?.eventRuleGroupAsText ? (
                <Grid item xs={12}>
                  <StyledEmptyEventRulesText>
                    {t(
                      'ui.datachannel.noEventRulesConfiguredForDataChannelType',
                      'No event rules configured for this Data Channel Type'
                    )}
                  </StyledEmptyEventRulesText>
                </Grid>
              ) : (
                <>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <InventoryEventsTable
                        inventoryEvents={inventoryEvents}
                        levelEvents={levelEvents}
                        isAirProductsEnabledDomain={isAirProductsEnabledDomain}
                        formattedScaledUnitsText={formattedScaledUnitsText}
                        setpointList={
                          combinedSelectableLevelAndLocalSetpointList
                        }
                        isMaster={isMaster}
                      />

                      <UsageRateEventTable
                        event={usageRateEvent}
                        isAirProductsEnabledDomain={isAirProductsEnabledDomain}
                        formattedScaledUnitsText={formattedScaledUnitsText}
                        setpointList={usageRateSetpointList}
                        isMaster={isMaster}
                      />

                      <ScheduledDeliveryEventsTable
                        event={scheduledDeliveryEvents}
                      />

                      <MissingDataEventTable
                        event={missingDataEvent}
                        isAirProductsEnabledDomain={isAirProductsEnabledDomain}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </StyledAccordionDetails>
        </StaticAccordion>
      </Grid>
    </>
  );
};

export default EventsPanel;
