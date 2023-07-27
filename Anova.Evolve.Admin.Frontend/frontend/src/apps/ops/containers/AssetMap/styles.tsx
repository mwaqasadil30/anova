/* eslint-disable indent */
import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import {
  boxBorderColor,
  defaultTextColor,
  gray150,
  lightTextColor,
  mediumTextColor,
} from 'styles/colours';

export const CardMajorText = styled(Typography)`
  font-weight: 600;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${defaultTextColor};

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const CardMinorText = styled(Typography)`
  font-size: 12px;
  color: ${mediumTextColor};

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
  color: ${lightTextColor};
  /* text-overflow: 'ellipsis'; */
`;

export const StyledMenuItemText = styled(ListItemText)`
  & .MuiListItemText-primary {
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    font-weight: 500;
    color: ${defaultTextColor};
  }
`;

export const StyledAccordionDetails = styled(({ header, ...props }) => (
  <AccordionDetails {...props} />
))`
  border-top: 1px solid ${boxBorderColor};
  padding: ${(props) => (props.header ? '0px' : '8px 24px 8px')};
  ${(props) => props.header && `background: ${gray150};`}
`;
