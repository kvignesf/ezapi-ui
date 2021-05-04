import React, { useEffect } from "react";
import Card from "@material-ui/core/Card";
import { LinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import { useHistory } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import Logo from "../static/images/logo/png.png";
import Constants from "../shared/constants";
import routes from "../shared/routes";
import Colors from "../shared/colors";
import { useLogin } from "../shared/query/authQueries";
import { setAccessToken } from "../shared/storage";
import { CircularProgress } from "@material-ui/core";
import _ from "lodash";
import { isUserLoggedIn } from "../shared/utils";

const Login = () => {
  const history = useHistory();

  const {
    data: loginData,
    error: loginError,
    isLoading: isLoggingIn,
    isSuccess: isLoginSuccess,
    mutate: login,
    reset: resetLogin,
  } = useLogin();

  const handleSuccess = (data) => {
    if (data?.code && !_.isEmpty(data?.code)) {
      login({ linkedInAuthToken: data?.code });
      setAccessToken(data?.code); // TODO - Remove
    }
  };

  useEffect(() => {
    if (isUserLoggedIn()) {
      history.replace(routes.projects);
    }
  }, []);

  const handleFailure = (error) => {
    resetLogin();
    setAccessToken(null);
  };

  if (isLoginSuccess && !isLoggingIn && !loginError) {
    history.replace(routes.projects);
    return null;
  }

  return (
    <div className='h-screen flex justify-center items-center'>
      <Card className='w-1/3 flex flex-col justify-center items-center p-5'>
        <img
          src={Logo}
          alt='ezapi logo'
          style={{ width: "125px", height: "125px" }}
          className='mb-4'
        />

        {!isLoggingIn && (
          <div className='mb-2'>
            <LinkedIn
              clientId={Constants.linkedClientId}
              onFailure={handleFailure}
              onSuccess={handleSuccess}
              redirectUri={encodeURIComponent(
                `${window.location.origin}/linkedin`
              )}
              redirectPath={"/signin"}
              scope='r_liteprofile r_emailaddress'
            >
              <img
                src={linkedin}
                alt='Log in with Linked In'
                style={{ maxWidth: "180px" }}
              />
            </LinkedIn>
          </div>
        )}

        {isLoggingIn && (
          <div>
            <CircularProgress size={20} />
          </div>
        )}

        {loginError && (
          <p className='text-overline2 text-accent-red'>
            {loginError?.message}
          </p>
        )}
      </Card>
    </div>
  );
};

export default Login;
