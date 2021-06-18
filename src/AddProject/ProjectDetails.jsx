import React, { useEffect, useCallback } from "react";
import { TextField } from "@material-ui/core";
import { useRecoilState } from "recoil";
import { Field, ErrorMessage, Form, Formik } from "formik";
import debounce from "lodash.debounce";
import { useFilePicker } from "use-file-picker";
import _ from "lodash";
import CloseIcon from "@material-ui/icons/Close";
import Scrollbar from "react-smooth-scrollbar";

import projectAtom from "./projectAtom";
import { PrimaryButton } from "../shared/components/AppButton";
import AppIcon from "../shared/components/AppIcon";
import apiNameSchema from "../shared/schemas/apiNameSchema";

const ProjectDetails = ({
  formRef,
  specsError,
  dbsError,
  addProjectMutation,
  uploadSpecsMutation,
  uploadDbMutation,
}) => {
  const [projectDetails, setProjectDetails] = useRecoilState(projectAtom);

  const debouncedSetName = useCallback(
    debounce((nextValue) => {
      setProjectDetails((currProjectDetails) => {
        return {
          ...currProjectDetails,
          name: nextValue,
        };
      });
    }, 300),
    [] // will be created only once initially
  );

  const handleOnSpecsPick = (pickedSpecs) => {
    if (
      uploadSpecsMutation?.isError ||
      uploadSpecsMutation?.isLoading ||
      uploadSpecsMutation?.isSuccess
    ) {
      uploadSpecsMutation?.reset();
    }

    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);

      pickedSpecs.forEach((pickedSpec) => {
        if (
          !_.find(
            updatedProjectDetails.specs,
            (existingSpec) => existingSpec.name === pickedSpec.name
          )
        ) {
          if (!updatedProjectDetails.specs) {
            updatedProjectDetails.specs = [];
          }

          updatedProjectDetails.specs.push(pickedSpec);
        }
      });

      return updatedProjectDetails;
    });
  };

  const handleOnDbsPick = (pickedDbs) => {
    if (
      uploadDbMutation?.isError ||
      uploadDbMutation?.isLoading ||
      uploadDbMutation?.isSuccess
    ) {
      uploadDbMutation?.reset();
    }

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
  };

  const removeSelectedSpec = (filename) => {
    if (
      uploadSpecsMutation?.isError ||
      uploadSpecsMutation?.isLoading ||
      uploadSpecsMutation?.isSuccess
    ) {
      uploadSpecsMutation?.reset();
    }

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
    if (
      uploadDbMutation?.isError ||
      uploadDbMutation?.isLoading ||
      uploadDbMutation?.isSuccess
    ) {
      uploadDbMutation?.reset();
    }

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
            name: projectDetails?.name ?? "",
          }}
          validationSchema={apiNameSchema("API name is required")}
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
                inputProps={{ maxLength: 24 }}
                disabled={addProjectMutation?.isSuccess}
                as={TextField}
              />
            </Form>
          )}
        </Formik>
      </div>

      <div className='mb-6'>
        <p className='text-mediumLabel mb-2'>Upload Spec</p>
        <input
          id='specs'
          type='file'
          accept='.json'
          multiple
          hidden
          onChange={(e) => {
            handleOnSpecsPick(Array.from(e.target.files));
          }}
        />
        <label
          for='specs'
          className='bg-brand-secondary rounded-md px-4 py-2 text-white text-mediumLabel hover:opacity-90'
        >
          Upload
        </label>

        {/* Spec list */}
        {!_.isEmpty(projectDetails?.specs) ? (
          <div className='mt-3'>
            <Scrollbar className='max-h-24' alwaysShowTracks={true}>
              <ul>
                {projectDetails?.specs?.map((file) => {
                  return (
                    <li key={file.name}>
                      <div className='rounded-md border bg-neutral-gray7 p-2 mb-2 flex flex-row items-center justify-between'>
                        <p className='text-overline2'>
                          {file.name} {Math.round(file.size / 1024)} KB
                        </p>
                        <AppIcon
                          aria-label='remove'
                          onClick={() => {
                            removeSelectedSpec(file.name);
                          }}
                          style={{ width: "18px", height: "18px" }}
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

        {_.isEmpty(projectDetails?.dbs) &&
          _.isEmpty(projectDetails?.specs) &&
          !_.isEmpty(specsError) && (
            <p className='text-accent-red text-overline2 mt-2'>{specsError}</p>
          )}
      </div>

      <div className='mb-3'>
        <p className='text-mediumLabel mb-2'>Connect DB</p>
        <input
          id='dbs'
          type='file'
          accept='.sql'
          multiple
          hidden
          onChange={(e) => {
            handleOnDbsPick(Array.from(e.target.files));
          }}
        />
        <label
          for='dbs'
          className='bg-brand-secondary rounded-md px-4 py-2
           text-white text-mediumLabel hover:opacity-90'
        >
          Upload
        </label>

        {/* Connected Dbs */}
        {!_.isEmpty(projectDetails?.dbs) ? (
          <div className='mt-3'>
            <Scrollbar className='max-h-24' alwaysShowTracks={true}>
              <ul>
                {projectDetails?.dbs?.map((file) => {
                  return (
                    <li key={file.name}>
                      <div className='rounded-md border bg-neutral-gray7 p-2 mb-2 flex flex-row items-center justify-between'>
                        <p className='text-overline2'>
                          {file.name} {Math.round(file.size / 1024)} KB
                        </p>
                        <AppIcon
                          aria-label='remove'
                          onClick={() => {
                            removeSelectedDb(file.name);
                          }}
                          style={{ width: "18px", height: "18px" }}
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

        {_.isEmpty(projectDetails?.dbs) &&
          _.isEmpty(projectDetails?.specs) &&
          !_.isEmpty(dbsError) && (
            <p className='text-accent-red text-overline2 mt-2'>{dbsError}</p>
          )}
      </div>
    </div>
  );
};

export default ProjectDetails;
