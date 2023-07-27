import { TextFieldProps } from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { ReactComponent as EyeClosed } from 'assets/icons/eye-closed.svg';
import { ReactComponent as EyeOpen } from 'assets/icons/eye-open.svg';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React, { useState } from 'react';
import styled from 'styled-components';

const StyledEyeClosedIcon = styled(EyeClosed)`
  color: #a8a8a8;
`;
const StyledEyeOpenIcon = styled(EyeOpen)`
  color: #a8a8a8;
`;

const StyledPasswordField = (props: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <StyledTextField
      type={showPassword ? 'text' : 'password'}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <StyledEyeClosedIcon /> : <StyledEyeOpenIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default StyledPasswordField;
