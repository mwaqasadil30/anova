import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Tab, { TabProps } from '@material-ui/core/Tab';
import React from 'react';

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.primary,
      minWidth: 72,
      fontWeight: 'normal',
      marginRight: theme.spacing(0),
      fontSize: 14,
      opacity: 1,
      borderBottom: `1px solid ${theme.palette.grey[100]}`,
      '&$selected': {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    selected: {
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
    indicator: {},
  })
)((props: TabProps) => <Tab disableRipple {...props} />);

export default StyledTab;
