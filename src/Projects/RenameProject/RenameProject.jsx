import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { Field, ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextField } from '@material-ui/core';

import AppIcon from '../../shared/components/AppIcon';
import { PrimaryButton, TextButton } from '../../shared/components/AppButton';

const RenameProject = ({ project, onClose }) => {
  const handleNext = (values) => {
    console.log('values', values);
  };

  return (
    <div>
      <div className='flex flex-row justify-between items-center border-b-2 border-neutral-gray7 px-4 py-2 mb-2'>
        <h5>Rename Project</h5>

        <AppIcon onClick={onClose}>
          <CloseIcon />
        </AppIcon>
      </div>

      <p className='px-4  mb-2 text-overline2'>API Name</p>

      <Formik
        initialValues={{
          name: project?.name ?? '',
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required('API name is required'),
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
                />
              </div>

              <div className='border-t-2 border-neutral-gray7 flex flex-row items-center justify-end p-4'>
                <TextButton
                  onClick={() => {
                    onClose();
                  }}
                  classes='mr-3'
                >
                  Cancel
                </TextButton>

                <PrimaryButton type='submit'>Save</PrimaryButton>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default RenameProject;
