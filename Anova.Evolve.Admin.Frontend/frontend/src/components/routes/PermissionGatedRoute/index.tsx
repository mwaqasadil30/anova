import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Route, RouteProps } from 'react-router-dom';
import { selectIsAuthenticated } from 'redux-app/modules/user/selectors';
import { State } from 'redux-app/types';
import { setShowGlobalPermissionDeniedDialog } from 'redux-app/modules/app/actions';

interface InProps extends RouteProps {
  children: React.ReactNode;
  hasPermission?: boolean;
}

interface StateProps {
  isAuthenticated: boolean;
}

type Props = InProps & StateProps;

const PermissionGatedRoute = ({
  children,
  isAuthenticated,
  hasPermission,
  ...rest
}: Props) => {
  const dispatch = useDispatch();

  // Show the permission denied dialog if the user doesn't have permission to
  // access this route
  useEffect(() => {
    if (isAuthenticated && !hasPermission) {
      dispatch(
        setShowGlobalPermissionDeniedDialog({
          showDialog: true,
          wasTriggeredFromApi: false,
        })
      );
    }
  }, [isAuthenticated, hasPermission]);

  return (
    <Route
      {...rest}
      render={() => isAuthenticated && hasPermission && children}
    />
  );
};

const mapStateToProps = (state: State) => ({
  isAuthenticated: selectIsAuthenticated(state),
});

export default connect(mapStateToProps)(PermissionGatedRoute);
