import ContactSupport from 'containers/ContactSupport';
import AccessDolv3 from 'containers/AccessDolv3';
import Language from 'containers/Language';
import ReleaseNotes from 'containers/ReleaseNotes';
import UserProfile from 'containers/UserProfile';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { selectCanUserEditTheirProfile } from 'redux-app/modules/user/selectors';

interface CommonRoutes {
  language?: string;
  releaseNotes?: string;
  userProfile?: string;
  contactSupport?: string;
  accessDolv3?: string;
}

interface Props {
  routes: CommonRoutes;
}

const CommonRoutes = ({ routes }: Props) => {
  const canUserEditTheirProfile = useSelector(selectCanUserEditTheirProfile);
  return (
    <>
      <Route path={routes.language} exact>
        <Language />
      </Route>
      <Route path={routes.releaseNotes} exact>
        <ReleaseNotes />
      </Route>
      <Route path={routes.contactSupport} exact>
        <ContactSupport />
      </Route>
      <Route path={routes.accessDolv3} exact>
        <AccessDolv3 />
      </Route>
      {canUserEditTheirProfile && (
        <Route path={routes.userProfile} exact>
          <UserProfile />
        </Route>
      )}
    </>
  );
};

export default CommonRoutes;
