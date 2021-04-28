import React from 'react';
import Card from '@material-ui/core/Card';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png';

import Logo from '../static/images/logo/jpg.jpg';
import Constants from '../shared/constants';

const Login = () => {
  const handleSuccess = (data) => {
    console.log('LinkedIn login success', data);
    this.setState({
      code: data.code,
      errorMessage: '',
    });
  };

  const handleFailure = (error) => {
    console.log('LinkedIn login failure', error);
    this.setState({
      code: '',
      errorMessage: error.errorMessage,
    });
  };

  return (
    <div className='h-screen flex justify-center items-center'>
      <Card className='flex flex-col justify-center items-center p-5'>
        <img
          src={Logo}
          alt='ezapi logo'
          style={{ width: '125px', height: '125px' }}
          className='mb-4'
        />

        <LinkedIn
          clientId={Constants.linkedClientId}
          onFailure={handleFailure}
          onSuccess={handleSuccess}
          redirectUri={Constants.redirectUri}
          scope='r_liteprofile%20r_emailaddress%20w_member_social'
        >
          <img
            src={linkedin}
            alt='Log in with Linked In'
            style={{ maxWidth: '180px' }}
          />
        </LinkedIn>
      </Card>
    </div>
  );
};

export default Login;
