import Button, { ButtonProps } from 'components/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';

const CancelButton = (props: ButtonProps) => {
  const { t } = useTranslation();
  return (
    <Button variant="outlined" {...props}>
      {t('ui.common.cancel', 'Cancel')}
    </Button>
  );
};

export default CancelButton;
