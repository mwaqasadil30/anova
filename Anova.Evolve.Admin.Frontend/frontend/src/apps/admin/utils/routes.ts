import { generatePath } from 'react-router-dom';
import queryString, { StringifyOptions } from 'query-string';
import adminRoutes from 'apps/admin/routes';

const assetTransferQueryOptions: StringifyOptions = {
  arrayFormat: 'bracket',
};

export const stringifyAssetTransferQuery = (
  assetIds: Array<string | undefined>
) => {
  const basePath = generatePath(adminRoutes.assetManager.transfer);
  const assetIdsQuery = {
    ids: assetIds.filter(Boolean),
  };
  const stringifiedQuery = queryString.stringify(
    assetIdsQuery,
    assetTransferQueryOptions
  );

  return `${basePath}?${stringifiedQuery}`;
};

export const parseAssetTransferQuery = (query: string) => {
  const queryParams = queryString.parse(query, assetTransferQueryOptions);

  return queryParams.ids && typeof queryParams.ids !== 'string'
    ? queryParams.ids.filter(Boolean)
    : [];
};
