import { TypographyProps } from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PageCount from '../PageCount';

interface Props extends TypographyProps {
  count: number;
}

const ItemCount = ({ count, ...props }: Props) => {
  const { t } = useTranslation();

  return (
    <PageCount {...props}>
      {t('ui.common.itemCount', `{{count}} items`, { count })}
    </PageCount>
  );
};

export default ItemCount;
