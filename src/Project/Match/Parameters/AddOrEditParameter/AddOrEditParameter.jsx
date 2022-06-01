import React, { useRef } from "react";
import CloseIcon from "@material-ui/icons/Close";
import {
  Checkbox,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
} from "@material-ui/core";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useParams } from "react-router";
import _ from "lodash";

import {
  PrimaryButton,
  TextButton,
} from "../../../../shared/components/AppButton";
import AppIcon from "../../../../shared/components/AppIcon";
import Constants from "../../../../shared/constants";
import addParameterSchema from "./parameterSchema";
import { useEditParameter, useAddParameter } from "./modifyParameterQueries";
import Colors from "../../../../shared/colors";

const AddOrEditParameter = ({ parameter, onClose }) => {
  const formRef = useRef(null);
  const { projectId } = useParams();
  const {
    isLoading: isAddingParameter,
    isSuccess: isAddSuccess,
    error: addParamError,
    mutate: addParam,
    reset: resetAddParam,
  } = useAddParameter();
  const {
    isLoading: isEditingParameter,
    isSuccess: isEditSuccess,
    error: editParamError,
    mutate: editParam,
    reset: resetEditParam,
  } = useEditParameter();

  const handleSubmit = (values) => {
    if (parameter) {
      editParam({
        projectId,
        paramId: parameter?.id,
        ...values,
      });
      return;
    }
    addParam({
      projectId,
      ...values,
    });
  };

  const resetMutationState = () => {
    if (parameter) {
      if (isEditingParameter || isEditSuccess || editParamError) {
        resetEditParam();
      }
      return;
    }

    if (isAddingParameter || isAddSuccess || addParamError) {
      resetAddParam();
    }
  };

  if (isAddSuccess || isEditSuccess) {
    onClose();
    return null;
  }

  return (
    <div className='flex flex-col'>
      <div className='p-4 flex flex-row justify-between border-b-1'>
        <p className='text-subtitle1'>
          {parameter ? "Edit Parameter" : "Add Parameter"}
        </p>
        {!isAddingParameter && !isEditingParameter && (
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
              attribute: parameter?.name ?? "",
              dataType: parameter?.type ?? "",
              description: parameter?.description ?? "",
              required: parameter?.required ?? false,
              possibleValues:
                parameter?.possibleValues?.reduce((acc, curr) => {
                  if (!_.isEmpty(acc)) {
                    return acc + ", " + curr;
                  }
                  return curr;
                }, "") ?? "",
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
                    disabled={isAddingParameter || isEditingParameter}
                    error={touched.attribute && Boolean(errors.attribute)}
                    helperText={<ErrorMessage name='attribute' />}
                    onKeyUp={(e) => {
                      resetMutationState();
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
                    disabled={isAddingParameter || isEditingParameter}
                    error={touched.dataType && Boolean(errors.dataType)}
                    helperText={<ErrorMessage name='dataType' />}
                    onKeyUp={(e) => {
                      resetMutationState();
                    }}
                    as={(value) => {
                      return (
                        <div className='flex flex-col'>
                          <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            variant='outlined'
                            className='w-full'
                            {...value}
                          >
                            {Constants.parameterDataTypes.map((type) => {
                              var upCaseType =
                                type.charAt(0).toUpperCase() + type.slice(1);
                              return (
                                <MenuItem value={type}>{upCaseType}</MenuItem>
                              );
                            })}
                          </Select>
                          {value?.error && (
                            <p
                              className='py-1'
                              style={{
                                fontSize: "0.75rem",
                                marginLeft: "1rem",
                                color: "#f44336",
                              }}
                            >
                              {errors?.dataType}
                            </p>
                          )}
                        </div>
                      );
                    }}
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
                    disabled={isAddingParameter || isEditingParameter}
                    error={touched.description && Boolean(errors.description)}
                    helperText={<ErrorMessage name='description' />}
                    onKeyUp={(e) => {
                      resetMutationState();
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
                    disabled={isAddingParameter || isEditingParameter}
                    error={
                      touched.possibleValues && Boolean(errors.possibleValues)
                    }
                    helperText={<ErrorMessage name='possibleValues' />}
                    onKeyUp={(e) => {
                      resetMutationState();
                    }}
                    inputProps={{
                      style: {
                        height: "6px",
                      },
                    }}
                    as={TextField}
                  />
                </div>

                {/* <div className='mb-4'>
                  <label className='flex flex-row items-center h-5 w-min'>
                    <p className='text-overline2 mr-2'>Required</p>
                    <Field
                      id='required'
                      name='required'
                      type='checkbox'
                      disabled={isAddingParameter || isEditingParameter}
                      component={({ field }) => {
                        return (
                          <Checkbox
                            {...field}
                            disabled={isAddingParameter || isEditingParameter}
                            style={{
                              color: Colors.brand.secondary,
                              padding: "0",
                            }}
                          />
                        );
                      }}
                    />
                  </label>
                </div> */}
              </Form>
            )}
          </Formik>
        </div>

        {addParamError && (
          <p className='text-accent-red text-overline2'>
            {addParamError?.message}
          </p>
        )}

        {editParamError && (
          <p className='text-accent-red text-overline2'>
            {editParamError?.message}
          </p>
        )}
      </div>

      <div className='border-t-1 p-4 flex flex-row justify-end items-center'>
        {!isAddingParameter && !isEditingParameter ? (
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
              {parameter ? "Save" : "Add"}
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

export default AddOrEditParameter;
