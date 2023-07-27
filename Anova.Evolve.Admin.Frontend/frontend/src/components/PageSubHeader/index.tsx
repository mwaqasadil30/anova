import Typography, { TypographyProps } from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

const StyledTypography = styled(({ dense, ...props }) => (
  <Typography {...props} />
))`
  font-weight: 600;
  margin-bottom: ${(props) => (props.dense ? 0 : 30)}px;
  font-size: 16px;
`;

interface Props extends TypographyProps {
  dense?: boolean;
}

const PageSubHeader = (props: Props) => {
  return <StyledTypography variant="h5" {...props} />;
};

export default PageSubHeader;
