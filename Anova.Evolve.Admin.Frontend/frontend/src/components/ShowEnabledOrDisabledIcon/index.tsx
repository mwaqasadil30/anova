import React from 'react';
import { ReactComponent as EnabledIcon } from 'assets/icons/enabled-check.svg';
import { ReactComponent as BlackCheckmarkIcon } from 'assets/icons/black-checkmark.svg';
import { ReactComponent as DisabledIcon } from 'assets/icons/disabled-cross.svg';
import styled from 'styled-components';

export const StyledEnabledIcon = styled(EnabledIcon)`
  margin-top: 4px;
`;

export const StyledBlackCheckmarkIcon = styled(BlackCheckmarkIcon)`
  margin-top: 4px;
  color: ${(props) => props.theme.palette.text.primary};
`;

export const StyledDisabledBlackCheckmarkIcon = styled(BlackCheckmarkIcon)`
  margin-top: 4px;
  /* color: rgba(216, 216, 216); */
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? 'rgba(216, 216, 216)'
      : 'rgba(119, 119, 119)'};
`;

export const StyledDisabledIcon = styled(DisabledIcon)`
  margin-top: 5px;
  height: 18px;
  width: 18px;
  color: ${(props) => props.theme.custom.palette.icon.fadedColor};
`;

interface Props {
  isEnabled?: boolean;
  showBlackCheck?: boolean;
  showDisabledCheckmarkIcon?: boolean;
}

const ShowEnabledOrDisabledIcon = ({
  isEnabled,
  showBlackCheck,
  showDisabledCheckmarkIcon,
}: Props) => {
  const DisabledCheckIcon = showDisabledCheckmarkIcon
    ? StyledDisabledBlackCheckmarkIcon
    : StyledBlackCheckmarkIcon;

  const EnabledCheckIcon = showBlackCheck
    ? DisabledCheckIcon
    : StyledEnabledIcon;
  return isEnabled ? <EnabledCheckIcon /> : <StyledDisabledIcon />;
};

export default ShowEnabledOrDisabledIcon;
