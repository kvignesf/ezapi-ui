import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import { CircularProgress, TextField } from "@material-ui/core";
import { ErrorMessage, Field, Form, Formik } from "formik";

import AppIcon from "../../../shared/components/AppIcon";
import {
  PrimaryButton,
  TextButton,
} from "../../../shared/components/AppButton";
import apiNameSchema from "../../../shared/schemas/apiNameSchema";
import { useAddPath, useEditPath } from "./pathQuery";

const AddOrEditPath = ({ title, path: { id, name }, onClose }) => {
  const {
    isLoading: isAddingPath,
    isSuccess: isAddingPathSuccess,
    error: addPathError,
    mutate: addPath,
  } = useAddPath();
  const {
    isLoading: isEditingPath,
    isSuccess: isEditingPathSuccess,
    error: editPathError,
    mutate: editPath,
  } = useEditPath();

  const handleSubmit = (values) => {
    const pathName = values?.name;
  };

  return (
    <div>
      <div className='p-3 flex flex-row justify-between border-b-2'>
        <h5>{title}</h5>

        <AppIcon onClick={onClose}>
          <CloseIcon />
        </AppIcon>
      </div>

      <p className='my-2 mx-4 text-overline2'>Path Name</p>

      <Formik
        initialValues={{
          name: name ?? "",
        }}
        validationSchema={apiNameSchema("Path name is required")}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <>
            <Form>
              <div className='mb-4 px-4'>
                <Field
                  id='name'
                  name='name'
                  fullWidth
                  color='primary'
                  error={touched.name && Boolean(errors.name)}
                  helperText={<ErrorMessage name='name' />}
                  variant='outlined'
                  as={TextField}
                  disabled={isEditingPath || isAddingPath}
                  inputProps={{ maxLength: 24 }}
                />
              </div>

              {editPathError && (
                <p className='ml-4 mb-3 text-accent-red text-overline2'>
                  {editPathError?.message}
                </p>
              )}

              {addPathError && (
                <p className='ml-4 mb-3 text-accent-red text-overline2'>
                  {addPathError?.message}
                </p>
              )}

              <div className='border-t-2 border-neutral-gray7 flex flex-row items-center justify-end p-4'>
                {!(isEditingPath || isAddingPath) ? (
                  <>
                    <TextButton
                      onClick={() => {
                        onClose();
                      }}
                      classes='mr-3'
                    >
                      Cancel
                    </TextButton>
                    <PrimaryButton type='submit'>Done</PrimaryButton>
                  </>
                ) : (
                  <CircularProgress size='24px' />
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default AddOrEditPath;
