import { SnackbarProvider } from 'notistack';
import React from 'react';
import { ReactComponent as CheckmarkIcon } from 'assets/icons/white-checkmark.svg';
import styled from 'styled-components';

const StyledCheckmarkIcon = styled(CheckmarkIcon)`
  padding-right: 12px;
`;

const StyledSnackBarProvider = styled(SnackbarProvider)`
  & [class*='SnackbarItem-message'] {
    padding: 6px 0px;
    font-weight: 500;
    font-size: 14px;
  }

  // TODO: This min-width must be custom, or we must style this snackbar to
  // re-size dynamically based on text-length (partly because of translations).
  min-width: 225px;
  background-color: #3bb573;
  border-radius: 0 0 10px 10px;
  margin-top: -24px;
  height: 28px;
`;

interface Props {
  children: React.ReactNode;
}

const SnackbarNotificationProvider = ({ children }: Props) => {
  return (
    <StyledSnackBarProvider
      maxSnack={1}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      autoHideDuration={5000}
      iconVariant={{
        success: <StyledCheckmarkIcon />,
      }}
    >
      {children}
    </StyledSnackBarProvider>
  );
};

export default SnackbarNotificationProvider;
