/* eslint-disable prefer-destructuring */
// This is shared between many of the internal components

import red from '@material-ui/core/colors/red';
import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';
import lightBlue from '@material-ui/core/colors/lightBlue';
import green from '@material-ui/core/colors/green';

import pink from '@material-ui/core/colors/pink';
import indigo from '@material-ui/core/colors/indigo';
import cyan from '@material-ui/core/colors/cyan';
import lightGreen from '@material-ui/core/colors/lightGreen';
import brown from '@material-ui/core/colors/brown';
import purple from '@material-ui/core/colors/purple';
import blue from '@material-ui/core/colors/blue';
import teal from '@material-ui/core/colors/teal';
import lime from '@material-ui/core/colors/lime';
import grey from '@material-ui/core/colors/grey';
import {
  EvolveHistoricalActiveEvent,
  EventRuleType,
  DataChannelType,
} from 'api/admin/api';

export const eventColors = [
  deepPurple[500],
  green[500],
  lightBlue[500],
  brown[500],
  grey[500],
  teal[500],
  lime[500],
  indigo[500],
  lightGreen[500],
  blue[500],
  purple[500],
  cyan[500],
  pink[500],
];

export const getColor = (
  eventDetails: EvolveHistoricalActiveEvent,
  index: number
) => {
  const isMissingDataEvent =
    eventDetails.eventRuleTypeId === EventRuleType.MissingData;
  const isBatteryVoltageEvent =
    eventDetails.dataChannelTypeId === DataChannelType.BatteryVoltage;

  let color: string = eventColors[index % eventColors.length];
  if (isMissingDataEvent) {
    color = red[500];
  } else if (isBatteryVoltageEvent) {
    color = deepOrange[500];
  }

  return color;
};
