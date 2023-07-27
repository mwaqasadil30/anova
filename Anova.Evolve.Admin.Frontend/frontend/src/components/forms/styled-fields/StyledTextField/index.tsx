/* eslint-disable indent */
import { fade } from '@material-ui/core/styles';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import DropdownCaret from 'components/forms/styled-fields/DropdownCaret';
import React from 'react';
import styled from 'styled-components';

const StyledMuiTextField = styled(TextField)`
  & [class*='MuiInputLabel-root'] {
    position: relative;
  }

  & label + [class*='MuiInput-formControl'] {
    margin-top: 8px;
  }

  & [class*='MuiInputBase-root'][class*='Mui-disabled'] {
    background: ${(props) =>
      props.theme.palette.type === 'light'
        ? 'rgba(240, 240, 240, 0.5)'
        : 'rgba(255, 255, 255, 0.16)'};
    color: ${(props) =>
      props.theme.palette.type === 'light'
        ? fade(props.theme.palette.text.primary, 0.37)
        : fade(props.theme.palette.text.secondary, 0.3)};
    border: 2px solid transparent;
  }

  & label {
    color: ${(props) => props.theme.palette.text.primary};
    /* NOTE: THIS REDUCES THE LABEL FONT SIZES! */
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    transform: none;
    font-weight: 500;
  }
  & [class*='MuiInput-root'] {
    border: 2px solid transparent;
    border-radius: 5px;
    background: ${(props) =>
      props.theme.palette.type === 'light'
        ? '#F0F0F0'
        : 'rgba(255, 255, 255, 0.26)'};
    transition: ${(props) =>
      props.theme.transitions.create('background', {
        duration: props.theme.transitions.duration.shortest,
        easing: props.theme.transitions.easing.easeOut,
      })};
    /* Use a different input text color in dark mode */
    ${(props) =>
      props.theme.palette.type === 'dark' &&
      `
      color: ${props.theme.palette.text.secondary};
    `};
  }
  & [class*='MuiInput-root']:hover {
    background: ${(props) =>
      props.theme.palette.type === 'light'
        ? 'rgba(240, 240, 240, 0.75)'
        : 'rgba(255, 255, 255, 0.21)'};
  }
  & [class*='MuiInput-root'][class*='Mui-focused'] {
    border-color: ${(props) => props.theme.palette.text.secondary};
  }
  & [class*='MuiInput-root'][class*='Mui-error'] {
    border-color: ${(props) => props.theme.palette.error.main};
  }
  & [class*='MuiInput-input'] {
    /* Add some spacing on the left and right of the input */
    padding-left: 12px;
    padding-right: 12px;
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    /*
      With the default Material UI padding, this adds up to roughly a 38px
      height
    */
    padding: 10px 7px;
  }

  & [class*='MuiInput-multiline'] {
    /*
      Reduce extra padding at the top of a multiline text field outside of the
      multiline field's <textarea>
    */
    padding: 0px; // Default was 6px 0px 7px
  }

  & [class*='MuiInputBase-inputMultiline'] {
    /*
      Reduce extra top padding within <textarea>
    */
    padding: 2px 7px; // Default was 10px 7px
  }

  & [class*='MuiSelect-select'][class*='MuiInput-input'] {
    /*
      Add more padding on the right of select dropdowns to prevent long text
      from overlapping over the caret
    */
    padding-right: 26px;
    padding: 8px 7px;
  }
  &
    [class*='MuiInput-root'][class*='Mui-focused']
    > [class*='MuiSelect-select'] {
    /* Change the background color of a focused select dropdown to be slightly lighter than the default */
    background: ${(props) =>
      props.theme.palette.type === 'light'
        ? 'rgba(240, 240, 240, 0.3)'
        : 'rgba(255, 255, 255, 0.16)'};
  }

  /* Weird height-related styles */
  & [class*='MuiSelect-icon'] {
    /* 50% minus half the height of the used select icon */
    top: calc(50% - 3px);
    /* Spacing to the right of the icon so it's not up against the right edge */
    margin-right: 12px;
  }

  /* Kept styles */
  /*
    Prevent the form label and asterisk from being colored differently (i.e.
    primary theme color when focusing, red for errors). This is according to
    the designs.
  */
  [class*='MuiFormLabel-root'][class*='Mui-focused'],
  [class*='MuiFormLabel-root'][class*='Mui-error'],
  [class*='MuiFormLabel-asterisk'][class*='Mui-error'] {
    color: inherit;
  }
`;

const StyledTextField = (props: TextFieldProps) => {
  const { select, InputProps, SelectProps, InputLabelProps } = props;

  const customInputLabelProps = {
    shrink: true,
    ...InputLabelProps,
  };
  const customInputProps = {
    disableUnderline: true,
    ...InputProps,
  };
  const customSelectProps = {
    IconComponent: DropdownCaret,
    ...SelectProps,
    MenuProps: {
      ...SelectProps?.MenuProps,
      PaperProps: {
        square: true,
        ...SelectProps?.MenuProps?.PaperProps,
      },
    },
  };

  return (
    <StyledMuiTextField
      fullWidth
      {...props}
      InputLabelProps={customInputLabelProps}
      InputProps={customInputProps}
      {...(select && {
        SelectProps: customSelectProps,
      })}
    />
  );
};

export default StyledTextField;
