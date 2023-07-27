import { TFunction } from 'i18next';

export const formatBooleanToYesOrNoString = (
  value: boolean | undefined,
  t: TFunction
) => (value ? t('ui.common.yes', 'Yes') : t('ui.common.no', 'No'));
