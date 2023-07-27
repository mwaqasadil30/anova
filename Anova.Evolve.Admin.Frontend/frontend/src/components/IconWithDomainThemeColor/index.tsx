import styled from 'styled-components';

const IconWithDomainThemeColor = styled.svg`
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? props.theme.custom.domainSecondaryColor
      : props.theme.custom.domainColor};
`;

export default IconWithDomainThemeColor;
