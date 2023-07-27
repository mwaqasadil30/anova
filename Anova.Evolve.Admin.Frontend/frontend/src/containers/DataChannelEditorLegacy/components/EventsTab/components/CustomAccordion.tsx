import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  EditDataChannelOptions,
  EventRuleType,
  EvolveDataChannelEventsInfo,
  EvolveRosterInfo,
} from 'api/admin/api';
import { ReactComponent as AccordionCaretIcon } from 'assets/icons/accordion-caret.svg';
import DrawerContent from 'components/drawers/DrawerContent';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import { AccordionEventType } from 'containers/DataChannelEditorLegacy/types';
import { FormikProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { boxBackgroundGrey } from 'styles/colours';
import { DCEditorEventRule, Values } from '../../ObjectForm/types';
import EventRuleEditor from './EventRuleEditor';
import LevelEventRuleBox from './LevelEventRule';
import MissingDataEventRuleBox from './MissingDataEventRule';
import ScheduledDeliveryEventRuleBox from './ScheduledDeliveryEventRule';
import UsageRateRuleBox from './UsageRateEventRule';

const getEventGroupFieldNameForEvent = (eventRule: DCEditorEventRule) => {
  switch (eventRule.eventRuleType) {
    case EventRuleType.Level:
      return 'levelEventRules';
    case EventRuleType.UsageRate:
      return 'usageRateEventRules';
    case EventRuleType.MissingData:
      return 'missingDataEventRules';
    case EventRuleType.ScheduledDeliveryMissed:
    case EventRuleType.ScheduledDeliveryTooEarly:
    case EventRuleType.ScheduledDeliveryTooLate:
      return 'scheduledDeliveryEventRules';
    default:
      return 'levelEventRules';
  }
};

const AccordionText = styled(Typography)`
  font-size: 18px;
  font-weight: 500;
`;

const ClosedAccordionCaret = styled(AccordionCaretIcon)`
  transform: rotate(-90deg);
`;

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: `${boxBackgroundGrey}`,
  },
}))(MuiAccordionDetails);

const NoEventRules = () => {
  const { t } = useTranslation();

  return (
    <MessageBlock>
      <Box m={2} alignItems="center">
        <SearchCloudIcon />
      </Box>
      <LargeBoldDarkText>
        {t('ui.datachanneleventrule.noEventRulesFound', 'No event rules found')}
      </LargeBoldDarkText>
    </MessageBlock>
  );
};

interface Props {
  values: Values;
  setFieldValue: FormikProps<Values>['setFieldValue'];
  options?: EditDataChannelOptions | null;
  eventRuleInfo?: EvolveDataChannelEventsInfo | null;
  displayUnitsText: string;
}

