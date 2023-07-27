/* eslint-disable indent */
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { darken } from '@material-ui/core/styles';
import {
  EventRuleImportanceLevel,
  EventRuleInventoryStatus,
} from 'api/admin/api';
import styled from 'styled-components';
import { defaultTextColor, tableHeaderColor, white } from 'styles/colours';
import { getRowColour } from 'utils/ui/helpers';

export const CardMajorText = styled(Typography)`
  font-weight: 600;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const CardMinorText = styled(Typography)`
  font-size: 12px;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const CardDateText = styled(Typography)`
  font-size: 12px;
  color: ${(props) => props.theme.palette.text.secondary};
`;

export const CardChannelNumText = styled(Typography)`
  font-size: 12px;
  color: ${(props) => props.theme.palette.text.secondary};
  /* text-overflow: 'ellipsis'; */
`;

export const ReadingsErrorDialogText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

export const StyledMenuItemText = styled(ListItemText)`
  & .MuiListItemText-primary {
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    font-weight: 500;
    color: ${defaultTextColor};
  }
`;

export const ThinSeparatorWrapper = styled.div`
  & > div:not(:last-child) {
    margin-bottom: 1px;
  }
`;

export const AccordionDetailsWrapper = styled.div<{
  $isEventProfile?: boolean;
}>`
  & {
    border-bottom: ${(props) =>
      props.$isEventProfile ? '' : `1px solid ${props.theme.palette.divider}`};
  }
  & > div:not(:last-child) {
    border-bottom: ${(props) =>
      props.$isEventProfile ? '' : `1px solid ${props.theme.palette.divider}`};
  }

  & > div:only-child {
    border-bottom: ${(props) =>
      props.$isEventProfile ? `1px solid ${props.theme.palette.divider}` : 0};
  }
`;

export const StyledAccordionDetails = styled(AccordionDetails)<{
  $header?: boolean;
}>`
  color: ${(props) => props.theme.palette.text.primary};
  padding: ${(props) => (props.$header ? '0px' : '8px 24px 8px')};

  ${(props) =>
    props.$header
      ? `
      background-color: ${
        props.theme.palette.type === 'light' ? '#CDCCCC' : '#616161'
      }
      `
      : ''}
`;

export const StyledAlertDetails = styled(StyledAccordionDetails)<{
  $importance?: EventRuleImportanceLevel | null;
  $inventoryStatus?: EventRuleInventoryStatus | null;
  $hasMissingData?: boolean;
}>`
  padding: 8px 10px;
  cursor: pointer;
  transition: background-color 0.18s ease-in-out;
  ${(props) => {
    const backgroundColor = getRowColour({
      eventInventoryStatus: props.$inventoryStatus,
      eventImportanceLevel: props.$importance,
      hasMissingData: props.$hasMissingData,
    });
    const colorStyles = backgroundColor
      ? `
          & .MuiTypography-root, & svg {
            color: ${white};
          }
          &:hover {
          background-color: ${darken(backgroundColor, 0.12)};
          }
        `
      : `
          &:hover {
            background-color: ${darken(
              props.theme.palette.background.paper,
              0.12
            )};
          }
        `;

    return `
      background: ${backgroundColor};
      ${colorStyles}
    `;
  }};
`;

export const accordionBannerSize = 37;

export const expandedRightPanelWidth = 240;

export const StyledAccordionSummary = styled(AccordionSummary)`
  background-color: ${tableHeaderColor};
  height: ${accordionBannerSize}px;
  && {
    min-height: ${accordionBannerSize}px;
  }
`;
