import React from 'react';
import DropdownAutocomplete, {
  Props as DropdownAutocompleteProps,
} from 'components/forms/styled-fields/DropdownAutocomplete';

export interface Props<T> extends DropdownAutocompleteProps<T> {}

function EmptyDropdownAutocomplete<T = any>(props: Props<T>) {
  const { onChange } = props;

  const [inputValue, setInputValue] = React.useState('');

  return (
    <DropdownAutocomplete<T>
      {...props}
      // Convert this to a controlled autocomplete. This way, the
      // user can continue adding tags, without losing focus on the
      // field. When the user selects an option, add it to the list.
      // The autocomplete always has no value.
      value={null}
      inputValue={inputValue}
      onChange={(event: any, selectedValue: T | null) => {
        onChange(event, selectedValue);
        setInputValue('');
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
    />
  );
}

export default EmptyDropdownAutocomplete;
