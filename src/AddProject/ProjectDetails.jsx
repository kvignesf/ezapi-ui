import React, { useEffect, useCallback } from 'react';
import { TextField } from '@material-ui/core';
import { useRecoilState } from 'recoil';
import { Field, ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import debounce from 'lodash.debounce';
import { useFilePicker } from 'use-file-picker';
import _ from 'lodash';
import CloseIcon from '@material-ui/icons/Close';
import Scrollbar from 'react-smooth-scrollbar';

import projectAtom from './projectAtom';
import { PrimaryButton } from '../shared/components/AppButton';
import AppIcon from '../shared/components/AppIcon';

const ProjectDetails = ({ formRef }) => {
  const [projectDetails, setProjectDetails] = useRecoilState(projectAtom);
  const specUploader = useFilePicker({
    multiple: true,
    readAs: 'BinaryString',
    accept: ['.json'],
  });
  const dbUploader = useFilePicker({
    multiple: true,
    readAs: 'Text',
    accept: ['.db', '.sql'],
  });

  const debouncedSetName = useCallback(
    debounce((nextValue) => {
      console.log('changes');

      setProjectDetails((currProjectDetails) => {
        return {
          ...currProjectDetails,
          name: nextValue,
        };
      });
    }, 300),
    [] // will be created only once initially
  );

  useEffect(() => {
    const pickedSpecs = specUploader[0];

    if (pickedSpecs && !_.isEmpty(pickedSpecs)) {
      setProjectDetails((currProjectDetails) => {
        const updatedProjectDetails = _.cloneDeep(currProjectDetails);

        pickedSpecs.forEach((pickedSpec) => {
          if (
            !_.find(
              updatedProjectDetails.specs,
              (existingSpec) => existingSpec.name === pickedSpec.name
            )
          ) {
            console.log('something', pickedSpec);
            if (!updatedProjectDetails.specs) {
              updatedProjectDetails.specs = [];
            }

            updatedProjectDetails.specs.push(pickedSpec);
          }
        });

        return updatedProjectDetails;
      });
    }
  }, [specUploader[0]]);

  useEffect(() => {
    const pickedDbs = dbUploader[0];

    if (pickedDbs && !_.isEmpty(pickedDbs)) {
      setProjectDetails((currProjectDetails) => {
        const updatedProjectDetails = _.cloneDeep(currProjectDetails);

        pickedDbs.forEach((pickedDb) => {
          if (
            !_.find(
              updatedProjectDetails.dbs,
              (existingDb) => existingDb.name === pickedDb.name
            )
          ) {
            if (!updatedProjectDetails.dbs) {
              updatedProjectDetails.dbs = [];
            }

            updatedProjectDetails.dbs.push(pickedDb);
          }
        });

        return updatedProjectDetails;
      });
    }
  }, [dbUploader[0]]);

  const handleUploadSpec = () => {
    const openFileSelector = specUploader[2];
    openFileSelector();
  };

  const handleUploadDb = () => {
    const openFileSelector = dbUploader[2];
    openFileSelector();
  };

  const removeSelectedSpec = (filename) => {
    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);

      updatedProjectDetails.specs = _.filter(
        updatedProjectDetails.specs,
        (spec) => {
          return spec.name !== filename;
        }
      );
      return updatedProjectDetails;
    });
  };

  const removeSelectedDb = (filename) => {
    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);

      updatedProjectDetails.dbs = _.filter(updatedProjectDetails.dbs, (db) => {
        return db.name !== filename;
      });
      return updatedProjectDetails;
    });
  };

  return (
    <div className='p-4'>
      <p className='text-mediumLabel mb-2'>API Name</p>

      <div className='mb-6'>
        <Formik
          initialValues={{
            name: projectDetails?.name ?? '',
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('API name is required'),
          })}
          innerRef={formRef}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                id='name'
                name='name'
                fullWidth
                color='primary'
                error={touched.name && Boolean(errors.name)}
                helperText={<ErrorMessage name='name' />}
                onKeyUp={(e) => {
                  const { value } = e.target;
                  debouncedSetName(value);
                }}
                variant='outlined'
                as={TextField}
              />
            </Form>
          )}
        </Formik>
      </div>

      <div className='mb-6'>
        <p className='text-mediumLabel mb-2'>Upload Spec</p>
        <PrimaryButton onClick={handleUploadSpec}>Upload</PrimaryButton>

        {/* Spec list */}
        {!_.isEmpty(projectDetails?.specs) ? (
          <div className='mt-3'>
            <Scrollbar className='max-h-24' alwaysShowTracks={true}>
              <ul>
                {projectDetails?.specs?.map((file) => {
                  return (
                    <li>
                      <div className='rounded-md border bg-neutral-gray7 p-2 mb-2 flex flex-row items-center justify-between'>
                        <p className='text-overline2'>{file.name}</p>
                        <AppIcon
                          aria-label='remove'
                          onClick={() => {
                            removeSelectedSpec(file.name);
                          }}
                          style={{ width: '18px', height: '18px' }}
                        >
                          <CloseIcon />
                        </AppIcon>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Scrollbar>
          </div>
        ) : null}
      </div>

      <div className='mb-3'>
        <p className='text-mediumLabel mb-2'>Connect DB</p>
        <PrimaryButton onClick={handleUploadDb}>Upload</PrimaryButton>

        {/* Connected Dbs */}
        {!_.isEmpty(projectDetails?.dbs) ? (
          <div className='mt-3'>
            <Scrollbar className='max-h-24' alwaysShowTracks={true}>
              <ul>
                {projectDetails?.dbs?.map((file) => {
                  return (
                    <li>
                      <div className='rounded-md border bg-neutral-gray7 p-2 mb-2 flex flex-row items-center justify-between'>
                        <p className='text-overline2'>{file.name}</p>
                        <AppIcon
                          aria-label='remove'
                          onClick={() => {
                            removeSelectedDb(file.name);
                          }}
                          style={{ width: '18px', height: '18px' }}
                        >
                          <CloseIcon />
                        </AppIcon>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Scrollbar>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProjectDetails;
