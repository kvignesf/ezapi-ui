import React, { useState, useRef, useEffect } from "react";
import Card from "@material-ui/core/Card";
import AppIcon from "../shared/components/AppIcon";
import { Field, ErrorMessage, Form, Formik } from "formik";
import CloseIcon from "@material-ui/icons/Close";
import * as Yup from "yup";
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
  const [formValues, setFormValues] = useState();
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
          } else {
          }
        });
    }
  }, []);

  function SSOLogin(values) {
    // console.log(orgID);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orgName: values.org,
        domain: values.dom,
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
        }
        if (data?.url) {
          setSsoError();
          window.location = data?.url;
        }
        // window.location = data?.url;
      });
  }
  // function organizationAPI(values) {
  //   const requestOptions = {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       org: values.org,
  //       domains: values.dom,
  //     }),
  //   };
  //   fetch(
  //     // process.env.REACT_APP_API_URL + "http://localhost:7744/organization_id",
  //     "http://localhost:7744/organization_id",
  //     requestOptions
  //   )
  //     .then((response) => response.json())

  //     .then((data) => {
  //       console.log(data);
  //       setOrgID(data?.orgId);
  //       SSOLogin(data?.orgId);
  //     });
  // }

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
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby='projects-dialog'
        open={dialog}
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
        disableBackdropClick
      >
        <div className='p-4'>
          <div className='flex flex-row items-center justify-between mb-3'>
            <h5>Organization Details </h5>

            <AppIcon aria-label='close' onClick={handleCloseDialog}>
              <CloseIcon />
            </AppIcon>
          </div>

          <div className='h-40'>
            <Formik
              initialValues={{
                org: formValues?.org ?? "",
                dom: formValues?.dom ?? "",
              }}
              innerRef={formRef}
              validationSchema={Yup.object().shape({
                org: Yup.string().required("Organization Name is required."),
                dom: Yup.string().required("Domain is required."),
              })}
              enableReinitialize
            >
              {({
                errors,
                touched,
                values,
                submitForm,
                validateForm,
                handleChange,
                handleBlur,
                setErrors,
              }) => {
                setFormValues(values);
                return (
                  <Form>
                    <Grid item xs={10}>
                      <p className='text-mediumLabel mb-2'>Organization Name</p>
                      <Field
                        id='org'
                        name='org'
                        fullWidth
                        color='primary'
                        // placeholder='127.0.0.1'
                        error={touched.host && Boolean(errors.host)}
                        helperText={
                          <ErrorMessage name='org'>
                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                          </ErrorMessage>
                        }
                        onKeyUp={(e) => {
                          const { value } = e.target;
                          // debouncedSetHost(value);
                        }}
                        style={{
                          // border: "1px solid #d2d2d2",
                          height: "60px",
                          // borderRadius: "4px",
                          width: "100%",
                          color: "primary",
                          backgroundColor: "#ffffff",
                          borderColor: touched.type && errors.type && "red",
                        }}
                        variant='outlined'
                        inputProps={{ maxLength: 55 }}
                        // disabled={addProjectMutation?.isSuccess}
                        as={TextField}
                      />
                      {touched.type && errors.type && (
                        <FormHelperText htmlFor='render-select' error>
                          {errors.type}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={10}>
                      <p className='text-mediumLabel mt-2 py-2'>Domain Name</p>
                      <Field
                        id='dom'
                        name='dom'
                        fullWidth
                        color='primary'
                        // placeholder=''
                        error={touched.host && Boolean(errors.host)}
                        helperText={
                          <ErrorMessage name='dom'>
                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                          </ErrorMessage>
                        }
                        onKeyUp={(e) => {
                          const { value } = e.target;
                          // debouncedSetHost(value);
                        }}
                        style={{
                          // border: "1px solid #d2d2d2",
                          height: "60px",
                          // borderRadius: "4px",
                          width: "100%",
                          color: "primary",
                          backgroundColor: "#ffffff",
                          borderColor: touched.type && errors.type && "red",
                        }}
                        variant='outlined'
                        inputProps={{ maxLength: 55 }}
                        // disabled={addProjectMutation?.isSuccess}
                        as={TextField}
                      />
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
            {ssoError && (
              <p className=' mt-5 text-overline2 text-accent-red ml-5 my-2'>
                {ssoError}
              </p>
            )}
          </div>

          <div className='border-t-2 mt-4 border-neutral-gray7 flex flex-row items-center justify-end pt-4'>
            <PrimaryButton
              onClick={() => {
                if (formRef.current) {
                  formRef.current.handleSubmit();
                  if (formRef.current.isValid) {
                    console.log(formValues);
                    SSOLogin(formValues);
                  }
                }
                // console.log("clicked next");
              }}
            >
              Next
            </PrimaryButton>
          </div>
        </div>
      </Dialog>
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
      </Card>
    </div>
  );
};

export default Login;
