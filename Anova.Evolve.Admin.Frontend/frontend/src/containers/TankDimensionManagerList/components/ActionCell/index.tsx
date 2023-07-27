import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { TankDimensionInfoRecord } from 'api/admin/api';
import ActionsButton from 'components/buttons/ActionsButton';
import { useTranslation } from 'react-i18next';
import { Cell } from 'react-table';

function isDisabled(record: TankDimensionInfoRecord): boolean {
  return !!record.dataChannelCount;
}
interface Props extends Cell<TankDimensionInfoRecord> {
  handleDelete: (tankDimension: TankDimensionInfoRecord) => void;
  disabled?: boolean;
}

const ActionCell = ({ row, handleDelete }: Props) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteOne = (
    tankDimension: TankDimensionInfoRecord | undefined
  ) => {
    if (tankDimension) {
      handleDelete(tankDimension);
    }
  };

  return (
    <>
      <ActionsButton onClick={handleClick} style={{ width: 40, height: 40 }} />
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
          disabled={isDisabled(row.values as TankDimensionInfoRecord)}
        >
          {t('ui.common.delete', 'Delete')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default ActionCell;
