import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Field, ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { CircularProgress, TextField } from "@material-ui/core";

import AppIcon from "../../shared/components/AppIcon";
import { PrimaryButton, TextButton } from "../../shared/components/AppButton";
import { useUpdateProject } from "../updateProjectQueries";

const RenameProject = ({ project, onClose }) => {
  const {
    isLoading: isUpdatingProject,
    isSuccess: isProjectUpdated,
    error: updateProjectError,
    mutate: updateProject,
  } = useUpdateProject();

  const handleNext = (values) => {
    if (values?.name !== project?.projectName) {
      updateProject({ id: project?._id, projectName: values?.name });
    } else {
      onClose();
    }
  };

  if (isProjectUpdated) {
    onClose();
    return null;
  }

  return (
    <div>
      <div className='flex flex-row justify-between items-center border-b-2 border-neutral-gray7 px-4 py-2 mb-2'>
        <h5>Rename Project</h5>

        {!isUpdatingProject && (
          <AppIcon onClick={onClose}>
            <CloseIcon />
          </AppIcon>
        )}
      </div>

      <p className='px-4  mb-2 text-overline2'>API Name</p>

      <Formik
        initialValues={{
          name: project?.projectName ?? "",
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .required("API name is required")
            .matches(
              `^(?=[a-zA-Z0-9-_]*$)`,
              "Only - and _ are allowed as special characters"
            ),
        })}
        onSubmit={handleNext}
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
                  disabled={isUpdatingProject}
                  inputProps={{ maxLength: 24 }}
                />
              </div>

              <p className='ml-4 mb-3 text-accent-red text-overline2'>
                {updateProjectError?.message}
              </p>

              <div className='border-t-2 border-neutral-gray7 flex flex-row items-center justify-end p-4'>
                {!isUpdatingProject ? (
                  <>
                    <TextButton
                      onClick={() => {
                        onClose();
                      }}
                      classes='mr-3'
                    >
                      Cancel
                    </TextButton>
                    <PrimaryButton type='submit'>Save</PrimaryButton>
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

export default RenameProject;
