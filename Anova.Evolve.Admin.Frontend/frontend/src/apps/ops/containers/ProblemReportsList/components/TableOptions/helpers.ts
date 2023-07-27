import { TagDto } from 'api/admin/api';
import { ProblemReportStatusFilterEnum } from 'apps/ops/types';
import { TFunction } from 'i18next';
import { defaultStatusType } from '../../helpers';

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
  currentFilterByText?: string | null;
  currentSelectedStatus?: ProblemReportStatusFilterEnum;
  currentSelectedTags?: TagDto[] | null;
}

export const numberOfActiveFilters = ({
  currentFilterByText,
  currentSelectedStatus,
  currentSelectedTags,
}: NumberOfActiveFiltersProps) => {
  let totalActiveFilters = 0;

  if (currentSelectedStatus !== defaultStatusType) {
    totalActiveFilters += 1;
  }

  if (currentFilterByText && currentFilterByText?.length > 0) {
    totalActiveFilters += 1;
  }

  if (currentSelectedTags && currentSelectedTags?.length > 0) {
    totalActiveFilters += 1;
  }

  return totalActiveFilters;
};
