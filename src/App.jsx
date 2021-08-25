import React, { useMemo, useState } from "react";
import { QueryClientProvider } from "react-query";
import { RecoilRoot, useRecoilValue } from "recoil";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { LinkedInPopUp } from "react-linkedin-login-oauth2";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import SnackbarProvider from "react-simple-snackbar";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, ElementsConsumer } from "@stripe/react-stripe-js";

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
import ProjectPayment from "./ProjectPayment/ProjectPayment";
import Orders from "./Orders/Orders";
import EzapiFooter from "./shared/components/EzapiFooter";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: Colors.brand.primary,
    },
  },
});

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const App = () => {
  const isAuthenticated = () => isUserLoggedIn();

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <MuiThemeProvider theme={theme}>
          <SnackbarProvider>
            <BrowserRouter>
              {/* <CookieConsentPopup /> */}

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

                <PrivateRoute exact path={routes.orders} component={Orders} />

                <Route
                  path={routes.paymentForOrder}
                  render={(props) => {
                    return (
                      <>
                        {isAuthenticated() ? (
                          <Elements stripe={stripePromise}>
                            <ProjectPayment />
                          </Elements>
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
