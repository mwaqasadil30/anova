import Typography from '@material-ui/core/Typography';
import { OverallPasswordStrength } from 'api/admin/api';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { getTextForPasswordStrengthLevel } from 'utils/i18n/enum-to-text';
import { passwordStrengthColours } from 'utils/ui/password';

const commonBarStyles = css`
  height: 4px;
  border-radius: ${(props) => props.theme.shape.borderRadius}px;
`;

const BarBackground = styled.div`
  ${commonBarStyles};
  background: ${(props) =>
    props.theme.palette.type === 'dark' ? '#585858' : '#f0f0f0'};
`;

const BarFill = styled(({ level, ...props }) => <div {...props} />)`
  ${commonBarStyles};

  background: ${(props) =>
    props.level ? passwordStrengthColours[props.level] : 'transparent'};

  width: ${(props) =>
    (props.level / (passwordStrengthColours.length - 1)) * 100}%;
`;

const Label = styled(Typography)`
  font-weight: 500;
  margin-bottom: 8px;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const PasswordStrengthLevelText = styled(Typography)`
  color: ${(props) => props.theme.palette.text.secondary};
`;

const LabelWrapper = styled.div<{ $dense?: boolean }>`
  margin-bottom: 8px;

  ${(props) =>
    props.$dense &&
    `
    min-width: 210px;
    margin-bottom: 0;

    & .password-strength-label, & .password-strength-text {
      font-size: ${props.theme.typography.pxToRem(13)};
    }
  `}
`;

interface Props {
  level: OverallPasswordStrength;
  dense?: boolean;
}

const PasswordStrengthIndicatorBase = ({ dense, level }: Props) => {
  const { t } = useTranslation();

  const textForPasswordStrengthLevel = getTextForPasswordStrengthLevel(
    t,
    level || OverallPasswordStrength.None
  );

  return (
    <div>
      <LabelWrapper $dense={dense}>
        <Label display="inline" className="password-strength-label">
          {t('ui.changepassword.passwordStrength', 'Password Strength')}:
        </Label>{' '}
        <PasswordStrengthLevelText
          display="inline"
          className="password-strength-text"
        >
          {textForPasswordStrengthLevel}
        </PasswordStrengthLevelText>
      </LabelWrapper>
      <BarBackground>
        <BarFill level={level} />
      </BarBackground>
    </div>
  );
};

export default PasswordStrengthIndicatorBase;
