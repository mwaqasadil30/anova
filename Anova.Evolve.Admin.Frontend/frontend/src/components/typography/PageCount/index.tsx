import React from 'react';
import styled from 'styled-components';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

const StyledPageCount = styled(Typography)`
  && {
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;

const PageCount = (props: TypographyProps) => {
  return <StyledPageCount aria-label="Item count" {...props} />;
};

export default PageCount;
