import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';
import LoadingButton, {
  Props as LoadingButtonProps,
} from 'components/buttons/LoadingButton';
import React from 'react';
import { useTranslation } from 'react-i18next';

const DownloadPDFButton = (props: LoadingButtonProps) => {
  const { t } = useTranslation();
  return (
    <LoadingButton
      variant="text"
      useDomainColorForIcon
      startIcon={<DownloadIcon />}
      {...props}
    >
      {t('ui.common.downloadPDF', 'Download PDF')}
    </LoadingButton>
  );
};

export default DownloadPDFButton;
