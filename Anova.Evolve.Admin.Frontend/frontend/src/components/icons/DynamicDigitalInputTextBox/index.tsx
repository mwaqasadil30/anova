import React from 'react';
import { useTranslation } from 'react-i18next';
import { isNumber } from 'utils/format/numbers';
import { getDigitalInputDisplayText } from 'utils/ui/digital-input';
import WrapperBox from './WrapperBox';

interface DigitalInputProps {
  value?: number | null;
  stateZeroText?: string | null;
  stateOneText?: string | null;
  stateTwoText?: string | null;
  stateThreeText?: string | null;
}

const DynamicDigitalInputTextBox = ({
  value,
  stateZeroText,
  stateOneText,
  stateTwoText,
  stateThreeText,
}: DigitalInputProps) => {
  const { t } = useTranslation();

  if (!isNumber(value)) {
    return <WrapperBox text={t('ui.common.notapplicable', 'N/A')} />;
  }

  const valueText = getDigitalInputDisplayText({
    value,
    stateZeroText,
    stateOneText,
    stateTwoText,
    stateThreeText,
  });

  return <WrapperBox text={valueText || t('ui.common.notapplicable', 'N/A')} />;
};

export default DynamicDigitalInputTextBox;
