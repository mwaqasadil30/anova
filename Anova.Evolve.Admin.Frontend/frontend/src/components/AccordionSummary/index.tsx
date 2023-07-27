import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import styled from 'styled-components';

const accordionBannerSize = 43;

const AccordionSummary = styled(MuiAccordionSummary)`
  background: linear-gradient(0deg, #474747, #474747), #666666;
  height: ${accordionBannerSize}px;

  ${(props) => `
    border-top-left-radius: ${props.theme.shape.borderRadius}px;
    border-top-right-radius: ${props.theme.shape.borderRadius}px;
  `}

  && {
    min-height: ${accordionBannerSize}px;
  }
`;

export default AccordionSummary;
