import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AdminSideNavigation from 'apps/admin/components/navigation/SideNavigation';
import adminRoutes from 'apps/admin/routes';
import OpsSideNavigation from 'apps/ops/components/navigation/SideNavigation';
import opsRoutes from 'apps/ops/routes';
import FreezerSideNavigation from 'apps/freezers/components/navigation/SideNavigation';
import freezerRoutes from 'apps/freezers/routes';
import SystemSideNavigation from 'apps/system/components/navigation/SideNavigation';
import systemRoutes from 'apps/system/routes';
import ToolbarOffset from 'components/navigation/ToolbarOffset';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { openedSidebarWidth } from 'styles/theme';
import TopNavigation from './components/TopNavigation';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    content: {
      flexGrow: 1,
      padding: `0 ${theme.spacing(1)}px`,
      // NOTE: Really important to have this, otherwise, tables will cause a
      // horizontal scroll on the main content of the page (ie: the inner
      // table content itself isn't scrollable, the whole page is)
      // The values here involve:
      // - the sidebar width (closed or open)
      // - PLUS left and right padding on the main content
      // - PLUS 1 for the border
      width: `calc(100% - ${openedSidebarWidth + theme.spacing(1) * 2 + 1}px)`,
    },
  })
);

interface Props {
  children?: React.ReactNode;
}

const MainNavigation = ({ children }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TopNavigation />
      <Switch>
        <Route path={opsRoutes.base}>
          <OpsSideNavigation />
        </Route>
        <Route path={adminRoutes.base}>
          <AdminSideNavigation />
        </Route>
        <Route path={freezerRoutes.base}>
          <FreezerSideNavigation />
        </Route>
        <Route path={systemRoutes.base}>
          <SystemSideNavigation />
        </Route>
      </Switch>

      <main className={classes.content}>
        <ToolbarOffset />
        {children}
      </main>
    </div>
  );
};

export default MainNavigation;
