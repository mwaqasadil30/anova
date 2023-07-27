import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ActionsButton from 'components/buttons/ActionsButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cell } from 'react-table';

interface Props<T extends object> extends Cell<T> {
  disabled?: boolean;
  handleDelete: (record: T) => void;
  isRecordDisabled?: (record: T) => boolean;
}

function TableActionCell<T extends object>({
  disabled,
  row,
  handleDelete,
  isRecordDisabled,
}: Props<T>) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteOne = (record: T | undefined) => {
    if (record) {
      handleDelete(record);
    }
  };

  return (
    <>
      <ActionsButton
        onClick={handleClick}
        disabled={disabled}
        style={{ width: 40, height: 40 }}
      />
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => {
            handleDeleteOne(row.original);
            handleClose();
          }}
          disabled={isRecordDisabled?.(row.original)}
        >
          {t('ui.common.delete', 'Delete')}
        </MenuItem>
      </Menu>
    </>
  );
}

export default TableActionCell;
