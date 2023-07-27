import { AvailableTagBase, ChartTagBaseDto } from 'api/admin/api';
import { graphColours } from 'apps/freezers/components/FreezerChart/helpers';
import moment from 'moment';
import { DataChannelIdToColorMapping } from './types';

// For User Charts
export const getDataChannelToColorMapping = (
  chartDataChannels?: ChartTagBaseDto[] | null
): DataChannelIdToColorMapping => {
  const dataChannelIdToColorMapping = chartDataChannels?.reduce<
    Record<string, string>
  >((prev, current, index) => {
    const seriesColoursIndex = index % graphColours.seriesColours.length;
    const seriesColour = graphColours.seriesColours[seriesColoursIndex];

    prev[current.tagId!] = seriesColour;
    return prev;
  }, {});

  return dataChannelIdToColorMapping;
};

// For Default Charts
export const getTagToColorMapping = (
  defaultChartTags?: AvailableTagBase[] | null
): DataChannelIdToColorMapping => {
  const tagIdToColorMapping = defaultChartTags?.reduce<Record<string, string>>(
    (prev, current, index) => {
      const seriesColoursIndex = index % graphColours.seriesColours.length;
      const seriesColour = graphColours.seriesColours[seriesColoursIndex];

      prev[current.tagId!] = seriesColour;
      return prev;
    },
    {}
  );

  return tagIdToColorMapping;
};

export const getDetailsInitialStartDate = (defaultDate?: string) => {
  const formattedDefaultDate = moment(defaultDate);
  // Check if the defaultDate exists before using it (moment will default to
  // now when initialized with `undefined`)
  if (defaultDate && formattedDefaultDate.isValid()) {
    return formattedDefaultDate;
  }

  const now = moment();
  const initialStartDate = moment(now).subtract(30, 'minutes');
  return initialStartDate;
};
export const getDetailsInitialEndDate = (defaultDate?: string) => {
  const formattedDefaultDate = moment(defaultDate);
  // Check if the defaultDate exists before using it (moment will default to
  // now when initialized with `undefined`)
  if (defaultDate && formattedDefaultDate.isValid()) {
    return formattedDefaultDate;
  }

  const now = moment();
  const initialEndDate = moment(now);
  return initialEndDate;
};
