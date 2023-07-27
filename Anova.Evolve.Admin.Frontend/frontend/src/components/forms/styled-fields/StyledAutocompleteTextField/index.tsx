/* eslint-disable indent */
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import styled from 'styled-components';

const StyledAutocompleteTextField = styled(StyledTextField)`
  [class*='MuiAutocomplete-inputRoot'][class*='MuiInput-root']
    [class*='MuiAutocomplete-input']:first-child {
    padding: 9px 7px;
  }

  & [class*='MuiInput-root'],
  & [class*='MuiInput-root']:hover,
  & [class*='MuiInput-root']:focus,
  & [class*='MuiInput-root']:active {
    /*
      Padding to account for very long text on the field minus the dropdown
      caret and clear icon
      TODO: Find out what CSS is removing the padding so the !important can be
      removed.
    */
    padding-right: 66px !important;
  }

  & [class*='MuiAutocomplete-endAdornment'] {
    margin-right: 5px;
  }

  & [class*='MuiAutocomplete-popupIndicator'] {
    padding: 9px;

    svg {
      height: 10px;
    }
  }
`;

export default StyledAutocompleteTextField;
