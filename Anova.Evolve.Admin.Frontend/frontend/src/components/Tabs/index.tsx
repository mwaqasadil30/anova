import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import MuiTabs, { TabsProps } from '@material-ui/core/Tabs';
import React from 'react';

interface CustomTabsProps {
  borderWidth?: number;
  dense?: boolean;
}

const StyledTabs = withStyles(
  (theme: Theme) =>
    createStyles({
      root: (props: CustomTabsProps) => ({
        borderBottom: `${
          props.borderWidth === undefined ? 1 : props.borderWidth
        }px solid ${theme.palette.divider}`,

        minHeight: props.dense ? 28 : 48,
        '& .MuiTab-root': {
          minHeight: props.dense ? 28 : 48,
        },
      }),
      indicator: {
        backgroundColor: theme.custom.domainColor,
        height: 3,
      },
    })
  // @ts-ignore
)(({ borderWidth, dense, ...props }) => <MuiTabs {...props} />);

// The main reason why we have this component is to get around an issue
// preventing the Tabs indicator from starting in the correct position.
// https://github.com/mui-org/material-ui/issues/9337#issuecomment-413789329
const Tabs = (props: TabsProps & CustomTabsProps) => {
  const tabsActions = React.useRef();

  React.useEffect(() => {
    if (tabsActions.current) {
      // @ts-ignore
      tabsActions?.current?.updateIndicator();
    }
  }, []);

  // @ts-ignore
  return <StyledTabs action={tabsActions} {...props} />;
};

export default Tabs;
