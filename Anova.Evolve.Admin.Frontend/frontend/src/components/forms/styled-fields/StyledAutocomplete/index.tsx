import MuiAutocomplete, {
  AutocompleteProps,
} from '@material-ui/lab/Autocomplete';
import DropdownCaret from 'components/forms/styled-fields/DropdownCaret';
import React from 'react';

function StyledAutocomplete<T>(props: AutocompleteProps<T>) {
  return <MuiAutocomplete popupIcon={<DropdownCaret />} {...props} />;
}

export default StyledAutocomplete;
