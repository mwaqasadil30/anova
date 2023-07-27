import React from 'react';
import moment from 'moment';

interface Props {
  date: string;
  format: string;
}

/**
 * Format a moment object.
 * https://momentjs.com/docs/#/displaying/
 * Common date format: dddd, MMMM Do YYYY --> Friday, February 2nd 2018
 * Common time format: h:mm A             --> 5:14 PM
 */
const FormatDateTime = ({ date, format: customFormat }: Props) => {
  const format = customFormat || 'dddd, MMMM Do YYYY';
  return <span>{moment(date).format(format)}</span>;
};

export default FormatDateTime;
