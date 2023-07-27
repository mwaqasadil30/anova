import InputAdornment from '@material-ui/core/InputAdornment';
import { MenuProps as MuiMenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { TextFieldProps } from '@material-ui/core/TextField';
import { ReactComponent as DeselectAllIcon } from 'assets/icons/multiselect-deselect-all-line.svg';
import { ReactComponent as SelectAllIcon } from 'assets/icons/multiselect-select-all-check.svg';
import Button from 'components/Button';
import Checkbox from 'components/forms/styled-fields/Checkbox';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { tableBorderColor } from 'styles/colours';

const StyledTextFieldForMultiSelect = styled(StyledTextField)`
  /* For the input adornment at the end */
  position: relative;

  && [class*='MuiSelect-select'],
  &
    [class*='MuiInput-root'][class*='Mui-focused']
    > [class*='MuiSelect-select'] {
    /*
      Padding on the right side to account for the input adornment at the end
      as well as the dropdown caret icon
    */
    padding-right: 70px;
  }
`;

const StyledMutliSelectActionList = styled.li`
  background: ${(props) => props.theme.palette.background.paper};
  position: sticky;
  top: 0;
  z-index: 1;
  &:focus {
    outline: 0;
  }
`;

const StopClickPropagationWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid ${tableBorderColor};
`;

const MultiSelectActionButton = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  && {
    border-radius: 10px 10px 0 0;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  font-size: 14px;
  min-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
`;

const StyledCheckbox = styled(Checkbox)`
  padding: 4px;
  margin-right: 8px;
  & .MuiSvgIcon-fontSizeSmall {
    font-size: 1.417rem;
  }
`;

const StyledInputAdornment = styled(InputAdornment)`
  color: ${(props) => props.theme.palette.text.secondary};
  position: absolute;
  right: 40px;
  top: 50%;
  line-height: 1;
`;

const StyledIcon = styled.svg`
  width: 18px;
  margin-right: 12px;
`;

const MenuProps: Partial<MuiMenuProps> = {
  // Prevent material UI from scrolling to the last selected item in the list
  // (ex: when selecting all items)
  autoFocus: false,
  // Note: The Paper's min width is automatically calculated based on the width
  // of the select dropdown
  PaperProps: {
    style: {
      borderWidth: '2px',
      // Prevent weird issues with the select all/deselect all button not being
      // sticky on long multi-select lists. Note that the design team wants to
      // limit the maximum items shown to 10 (which is why height is hard-coded
      // here).
      height: 442,
      maxHeight: 'calc(100% - 96px)',
    },
  },
  MenuListProps: {
    style: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  // Make the multi select appear UNDER the input element if there's
  // enough room
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  getContentAnchorEl: null,
};

type Props<T> = Partial<TextFieldProps> & {
  children?: React.ReactNode;
  label: React.ReactNode;
  options: T[];
  value: T[];
  style: any;
  MenuProps?: Partial<MuiMenuProps>;
  onClose?: (selectedOptions: T[]) => void;
  setValue: (selectedOptions: T[]) => void;
  // renderValue: What should be rendered for a single option
  renderValue: (option: T) => string;
};

function MultiSelect<T = any>(props: Props<T>) {
  const { onClose, setValue, renderValue, ...textFieldProps } = props;

  const {
    children,
    label,
    options,
    value,
    MenuProps: customMenuProps,
    InputProps,
  } = props;
  const { t } = useTranslation();

  return (
    <StyledTextFieldForMultiSelect
      select
      fullWidth
      label={label}
      {...textFieldProps}
      SelectProps={{
        // We want to show "None" if no options are selected
        displayEmpty: true,
        multiple: true,

        // @ts-ignore
        renderValue: (selected: T[] | undefined) => {
          if (!selected || selected.length === 0) {
            return t('ui.common.none', 'None');
          }
          if (selected.length === props.options.length) {
            return t('ui.common.all', 'All');
          }

          return selected.map(props.renderValue).filter(Boolean).join(', ');
        },
        onChange: (
          evt: React.ChangeEvent<{
            name?: string | undefined;
            value: unknown;
          }>
        ) => {
          evt.stopPropagation();
          setValue(evt.target.value as T[]);
        },
        onClose: () => onClose?.(value),
        MenuProps: {
          ...MenuProps,
          ...customMenuProps,
          PaperProps: {
            ...MenuProps.PaperProps,
            style: {
              ...MenuProps.PaperProps?.style,
              // Prevent a blank white space from showing up if less than 10
              // items show up (see comment about showing 10 items above in
              // MenuProps.PaperProps)
              ...(options.length <= 10 && { height: 'auto' }),
            },
          },
        },
      }}
      InputProps={{
        endAdornment: (
          <StyledInputAdornment position="end" disablePointerEvents>
            ({value.length || 0})
          </StyledInputAdornment>
        ),
        ...InputProps,
      }}
    >
      <StyledMutliSelectActionList>
        {/*
          Prevent propagating the click event anywhere on this <li>
          element so it doesn't trigger the onChange callback on
          material-ui's <Select> (via <TextField>). Otherwise, `null`
          values could be added to the state when clicking on this
          <li> element.
        */}
        <StopClickPropagationWrapper
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();
          }}
        >
          <MultiSelectActionButton
            variant="text"
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              event.stopPropagation(); // Dont allow clicking on the MenuItem

              const allItemsAreSelected =
                props.value.length === props.options.length;
              if (allItemsAreSelected) {
                setValue([]);
              } else {
                setValue(options);
              }
            }}
          >
            {value.length === options.length ? (
              <>
                <StyledIcon as={DeselectAllIcon} />
                {t('ui.common.deselectall', 'Deselect All')}
              </>
            ) : (
              <>
                <StyledIcon as={SelectAllIcon} />
                {t('ui.main.selectall', 'Select All')}
              </>
            )}
          </MultiSelectActionButton>
        </StopClickPropagationWrapper>
      </StyledMutliSelectActionList>
      {children ||
        options.map((option: T, index) => {
          const isSelected = value.includes(option);
          return (
            // TODO: Is index good enough for the multi-select? or should
            // another prop be passed to customize the ID?
            // @ts-ignore
            <StyledMenuItem key={index} value={option}>
              <StyledCheckbox size="small" checked={isSelected} />
              {props.renderValue(option)}
            </StyledMenuItem>
          );
        })}
    </StyledTextFieldForMultiSelect>
  );
}

export default MultiSelect;
