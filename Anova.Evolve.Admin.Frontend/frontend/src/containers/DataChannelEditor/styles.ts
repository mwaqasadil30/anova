import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/core/styles';

export const AdditionalPropertiesAccordion = withStyles((theme) => ({
  root: {
    border: 'none',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
}))(MuiAccordion);

export const AdditionalPropertiesAccordionSummary = withStyles({
  root: {
    backgroundColor: 'transparent',
    border: 'none',
    minHeight: 38,
    '&&&&': {
      cursor: 'pointer',
    },
    '&$expanded': {
      minHeight: 38,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

export const AdditionalPropertiesAccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);
