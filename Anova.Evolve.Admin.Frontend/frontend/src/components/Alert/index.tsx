import React from 'react';
import styled from 'styled-components';
import MuiAlert, { AlertProps as MuiAlertProps } from '@material-ui/lab/Alert';

const StyledAlert = styled(MuiAlert)`
  & [class*='MuiAlert-root'] {
    border-radius: 6px;
  }
`;

export type AlertProps = MuiAlertProps;

const Alert = (props: AlertProps) => {
  // TODO: Render icons provided from Figma instead of using material-ui's
  // defaults
  return <StyledAlert variant="filled" {...props} />;
};

export default Alert;
