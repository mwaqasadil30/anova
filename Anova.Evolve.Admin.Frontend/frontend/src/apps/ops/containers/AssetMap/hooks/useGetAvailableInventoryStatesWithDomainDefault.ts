import {
  EvolveGetAvailableInventoryStatesWithDomainDefaultRequest,
  EvolveGetAvailableInventoryStatesWithDomainDefaultResponse,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { useCallback, useEffect, useState } from 'react';

type RequestObj = EvolveGetAvailableInventoryStatesWithDomainDefaultRequest;
type ResponseObj = EvolveGetAvailableInventoryStatesWithDomainDefaultResponse;

interface Props {
  domainId?: string;
}

export const useGetAvailableInventoryStatesWithDomainDefault = ({
  domainId,
}: Props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any | null>(null);
  const [apiResponse, setApiResponse] = useState<ResponseObj | null>(null);

  const fetchInventoryStates = useCallback(() => {
    setIsFetching(true);
    return AdminApiService.InventoryStatesService.getAvailableInventoryStatesWithDomainDefault_GetAvailableInventoryStatesWithDomainDefault(
      { domainId } as RequestObj
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
  }, [domainId]);

  useEffect(() => {
    fetchInventoryStates();
  }, [fetchInventoryStates]);

  return {
    isFetching,
    responseError,
    apiResponse,
  };
};
