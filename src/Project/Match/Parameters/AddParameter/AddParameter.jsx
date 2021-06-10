import React, { useRef } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Checkbox, CircularProgress, TextField } from "@material-ui/core";
import { ErrorMessage, Field, Form, Formik } from "formik";

import {
  PrimaryButton,
  TextButton,
} from "../../../../shared/components/AppButton";
import AppIcon from "../../../../shared/components/AppIcon";
import addParameterSchema from "./addParameterSchema";
import { useAddParameter } from "./addParameterQuery";
import Colors from "../../../../shared/colors";
import { useParams } from "react-router";

const AddParameter = ({ onClose }) => {
  const formRef = useRef(null);
  const { id: projectId } = useParams();
  const {
    isLoading: isAddingParameter,
    isSuccess: isAddSuccess,
    error: addParamError,
    mutate: addParam,
    reset: resetAddParam,
  } = useAddParameter();

  const handleSubmit = (values) => {
    addParam({
      projectId,
      ...values,
    });
  };

  const resetAddParamMutationState = () => {
    if (isAddingParameter || isAddSuccess || addParamError) {
      resetAddParam();
    }
  };

  if (isAddSuccess) {
    onClose();
    return null;
  }

  return (
    <div className='flex flex-col'>
      <div className='p-4 flex flex-row justify-between border-b-1'>
        <p className='text-subtitle1'>Add Parameter</p>
        {!isAddingParameter && (
          <AppIcon
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              onClose();
            }}
          >
            <CloseIcon />
          </AppIcon>
        )}
      </div>

      <div className='p-4'>
        <div className='mb-3'>
          <Formik
            initialValues={{
              attribute: "",
              dataType: "",
              description: "",
              required: false,
              possibleValues: "",
            }}
            validationSchema={addParameterSchema}
            innerRef={formRef}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className='mb-4'>
                  <p className='text-overline2 mb-2'>Attribute</p>

                  <Field
                    id='attribute'
                    name='attribute'
                    fullWidth
                    color='primary'
                    variant='outlined'
                    disabled={isAddingParameter}
                    error={touched.attribute && Boolean(errors.attribute)}
                    helperText={<ErrorMessage name='attribute' />}
                    onKeyUp={(e) => {
                      resetAddParamMutationState();
                    }}
                    inputProps={{
                      style: {
                        height: "6px",
                      },
                    }}
                    as={TextField}
                  />
                </div>

                <div className='mb-4'>
                  <p className='text-overline2 mb-2'>Data Type</p>

                  <Field
                    id='dataType'
                    name='dataType'
                    fullWidth
                    color='primary'
                    variant='outlined'
                    disabled={isAddingParameter}
                    error={touched.dataType && Boolean(errors.dataType)}
                    helperText={<ErrorMessage name='dataType' />}
                    onKeyUp={(e) => {
                      resetAddParamMutationState();
                    }}
                    inputProps={{
                      style: {
                        height: "6px",
                      },
                    }}
                    as={TextField}
                  />
                </div>

                <div className='mb-4'>
                  <p className='text-overline2 mb-2'>Description</p>

                  <Field
                    id='description'
                    name='description'
                    fullWidth
                    color='primary'
                    variant='outlined'
                    disabled={isAddingParameter}
                    error={touched.description && Boolean(errors.description)}
                    helperText={<ErrorMessage name='description' />}
                    onKeyUp={(e) => {
                      resetAddParamMutationState();
                    }}
                    inputProps={{
                      style: {
                        height: "6px",
                      },
                    }}
                    as={TextField}
                  />
                </div>

                <div className='mb-4'>
                  <p className='text-overline2 mb-2'>Possible Values</p>

                  <Field
                    id='possibleValues'
                    name='possibleValues'
                    fullWidth
                    color='primary'
                    variant='outlined'
                    disabled={isAddingParameter}
                    error={
                      touched.possibleValues && Boolean(errors.possibleValues)
                    }
                    helperText={<ErrorMessage name='possibleValues' />}
                    onKeyUp={(e) => {
                      resetAddParamMutationState();
                    }}
                    inputProps={{
                      style: {
                        height: "6px",
                      },
                    }}
                    as={TextField}
                  />
                </div>

                <div className='mb-4'>
                  <label className='flex flex-row items-center h-5 w-min'>
                    <p className='text-overline2 mr-2'>Required</p>
                    <Field
                      id='required'
                      name='required'
                      type='checkbox'
                      disabled={isAddingParameter}
                      component={({ field }) => {
                        return (
                          <Checkbox
                            {...field}
                            disabled={isAddingParameter}
                            style={{ color: Colors.brand.secondary }}
                          />
                        );
                      }}
                    />
                  </label>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {addParamError && (
          <p className='text-accent-red text-overline2'>
            {addParamError?.message}
          </p>
        )}
      </div>

      <div className='border-t-1 p-4 flex flex-row justify-end items-center'>
        {!isAddingParameter ? (
          <>
            <TextButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                onClose();
              }}
            >
              Cancel
            </TextButton>
            <PrimaryButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                formRef.current.submitForm();
              }}
            >
              Add
            </PrimaryButton>
          </>
        ) : (
          <CircularProgress
            style={{
              width: "24px",
              height: "24px",
              color: Colors.brand.secondary,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AddParameter;