export default function CustomAccordion({
  values,
  setFieldValue,
  options,
  eventRuleInfo,
  displayUnitsText,
}: Props) {
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState<Record<AccordionEventType, boolean>>(
    {
      [AccordionEventType.Level]: true,
      [AccordionEventType.UsageRate]: false,
      [AccordionEventType.ScheduledDelivery]: false,
      [AccordionEventType.MissingData]: false,
    }
  );

  // Event Rule Drawer
  const [
    editingEventRule,
    setEditingEventRule,
  ] = useState<DCEditorEventRule | null>(null);
  const [isEventRuleDrawerOpen, setIsEventRuleDrawerOpen] = useState(false);
  const toggleEventRuleDrawer = (
    open: boolean,
    drawerOptions?: { eventRule: DCEditorEventRule }
  ) => (event?: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setIsEventRuleDrawerOpen(open);

    if (open && drawerOptions) {
      setEditingEventRule(drawerOptions?.eventRule);
    }
  };

  const handleChange = (panel: AccordionEventType) => (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    setExpanded((prevState) => ({
      ...prevState,
      [panel]: newExpanded,
    }));
  };

  // Previous & Next events
  const allEventRules = [
    ...(values?.levelEventRules || []),
    ...(values?.usageRateEventRules || []),
    ...(values?.scheduledDeliveryEventRules || []),
    ...(values?.missingDataEventRules || []),
  ].flatMap((eventRules) => eventRules);

  const handlePreviousEventChange = () => {
    const currentEventRuleIndex = allEventRules.findIndex(
      (eventRule) => editingEventRule?.eventRuleId === eventRule.eventRuleId
    );

    const previousIndex =
      currentEventRuleIndex === 0
        ? allEventRules.length - 1
        : currentEventRuleIndex - 1;
    const currentEventRule = allEventRules[previousIndex];

    setEditingEventRule(currentEventRule);
  };

  const handleNextEventChange = () => {
    const currentEventRuleIndex = allEventRules.findIndex(
      (eventRule) => editingEventRule?.eventRuleId === eventRule.eventRuleId
    );

    const nextIndex =
      currentEventRuleIndex === allEventRules.length - 1
        ? 0
        : currentEventRuleIndex + 1;
    const currentEventRule = allEventRules[nextIndex];

    setEditingEventRule(currentEventRule);
  };

  const handleRosterChange = (newRosters: EvolveRosterInfo[]) => {
    if (eventRuleInfo && editingEventRule) {
      const eventGroupFieldName = getEventGroupFieldNameForEvent(
        editingEventRule
      );
      const index = eventRuleInfo[eventGroupFieldName]?.findIndex(
        (eventRule) => eventRule.id === editingEventRule.id
      );

      setFieldValue(`${eventGroupFieldName}.${index}.rosters`, newRosters);
      toggleEventRuleDrawer(false)();
    }
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {editingEventRule && (
            <Drawer
              anchor="right"
              open={isEventRuleDrawerOpen}
              // @ts-ignore
              onClose={toggleEventRuleDrawer(false)}
              variant="temporary"
              disableBackdropClick
            >
              <DrawerContent>
                {/* TODO: rename to RosterRuleEditor */}
                <EventRuleEditor
                  onPreviousEventSwitch={handlePreviousEventChange}
                  onNextEventSwitch={handleNextEventChange}
                  editingObjectId=""
                  isInlineForm
                  eventRule={editingEventRule}
                  rosters={options?.rosters}
                  cancelCallback={toggleEventRuleDrawer(false)}
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  saveAndExitCallback={handleRosterChange}
                />
              </DrawerContent>
            </Drawer>
          )}
          <Accordion
            square
            expanded={expanded[AccordionEventType.Level]}
            onChange={handleChange(AccordionEventType.Level)}
          >
            <AccordionSummary
              aria-controls="Level accordion"
              id="level-accordion"
            >
              <Grid
                container
                spacing={1}
                alignItems="center"
                justify="space-between"
              >
                <Grid item>
                  <AccordionText>
                    {t('ui.datachanneleventrule.levelevents', 'Level Events')}
                  </AccordionText>
                </Grid>
                <Grid item>
                  <ClosedAccordionCaret
                    style={{
                      transform: expanded[AccordionEventType.Level]
                        ? 'none'
                        : 'rotate(-90deg)',
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {!eventRuleInfo?.levelEventRules?.length ? (
                  <Grid item xs={12}>
                    <NoEventRules />
                  </Grid>
                ) : (
                  values?.levelEventRules?.map((rule, index) => {
                    return (
                      <Grid item xs={12} key={rule.eventRuleId}>
                        <LevelEventRuleBox
                          displayUnitsText={displayUnitsText}
                          index={index}
                          eventRule={rule}
                          setPoints={eventRuleInfo.levelSetPoints}
                          onEdit={toggleEventRuleDrawer(true, {
                            eventRule: rule,
                          })}
                        />
                      </Grid>
                    );
                  })
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded[AccordionEventType.UsageRate]}
            onChange={handleChange(AccordionEventType.UsageRate)}
          >
            <AccordionSummary
              aria-controls="Usage rate accordion"
              id="usage-rate-accordion"
            >
              <Grid
                container
                spacing={1}
                alignItems="center"
                justify="space-between"
              >
                <Grid item>
                  <AccordionText>
                    {t(
                      'ui.datachanneleventrule.usagerateevents',
                      'Usage Rate Events'
                    )}
                  </AccordionText>
                </Grid>
                <Grid item>
                  <ClosedAccordionCaret
                    style={{
                      transform: expanded[AccordionEventType.UsageRate]
                        ? 'none'
                        : 'rotate(-90deg)',
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {!eventRuleInfo?.usageRateEventRules?.length ? (
                  <Grid item xs={12}>
                    <NoEventRules />
                  </Grid>
                ) : (
                  values?.usageRateEventRules?.map((rule, index) => {
                    return (
                      <Grid item xs={12} key={rule.eventRuleId}>
                        <UsageRateRuleBox
                          displayUnitsText={displayUnitsText}
                          index={index}
                          eventRule={rule}
                          setPoints={eventRuleInfo.usageRateSetPoints}
                          onEdit={toggleEventRuleDrawer(true, {
                            eventRule: rule,
                          })}
                        />
                      </Grid>
                    );
                  })
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded[AccordionEventType.ScheduledDelivery]}
            onChange={handleChange(AccordionEventType.ScheduledDelivery)}
          >
            <AccordionSummary
              aria-controls="Scheduled delivery accordion"
              id="scheduled-delivery-accordion"
            >
              <Grid
                container
                spacing={1}
                alignItems="center"
                justify="space-between"
              >
                <Grid item>
                  <AccordionText>
                    {t(
                      'ui.datachanneleventrule.scheduleddeliveryevents',
                      'Scheduled Delivery Events'
                    )}
                  </AccordionText>
                </Grid>
                <Grid item>
                  <ClosedAccordionCaret
                    style={{
                      transform: expanded[AccordionEventType.ScheduledDelivery]
                        ? 'none'
                        : 'rotate(-90deg)',
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {!eventRuleInfo?.scheduledDeliveryEventRules?.length ? (
                  <Grid item xs={12}>
                    <NoEventRules />
                  </Grid>
                ) : (
                  values?.scheduledDeliveryEventRules?.map((rule, index) => {
                    return (
                      <Grid item xs={12} key={rule.eventRuleId}>
                        <ScheduledDeliveryEventRuleBox
                          index={index}
                          eventRule={rule}
                          onEdit={toggleEventRuleDrawer(true, {
                            eventRule: rule,
                          })}
                        />
                      </Grid>
                    );
                  })
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded[AccordionEventType.MissingData]}
            onChange={handleChange(AccordionEventType.MissingData)}
          >
            <AccordionSummary
              aria-controls="Missing data accordion"
              id="missing-data-accordion"
            >
              <Grid
                container
                spacing={1}
                alignItems="center"
                justify="space-between"
              >
                <Grid item>
                  <AccordionText>
                    {t(
                      'ui.datachanneleventrule.missingdataevents',
                      'Missing Data Events'
                    )}
                  </AccordionText>
                </Grid>
                <Grid item>
                  <ClosedAccordionCaret
                    style={{
                      transform: expanded[AccordionEventType.MissingData]
                        ? 'none'
                        : 'rotate(-90deg)',
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {!values?.missingDataEventRules?.length ? (
                  <Grid item xs={12}>
                    <NoEventRules />
                  </Grid>
                ) : (
                  values?.missingDataEventRules?.map((rule, index) => {
                    return (
                      <Grid item xs={12} key={rule.eventRuleId}>
                        <MissingDataEventRuleBox
                          index={index}
                          eventRule={rule}
                          onEdit={toggleEventRuleDrawer(true, {
                            eventRule: rule,
                          })}
                        />
                      </Grid>
                    );
                  })
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </div>
  );
}
