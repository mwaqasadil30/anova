import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';
import LoadingButton, {
  Props as LoadingButtonProps,
} from 'components/buttons/LoadingButton';
import React from 'react';
import { useTranslation } from 'react-i18next';

const DownloadButton = (props: LoadingButtonProps) => {
  const { t } = useTranslation();
  const { children } = props;
  return (
    <LoadingButton
      variant="text"
      useDomainColorForIcon
      startIcon={<DownloadIcon />}
      disabled
      {...props}
    >
      {!children ? t('ui.common.download', 'Download') : children}
    </LoadingButton>
  );
};

export default DownloadButton;
