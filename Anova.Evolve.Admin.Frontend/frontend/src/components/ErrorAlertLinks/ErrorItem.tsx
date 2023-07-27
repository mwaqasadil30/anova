import React from 'react';
import Box from '@material-ui/core/Box';
import MuiLink from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import WarningIcon from '@material-ui/icons/Warning';
import styled from 'styled-components';
import { errorMessageBlockBackground, red500 } from 'styles/colours';
import Typography from '@material-ui/core/Typography';

const StyledWarningIcon = styled(WarningIcon)`
  color: ${red500};
  font-size: 20px;
  vertical-align: middle;
`;

const ErrorMessage = styled(Typography)`
  font-size: 14px;
`;

interface Props {
  highlighted?: boolean;
  message: React.ReactNode;
  onClick: () => void;
}

const ErrorItem = ({ highlighted, message, onClick }: Props) => {
  const handleClickItem = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onClick();
  };

  return (
    <Box
      p={1}
      display="block"
      component={MuiLink}
      color="inherit"
      // @ts-ignore
      href="#"
      onClick={handleClickItem}
      bgcolor={highlighted ? errorMessageBlockBackground : undefined}
    >
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <StyledWarningIcon />
        </Grid>
        <Grid item xs>
          <ErrorMessage>{message}</ErrorMessage>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ErrorItem;
