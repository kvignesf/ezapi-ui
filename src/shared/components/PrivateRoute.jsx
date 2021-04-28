import _ from 'lodash';
import React from 'react';
import { Redirect, Route } from 'react-router';

import routes from '../routes';
import { getLinkedInToken } from '../storage';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = () => {
    const token = getLinkedInToken();
    return token && !_.isEmpty(token);
  };

  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            {isAuthenticated() ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: routes.signIn,
                  state: { from: props.location },
                }}
              />
            )}
          </>
        );
      }}
    />
  );
};

export default PrivateRoute;
