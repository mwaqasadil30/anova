import React from 'react';
import { useTranslation } from 'react-i18next';
import Button, { ButtonProps } from 'components/Button';
import { ReactComponent as PaperAirPlaneIcon } from 'assets/icons/paper-air-plane.svg';

const SendTestMessage = (props: ButtonProps) => {
  const { t } = useTranslation();
  return (
    <Button variant="text" {...props} startIcon={<PaperAirPlaneIcon />}>
      {t('ui.rosterEditor.sendTestMessage', 'Send Test Message')}
    </Button>
  );
};

export default SendTestMessage;
