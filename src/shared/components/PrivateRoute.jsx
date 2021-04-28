import React from 'react';
import { Redirect, Route } from 'react-router';

import routes from '../routes';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = () => {
    return true;
  };

  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            {isAuthenticated() || (isLoggingOut ?? false) ? (
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
