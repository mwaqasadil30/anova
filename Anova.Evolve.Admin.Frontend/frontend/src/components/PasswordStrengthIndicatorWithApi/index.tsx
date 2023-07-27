import { OverallPasswordStrength } from 'api/admin/api';
import PasswordStrengthIndicatorBase from 'components/PasswordStrengthIndicatorBase';
import useDebouncedValue from 'hooks/useDebouncedValue';
import { useVerifyPasswordStrength } from 'hooks/useVerifyPasswordStrength';
import React from 'react';

interface Props {
  password?: string | null;
  dense?: boolean;
}

const PasswordStrengthIndicatorWithApi = ({ dense, password }: Props) => {
  const debouncedPassword = useDebouncedValue(password, 300);
  const verifyPasswordStrengthApi = useVerifyPasswordStrength({
    newPassword: debouncedPassword,
  });

  const passwordStrengthLevel =
    !!debouncedPassword &&
    verifyPasswordStrengthApi.data?.overallPasswordStrength
      ? verifyPasswordStrengthApi.data?.overallPasswordStrength
      : OverallPasswordStrength.None;

  return (
    <PasswordStrengthIndicatorBase
      dense={dense}
      level={passwordStrengthLevel}
    />
  );
};

export default PasswordStrengthIndicatorWithApi;
