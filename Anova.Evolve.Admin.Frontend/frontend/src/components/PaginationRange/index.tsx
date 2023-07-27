import React from 'react';
import PageCount from 'components/typography/PageCount';
import { useTranslation } from 'react-i18next';

export interface Props {
  align: 'inherit' | 'left' | 'center' | 'right' | 'justify' | undefined;
  totalRows: number;
  pageIndex: number;
  pageSize: number;
}

const PaginationRange = ({ align, totalRows, pageIndex, pageSize }: Props) => {
  const { t } = useTranslation();
  return (
    // TODO: Figure out best way to handle selecting this content via selectors.
    // At the moment, adding an extra div is most likely overkill
    <div aria-label="Page range">
      <PageCount align={align}>
        {totalRows === 0 ? 0 : pageIndex * pageSize + 1}-
        {totalRows !== -1
          ? Math.min(totalRows, (pageIndex + 1) * pageSize)
          : (pageIndex + 1) * pageSize}{' '}
        {t('ui.common.paginationOf', 'of')} {totalRows}
      </PageCount>
    </div>
  );
};

export default PaginationRange;
