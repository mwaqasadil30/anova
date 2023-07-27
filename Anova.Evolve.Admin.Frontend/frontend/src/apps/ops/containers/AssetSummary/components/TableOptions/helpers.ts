import { AssetSummaryGroupingOptions, DataChannelType } from 'api/admin/api';
import { TFunction } from 'i18next';
import { UnitDisplayType } from 'types';
import { defaultGroupByColumn, defaultUnitDisplayType } from '../../helpers';

export const truncateListWithMoreText = (
  list: string[] | undefined,
  t: TFunction
) => {
  if (!list) {
    return '';
  }

  let truncatedText = list.slice(0, 2).join(', ');

  if (list.length === 0) {
    truncatedText += t('ui.common.none', 'None');
  }

  if (list.length >= 3) {
    const remainingItemsText = t('ui.common.moreCount', '+ {{count}} more', {
      count: list.slice(2).length,
    });

    truncatedText += `, ${remainingItemsText}`;
  }

  return truncatedText;
};

interface NumberOfActiveFiltersProps {
  currentFilterByText?: string;
  currentGroupBy?: AssetSummaryGroupingOptions;
  currentSelectedUnits?: UnitDisplayType;
  currentDataChannels?: DataChannelType[];
  dataChannelOptions: DataChannelType[];
  currentInventoryStates?: string[];
  inventoryStateOptions: string[];
}

export const numberOfActiveFilters = ({
  currentFilterByText,
  currentGroupBy,
  currentSelectedUnits,
  currentDataChannels,
  dataChannelOptions,
  currentInventoryStates,
  inventoryStateOptions,
}: NumberOfActiveFiltersProps) => {
  let totalActiveFilters = 0;

  if (currentFilterByText && currentFilterByText?.length > 0) {
    totalActiveFilters += 1;
  }

  if (currentGroupBy !== defaultGroupByColumn) {
    totalActiveFilters += 1;
  }

  if (currentSelectedUnits !== defaultUnitDisplayType) {
    totalActiveFilters += 1;
  }

  if (currentDataChannels?.length !== dataChannelOptions.length) {
    totalActiveFilters += 1;
  }

  if (currentInventoryStates?.length !== inventoryStateOptions.length) {
    totalActiveFilters += 1;
  }

  return totalActiveFilters;
};
