import Box from '@material-ui/core/Box';
import PageCount from 'components/typography/PageCount';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  totalRows: number;
}

const TableActionsAndPagination = ({ totalRows }: Props) => {
  const { t } = useTranslation();

  return (
    <Box p={0.5}>
      <Box textAlign="center">
        <PageCount>
          {t('ui.common.itemCount', `{{count}} items`, {
            count: totalRows,
          })}
        </PageCount>
      </Box>
    </Box>
  );
};

export default TableActionsAndPagination;
