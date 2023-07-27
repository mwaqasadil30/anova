import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiSwitch, { SwitchProps } from '@material-ui/core/Switch';
import { switchBackgroundColor, switchSelectedColor } from 'styles/colours';

// This switch is closely related to the default Material UI Switch. It's used
// in some places BEFORE the newly designed switch was introduced.
const CustomSwitch = withStyles({
  switchBase: {
    color: switchSelectedColor,
    '&$checked': {
      color: switchSelectedColor,
    },
    '&$checked + $track': {
      backgroundColor: switchBackgroundColor,
    },
  },
  checked: {},
  track: {},
})(MuiSwitch);

const Switch = (props: SwitchProps) => (
  <CustomSwitch color="default" {...props} />
);

export default Switch;
