import { AlertProps } from 'components/Alert';
import FormErrorAlert from 'components/FormErrorAlert';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends AlertProps {
  error?: any;
}

const FormErrorAlertWithMessage = ({ error, children, ...props }: Props) => {
  const { t } = useTranslation();

  const defaultMessage =
    !!error?.status && error.status === 500
      ? t('ui.common.defaultError', 'An unexpected error occurred')
      : t('ui.common.unableToSave', 'Unable to save');
  const content = children || defaultMessage;

  return <FormErrorAlert {...props}>{content}</FormErrorAlert>;
};

export default FormErrorAlertWithMessage;
