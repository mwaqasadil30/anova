import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Tab, { TabProps } from '@material-ui/core/Tab';
import React from 'react';

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.primary,
      minWidth: 72,
      fontWeight: 'normal',
      marginRight: theme.spacing(1),
      fontSize: 14,
      opacity: 1,
      '&$selected': {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    selected: {},
  })
)((props: TabProps) => <Tab disableRipple {...props} />);

export default StyledTab;
