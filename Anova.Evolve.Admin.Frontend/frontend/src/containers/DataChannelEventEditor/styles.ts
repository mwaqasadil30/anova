import Typography from '@material-ui/core/Typography';
import FieldGroup from 'components/forms/styled-fields/FieldGroup';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import TableCell from 'components/tables/components/TableCell';
import styled from 'styled-components';

export const StyledFieldGroup = styled(FieldGroup)`
  display: flex;
  align-items: flex-end;
`;

export const StyledComparatorText = styled(StyledTextField)`
  min-width: 40px;
  max-width: 40px;

  & .MuiInput-input {
    text-align: center;
  }
`;

export const StyledEventText = styled(Typography)`
  font-size: 16px;
`;

export const StyledEventDescriptionText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 400;
`;

// The secondary text styles were adjusted to be simlar to the event text (they
// were previously smaller and lighter)
export const StyledSecondaryText = StyledEventText;

// Used to center align text along-side other text fields when they have
// validation errors
export const StyledSecondaryTextWithHeight = styled(StyledSecondaryText)`
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

export const TableBodyCellForRTUSyncIcon = styled(TableCell)`
  padding: 0;
  text-align: center;
`;
