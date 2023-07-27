import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { MessageTemplate_SummaryDto } from 'api/admin/api';
import ActionsButton from 'components/buttons/ActionsButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cell } from 'react-table';
import { isRecordDisabled } from '../../helpers';

interface Props extends Cell<MessageTemplate_SummaryDto> {
  handleDelete: (rosterId: MessageTemplate_SummaryDto) => void;
  disabled?: boolean;
}

const ActionCell = ({ disabled, row, handleDelete }: Props) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteOne = (roster: MessageTemplate_SummaryDto | undefined) => {
    if (roster) {
      handleDelete(roster);
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
          disabled={isRecordDisabled(row.values as MessageTemplate_SummaryDto)}
        >
          {t('ui.common.delete', 'Delete')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default ActionCell;
