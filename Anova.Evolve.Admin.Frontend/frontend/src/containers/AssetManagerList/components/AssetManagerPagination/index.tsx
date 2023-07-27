import React from 'react';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import MenuList from '@material-ui/core/MenuList';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import DropdownCaret from 'components/forms/styled-fields/DropdownCaret';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import PageNumberPagination, {
  Props as PageNumberPaginationProps,
} from 'components/PageNumberPagination';
import PaginationRange, {
  Props as PaginationRangeProps,
} from 'components/PaginationRange';
import { useTranslation } from 'react-i18next';

interface Option {
  label: string;
  value: string;
  action?: () => void;
  disabled?: boolean;
}
interface Props extends PageNumberPaginationProps, PaginationRangeProps {
  showBulkActions?: boolean;
  disableBulkActions?: boolean;
  actions?: {
    deleteSelected?: () => void;
    copySelected?: () => void;
    isCopyDisabled?: boolean;
    transferSelected?: () => void;
  };
}

const AssetManagerPagination = ({
  showBulkActions,
  disableBulkActions,
  totalRows,
  pageIndex,
  pageSize,
  items,
  actions = {},
}: Props) => {
  const { t } = useTranslation();
  const options: Record<string, Option> = {
    none: {
      label: t('ui.common.bulkActions', 'Bulk Actions'),
      value: '',
    },
    copy: {
      label: t('ui.common.copy', 'Copy'),
      value: 'copy',
      action: actions.copySelected,
      // NOTE(oct-30-2020): Temporarily disable this option
      // disabled: actions.isCopyDisabled,
      disabled: true,
    },
    transfer: {
      label: t('ui.common.transfer', 'Transfer'),
      value: 'transfer',
      action: actions.transferSelected,
      // NOTE(oct-30-2020): Temporarily disable this option
      disabled: true,
    },
    delete: {
      label: t('ui.common.delete', 'Delete'),
      value: 'delete',
      action: actions.deleteSelected,
    },
  };

  const onChange = ({
    target: { value },
  }: {
    target: { value: keyof typeof options };
  }) => {
    const action = options[value].action || (() => {});
    return action();
  };
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} md={4}>
        <Box justifyContent={['center', 'center', 'flex-end']}>
          {showBulkActions ? (
            <MenuList>
              <StyledTextField
                disabled={disableBulkActions}
                select
                onChange={onChange}
                value=""
                style={{ minWidth: 200 }}
                fullWidth
                InputLabelProps={{
                  shrink: false,
                  style: {
                    transform: 'translate(0, 8px) scale(1)',
                    zIndex: 1,
                    paddingLeft: 15,
                  },
                }}
                InputProps={{
                  style: { margin: 0, overflow: 'hidden' },
                }}
                SelectProps={{
                  displayEmpty: true,
                  // NOTE: If we want the dropdown options to appear directly
                  // under, use the following
                  // MenuProps: {
                  //   getContentAnchorEl: null,
                  //   anchorOrigin: {
                  //     vertical: 'bottom',
                  //     horizontal: 'left',
                  //   },
                  // },
                  IconComponent: DropdownCaret,
                }}
              >
                {Object.values(options).map((option: Option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    disabled={option.value === '' || option.disabled}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </StyledTextField>
            </MenuList>
          ) : (
            <Hidden smDown>&nbsp;</Hidden>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box justifyContent={['center', 'center', 'flex-end']}>
          <PaginationRange
            totalRows={totalRows}
            pageIndex={pageIndex}
            pageSize={pageSize}
            align="center"
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box display="flex" justifyContent={['center', 'center', 'flex-end']}>
          <PageNumberPagination items={items} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default AssetManagerPagination;
