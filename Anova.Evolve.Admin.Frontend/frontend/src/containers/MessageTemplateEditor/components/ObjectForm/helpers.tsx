import {
  DropDownListDtoOfString,
  MessageTemplateDto,
  TimeZoneTypeEnum,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import { fieldIsRequired } from 'utils/forms/errors';
import * as Yup from 'yup';
import { Values } from './types';

enum CurrentState {
  OutsideBracket = 'outside-bracket',
  InsideBracket = 'inside-bracket',
}

export const validateTemplateString = (
  t: TFunction,
  template: string,
  validVariables?: string[]
) => {
  const variableList = [];
  const invalidVariables = [];
  const startErrorPositions = [];
  const endErrorPositions = [];
  let latestOpenBracketPosition = null;
  let currentString = '';

  let currentState: CurrentState | null = CurrentState.OutsideBracket;
  for (let index = 0; index < template.length; index += 1) {
    const character = template[index];

    // You can't start another variable while you're inside one
    if (character === '{' && currentState === CurrentState.InsideBracket) {
      startErrorPositions.push(index + 1);
      // eslint-disable-next-line no-continue
      continue;
    }
    // You end a variable if you're not inside one
    if (character === '}' && currentState === CurrentState.OutsideBracket) {
      endErrorPositions.push(index + 1);
      // eslint-disable-next-line no-continue
      continue;
    }

    if (character === '{') {
      currentState = CurrentState.InsideBracket;

      latestOpenBracketPosition = index + 1;
      // eslint-disable-next-line no-continue
      continue;
    } else if (character === '}') {
      currentState = CurrentState.OutsideBracket;
      variableList.push(currentString);

      if (validVariables && !validVariables?.includes(currentString)) {
        invalidVariables.push(currentString);
      }

      currentString = '';
      // eslint-disable-next-line no-continue
      continue;
    }

    if (currentState === CurrentState.InsideBracket) {
      currentString += character;
    }
  }

  // We've reached the end but a variable hasn't been closed properly
  if (
    currentState === CurrentState.InsideBracket &&
    latestOpenBracketPosition !== null
  ) {
    startErrorPositions.push(latestOpenBracketPosition);
  }

  const isValid =
    startErrorPositions.length === 0 &&
    endErrorPositions.length === 0 &&
    invalidVariables.length === 0;

  return {
    isValid,
    startErrorPositions: startErrorPositions.sort(),
    endErrorPositions: endErrorPositions.sort(),
    invalidVariables,
  };
};

export const getVariableToPreviewTextMapping = (
  additionalVariables?: DropDownListDtoOfString[]
): Record<string, string | undefined> => {
  const allVariables: Record<string, string | undefined> = {
    '{AcknowledgeURL}': '<Click here to acknowledge event>',
    // NOTE:
    // Back-end does not take into account existing templates that have a
    // space inbetween 'Acknowledge URL', so we added it here for back-compat.
    '{Acknowledge URL}': '<Click here to acknowledge event>',
    '{AcknowledgeTranscendURL}':
      '<Click here to acknowledge event on Transcend>',
    '{AssetStatus}':
      'Description: level LatestReading: 50 insWc LatestReadingTime: 2014-05-01 11:01:01',
    '{Asset.Location.GPS}': 'Location: 40.6995998, -74.4024002',
    '{Asset.Notes}': 'Asset Notes',
    '{Asset.Title}': 'ABC Corp Gas Tank',
    '{Customer.Name}': 'ABC Corp',
    '{Customer.Address}': '123 Test Drive Suite 400',
    '{Customer.City}': 'Testville',
    '{Customer.State}': 'CA',
    '{DataChannel.Description}': 'Level',
    '{DataChannel.LastReadingTimestamp}': '2021-04-16 15:42',
    '{DataChannel.ScaledValue}': '40.53',
    '{DataChannel.DisplayLevel}': '35452',
    '{DataChannel.ScaledMax}': '100',
    '{DataChannel.DisplayUnits}': 'lbs',
    '{DataChannel.ScaledUnits}': 'Ins WC',
    '{SelectedTimeZone}':
      '(UTC -05:00) Eastern Time (US & Canada) (Asset Local Time Zone)',
    '{Event.Description}': 'Reorder',
    '{Event.Message}': 'Please refill gas tank soon for optimal reorder level.',
    '{Event.ImportanceLevel}': 'Important',
    '{Event.CreateTimeStamp}': '2021-04-16 15:42',
    '{EventRule.Value}': '36000',
    '{Product.Description}': 'CO2',
    '{RTU.ChannelNumber}': '2',
    '{RTU.DeviceId}': 'FF123456',
    '{Site.Contact}': 'Adam Smith',
    '{Site.TelephoneNumber}': '1-800-123-4567',
    '{TranscendURL}': '<Click here to go to Transcend>',
    '{URL}': '<Click here to go to Asset Detail Page>',
  };

  additionalVariables?.forEach((variable) => {
    allVariables[`{${variable.id!}}`] = variable.value!;
  });

  return allVariables;
};

export const fillInTemplateVariable = (
  template: string,
  variableName: string,
  variableMapping: Record<string, string | undefined>
) => {
  const previewValue = variableMapping[variableName];
  if (!previewValue) {
    return template;
  }

  return template?.replace(variableName, previewValue);
};

export const messageTemplateVariables = [
  '{AcknowledgeURL}',
  // NOTE:
  // Back-end does not take into account existing templates that have a
  // space inbetween 'Acknowledge URL', so we added it here for back-compat.
  '{Acknowledge URL}',
  '{AcknowledgeTranscendURL}',
  '{AssetStatus}',
  '{Asset.Location.GPS}',
  '{Asset.Notes}',
  '{Asset.Title}',
  '{Customer.Name}',
  '{Customer.Address}',
  '{Customer.City}',
  '{Customer.State}',
  '{DataChannel.Description}',
  '{DataChannel.LastReadingTimestamp}',
  '{DataChannel.ScaledValue}',
  '{DataChannel.DisplayLevel}',
  '{DataChannel.ScaledMax}',
  '{DataChannel.DisplayUnits}',
  '{DataChannel.ScaledUnits}',
  '{SelectedTimeZone}',
  '{Event.Description}',
  '{Event.Message}',
  '{Event.ImportanceLevel}',
  '{Event.CreateTimeStamp}',
  '{EventRule.Value}',
  '{Product.Description}',
  '{RTU.ChannelNumber}',
  '{RTU.DeviceId}',
  '{Site.Contact}',
  '{Site.TelephoneNumber}',
  '{TranscendURL}',
  '{URL}',
  '{Asset.CustomField1}',
  '{Asset.CustomField2}',
  '{Asset.CustomField3}',
  '{Asset.CustomField4}',
  '{Asset.CustomField5}',
  '{Asset.CustomField6}',
  '{Asset.CustomField7}',
  '{Asset.CustomField8}',
  '{Asset.CustomField9}',
  '{Asset.CustomField10}',
];

export const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  return Yup.object().shape({
    description: Yup.string()
      .required(fieldIsRequired(t, translationTexts.descriptionText))
      .typeError(fieldIsRequired(t, translationTexts.descriptionText)),
    bodyTemplate: Yup.string()
      .required(fieldIsRequired(t, translationTexts.bodyTemplateText))
      .typeError(fieldIsRequired(t, translationTexts.bodyTemplateText)),
  });
};

