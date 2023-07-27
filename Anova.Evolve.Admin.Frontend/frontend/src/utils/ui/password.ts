import { OverallPasswordStrength } from 'api/admin/api';
import { TFunction } from 'i18next';

export interface PasswordRequirementItem {
  isValid: boolean;
  label: React.ReactNode;
}

interface AllPasswordRequirements {
  hasValidLength: boolean;
  hasAtLeastOneUppercaseLetter: boolean;
  hasAtLeastOneNumber: boolean;
  hasNoSpaces: boolean;
  hasAtLeastOneSpecialCharacter: boolean;
}

export const passwordStrengthColours = [
  'transparent',
  '#d72c20',
  '#FFA132',
  '#2069d7',
  '#2069d7',
  '#86D720',
];

export const hasValidLength = (password: string) => password.length >= 8;
export const hasAtLeastOneSpecialCharacter = (password: string) =>
  /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password);
export const hasAtLeastOneUppercaseLetter = (password: string) =>
  password.toLowerCase() !== password;
export const hasAtLeastOneNumber = (password: string) => /\d/.test(password);
export const hasNoSpaces = (password: string) => !/\s/g.test(password);

export const validateAllPasswordRequirements = (
  password: string
): AllPasswordRequirements => {
  const passwordHasValidLength = hasValidLength(password);
  const passwordHasAtLeastOneUppercaseLetter = hasAtLeastOneUppercaseLetter(
    password
  );
  const passwordHasAtLeastOneNumber = hasAtLeastOneNumber(password);
  const passwordHasNoSpaces = hasNoSpaces(password);
  const passwordHasAtLeastOneSpecialCharacter = hasAtLeastOneSpecialCharacter(
    password
  );

  return {
    hasValidLength: passwordHasValidLength,
    hasAtLeastOneUppercaseLetter: passwordHasAtLeastOneUppercaseLetter,
    hasAtLeastOneNumber: passwordHasAtLeastOneNumber,
    hasNoSpaces: passwordHasNoSpaces,
    hasAtLeastOneSpecialCharacter: passwordHasAtLeastOneSpecialCharacter,
  };
};

export const buildPasswordRequirementsLabels = (
  t: TFunction,
  validatedRequirements: AllPasswordRequirements
): PasswordRequirementItem[] => {
  return [
    {
      isValid: validatedRequirements.hasValidLength,
      label: t(
        'ui.resetPassword.criteria.characterLimits',
        'Minimum 8 characters'
      ),
    },
    {
      isValid: validatedRequirements.hasAtLeastOneUppercaseLetter,
      label: t(
        'ui.resetPassword.criteria.oneUppercaseLetter',
        'Uppercase character'
      ),
    },
    {
      isValid: validatedRequirements.hasAtLeastOneSpecialCharacter,
      label: t(
        'ui.resetPassword.criteria.oneSpecialCharacter',
        'Special character'
      ),
    },
    {
      isValid: validatedRequirements.hasAtLeastOneNumber,
      label: t('ui.resetPassword.criteria.oneNumber', 'Number'),
    },
    {
      isValid: validatedRequirements.hasNoSpaces,
      label: t('ui.resetPassword.criteria.noSpaces', 'Must NOT contain spaces'),
    },
  ];
};

// Obtained from: https://stackoverflow.com/a/11268104
const scorePassword = (password: string) => {
  let score = 0;
  if (!password) return score;

  // award every unique letter until 5 repetitions
  const letters = {};
  for (let i = 0; i < password.length; i += 1) {
    // @ts-ignore
    letters[password[i]] = (letters[password[i]] || 0) + 1;
    // @ts-ignore
    score += 5.0 / letters[password[i]];
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(password),
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    nonWords: /\W/.test(password),
  };

  let variationCount = 0;
  Object.keys(variations).forEach((check) => {
    // @ts-ignore
    variationCount += variations[check] === true ? 1 : 0;
  });

  score += (variationCount - 1) * 10;

  return score;
};

export const getPasswordStrengthLevel = (
  password?: string | null
): OverallPasswordStrength => {
  if (!password) {
    return OverallPasswordStrength.None;
  }

  const score = scorePassword(password);
  if (score > 90) {
    return OverallPasswordStrength.Excellent;
  }
  if (score > 75) {
    return OverallPasswordStrength.Strong;
  }
  if (score > 50) {
    return OverallPasswordStrength.Good;
  }
  if (score > 25) {
    return OverallPasswordStrength.Fair;
  }
  return OverallPasswordStrength.Weak;
};
