import React from 'react';
import { useTranslation } from 'react-i18next';
import Button, { ButtonProps } from 'components/Button';

const SaveAndExitButton = (props: ButtonProps) => {
  const { children } = props;
  const { t } = useTranslation();
  return (
    <Button variant="contained" {...props}>
      {children || t('ui.common.saveandclose', 'Save & Close')}
    </Button>
  );
};

export default SaveAndExitButton;
