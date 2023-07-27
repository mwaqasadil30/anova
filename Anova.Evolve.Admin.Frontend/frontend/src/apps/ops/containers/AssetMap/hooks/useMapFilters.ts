/* eslint-disable indent */
import {
  AssetMapInfo,
  EventInventoryStatusType,
  EvolveAssetLocationDto,
  EvolveInventoryState,
} from 'api/admin/api';
import sortBy from 'lodash/sortBy';
import { useState } from 'react';
import { isNumber } from 'utils/format/numbers';
import { MapFiltersData } from './types';

// Custom ordering for inventory state. Note that the order may be different
// from the value in the EventInventoryStatusType enum, and we also want to
// order `null` in a custom way.
const sortOrderMappingForInventoryStates = {
  [EventInventoryStatusType.Full]: 0,
  // @ts-ignore
  [null]: 10, // The "Normal" case
  [EventInventoryStatusType.Reorder]: 20,
  [EventInventoryStatusType.Critical]: 30,
  [EventInventoryStatusType.Empty]: 40,
  [EventInventoryStatusType.UserDefined]: 50,
};

const getInventoryStateKey = (
  inventoryStatus: EventInventoryStatusType | null | undefined,
  description: string | null | undefined
) => {
  const key = `${inventoryStatus}|${description}`;
  return key;
};

interface Props {
  filterableInventoryStates?: EvolveInventoryState[] | null;
  initialActiveFilters?: Record<string, boolean | undefined>;
  mapRecords?: EvolveAssetLocationDto[];
}

const useMapFilters = ({
  filterableInventoryStates,
  mapRecords,
  initialActiveFilters,
}: Props): MapFiltersData => {
  const inventoryStatesWithOrder = filterableInventoryStates?.map(
    (inventoryState) => ({
      ...inventoryState,
      order:
        sortOrderMappingForInventoryStates[
          inventoryState.eventInventoryStatus!
        ],
    })
  );

  const sortedFilterableInventoryStates = sortBy(inventoryStatesWithOrder, [
    'order',
    'description',
  ]).map(
    // Convert back to EvolveInventoryState so we remove properties that were
    // used to sort
    (inventoryState) => EvolveInventoryState.fromJS(inventoryState)
  );

  const initialInventoryStateActiveMapping: Record<
    string,
    boolean | undefined
  > =
    filterableInventoryStates?.reduce((prev, current) => {
      const key = getInventoryStateKey(
        current.eventInventoryStatus,
        current.description
      );
      // @ts-ignore
      prev[key] = true;
      return prev;
    }, {}) || {};

  const [filterButtonActiveMapping, setFilterButtonActiveMapping] = useState(
    initialActiveFilters || initialInventoryStateActiveMapping
  );

  const changeAllInventoryStates = (newValue: boolean) => {
    const newActiveInventoryStates =
      filterableInventoryStates?.reduce((prev, current) => {
        const key = getInventoryStateKey(
          current.eventInventoryStatus,
          current.description
        );
        // @ts-ignore
        prev[key] = newValue;
        return prev;
      }, {}) || {};
    setFilterButtonActiveMapping(newActiveInventoryStates);
  };
  const selectAllInventoryStates = () => {
    changeAllInventoryStates(true);
  };
  const deselectAllInventoryStates = () => {
    changeAllInventoryStates(false);
  };

  // We may need to use this as a base since eventStatus is a comma separated
  // string of MULTIPLE event statuses. Examples:
  // "Critical"
  // "Critial,Missing Data"
  const inventoryStateCountMapping: Record<string, number | undefined> =
    sortedFilterableInventoryStates?.reduce((prev, current) => {
      const key = getInventoryStateKey(
        current.eventInventoryStatus,
        current.description
      );

      // @ts-ignore
      prev[key] = 0;
      return prev;
    }, {}) || {};

  // Since we're paginating assets, we won't have access to the site directly.
  // So we set up ID mappings here to access access an asset's site via just
  // the asset ID.
  const siteIdMapping: Record<string, EvolveAssetLocationDto | undefined> = {};
  const assetIdToSiteIdMapping: Record<string, string | undefined> = {};

  const filteredMapRecords = mapRecords?.flatMap((record) => {
    const siteKey = `${record.latitude}_${record.longitude}`;

    const filteredAssets = record.assets?.flatMap((asset) => {
      if (asset.assetId) {
        assetIdToSiteIdMapping[asset.assetId] = siteKey;
      }

      const filteredDataChannels = asset.dataChannels?.flatMap((channel) => {
        const inventoryStatuses = channel.eventStatus?.split(',');

        // TODO: Should this be a find or filter?
        const matchingFilterableInventoryState = sortedFilterableInventoryStates?.find(
          (filterableInventoryState) =>
            // Non-normal case
            (channel.eventInventoryStatusId ===
              filterableInventoryState.eventInventoryStatus &&
              inventoryStatuses?.includes(
                filterableInventoryState.description!
              )) ||
            // Normal case
            (channel.eventInventoryStatusId === null &&
              filterableInventoryState.eventInventoryStatus === null)
        );
        const firstEventStatus = matchingFilterableInventoryState?.description;

        const inventoryStateKey = `${channel.eventInventoryStatusId}|${firstEventStatus}`;

        // NOTE: We also update the total counts while filtering here
        if (isNumber(inventoryStateCountMapping[inventoryStateKey])) {
          inventoryStateCountMapping[inventoryStateKey]! += 1;
        } else {
          inventoryStateCountMapping[inventoryStateKey] = 1;
        }

        // Filter for channels that match the current active filter
        return filterButtonActiveMapping[inventoryStateKey] ? [channel] : [];
      });

      // Modify the list of data channels based on ones that have been filtered
      return filteredDataChannels?.length
        ? [
            AssetMapInfo.fromJS({
              ...asset,
              dataChannels: filteredDataChannels || [],
            }),
          ]
        : [];
    });

    // Modify the list of assets based on the data channels that have been
    // filtered
    const recordWithFilteredAssets = filteredAssets?.length
      ? EvolveAssetLocationDto.fromJS({
          ...record,
          assets: filteredAssets || [],
        })
      : null;

    if (!recordWithFilteredAssets) {
      return [];
    }

    siteIdMapping[siteKey] = recordWithFilteredAssets;
    return [recordWithFilteredAssets];
  });

  const getSiteForAssetId = (assetId?: string) => {
    if (!assetId) {
      return null;
    }

    const siteId = assetIdToSiteIdMapping[assetId];
    if (!siteId) {
      return null;
    }

    return siteIdMapping[siteId] || null;
  };

  return {
    inventoryStates: sortedFilterableInventoryStates,
    filterButtonActiveMapping,
    inventoryStateCountMapping,
    filteredMapRecords,
    getSiteForAssetId,
    setFilterButtonActiveMapping,
    selectAllInventoryStates,
    deselectAllInventoryStates,
  };
};

export default useMapFilters;
