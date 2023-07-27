import Box from '@material-ui/core/Box';
import Button, { ButtonProps } from 'components/Button';
import CircularProgress from 'components/CircularProgress';
import React from 'react';

export interface Props extends ButtonProps {
  children?: React.ReactNode;
  isLoading?: boolean;
}

const LoadingButton = ({
  children,
  isLoading,
  onClick,
  ...buttonProps
}: Props) => {
  return (
    <Box position="relative">
      <Button
        variant="contained"
        onClick={onClick}
        disabled={isLoading}
        style={{ minWidth: 100 }}
        {...buttonProps}
      >
        {children}
      </Button>
      {isLoading && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          marginTop="-9px"
          marginLeft="-11px"
        >
          <CircularProgress size={20} />
        </Box>
      )}
    </Box>
  );
};

export default LoadingButton;
