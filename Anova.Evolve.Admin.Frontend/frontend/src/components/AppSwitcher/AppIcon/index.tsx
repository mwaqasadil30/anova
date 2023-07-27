/* eslint-disable indent */
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';
import { getCustomDomainContrastText } from 'styles/colours';

const StyledWrapper = styled(({ active, disabled, ...props }) => (
  <div {...props} />
))`
  text-align: center;
  padding: 24px;
  min-height: 160px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${(props) => (props.disabled ? 'cursor: not-allowed;' : '')}

  background-color: ${(props) =>
    props.active ? props.theme.custom.domainColor : '#333333'};

  &:hover {
    ${(props) =>
      !props.disabled &&
      `
      background-color: ${props.theme.custom.domainColor};

      p {
        color: ${getCustomDomainContrastText(props.theme.custom.domainColor)};
      }

      svg {
        color: ${getCustomDomainContrastText(props.theme.custom.domainColor)};
      }
    `}
  }

  svg {
    color: ${(props) =>
      props.active
        ? getCustomDomainContrastText(props.theme.custom.domainColor)
        : '#838383'};
  }
`;
const StyledText = styled(({ active, ...props }) => <Typography {...props} />)`
  font-weight: 500;
  font-size: 14px;
  /* Override the default link color */
  color: ${(props) =>
    props.active
      ? getCustomDomainContrastText(props.theme.custom.domainColor)
      : 'rgba(255, 255, 255, 0.67)'};
  line-height: 20px;
`;

interface Props {
  IconComponent: React.ComponentType;
  text: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

const AppIcon = ({ IconComponent, text, active, disabled }: Props) => {
  const isCurrentlySelectedApp = active;

  return (
    <StyledWrapper active={isCurrentlySelectedApp} disabled={disabled}>
      <IconComponent />
      <StyledText active={isCurrentlySelectedApp}>{text}</StyledText>
    </StyledWrapper>
  );
};

export default AppIcon;
