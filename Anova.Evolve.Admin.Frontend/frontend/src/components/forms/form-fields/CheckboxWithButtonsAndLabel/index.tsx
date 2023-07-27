/* eslint-disable indent */
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { FieldProps } from 'formik';
import { CheckboxProps } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getCustomDomainContrastText } from 'styles/colours';

const StyledFormControl = styled(FormControl)`
  & label {
    color: ${(props) => props.theme.palette.text.primary};
    font-size: 16px;
    transform: none;
    font-weight: 500;
    position: relative;
  }

  & label + [class*='MuiInput-formControl'] {
    margin-top: 24px;
  }

  & label + .MuiToggleButtonGroup-root {
    margin-top: 8px;
  }

  & .MuiToggleButtonGroup-root > .MuiToggleButton-root {
    min-width: 68px;
  }

  /* Remove the middle border when the "Yes" button is selected */
  & .MuiToggleButtonGroup-grouped:not(:first-child) {
    border-left: 0;
    margin-left: 0; /* Remove -1px margin from material UI */
  }
  & .MuiToggleButtonGroup-grouped:not(:last-child) {
    border-right: 0;
  }

  /* Styles for the UNSELECTED button */
  & .MuiToggleButton-root {
    color: ${(props) => props.theme.palette.text.primary};
    border-color: ${(props) => props.theme.palette.text.secondary};
  }

  /* Styles for the SELECTED button */
  & .MuiToggleButton-root.Mui-selected {
    ${(props) => {
      const dominantDomainColor =
        props.theme.palette.type === 'light'
          ? props.theme.custom.domainSecondaryColor
          : props.theme.custom.domainColor;
      const textColorForDominantColor = getCustomDomainContrastText(
        dominantDomainColor
      );

      return `
        border-color: transparent;
        background-color: ${dominantDomainColor};
        color: ${textColorForDominantColor};
      `;
    }}
  }
`;

/**
 * Exclude props that are passed directly to the control
 * https://github.com/mui-org/material-ui/blob/v3.1.1/packages/material-ui/src/FormControlLabel/FormControlLabel.js#L71
 */
export interface CheckboxToggleButtonsWithLabelProps
  extends FieldProps,
    CheckboxProps {
  // Add a top margin to the label to align it beside a text field
  withTopMargin?: boolean;
  // Label: Omit<
  //   MuiFormControlLabelProps,
  //   'checked' | 'name' | 'onChange' | 'value' | 'control'
  // >;
  label?: React.ReactNode;
}

const CheckboxToggleButtonsWithLabel = ({
  label,
  withTopMargin,
  ...props
}: CheckboxToggleButtonsWithLabelProps) => {
  const { t } = useTranslation();
  const { id, field, form, disabled } = props;
  const errorMessage = form.errors[field.name];

  const handleToggleChange = (event: any, isChecked: boolean | null) => {
    if (isChecked !== null) {
      form.setFieldValue(field.name, isChecked);
    }
  };

  return (
    <StyledFormControl>
      {label && (
        <InputLabel htmlFor={id} shrink>
          {label}
        </InputLabel>
      )}
      <ToggleButtonGroup
        id={id}
        value={field.value}
        exclusive
        onChange={handleToggleChange}
        aria-label="Is enabled"
      >
        <ToggleButton value disabled={disabled}>
          {t('ui.common.yes', 'Yes')}
        </ToggleButton>
        <ToggleButton value={false} disabled={disabled}>
          {t('ui.common.no', 'No')}
        </ToggleButton>
      </ToggleButtonGroup>
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </StyledFormControl>
  );
};

export default CheckboxToggleButtonsWithLabel;
