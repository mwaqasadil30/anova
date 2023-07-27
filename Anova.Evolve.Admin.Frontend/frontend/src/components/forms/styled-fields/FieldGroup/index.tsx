import React from 'react';
import styled from 'styled-components';

const StyledFieldGroup = styled.div`
  /* Remove right side border radius for all inputs except the last one */
  & .MuiTextField-root:not(:last-child) .MuiInput-root {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  /* Remove left side border radius for all inputs except the first one */
  & .MuiTextField-root:not(:first-child) .MuiInput-root {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }

  /* Add a right border to all non-focused inputs except for the last one */
  & .MuiTextField-root:not(:last-child) .MuiInput-root:not(.Mui-focused) {
    border-right: 1px solid ${(props) => props.theme.palette.divider};
  }
`;

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const FieldGroup = (props: Props) => {
  return <StyledFieldGroup role="group" aria-label="Field group" {...props} />;
};

export default FieldGroup;
