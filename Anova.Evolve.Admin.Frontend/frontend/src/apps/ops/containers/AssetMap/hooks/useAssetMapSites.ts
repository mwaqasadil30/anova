import {
  AssetListFilterOptions,
  DataChannelType,
  EvolveRetrieveAssetMapRecordsByOptionsRequest,
  EvolveRetrieveAssetMapRecordsByOptionsResponse,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  domainId?: string | null;
  filterTextValue?: string | null;
  filterByColumn?: AssetListFilterOptions | null;
  dataChannelSelected?: DataChannelType[] | null;
  inventoryStateSelected?: string[] | null;
  lastRefreshDate?: Date;
  assetSearchExpression?: string | null;
  navigationDomainId?: string;
}

type RequestObj = EvolveRetrieveAssetMapRecordsByOptionsRequest;
type ResponseObj = EvolveRetrieveAssetMapRecordsByOptionsResponse;

export const useAssetMapSites = ({
  domainId,
  assetSearchExpression,
  navigationDomainId,
  filterByColumn,
  filterTextValue,
  dataChannelSelected,
  inventoryStateSelected,
}: Props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any | null>(null);
  const [apiResponse, setApiResponse] = useState<ResponseObj | null>(null);

  const fetchAssetMapSiteInfo = useCallback(() => {
    setIsFetching(true);
    return AdminApiService.AssetService.retrieveAssetMapRecordsByOptions_GetAssetMapRecordsByOptions(
      {
        options: {
          domainId,
          assetSearchExpression,
          assetSearchDomainId: navigationDomainId || domainId,
          filterBy: filterByColumn,
          filterText: filterTextValue,
          dataChannelTypes: dataChannelSelected,
          inventoryStates: inventoryStateSelected,
        },
      } as RequestObj
    )
      .then((response) => {
        setApiResponse(response);
      })
      .catch((error) => {
        setResponseError(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [
    domainId,
    assetSearchExpression,
    navigationDomainId,
    filterByColumn,
    filterTextValue,
    dataChannelSelected,
    inventoryStateSelected,
  ]);

  useEffect(() => {
    fetchAssetMapSiteInfo();
  }, [fetchAssetMapSiteInfo]);

  return {
    isFetching,
    responseError,
    apiResponse,
  };
};
