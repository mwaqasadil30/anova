import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cell } from 'react-table';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ReactComponent as EllipsisIcon } from 'assets/icons/ellipsis.svg';
import { DomainInfoRecord } from 'api/admin/api';

interface Props extends Cell<DomainInfoRecord> {
  handleCopy: (id: string | undefined) => void;
  disabled?: boolean;
}

const ActionCell = ({ disabled, row, handleCopy }: Props) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        aria-controls="asset group options"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ width: 50, minWidth: 0, borderRadius: 0, height: 50 }}
        disabled={disabled}
      >
        <EllipsisIcon />
      </Button>
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
            handleCopy(row.original.domainId);
            handleClose();
          }}
          disabled={disabled}
        >
          {t('ui.common.copy', 'Copy')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default ActionCell;
