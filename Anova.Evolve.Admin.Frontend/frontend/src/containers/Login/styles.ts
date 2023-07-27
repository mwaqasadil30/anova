import BackIconButton from 'components/buttons/BackIconButton';
import styled from 'styled-components';

export const StyledBackIconButton = styled(BackIconButton)`
  color: ${(props) => props.theme.palette.text.secondary};
  & svg {
    width: 30px;
    height: 30px;
  }
`;
