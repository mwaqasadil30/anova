import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import DropdownCaret from 'components/forms/styled-fields/DropdownCaret';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import PageNumberPagination, {
  Props as PageNumberPaginationProps,
} from 'components/PageNumberPagination';
import PaginationRange, {
  Props as PaginationRangeProps,
} from 'components/PaginationRange';
import { BulkActions } from 'containers/RTUManagerList/helpers';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Option {
  label: string;
  value: string;
  action?: () => void;
  disabled?: boolean;
}

interface Props extends PageNumberPaginationProps, PaginationRangeProps {
  shouldShowActions?: boolean;
  shouldDisableActions?: boolean;
  actions?: {
    deleteSelected?: () => void;
    copySelected?: () => void;
    swapSelected?: () => void;
    createTemplateSelected?: () => void;
    applyTemplateSelected?: () => void;
    transferSelected?: () => void;
    isCopyDisabled?: boolean;
    isSwapDisabled?: boolean;
    isCreateTemplateDisabled?: boolean;
    isApplyTemplateDisabled?: boolean;
    isTransferDisabled?: boolean;
    isDeleteDisabled?: boolean;
  };
}

const TableActionsAndPagination = ({
  shouldShowActions,
  shouldDisableActions,
  totalRows,
  pageIndex,
  pageSize,
  items,
  actions = {},
}: Props) => {
  const { t } = useTranslation();

  const options: Record<string, Option> = {
    // NOTE: Commented out options below have not been implemented. Copy has
    // somewhat been worked on but years ago, and not fully implemented.
    // swap: {
    //   label: t('ui.common.swap', 'Swap'),
    //   value: BulkActions.Swap,
    //   action: actions.swapSelected,
    //   disabled: actions.isSwapDisabled,
    // },
    // copy: {
    //   label: t('ui.common.copy', 'Copy'),
    //   value: BulkActions.Copy,
    //   action: actions.copySelected,
    //   disabled: actions.isCopyDisabled,
    // },
    // createTemplate: {
    //   label: t('ui.common.createtemplate', 'Create Template'),
    //   value: BulkActions.CreateTemplate,
    //   action: actions.createTemplateSelected,
    //   disabled: actions.isCreateTemplateDisabled,
    // },
    // applyTemplate: {
    //   label: t('ui.common.applytemplate', 'Apply Template'),
    //   value: BulkActions.ApplyTemplate,
    //   action: actions.applyTemplateSelected,
    //   disabled: actions.isApplyTemplateDisabled,
    // },
    // transfer: {
    //   label: t('ui.common.transfer', 'Transfer'),
    //   value: BulkActions.Transfer,
    //   action: actions.transferSelected,
    //   disabled: actions.isTransferDisabled,
    // },
    delete: {
      label: t('ui.common.delete', 'Delete'),
      value: BulkActions.Delete,
      action: actions.deleteSelected,
      disabled: actions.isDeleteDisabled,
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
        <Box
          minWidth="100px"
          maxWidth="150px"
          textAlign={['center', 'center', 'left']}
        >
          {shouldShowActions ? (
            <MenuList>
              <StyledTextField
                disabled={shouldDisableActions}
                select
                onChange={onChange}
                value=""
                style={{ minWidth: 100, maxWidth: 150 }}
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
                <MenuItem value="" disabled>
                  {t('ui.common.bulkActions', 'Bulk Actions')}
                </MenuItem>
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

export default TableActionsAndPagination;
