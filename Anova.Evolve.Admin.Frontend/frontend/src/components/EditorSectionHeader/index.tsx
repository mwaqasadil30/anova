import Typography, { TypographyProps } from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

const StyledTypography = styled(({ dense, ...props }) => (
  <Typography {...props} />
))`
  font-weight: 600;
  margin-top: ${(props) => (props.dense ? 0 : 30)}px;
  font-size: 1.3rem;
`;

interface Props extends TypographyProps {
  dense?: boolean;
}

const EditorSectionHeader = (props: Props) => {
  return <StyledTypography variant="h5" {...props} />;
};

export default EditorSectionHeader;
