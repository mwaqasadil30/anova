import Box from '@material-ui/core/Box';
import CircularProgress from 'components/CircularProgress';
import React from 'react';
import styled from 'styled-components';

const StyledCircularProgress = styled(CircularProgress)`
  vertical-align: middle;
`;

const StyledAutocompleteCircularProgress = () => {
  return (
    <Box position="absolute" right="32px">
      <StyledCircularProgress color="inherit" size={23} />
    </Box>
  );
};

export default StyledAutocompleteCircularProgress;
