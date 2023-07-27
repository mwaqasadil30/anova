import CenteredContentWithLogo from 'components/layout/CenteredContentWithLogo';
import React from 'react';
import { Route, Redirect, Switch } from 'react-router';
import routes from 'routes-config';
import ChangeSuccessContent from './components/ChangeSuccessContent';
import EmailSentContent from './components/EmailSentContent';
import RequestResetForm from './components/RequestResetForm';
import ResetPasswordWithToken from './components/ResetPasswordWithTokenForm';

const ResetPassword = () => {
  return (
    <CenteredContentWithLogo>
      <Switch>
        <Route path={routes.resetPassword.request} exact>
          <RequestResetForm />
        </Route>
        <Route path={routes.resetPassword.emailSent} exact>
          <EmailSentContent />
        </Route>
        <Route path={routes.resetPassword.changePasswordWithToken} exact>
          <ResetPasswordWithToken />
        </Route>
        <Route path={routes.resetPassword.changeSuccess} exact>
          <ChangeSuccessContent />
        </Route>
        {/* Handle case when accessing a non-existant reset-password path */}
        <Route>
          <Redirect to={routes.resetPassword.request} />
        </Route>
      </Switch>
    </CenteredContentWithLogo>
  );
};

export default ResetPassword;
