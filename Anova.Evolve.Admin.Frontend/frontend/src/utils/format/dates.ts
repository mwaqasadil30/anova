/* eslint-disable indent */
import moment from 'moment-timezone';

export const formatModifiedDatetime = (
  date: moment.MomentInput,
  ianaTimezoneId?: string | null,
  customDateFormat?: string
) => {
  const dateFormat = customDateFormat ?? 'M/D/YYYY h:mm:ss A';
  if (!date) {
    return '';
  }

  return ianaTimezoneId
    ? moment(date).tz(ianaTimezoneId).format(dateFormat)
    : moment(date).format(dateFormat);
};

export const formatModifiedDate = (date: moment.MomentInput) => {
  if (!date) {
    return '';
  }

  return moment(date).format('MMM DD, YYYY');
};

/**
 * Return a calendar formatted date (ex: Today at 4:00 PM, Yesterday at 4:00
 * PM).
 * See Moment Calendar Time docs:
 * https://momentjs.com/docs/#/displaying/calendar-time/
 * @param date Anything acceptable as a moment input
 * @returns Formatted calendar date (ex: Today at 4:00 PM)
 */
export const formatCalendarDate = (date: moment.MomentInput) => {
  // TODO: Handle translations, maybe use a component instead so we can access
  // the current active language/locale using the i18next hook.
  return moment(date).calendar(null, {
    lastDay: '[Yesterday at] LT',
    sameDay: '[Today at] LT',
    nextDay: '[Tomorrow at] LT',
    lastWeek: '[last] dddd [at] LT',
    nextWeek: 'dddd [at] LT',
    sameElse: 'M/D/YYYY h:mm:ss A',
  });
};

export const secondsToHoursAndMinutes = (numberOfSeconds?: number | null) => {
  if (!numberOfSeconds) {
    return { hours: 0, minutes: 0 };
  }
  const hours = Math.floor(numberOfSeconds / 3600);
  const minutes = Math.floor((numberOfSeconds % 3600) / 60);

  return { hours, minutes };
};

// Retrieved logic from:
// https://stackoverflow.com/questions/37096367/how-to-convert-seconds-to-minutes-and-hours-in-javascript
export const secondsToHoursDisplay = (
  numberOfSeconds?: number | null
): string => {
  if (!numberOfSeconds) {
    return '0 m';
  }
  const hours = Math.floor(numberOfSeconds / 3600);
  const minutes = Math.floor((numberOfSeconds % 3600) / 60);
  const seconds = Math.floor((numberOfSeconds % 3600) % 60);

  const hoursDisplay = hours > 0 ? `${hours} h` : '';
  const minutesDisplay = minutes > 0 ? `${minutes} m` : '';
  const secondsDisplay = seconds > 0 ? `${seconds} s` : '';
  return [hoursDisplay, minutesDisplay, secondsDisplay]
    .filter(Boolean)
    .join(' ');
};
