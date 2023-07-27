import Box from '@material-ui/core/Box';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

const StyledTypography = styled(Typography)`
  && {
    font-weight: 600;
    font-size: 20px;
    color: ${(props) => props.theme.palette.text.primary};
  }
  color: ${(props) => props.theme.palette.text.primary};
`;

interface Props extends TypographyProps {
  dense?: boolean;
}

const PageHeader = ({ dense, ...typographyProps }: Props) => {
  return (
    <Box mb={dense ? [] : [0, 0, 3]}>
      <StyledTypography
        variant="h1"
        aria-label="Page header"
        {...typographyProps}
      />
    </Box>
  );
};

export default PageHeader;
