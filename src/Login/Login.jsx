import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import { LinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import sso from "../icons/ssoLogo.svg";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getAccessToken } from "../shared/storage";
import Logo from "../static/images/logo/connectoLogoWithName.svg";
import Constants from "../shared/constants";
import routes from "../shared/routes";
import Colors from "../shared/colors";
import { useLogin } from "../shared/query/authQueries";
import { setAccessToken } from "../shared/storage";
import client, { endpoint } from "../shared/network/client";
import { CircularProgress } from "@material-ui/core";
import _ from "lodash";
import { isUserLoggedIn } from "../shared/utils";
import { useQuery } from "react-query";

const acc_token = getAccessToken();
const Login = () => {
  const [userDetails, setUserDetails] = useState(null);
  const history = useHistory();
  const redirect_uri = `${window.location.origin}/linkedin`;
  // const redirect_sso =
  //   "https://api.workos.com/sso/authorize?client_id=client_01G38CGM9H2SD3W0NB50QD3WYE&organization=org_01G38DMHSPFQ7RP0782NZAXZ91&redirect_uri=http%3A%2F%2Flocalhost%3A7744%2Fauth_workos&response_type=code";
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get("code");
  const {
    error: loginError,
    isLoading: isLoggingIn,
    isSuccess: isLoginSuccess,
    mutate: login,
    reset: resetLogin,
  } = useLogin();

  const handleSuccess = (data) => {
    // console.log("success");
    if (data?.code && !_.isEmpty(data?.code)) {
      login({ linkedInAuthToken: data?.code, redirect_uri: redirect_uri });
    }
  };

  useEffect(() => {
    if (isUserLoggedIn()) {
      history.push({
        pathname: routes.projects,
        state: { allow: false },
      });
    }
  }, []);

  // useEffect(() => {
  //   console.log("inside UE");

  //   const requestOptions = {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ code: code }),
  //   };
  //   fetch("https://test-1.ezapi.ai/node/auth_workos", requestOptions)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       if ("jwtToken" in data && "userData" in data) {
  //         console.log("inside successs");
  //         // history.replace({
  //         //   pathname: routes.projects,
  //         //   state: { allow: false },
  //         // });
  //       }
  //     });
  // }, []);

  const handleFailure = (error) => {
    resetLogin();
    setAccessToken(null);
  };

  if (isLoginSuccess && !isLoggingIn && !loginError) {
    history.replace({
      pathname: routes.projects,
      state: { allow: false },
    });
    return null;
  }

  return (
    <div className='h-screen flex justify-center items-center'>
      <Card className='w-1/2 max-w-sm flex flex-col justify-center items-center p-5'>
        <img
          src={Logo}
          alt='conektto logo'
          className='mb-4 p-3'
          style={{ maxWidth: "128px" }}
        />

        {!isLoggingIn && (
          <div className='mb-2 flex flex-col '>
            <LinkedIn
              className='mb-2'
              clientId={Constants.linkedClientId}
              onFailure={handleFailure}
              onSuccess={handleSuccess}
              redirectUri={encodeURIComponent(redirect_uri)}
              redirectPath={"/signin"}
              scope='r_liteprofile r_emailaddress'
            >
              <img
                src={linkedin}
                alt='Log in with Linked In'
                style={{ maxWidth: "180px" }}
                className='w-full'
              />
            </LinkedIn>
            {/* <button
              onClick={SSOLogin}
              className='bg-brand-secondary text-white p-2 ml-2 mt-2'
            >
              Sign in with SSO
            </button> */}
            {/* <img
              class='cursor-pointer ...'
              src={sso}
              onClick={SSOLogin}
              alt='Log in with SSO'
              style={{ maxWidth: "180px" }}
              className='w-full'
            /> */}
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
