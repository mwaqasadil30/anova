import { useEffect, useState } from 'react';
import { ApiService } from 'api/admin/ApiService';
import {
  EvolveGetDataChannelsByDomainIdAndUserIdRequest,
  DataChannelType,
  EvolveGetInventoryStatesByDomainIdAndUserIdRequest,
  EvolveGetUnitTypesRequest,
  EvolveUnitType,
} from 'api/admin/api';

export const useAssetFilters = ({ domainId, userId }: any) => {
  const [dataChannels, setDataChannels] = useState<DataChannelType[]>([]);
  const [inventoryStates, setInventoryStates] = useState<string[]>([]);
  const [unitTypes, setUnitTypes] = useState<EvolveUnitType[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      ApiService.DataChannelService.getDataChannelsByDomainIdAndUserId_GetDataChannelsByDomainIdAndUserId(
        {
          domainId,
          userId,
        } as EvolveGetDataChannelsByDomainIdAndUserIdRequest
      ).then(({ result }) => setDataChannels(result || [])),
      ApiService.InventoryStatesService.getInventoryStatesByDomainIdAndUserId_GetInventoryStatesByDomainIdAndUserId(
        {
          domainId,
          userId,
        } as EvolveGetInventoryStatesByDomainIdAndUserIdRequest
      ).then(({ result }) => setInventoryStates(result || [])),
      ApiService.UnitTypeService.getUnitTypes_GetUnitTypes(
        {} as EvolveGetUnitTypesRequest
      ).then(({ result }) => setUnitTypes(result || [])),
    ])
      .catch((err) => setError(err))
      .finally(() => {
        setIsLoading(false);
        setIsLoadingInitial(false);
      });
  }, [domainId, userId]);

  return {
    dataChannels,
    inventoryStates,
    unitTypes,
    isLoading,
    isLoadingInitial,
    error,
  };
};
