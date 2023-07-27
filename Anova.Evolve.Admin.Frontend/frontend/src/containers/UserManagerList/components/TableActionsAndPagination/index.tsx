import Box from '@material-ui/core/Box';
import ItemCount from 'components/typography/ItemCount';
import React from 'react';

interface Props {
  count: number;
}

const TableActionsAndPagination = ({ count }: Props) => {
  // later will add delete button and return Grid back
  return (
    <Box textAlign="center">
      <ItemCount count={count} />
    </Box>
  );
};

export default TableActionsAndPagination;
