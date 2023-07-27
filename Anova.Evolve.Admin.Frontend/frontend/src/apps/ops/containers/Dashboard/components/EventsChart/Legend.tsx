/* eslint-disable prefer-destructuring */
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { EventRuleType, EvolveHistoricalActiveEvent } from 'api/admin/api';
import { buildEventListLink } from 'apps/ops/utils/routes';
import Checkbox from 'components/forms/styled-fields/Checkbox';
import React, { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { lightDividerColor } from 'styles/colours';
import { Datum } from './Chart';

const Heading = styled(Typography)`
  font-weight: 500;
  font-size: 17px;
`;

const CompactListItemIcon = styled(ListItemIcon)`
  min-width: 36px;
`;

// XXX: this is a pixel-perfect hack that would ideally not be used.
const AlignedCheckbox = styled(Checkbox)``;

// this spicy type signature simply overrides the 'color' prop
type ColorIconProps = { color: string } & Omit<
  ComponentProps<typeof FiberManualRecordIcon>,
  'color'
>;
const ColorIcon = ({ color, ...props }: ColorIconProps) => (
  <FiberManualRecordIcon style={{ color }} {...props} />
);

type EventsLegendProps = {
  activeEvents: Record<string, boolean>;
  toggleEvent(eventName: string): void;
  latestDay?: Datum;
  eventsMapping: Record<string, EvolveHistoricalActiveEvent>;
  eventColorMapping: Record<string, string>;
  eventsTotalsMapping: Record<string, number>;
};

export const Legend = ({
  activeEvents,
  toggleEvent,
  eventsMapping,
  eventColorMapping,
  eventsTotalsMapping,
}: EventsLegendProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  const goToFilteredEventList = (eventRuleType: EventRuleType) => {
    history.push(
      buildEventListLink({
        eventTypes: [eventRuleType],
      })
    );
  };

  return (
    <Container>
      <Heading>
        {t('ui.common.currentActiveEvents', 'Current Active Events')}
      </Heading>
      <List>
        {Object.keys(eventsMapping).map((eventName, index, eventValues) => {
          const grandTotal = eventsTotalsMapping?.[eventName] ?? '';
          const isLast = index === eventValues.length - 1;
          const eventData = eventsMapping[eventName];

          return (
            <ListItem
              key={eventName}
              button
              disableGutters
              onClick={() => goToFilteredEventList(eventData.eventRuleTypeId!)}
              {...(!isLast && {
                style: { borderBottom: `1px solid ${lightDividerColor}` },
              })}
            >
              <CompactListItemIcon>
                <AlignedCheckbox
                  checked={!!activeEvents[eventName]}
                  onClick={(evt) => {
                    evt.stopPropagation();
                    toggleEvent(eventName);
                  }}
                  disableRipple
                />
              </CompactListItemIcon>
              <CompactListItemIcon>
                <ColorIcon color={eventColorMapping[eventName]} />
              </CompactListItemIcon>
              <ListItemText>{eventName}</ListItemText>
              <ListItemText style={{ textAlign: 'end', paddingRight: 8 }}>
                {!grandTotal ? 0 : grandTotal}
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
};
