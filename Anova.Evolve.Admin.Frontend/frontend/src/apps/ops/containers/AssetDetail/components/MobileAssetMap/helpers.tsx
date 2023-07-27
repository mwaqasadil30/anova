import { lineString as turfLineString } from '@turf/helpers';
import turfGreatCircle from '@turf/great-circle';
import moment from 'moment';

export const getHighlightedLineSegmentData = (segment: any) => {
  return turfLineString(
    [
      [segment.geometry.coordinates[0][0], segment.geometry.coordinates[0][1]],
      [segment.geometry.coordinates[1][0], segment.geometry.coordinates[1][1]],
    ],
    {
      name: segment.properties.name,
    }
  );
};

export const getHighlightedGreatCircleSegmentData = (segment: any) => {
  return turfGreatCircle(
    segment.properties.prevPos,
    segment.properties.currentPos,
    {
      properties: {
        name: segment.properties.name,
      },
    }
  );
};

export const convertStartOfDay = (dateTime: moment.MomentInput) =>
  moment(dateTime).startOf('day').valueOf();

export const convertDateIntoMarkerRange = (
  dateTimeOne?: moment.MomentInput,
  dateTimeTwo?: moment.MomentInput
) => {
  if (!dateTimeTwo) {
    return [
      moment(dateTimeOne).startOf('day').valueOf(),
      // NOTE / TODO: Previously used endOf('day'). Now both items will be same value. Consider refactor
      moment(dateTimeOne).startOf('day').valueOf(),
    ];
  }
  return [
    moment(dateTimeOne).startOf('day').valueOf(),
    moment(dateTimeTwo).startOf('day').valueOf(),
  ];
};

export const convertSegmentIntoRange = (
  dateTimeOne?: moment.MomentInput,
  dateTimeTwo?: moment.MomentInput
) => {
  return [
    moment(dateTimeOne).endOf('day').valueOf() + 1,
    moment(dateTimeTwo).startOf('day').valueOf() - 1,
  ];
};
