import React, { useEffect } from 'react';
import Card from '@material-ui/core/Card';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png';
import { useHistory } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Logo from '../static/images/logo/png.png';
import Constants from '../shared/constants';
import routes from '../shared/routes';
import { setLinkedInToken } from '../shared/storage';
import { isUserLoggedIn } from '../shared/utils';

const Login = () => {
  const history = useHistory();

  const handleSuccess = (data) => {
    setLinkedInToken(data?.code);
    // TODO - Api call to get the user details
    history.replace(routes.projects);
  };

  const handleFailure = (error) => {
    setLinkedInToken(null);
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
          redirectUri={encodeURIComponent(`${window.location.origin}/linkedin`)}
          redirectPath={'/signin'}
          scope='r_liteprofile r_emailaddress'
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
