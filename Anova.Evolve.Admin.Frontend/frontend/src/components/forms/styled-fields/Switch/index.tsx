import React from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import MuiSwitch, { SwitchProps } from '@material-ui/core/Switch';

// Copied over from Material-UI's customized AntSwitch example:
// https://material-ui.com/components/switches/#customized-switches
const CustomSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 60,
      height: 26,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 4,
      left: 1,
      color: '#333333',
      '&$checked': {
        transform: 'translateX(32px)',
        color: '#FFFFFF',
        boxShadow: '1px 1px 5px rgba(0,0,0,0.10)',
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.custom.domainColor,
          borderColor: theme.custom.domainColor,
        },
      },
    },
    thumb: {
      width: 18,
      height: 18,
      boxShadow: 'none',
    },
    track: {
      border: `1px solid ${theme.custom.palette.switch.trackBorderColor}`,
      borderRadius: 32 / 2,
      opacity: 1,
      boxSizing: 'border-box',
      backgroundColor: theme.custom.palette.switch.trackColor,
    },
    checked: {},
  })
)(MuiSwitch);

const Switch = (props: SwitchProps) => (
  <CustomSwitch color="default" {...props} />
);

export default Switch;
