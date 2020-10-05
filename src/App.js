import React, { useState, useRef, useEffect } from 'react';

import axios from 'axios';
//import styled from 'styled-components';
import * as d3 from 'd3';

import d3sankey from './sankey';
import UploadFile from './components/UploadFile';
import LoginView from './auth/LoginView';
import LoginView2 from './auth/LoginView2';
import { connect } from 'react-redux';
import Dashboard from './dashboard/Dashboard';
import DashboardAPIView from './dashboard/DashboardAPIView';

const PARSER_URL = 'http://104.197.42.14:5000/apiops_parser';
const VISULIZER_URL = 'http://104.197.42.14:5000/visualizer'

const apiops_types = ["Business Function", "Elements", "Resource", "Endpoint", "Operation", "Status"]

const colorPalette = [
  '#ffadad',
  '#ffd6a5',
  '#fdffb6',
  '#caffbf',
  '#9bf6ff',
  '#a0c4ff',
  '#bdb2ff',
  '#ffc6ff'
]

const resourceToColor = (nodes) => {
  let nodesResource = nodes.map(x => x.tag)  // list of all resources
  nodesResource = [...new Set(nodesResource)] // unique resource

  let resourceColor = {}
  if (nodesResource.length <= colorPalette.length) {
    for (let i = 0; i < nodesResource.length; ++i)
      resourceColor[nodesResource[i]] = colorPalette[i]
  }
  else {
    let color = d3.scale.category20();
    for (let i = 0; i < nodesResource.length; ++i)
      resourceColor[nodesResource[i]] = color(nodesResource[i])
  }
  return resourceColor
}

function App(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const authenticateUser = (result) => {
    setIsLoggedIn(result);
  };
  
  return (
    <div>
      {/* {this.props.isLoggedIn ? <Dashboard /> : <SignIn />} */}
      
      {/* {props.isLoggedIn ? <UploadFile parseFile={parseFile} /> : <LoginView authenticateUser={authenticateUser}/>} */}
      {/* {props.isLoggedIn ? <UploadFile /> : <Dashboard/>} */}

      {props.isLoggedIn ? <DashboardAPIView user={props.user}/> : <LoginView />}

    </div >
  )
}

const styles = {
  'tooltip': {
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'position': 'absolute',
    'textAlign': 'center',
    'width': '200px',
    'height': '28px',
    'padding': '2px',
    'font': '12px sans-serif',
    'background': 'rgb(222, 224, 227)',
    'border': '0px',
    'borderRadius': '8px',
    'pointerEvents': 'none',
    'visibility': 'hidden'
  }
}

// export default App;
const mapStateToProps = state => {
  return {
    isLoggedIn: state.authReducer.isLoggedIn,
    errorMessage: state.authReducer.erronMessage,
    user: state.authReducer.user
  };
};

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(App)