import React, { useState, useRef, useEffect, useCallback } from "react";
import { TextField, Grid } from "@material-ui/core";
import { PrimaryButton, TextButton } from "../shared/components/AppButton";
import { Field, ErrorMessage, Form, Formik } from "formik";
import CloseIcon from "@material-ui/icons/Close";
import AppIcon from "../shared/components/AppIcon";
import _ from "lodash";

import * as Yup from "yup";

import { ConnectedFocusError } from "focus-formik-error";

import { FormHelperText } from "@mui/material";

const CredentialsBeforePublish = ({
  onClose,
  onPublish,
  newProjectDetails,
  isDefaultproj,
  dbType
}) => {
  const formRef = useRef();
  //console.log("isDefaultproj.. ", isDefaultproj, dbType)
  return (
    <div className='p-4'>
      <>
        {/* Header */}
        <div className='flex flex-row items-center justify-between mb-3'>
          <h5>Enter Password </h5>

          <AppIcon aria-label='close' onClick={onClose}>
            <CloseIcon />
          </AppIcon>
        </div>
        {/* Form */}
        <div
          className='p-4'
          style={{ height: "300px", overflowY: "scroll", overflowX: "hidden" }}
        >
          <div className=' mb-6'>
            <Formik
              initialValues={{
                type: newProjectDetails.dbtype,
                host: newProjectDetails.server,
                port: newProjectDetails.port,
                database: newProjectDetails.database,
                username: newProjectDetails.username,
                
                                
              }}
              validationSchema={Yup.object().shape({
                password: Yup.string().required("Password is required"),
              })}
              innerRef={formRef}
            >
              {({ errors, touched, values }) => (
                <Form>
                  <ConnectedFocusError />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <p className='text-mediumLabel mb-2'>Server Type</p>
                      <Field
                        id='type'
                        name='type'
                        fullWidth
                        color='primary'
                        value={newProjectDetails.dbtype}
                        // error={touched.host && Boolean(errors.type)}
                        helperText={<ErrorMessage name='type' />}
                        variant='outlined'
                        inputProps={{ maxLength: 55 }}
                        // disabled={true}
                        as={TextField}
                      ></Field>
                    </Grid>
                    <Grid item xs={6}>
                      <p className='text-mediumLabel mb-2'>Host</p>
                      <Field
                        id='host'
                        name='host'
                        fullWidth
                        value={newProjectDetails.server}
                        color='primary'
                        placeholder='127.0.0.1'
                        // error={touched.host && Boolean(errors.host)}
                        helperText={<ErrorMessage name='host' />}
                        variant='outlined'
                        inputProps={{ maxLength: 55 }}
                        as={TextField}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <p className='text-mediumLabel mb-2'>Port</p>
                      <Field
                        id='port'
                        name='port'
                        fullWidth
                        color='primary'
                        value={newProjectDetails.portNo}
                        placeholder='7744'
                        // error={touched.port && Boolean(errors.port)}
                        helperText={<ErrorMessage name='port' />}
                        // onKeyUp={(e) => {
                        //   const { value } = e.target;
                        //   debouncedSetPort(value);
                        // }}
                        variant='outlined'
                        inputProps={{ maxLength: 24 }}
                        // disabled={addProjectMutation?.isSuccess}
                        as={TextField}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <p className='text-mediumLabel mb-2'>Username</p>
                      <Field
                        id='username'
                        name='username'
                        fullWidth
                        value={newProjectDetails.username}
                        color='primary'
                        // error={touched.username && Boolean(errors.username)}
                        helperText={<ErrorMessage name='username' />}
                        // onKeyUp={(e) => {
                        //   const { value } = e.target;
                        //   debouncedSetUsername(value);
                        // }}
                        variant='outlined'
                        inputProps={{ maxLength: 24 }}
                        // disabled={addProjectMutation?.isSuccess}
                        as={TextField}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>                      
                      <p className='text-mediumLabel mb-2'>Password</p>
                      <Field
                        id='password'
                        name='password'
                        // value={newProjectDetails.server}
                        type='password'
                        autocomplete='off'
                        fullWidth
                        disabled={isDefaultproj}
                        
                        value={(isDefaultproj && dbType === "mssql") ? "S0mbari@2022" : (isDefaultproj && dbType === "mongo") ? "JRVvuh9D5V0IZxCW" : null}
                        color='primary'
                        error={(!isDefaultproj) && Boolean(errors.password)}
                        helperText={errors.password}
                        // onKeyUp={(e) => {
                        //   const { value } = e.target;
                        //   debouncedSetPassword(value);
                        // }}
                        variant='outlined'
                        inputProps={{ maxLength: 24 }}
                        // disabled={addProjectMutation?.isSuccess}
                        as={TextField}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <p className='text-mediumLabel mb-2'>Database</p>
                      <Field
                        id='database'
                        name='database'
                        fullWidth
                        value={newProjectDetails.database}
                        color='primary'
                        // error={touched.database && Boolean(errors.database)}
                        helperText={<ErrorMessage name='database' />}
                        // onKeyUp={(e) => {
                        //   const { value } = e.target;
                        //   debouncedSetDatabase(value);
                        // }}
                        variant='outlined'
                        inputProps={{ maxLength: 55 }}
                        // disabled={addProjectMutation?.isSuccess}
                        as={TextField}
                      />
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        {/* Footer */}
        <div className='border-t-2 border-neutral-gray7 flex flex-row items-center justify-end pt-4'>
          <TextButton classes='mr-3' onClick={onClose}>
            Cancel
          </TextButton>

          <PrimaryButton
            type='submit'
            onClick={() => {
              if (!isDefaultproj) formRef.current.handleSubmit();
              setTimeout(function () {
                if (formRef.current.isValid) {
                  newProjectDetails["password"] =
                    formRef.current.values.password;

                  onPublish(newProjectDetails);
                }
              }, 100);
            }}
          >
            Publish
          </PrimaryButton>
        </div>
      </>
    </div>
  );
};

export default CredentialsBeforePublish;
