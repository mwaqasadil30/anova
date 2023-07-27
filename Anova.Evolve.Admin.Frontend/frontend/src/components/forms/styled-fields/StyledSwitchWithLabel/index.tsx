import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import { SwitchProps } from '@material-ui/core/Switch';
import StyledSwitch from 'components/forms/styled-fields/Switch';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledFormControl = styled(FormControl)`
  & label {
    color: ${(props) => props.theme.palette.text.primary};
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    transform: none;
    font-weight: 500;
    position: relative;
  }

  /*
    Prevent the form label and asterisk from being colored differently (i.e.
    primary theme color when focusing, red for errors). This is according to
    the designs.
  */
  & [class*='MuiFormLabel-root'][class*='Mui-focused'],
  & [class*='MuiFormLabel-root'][class*='Mui-error'],
  & [class*='MuiFormLabel-asterisk'][class*='Mui-error'] {
    color: inherit;
  }

  & label + [class*='MuiFormControlLabel-root'] {
    margin-top: 8px;
  }
  & .MuiFormControlLabel-root {
    /* Remove material-ui's negative left margin */
    margin-left: 0;

    /* Make the height similar to other input elements */
    min-height: 48px;
  }

  & .MuiFormControlLabel-label {
    margin-left: 8px;
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  }
`;

/**
 * Exclude props that are passed directly to the control
 * https://github.com/mui-org/material-ui/blob/v3.1.1/packages/material-ui/src/FormControlLabel/FormControlLabel.js#L71
 */
export interface StyledSwitchWithLabelProps extends SwitchProps {
  // Add a top margin to the label to align it beside a text field
  label?: React.ReactNode;
  onLabel?: React.ReactNode;
  offLabel?: React.ReactNode;
  errorMessage?: React.ReactNode;
}

const StyledSwitchWithLabel = ({
  label,
  onLabel,
  offLabel,
  ...props
}: StyledSwitchWithLabelProps) => {
  const { t } = useTranslation();
  const { id, checked, errorMessage } = props;

  const cleanOnLabel =
    onLabel !== undefined ? onLabel : t('ui.common.yes', 'Yes');
  const cleanOffLabel =
    offLabel !== undefined ? offLabel : t('ui.common.no', 'No');

  const switchLabel = checked ? cleanOnLabel : cleanOffLabel;

  return (
    <StyledFormControl>
      {label && (
        <InputLabel htmlFor={id} shrink>
          {label}
        </InputLabel>
      )}
      <FormControlLabel
        control={<StyledSwitch {...props} />}
        label={switchLabel}
      />
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </StyledFormControl>
  );
};

export default StyledSwitchWithLabel;
