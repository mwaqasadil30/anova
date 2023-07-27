/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import {
  DataChannelDTO,
  EventRuleModel,
  EventRuleCategory,
} from 'api/admin/api';
import { getReadingValueDisplayText } from 'apps/ops/containers/AssetDetail/helpers';
import {
  StyledAccordionDetails,
  StyledAlertDetails,
  ThinSeparatorWrapper,
} from 'apps/ops/containers/AssetDetail/styles';
import MajorText from 'components/typography/MajorText';
import MinorText from 'components/typography/MinorText';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { formatCalendarDate } from 'utils/format/dates';
import {
  getDataChannelDTODescription,
  renderImportance,
} from 'utils/ui/helpers';
import { AssetDetailTab } from 'apps/ops/containers/AssetDetail/types';

const LargeIconWrapper = styled.span`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const StyledMajorText = styled(MajorText)`
  && {
    font-weight: 600;
  }
`;
const StyledMinorText = styled(MinorText)`
  & {
    color: ${(props) => props.theme.palette.text.primary};
  }
`;

interface Props {
  dataChannelResult: DataChannelDTO[];
  setActiveTab: (tab: AssetDetailTab) => void;
}

const ActiveEventRows = ({ dataChannelResult, setActiveTab }: Props) => {
  const { t } = useTranslation();

  const dataChannelsWithEnabledEvents = dataChannelResult.filter(
    (dataChannel) => dataChannel.uomParams?.eventRules?.length
  );
  const renderRows = (
    dataChannel: DataChannelDTO,
    enabledEvents: EventRuleModel[] | undefined | null
  ) => (
    <Fragment key={dataChannel.dataChannelId!}>
      {enabledEvents
        ?.filter((ev) => ev.isActive)
        .map((event) => {
          const importanceIcon = renderImportance(event.importanceLevel, {
            allowColorOverride: true,
          });

          const configurationAriaLabel = [
            event.description,
            'event configuration',
          ]
            .filter(Boolean)
            .join(' ');

          const eventImportance = event.isActive ? event.importanceLevel : null;

          const formattedCalendarDate = formatCalendarDate(
            dataChannel.latestReadingTimestamp
          );

          return (
            <StyledAlertDetails
              key={event.dataChannelEventRuleId!}
              $importance={eventImportance}
              onClick={() => {
                setActiveTab(AssetDetailTab.Events);
              }}
              $inventoryStatus={event.inventoryStatus}
              $hasMissingData={
                event.eventRuleType === EventRuleCategory.MissingData
              }
            >
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                spacing={1}
              >
                <Grid item container justify="center" xs={3}>
                  <LargeIconWrapper>
                    {event.isActive && importanceIcon}
                  </LargeIconWrapper>
                </Grid>
                <Grid item xs={9}>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={0}
                  >
                    <Grid item xs={12}>
                      <StyledMajorText aria-label="Event description">
                        {event?.description}
                      </StyledMajorText>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledMinorText>
                        {getDataChannelDTODescription(dataChannel)}
                      </StyledMinorText>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledMinorText noWrap title={formattedCalendarDate}>
                        {formattedCalendarDate}
                      </StyledMinorText>
                    </Grid>
                    {event.eventRuleType !== EventRuleCategory.MissingData && (
                      <Grid item xs={12}>
                        <StyledMinorText aria-label={configurationAriaLabel}>
                          {getReadingValueDisplayText(dataChannel)}
                        </StyledMinorText>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </StyledAlertDetails>
          );
        })}
    </Fragment>
  );

  return (
    <div aria-label="Active events accordion details">
      {dataChannelsWithEnabledEvents.length > 0 ? (
        <ThinSeparatorWrapper>
          {dataChannelsWithEnabledEvents.map((dataChannel: DataChannelDTO) =>
            renderRows(dataChannel, dataChannel.uomParams?.eventRules)
          )}
        </ThinSeparatorWrapper>
      ) : (
        <StyledAccordionDetails>
          <MinorText>
            {t('ui.assetdetail.noActiveEvents', 'No active events')}
          </MinorText>
        </StyledAccordionDetails>
      )}
    </div>
  );
};
export default ActiveEventRows;
