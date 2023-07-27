import React from 'react';
import Button, { ButtonProps } from 'components/Button';
import { ReactComponent as RefreshIcon } from 'assets/icons/refresh.svg';
import { useTranslation } from 'react-i18next';
import { useRefreshUserPermissions } from 'hooks/useRefreshUserPermissions';

const RefreshButton = (props: ButtonProps) => {
  const { t } = useTranslation();

  const { refetch: refreshPermissions } = useRefreshUserPermissions();

  return (
    <Button
      variant="text"
      startIcon={<RefreshIcon />}
      useDomainColorForIcon
      {...props}
      onClick={(...args) => {
        refreshPermissions();
        props.onClick?.(...args);
      }}
    >
      {t('ui.common.refresh', 'Refresh')}
    </Button>
  );
};

export default RefreshButton;
