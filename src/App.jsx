import React from 'react';
import { QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { LinkedInPopUp } from 'react-linkedin-login-oauth2';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

import queryClient from './shared/queryClient';
import NotFound from './shared/components/NotFound';
import PrivateRoute from './shared/components/PrivateRoute';
import routes from './shared/routes';
import Login from './Login';
import Projects from './Projects';
import Colors from './shared/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: Colors.brand.primary,
    },
  },
});

const App = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
            <Switch>
              {/* Login route */}
              <Route path={routes.signIn} component={Login} />

              <PrivateRoute exact path={routes.projects} component={Projects} />

              <Route exact path='/linkedin' component={LinkedInPopUp} />

              {/* Base route */}
              <Route exact path='/'>
                {<Redirect to={routes.projects} />}
              </Route>

              {/* 404 */}
              <Route component={NotFound} />
            </Switch>
          </BrowserRouter>
        </MuiThemeProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;
