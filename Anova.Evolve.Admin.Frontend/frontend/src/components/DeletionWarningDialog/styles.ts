import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

// Using a styled component in case styles are to be adjusted in the future
export const DeleteUnorderedList = styled.ul``;

export const DeleteListItem = styled(Typography).attrs(() => ({
  component: 'li',
}))`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;
