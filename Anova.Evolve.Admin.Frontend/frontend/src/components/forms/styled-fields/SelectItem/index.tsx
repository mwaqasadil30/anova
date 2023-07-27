import React from 'react';
import { fadedTextColor } from 'styles/colours';
import { useTranslation } from 'react-i18next';

const SelectItem = () => {
  const { t } = useTranslation();
  return (
    <span style={{ color: fadedTextColor }}>
      {t('ui.common.select', 'Select')}
    </span>
  );
};

export default SelectItem;
