import React, { ReactNode } from 'react';
import moment from 'moment';
import 'moment-duration-format';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { isNumber } from 'utils/format/numbers';

const IconWithSpacing = styled('div')`
  margin-right: 0.5em;
`;

const formatNumberValue = (value?: string | number | null) => {
  if (!isNumber(value)) {
    return value;
  }

  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 4 });
};

const StyledTextValue = styled(
  ({
    ariaLabel,
    textLabel,
    value,
    valueTextAriaLabel,
    valueColor,
    valueType,
    textSize,
    ...props
  }) => {
    const { t } = useTranslation();
    let valueString = value;
    if (valueString !== undefined) {
      if (valueType === 'percentage') {
        valueString = `${valueString}%`;
      } else if (valueType === 'time') {
        valueString = moment.duration(valueString, 'hours').format('hh[h]');
      } else if (valueType === 'temperature') {
        valueString = `${formatNumberValue(valueString)} °C`;
      } else if (valueType === 'rpm') {
        valueString = `${formatNumberValue(valueString)} RPM`;
      } else if (valueType === 'kg') {
        valueString = `${formatNumberValue(valueString)} Kg`;
      } else {
        valueString = formatNumberValue(valueString);
      }
    } else {
      valueString = t('ui.common.notapplicable', 'N/A');
    }

    // if valueTextAriaLabel is not passed to EmphasizedValue component
    // aria-label is composed of label and valueString
    const ariaLabelString = ariaLabel || `${textLabel} ${valueString}`;
    return (
      <Typography aria-label={ariaLabelString} {...props}>
        {valueString}
      </Typography>
    );
  }
)`
  font-size: ${(props) => (props.textSize === 'small' ? 1 : 1.5)}rem;
  color: ${(props) =>
    props.valueColor ? props.valueColor : props.theme.palette.text.primary};
`;

const StyledTextLabel = styled(Typography)`
  color: ${(props) => props.theme.palette.text.secondary};
  font-size: 0.875rem;
`;

interface EmphasizedValueProps {
  value?: string | number;
  valueTextAriaLabel?: string;
  valueType?: 'none' | 'percentage' | 'time' | 'temperature' | 'rpm' | 'kg';
  valueColor?: string;
  label: string;
  textSize?: 'small' | 'medium';
  icon?: ReactNode;
}

const EmphasizedValue = ({
  value,
  valueType = 'none',
  valueColor,
  valueTextAriaLabel,
  label,
  icon,
  textSize = 'medium',
}: EmphasizedValueProps) => {
  return (
    <Box display="flex" alignItems="center" minHeight="56px">
      {icon && <IconWithSpacing>{icon}</IconWithSpacing>}
      <Box>
        <StyledTextValue
          value={value}
          valueType={valueType}
          textSize={textSize}
          valueColor={valueColor}
          variant="h4"
          ariaLabel={valueTextAriaLabel}
          textLabel={label}
        />
        <StyledTextLabel variant="h3">{label}</StyledTextLabel>
      </Box>
    </Box>
  );
};

export default EmphasizedValue;
