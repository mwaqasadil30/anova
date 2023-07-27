// Majority of this is from material-ui's Virtualized Autocomplete example
// since they use some workarounds for react-window
// https://material-ui.com/components/autocomplete/#virtualization
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { TextFieldProps } from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import StyledAutocomplete from 'components/forms/styled-fields/StyledAutocomplete';
import StyledAutocompleteTextField from 'components/forms/styled-fields/StyledAutocompleteTextField';
import React, { useEffect, useRef } from 'react';
import { ListChildComponentProps, VariableSizeList } from 'react-window';

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
    },
  });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef<HTMLDivElement>(
  function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child: React.ReactNode) => {
      if (React.isValidElement(child) && child.type === ListSubheader) {
        return 48;
      }

      return itemSize;
    };

    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * itemSize;
      }
      return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width="100%"
            ref={gridRef}
            outerElementType={OuterElementType}
            innerElementType="ul"
            itemSize={(index) => getChildSize(itemData[index])}
            overscanCount={5}
            itemCount={itemCount}
          >
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  }
);

const useStyles = makeStyles({
  listbox: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

export interface Props<T> extends Omit<AutocompleteProps<T>, 'renderInput'> {
  isOpen?: boolean;
  options: T[];
  id?: string;
  label?: React.ReactNode;
  InputProps?: TextFieldProps['InputProps'];
  textFieldProps?: TextFieldProps;
  fieldError?: string;
  getOptionLabel: (option: T) => string;
  // Note: if this was allowed to be a multi-select, the type may need to
  // be T | T[] | null
  onChange: (_: any, selectedValue: T | null) => void;
  renderOption: (option: T) => React.ReactNode;
  value?: any;
}

export default function DropdownAutocomplete<T = any>({
  isOpen,
  getOptionLabel,
  options,
  id,
  label,
  InputProps,
  textFieldProps,
  fieldError,
  renderOption,
  onChange,
  ...props
}: Props<T>) {
  const classes = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);

  // Click on the autocomplete input when it's being displayed to automatically
  // select all input text so it can be replaced when the user types.
  // Note: Using .focus() alone isn't enough to automatically select the entire
  // input text value
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.click();
    }
  }, [isOpen]);

  return (
    <StyledAutocomplete
      id={id}
      disableListWrap
      openOnFocus
      autoHighlight
      classes={classes}
      // @ts-ignore
      onChange={onChange}
      ListboxComponent={
        ListboxComponent as React.ComponentType<
          React.HTMLAttributes<HTMLElement>
        >
      }
      options={options}
      renderInput={(params) => {
        return (
          <StyledAutocompleteTextField
            label={label}
            {...params}
            {...textFieldProps}
            InputProps={{
              ...params.InputProps,
              startAdornment: InputProps?.startAdornment,
            }}
            inputRef={inputRef}
            {...(fieldError && { error: true, helperText: fieldError })}
          />
        );
      }}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      {...props}
    />
  );
}
