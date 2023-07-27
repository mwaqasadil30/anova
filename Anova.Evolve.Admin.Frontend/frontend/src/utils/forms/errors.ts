import { TFunction } from 'i18next';

export const fieldMustBeNumber = (t: TFunction, field: string) =>
  t('validate.common.mustbeanumber', '{{field}} must be a number.', { field });

export const fieldIsRequired = (t: TFunction, field: string) =>
  t('validate.common.isrequired', '{{field}} is required.', { field });

export const fieldMinimumOrEqualNumber = (
  t: TFunction,
  field: string,
  minimum: number
) =>
  t(
    'validate.common.numberMinimumValue',
    '{{field}} must be greater than or equal to {{minimum}}.',
    { field, minimum }
  );

export const fieldBetweenNumberRange = (
  t: TFunction,
  field: string,
  minimum: number,
  maximum: number
) =>
  t(
    'validate.common.numberBetweenRange',
    '{{field}} must be between {{minimum}} and {{maximum}}.',
    { field, minimum, maximum }
  );

export const fieldIsIncorrect = (t: TFunction, field: string) =>
  t('validate.common.isIncorrect', '{{field}} is incorrect.', { field });

export const fieldMustBeAnEmail = (t: TFunction, field: string) =>
  t('validate.common.mustBeAnEmail', '{{field}} must be a valid email.', {
    field,
  });

export const fieldMaxLength = (t: TFunction) => ({ max }: { max: number }) =>
  t(
    'validate.customproperties.greaterthanmaxlength',
    `Input is beyond maximum length of {{max}}.`,
    { max }
  );

export const fieldAlreadyExists = (t: TFunction, field: string) =>
  t('validate.common.recordAlreadyExists', '{{field}} already exists.', {
    field,
  });
