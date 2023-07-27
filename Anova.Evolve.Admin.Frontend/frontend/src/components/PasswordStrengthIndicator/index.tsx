import PasswordStrengthIndicatorBase from 'components/PasswordStrengthIndicatorBase';
import React from 'react';
import { getPasswordStrengthLevel } from 'utils/ui/password';

interface Props {
  password?: string | null;
  dense?: boolean;
}

const PasswordStrengthIndicator = ({ dense, password }: Props) => {
  const passwordStrengthLevel = getPasswordStrengthLevel(password);

  return (
    <PasswordStrengthIndicatorBase
      dense={dense}
      level={passwordStrengthLevel}
    />
  );
};

export default PasswordStrengthIndicator;
