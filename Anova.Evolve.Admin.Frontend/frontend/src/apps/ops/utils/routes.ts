import queryString, { StringifyOptions } from 'query-string';
import routes from 'apps/ops/routes';
import { isNumber } from 'utils/format/numbers';
import { EventRuleType } from 'api/admin/api';

const assetSummaryQueryOptions: StringifyOptions = {
  arrayFormat: 'comma',
};

interface BuildAssetSummaryLinkOptions {
  inventoryStatusLevel: string;
}

export const buildAssetSummaryLink = (
  options: BuildAssetSummaryLinkOptions
) => {
  const { inventoryStatusLevel } = options;

  const stringifiedQuery = queryString.stringify(
    { inventoryStatusLevel },
    assetSummaryQueryOptions
  );
  return `${routes.assetSummary.list}?${stringifiedQuery}`;
};

export const parseAssetSummaryQuery = (query: string) => {
  // NOTE: There's no ability to a param with one item as an array, need to set
  // it up manually:
  // https://github.com/sindresorhus/query-string/issues/206
  const queryParams = queryString.parse(query, assetSummaryQueryOptions);

  let formattedInventoryStatusLevels;
  if (
    queryParams.inventoryStatusLevel &&
    typeof queryParams.inventoryStatusLevel === 'string'
  ) {
    formattedInventoryStatusLevels = [queryParams.inventoryStatusLevel];
  } else if (Array.isArray(queryParams.inventoryStatusLevel)) {
    formattedInventoryStatusLevels = queryParams.inventoryStatusLevel.filter(
      Boolean
    );
  }

  return {
    ...queryParams,
    // Convert inventoryStatusLevel to a list when only 1 item is specified in
    // the query param
    inventoryStatusLevel: formattedInventoryStatusLevels,
  };
};

const eventListQueryOptions: StringifyOptions = {
  arrayFormat: 'comma',
};

interface BuildEventListLinkOptions {
  eventTypes: EventRuleType[];
}

export const buildEventListLink = (options: BuildEventListLinkOptions) => {
  const { eventTypes } = options;

  const stringifiedQuery = queryString.stringify(
    { eventTypes },
    eventListQueryOptions
  );
  return `${routes.events.list}?${stringifiedQuery}`;
};

export const parseEventListQuery = (query: string) => {
  // NOTE: There's no ability to a param with one item as an array, need to set
  // it up manually:
  // https://github.com/sindresorhus/query-string/issues/206
  const queryParams = queryString.parse(query, eventListQueryOptions);

  let formattedEventTypes;
  if (
    queryParams.eventTypes &&
    typeof queryParams.eventTypes === 'string' &&
    isNumber(queryParams.eventTypes)
  ) {
    formattedEventTypes = [Number(queryParams.eventTypes) as EventRuleType];
  } else if (Array.isArray(queryParams.eventTypes)) {
    formattedEventTypes = queryParams.eventTypes
      .filter(isNumber)
      .map(Number) as EventRuleType[];
  }

  return {
    ...queryParams,
    eventTypes: formattedEventTypes,
  };
};
