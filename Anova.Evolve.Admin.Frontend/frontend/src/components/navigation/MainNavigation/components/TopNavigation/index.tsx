import AdminTopNav from 'apps/admin/components/navigation/TopNavigation';
import adminRoutes from 'apps/admin/routes';
import FreezersTopNav from 'apps/freezers/components/navigation/TopNavigation';
import freezersRoutes from 'apps/freezers/routes';
import SystemTopNav from 'apps/system/components/navigation/TopNavigation';
import systemRoutes from 'apps/system/routes';
import OperationsTopNav from 'apps/ops/components/navigation/TopNavigation';
import opsRoutes from 'apps/ops/routes';
import ReportsTopNav from 'apps/reports/components/navigation/TopNavigation';
import reportsRoutes from 'apps/reports/routes';
import TrainingTopNav from 'apps/training/components/navigation/TopNavigation';
import trainingRoutes from 'apps/training/routes';
import CustomThemeProvider from 'components/CustomThemeProvider';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

const TopNavigation = () => {
  return (
    <CustomThemeProvider forceThemeType="dark">
      <Switch>
        <Route path={trainingRoutes.base}>
          <TrainingTopNav />
        </Route>
        <Route path={adminRoutes.base}>
          <AdminTopNav />
        </Route>
        <Route path={reportsRoutes.base}>
          <ReportsTopNav />
        </Route>
        <Route path={freezersRoutes.base}>
          <FreezersTopNav />
        </Route>
        <Route path={systemRoutes.base}>
          <SystemTopNav />
        </Route>
        <Route path={opsRoutes.base}>
          <OperationsTopNav />
        </Route>
      </Switch>
    </CustomThemeProvider>
  );
};

export default TopNavigation;