export const formatInitialValues = (
  values?: MessageTemplateDto | null
): Values => {
  return {
    description: values?.description || '',
    timeZoneTypeId:
      values?.timeZoneTypeId || TimeZoneTypeEnum.DomainAvailableTimeZone,
    timeZoneId: values?.timeZoneId || '',
    dateFormat: values?.dateFormat || 'yyyy-MM-dd',
    timeFormat: values?.timeFormat || 'HH:mm:ss',
    subjectTemplate: values?.subjectTemplate || '',
    bodyTemplate: values?.bodyTemplate || '',
  };
};

export const formatValuesForApi = (values: Values): MessageTemplateDto => {
  return {
    messageTemplateTypeId: values.messageTemplateTypeId,
    description: values?.description || '',
    domainId: values?.domainId,
    timeZoneTypeId: values?.timeZoneTypeId || null,
    timeZoneId: values?.timeZoneId || null,
    dateFormat: values?.dateFormat || '',
    timeFormat: values?.timeFormat || '',
    subjectTemplate: values?.subjectTemplate || '',
    bodyTemplate: values?.bodyTemplate || '',
  } as MessageTemplateDto;
};

export const mapApiErrorsToFields = (t: TFunction, errors: any) => {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    return formatApiErrors(t, errors);
  }

  return errors;
};
