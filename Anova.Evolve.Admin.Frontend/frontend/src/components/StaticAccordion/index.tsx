/* eslint-disable indent */
import { AccordionProps } from '@material-ui/core/Accordion';
import Accordion from 'components/Accordion';
import React from 'react';
import styled from 'styled-components';

const StyledAccordion = styled(Accordion)`
  && .MuiAccordionSummary-root {
    cursor: inherit;
    user-select: inherit;
  }
  &.MuiPaper-root {
    box-shadow: ${(props) =>
      props.theme.palette.type === 'light' &&
      '0px 3px 10px rgba(159, 178, 189, 0.2)'};
  }
`;

export const StaticAccordion = (props: AccordionProps) => {
  return <StyledAccordion expanded {...props} />;
};
