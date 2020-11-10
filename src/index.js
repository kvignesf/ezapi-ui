import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from "react-redux";
import configureStore from "./store";
import LinkedInPopUp from './auth/Linkedin/LinkedInPopUp';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Template1 from './templates/temp1';
import Home from './templates/home';
import ProductComponent from './templates/ProductComponent';

ReactDOM.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <Provider store={configureStore()}>
    <BrowserRouter>
        <Switch >
          <Route exact path="/linkedin" component={LinkedInPopUp} />
          <Route path="/app" component={App} />
          <Route path="/" component={Home} />
        </Switch>
    </BrowserRouter>
    {/* <App /> */}
  </Provider>,
  document.getElementById('root')
);