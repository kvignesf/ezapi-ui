import React, { useState, useRef, useEffect } from "react";
import Card from "@material-ui/core/Card";
import Snackbar from "@material-ui/core/Snackbar";
import AppIcon from "../shared/components/AppIcon";
import { Field, ErrorMessage, Form, Formik } from "formik";
import CloseIcon from "@material-ui/icons/Close";
import * as Yup from "yup";
import "./Login.css";
import { Select, MenuItem, OutlinedInput, Grid } from "@material-ui/core";
import { LinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "./images/LinkdInLogo.svg";
import sso from "./images/SSOLogo.svg";
import EzapiLogo from "./images/EzapiLogo.svg";
import EnterpriseAPI from "./images/EnterpriseAPI.svg";
import APIDesignStudio from "./images/APIDesignStudio.svg";
import APITestHarness from "./images/APITestHarness.svg";
import HybridAPIOrchestrator from "./images/HybridAPIOrchestrator.svg";
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
import EzapiFooter from "../shared/components/EzapiFooter";
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
import { border, maxHeight } from "@mui/system";
//import GoogleLogin from "react-google-login";
//import { Google } from "@mui/icons-material";

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
    // const error = queryParams.get("error");
    // console.log("error: " + error);
    // console.log(code);
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
    <div class='login-page grid h-screen grid-cols-6'>
      <div class='col-span-4 flex flex-col items-center justify-center'>
        <div class='grid grid-rows-5 mt-10 w-full h-full'>
          <div class='flex justify-center align-middle row-start-1 row-span-2'>
            {" "}
            <div class='flex flex-col items-center justify-center mb-8'>
              <img id='conekttoLogo' src={EzapiLogo} alt='conektto logo' />
              <p id='prodDes' className='mt-3'>
                Design, build, test and deploy API in minutes!
              </p>
            </div>
          </div>

          <div class='flex flex-col justify-start justify-items-center items-center align-top row-start-3 row-span-2 gap-7'>
            <Card
              className='flex w-3/4 max-w-sm p-3 place-items-center justify-center items-center align-middle justify-items-center'
              style={{ minHeight: "150px", maxHeight: "230px" }}
            >
              {" "}
              {/* selection card */}
              {!isLoading && !dialog && (
                <>
                  {!isLoggingIn && (
                    <div class='flex flex-col items-center justify-center gap-2 mb-6'>
                      <p className='mb-2'>Login / Sign Up to continue to Conektto</p>
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
                          style={{ width: "260px", height: "44px" }}
                          className='w-full'
                        />
                      </LinkedIn>
                      <div class='relative flex items-center justify-center align-middle'>
                        <div class='mt-1 flex w-14 border-t border-black'></div>
                        <span class='flex-shrink px-1'>or</span>
                        <div class='mt-1  flex w-14 border-t border-black'></div>
                      </div>

                      <img
                        src={sso}
                        onClick={() => {
                          setDialog(true);
                        }}
                        alt='Log in with SSO'
                        style={{ width: "260px", height: "44px" }}
                        className='w-full mt-2 cursor-pointer ... '
                      />
                    </div>
                  )}
                  {isLoggingIn && (
                    <div class='flex justify-center align-middle items-center'>
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
              {/* SSO Card */}
              {!isLoading && dialog && (
                <>
                  <div className=' flex flex-col'>
                    {" "}
                    <Formik
                      initialValues={{ email: "" }}
                      validate={(values) => {
                        const errors = {};
                        if (!values.email) {
                          errors.email = "Required";
                        } else if (
                          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                            values.email
                          )
                        ) {
                          errors.email = "Invalid email address";
                        }
                        return errors;
                      }}
                      onSubmit={(values, errors) => {
                        SSOLogin(values);
                      }}
                      // validateOnChange={false}
                      // validateOnBlur={false}
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
                          <Form
                            onSubmit={handleSubmit}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSubmit();
                              }
                            }}
                          >
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
                              // style={{ border: "1px solid red" }}
                              className={
                                errors.email && touched.email
                                  ? "text-input error"
                                  : "text-input"
                              }
                            />
                            {errors.email && touched.email && (
                              <div className='input-feedback'>
                                {errors.email}
                              </div>
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
                                type='button'
                                onClick={(e) => {
                                  e.preventDefault();
                                  setDialog(false);
                                  setSsoError("");
                                }}
                                // disabled={isSubmitting}
                              >
                                Back
                              </button>
                              <button type='submit' id='button2'>
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

            <p className=' flex items-center justify-center text-overline3'>
              © 2022 Conektto INC. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
      <div class='col-span-2' style={{ backgroundColor: "#2C71C7" }}>
        <div class='grid h-screen grid-cols-2 p-2'>
          <div class='grid grid-rows-5 mt-5'>
            {" "}
            <div class='flex flex-col justify-items-center align-middle row-start-1 row-span-2 '>
              <img
                class='justify-center align-top '
                src={EnterpriseAPI}
                alt='conektto logo'
              />
              <p class='flex mt-4 ml-7 imgDes justify-center'>
                Enterprise API SDLC
              </p>
            </div>
            <div class=' flex flex-col justify-items-center align-middle row-start-3 row-span-2 '>
              <img
                class='justify-center align-top '
                src={APITestHarness}
                alt='conektto logo'
              />
              <p class='flex mt-4 ml-7 imgDes justify-center'>
                API Test Harness
              </p>
            </div>
          </div>
          <div class='grid grid-rows-5 mt-5'>
            {" "}
            <div class=' flex flex-col justify-items-center align-middle row-start-2 row-span-2 '>
              <img
                class='justify-center align-top '
                src={APIDesignStudio}
                alt='conektto logo'
              />
              <p class='flex mt-4 ml-7 imgDes justify-center'>
                API Design Studio
              </p>
            </div>
            <div class=' flex flex-col justify-items-center align-middle row-start-4 row-span-2 '>
              <img
                class='justify-center align-top '
                src={HybridAPIOrchestrator}
                alt='conektto logo'
              />
              <div class='flex flex-col mt-4  imgDes justify-items-center '>
                <p class='flex imgDe justify-center '>
                  Hybrid API Orchestrator
                </p>
                <p class='flex imgDesCS justify-center mt-2'>Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
