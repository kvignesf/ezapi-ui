import React from 'react';
import { QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import queryClient from './shared/queryClient';
import NotFound from './shared/components/NotFound';
import routes from './shared/routes';
import Login from './Login';

const App = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Switch>
            {/* Login route */}
            <Route exact path={routes.signIn} component={Login} />

            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;
