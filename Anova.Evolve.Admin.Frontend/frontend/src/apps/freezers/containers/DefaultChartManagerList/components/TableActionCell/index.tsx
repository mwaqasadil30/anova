import Button from '@material-ui/core/Button';
import { ReactComponent as DeleteTrashIcon } from 'assets/icons/trash-simple.svg';
import React from 'react';
import { Cell } from 'react-table';
import styled from 'styled-components';

const StyledDeleteTrashIcon = styled(DeleteTrashIcon)`
  height: 14px;
  width: 14px;
`;

const StyledButton = styled(Button)`
  width: 40px;
  height: 40px;
  min-width: 0;
  border-radius: 0;
`;

interface Props<T extends object> extends Cell<T> {
  disabled?: boolean;
  handleDelete: (record: T) => void;
}

function TableActionCell<T extends object>({
  disabled,
  row,
  handleDelete,
}: Props<T>) {
  const handleDeleteOne = (record: T | undefined) => {
    if (record) {
      handleDelete(record);
    }
  };

  return (
    <>
      <StyledButton
        onClick={() => {
          handleDeleteOne(row.original);
        }}
        disabled={disabled}
      >
        <StyledDeleteTrashIcon />
      </StyledButton>
    </>
  );
}

export default TableActionCell;
