import React, { useState, useRef, useEffect } from "react";
import Card from "@material-ui/core/Card";
import AppIcon from "../shared/components/AppIcon";
import { Field, ErrorMessage, Form, Formik } from "formik";
import CloseIcon from "@material-ui/icons/Close";
import * as Yup from "yup";
import "./Login.css";
import { Select, MenuItem, OutlinedInput, Grid } from "@material-ui/core";
import { LinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import sso from "../icons/ssoLogo3.svg";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getAccessToken } from "../shared/storage";
import { FormHelperText } from "@mui/material";
import { TextField } from "@material-ui/core";
import Logo from "../static/images/logo/connectoLogoWithName.svg";
import Constants from "../shared/constants";
import LoaderWithMessage from "../shared/components/LoaderWithMessage";
import { Dialog } from "@material-ui/core/index";
import { PrimaryButton } from "../shared/components/AppButton";
import routes from "../shared/routes";
import Colors from "../shared/colors";
import { useLogin } from "../shared/query/authQueries";
import {
  clearSession,
  setAccessToken,
  setFirstName,
  setLastName,
  setUserId,
  setEmailId,
} from "../shared/storage";
import client, { endpoint } from "../shared/network/client";
import { CircularProgress } from "@material-ui/core";
import _ from "lodash";
import { isUserLoggedIn } from "../shared/utils";
import { useQuery } from "react-query";

const acc_token = getAccessToken();
const Login = () => {
  const formRef = useRef();
  const [ssoLoggedIn, setSsoLoggedIn] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ssoError, setSsoError] = useState();
  const history = useHistory();
  const redirect_uri = `${window.location.origin}/linkedin`;
  // console.log(formValues);
  const {
    error: loginError,
    isLoading: isLoggingIn,
    isSuccess: isLoginSuccess,
    mutate: login,
    reset: resetLogin,
  } = useLogin();

  const handleSuccess = (data) => {
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

  useEffect(() => {
    if (isUserLoggedIn()) {
      history.push({
        pathname: routes.projects,
        state: { allow: false },
      });
    }
  }, [ssoLoggedIn]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");
    if (code) {
      setIsLoading(true);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code }),
      };
      fetch(
        process.env.REACT_APP_API_URL + "/auth_workos",
        // "http://localhost:7744/auth_workos",
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          if ("jwtToken" in data && "userData" in data) {
            setAccessToken(data?.jwtToken);
            setFirstName(data?.userData?.firstName);
            setLastName(data?.userData?.lastName);
            setUserId(data?.userData?.user_id);
            setEmailId(data?.userData?.email);
            setSsoLoggedIn(true);
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  function SSOLogin(values) {
    setIsLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email,
      }),
    };
    fetch(
      process.env.REACT_APP_API_URL + "/sso_url",
      // "http://localhost:7744/sso_url",
      requestOptions
    )
      .then((response) => response.json())

      .then((data) => {
        // console.log(data);
        if (!data?.url && data?.error) {
          // console.log("inside error");

          setSsoError(data?.error);
          setIsLoading(false);
        }
        if (data?.url) {
          setSsoError();
          window.location = data?.url;
          // setIsLoading(false);
        }
      });
  }

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
  const handleCloseDialog = () => {
    setDialog(false);
  };
  return (
    <div className='h-screen flex justify-center items-center'>
      <Card className='w-1/2 max-w-sm flex flex-col justify-center items-center p-5'>
        {!isLoading && (
          <img
            src={Logo}
            alt='conektto logo'
            className='mb-4 p-3'
            style={{ maxWidth: "128px" }}
          />
        )}

        {!isLoading && !dialog && (
          <>
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

                <img
                  src={sso}
                  onClick={() => {
                    setDialog(true);
                  }}
                  alt='Log in with SSO'
                  style={{ maxWidth: "180px" }}
                  className='w-full cursor-pointer ... '
                />
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
          </>
        )}
        {isLoading && <LoaderWithMessage message='Loading data' />}

        {!isLoading && dialog && (
          <>
            <div className='mb-2 flex flex-col'>
              {" "}
              <Formik
                initialValues={{ email: "" }}
                validationSchema={Yup.object().shape({
                  email: Yup.string().email().required("Required"),
                })}
              >
                {(props) => {
                  const {
                    values,
                    touched,
                    errors,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset,
                  } = props;
                  return (
                    <Form onSubmit={handleSubmit}>
                      <label htmlFor='email' style={{ display: "block" }}>
                        Email
                      </label>
                      <input
                        id='email'
                        placeholder='Enter your email'
                        type='text'
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.email && touched.email
                            ? "text-input error"
                            : "text-input"
                        }
                      />
                      {errors.email && touched.email && (
                        <div className='input-feedback'>{errors.email}</div>
                      )}
                      {ssoError && (
                        <p className=' mt-5 text-overline2 text-accent-red ml-5 my-2'>
                          {ssoError}
                        </p>
                      )}
                      <div className='flex flex-row place-content-end gap-2'>
                        {" "}
                        <button
                          id='button1'
                          onClick={() => {
                            setDialog(false);
                          }}
                          // disabled={isSubmitting}
                        >
                          Back
                        </button>
                        <button
                          id='button2'
                          // disabled={isSubmitting}
                          onClick={() => {
                            console.log("clicked");
                            SSOLogin(values);
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Login;
