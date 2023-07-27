import React from 'react';
import { connect } from 'react-redux';
import {
  Redirect,
  Route,
  RouteProps,
  RouteComponentProps,
} from 'react-router-dom';
import { State } from 'redux-app/types';

interface MatchParams {
  id?: string;
}

export interface RouteWithId extends RouteComponentProps<MatchParams> {}

interface InProps extends RouteProps {
  children: React.ReactNode;
}

interface StateProps {
  isAuthenticated: boolean;
}

type Props = InProps & StateProps;

const AuthedRoute = ({ children, isAuthenticated, ...rest }: Props) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated ? (
        children
      ) : (
        <Redirect
          to={{ pathname: '/login', state: { from: props.location } }}
        />
      )
    }
  />
);

const mapStateToProps = (state: State) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(AuthedRoute);
