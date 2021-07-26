import React from "react";
import { QueryClientProvider } from "react-query";
import { RecoilRoot, useRecoilValue } from "recoil";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { LinkedInPopUp } from "react-linkedin-login-oauth2";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import SnackbarProvider from "react-simple-snackbar";

import queryClient from "./shared/network/queryClient";
import NotFound from "./shared/components/NotFound";
import PrivateRoute from "./shared/components/PrivateRoute";
import routes from "./shared/routes";
import Colors from "./shared/colors";
import Login from "./Login";
import Projects from "./Projects";
import Landing from "./Landing";
import { isUserLoggedIn, DebugObserver } from "./shared/utils";
import Project from "./Project";

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
          <SnackbarProvider>
            <BrowserRouter>
              <Switch>
                {/* Login route */}
                <Route exact path={routes.signIn}>
                  <Login />
                  {/* {!isUserLoggedIn() ? (
                  <Login />
                ) : (
                  <Redirect to={routes.projects} />
                )} */}
                </Route>

                <PrivateRoute
                  exact
                  path={routes.projects}
                  component={Projects}
                />

                <PrivateRoute exact path={routes.project} component={Project} />

                <Route exact path='/linkedin' component={LinkedInPopUp} />
                {/* Base route */}
                <Route exact path='/' component={Landing} />
                {/* 404 */}
                <Route component={NotFound} />
              </Switch>
            </BrowserRouter>
          </SnackbarProvider>
        </MuiThemeProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;
