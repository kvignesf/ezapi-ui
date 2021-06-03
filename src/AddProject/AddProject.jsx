import React, { useState, useRef } from "react";
import {
  AppBar,
  IconButton,
  Tab,
  Tabs,
  MuiThemeProvider,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useRecoilState } from "recoil";
import _ from "lodash";

import AppIcon from "../shared/components/AppIcon";
import { PrimaryButton, TextButton } from "../shared/components/AppButton";
import LoaderWithMessage from "../shared/components/LoaderWithMessage";
import { isEmailValid } from "../shared/utils";
import ProjectDetails from "./ProjectDetails";
import InviteCollaborators from "../shared/components/InviteCollaborators";
import projectAtom from "./projectAtom";
import {
  useAddProject,
  useUploadProjectDbs,
  useUploadProjectFile,
  useUploadProjectSpecs,
} from "./addProjectQuery";

const AddProject = ({ onClose }) => {
  const [currentTab, setTab] = useState(0);
  const [specsError, setSpecsError] = useState(null);
  const [dbsError, setDbsError] = useState(null);
  const [projectDetails, setProjectDetails] = useRecoilState(projectAtom);
  const {
    addProjectMutation,
    uploadSpecsMutation,
    uploadDbMutation,
    aiMatcherMutation: {
      isLoading: isMatchingAi,
      error: matchAiError,
      isSuccess: matchAiSuccess,
      mutate: callAiMatcher,
    },
  } = useAddProject();

  const formRef = useRef();

  const {
    isLoading: isUploadingProjectDetails,
    error: projectDetailsError,
    isSuccess: isProjectDetailsUploadSuccess,
    data: createdProjectDetails,
    mutate: uploadProjectData,
    reset: resetCreateProjectApi,
  } = addProjectMutation;

  const {
    isLoading: isUploadingSpecs,
    error: uploadSpecsError,
    isSuccess: uploadSpecsSuccess,
    mutate: uploadSpecs,
    reset: resetUploadSpecsApi,
  } = uploadSpecsMutation;

  const {
    isLoading: isUploadingDbs,
    error: uploadDbsError,
    isSuccess: uploadDbsSuccess,
    mutate: uploadDbs,
    reset: resetUploadDbsApi,
  } = uploadDbMutation;

  const handleNext = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();

      if (_.isEmpty(projectDetails?.specs)) {
        setSpecsError("Upload atleast one specs file.");
      }

      if (_.isEmpty(projectDetails?.dbs)) {
        setDbsError("Upload atleast one database file.");
      }

      if (
        formRef.current.isValid &&
        !_.isEmpty(projectDetails?.name) &&
        !_.isEmpty(projectDetails?.dbs) &&
        !_.isEmpty(projectDetails?.specs)
      ) {
        setTab(1);
      }
    }
  };

  const handleDone = () => {
    if (
      _.isEmpty(projectDetails?.name) ||
      _.isEmpty(projectDetails?.dbs) ||
      _.isEmpty(projectDetails?.specs)
    ) {
      setTab(0);
      if (formRef.current) {
        formRef.current.handleSubmit();
      }

      return;
    }

    if (!isProjectDetailsUploadSuccess) {
      uploadProjectData({
        name: projectDetails?.name,
        invitees: projectDetails?.collaborators?.map((collaborator) => {
          return {
            email: collaborator,
          };
        }),
      });
    } else if (!uploadSpecsSuccess) {
      uploadSpecs({
        projectId: createdProjectDetails?.projectId,
        files: projectDetails?.specs,
      });
    } else if (!uploadDbsSuccess) {
      uploadDbs({
        projectId: createdProjectDetails?.projectId,
        files: projectDetails?.dbs,
      });
    } else if (!matchAiSuccess) {
      callAiMatcher({
        projectId: createdProjectDetails?.projectId,
      });
    }
  };

  const handleCollaboratorsChange = (collaborators) => {
    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);

      updatedProjectDetails.collaborators = [];
      collaborators.forEach((collaborator) => {
        if (
          !_.find(updatedProjectDetails.collaborators, collaborator) &&
          isEmailValid(collaborator)
        ) {
          updatedProjectDetails.collaborators.push(collaborator);
        }
      });

      return updatedProjectDetails;
    });
  };

  if (matchAiSuccess) {
    onClose();
    return null;
  }

  return (
    <div className='p-4'>
      <div className='flex flex-row items-center justify-between mb-3'>
        <h5>Create New API Project</h5>

        {!isUploadingProjectDetails &&
          !isUploadingDbs &&
          !isUploadingSpecs &&
          !isMatchingAi && (
            <AppIcon aria-label='close' onClick={onClose}>
              <CloseIcon />
            </AppIcon>
          )}
      </div>

      {!isUploadingProjectDetails &&
        !isUploadingDbs &&
        !isUploadingSpecs &&
        !isMatchingAi && (
          <>
            <Tabs
              value={currentTab}
              onChange={(_, index) => {
                setTab(index);
              }}
              aria-label='add project tabs'
              indicatorColor='primary'
              textColor='primary'
            >
              <Tab
                label={
                  <span className='text-overline2 capitalize'>
                    1. Create API
                  </span>
                }
                style={{ outline: "none", border: "none" }}
              />
              <Tab
                label={
                  <span className='text-overline2 capitalize'>
                    2. Invite Collaborators
                  </span>
                }
                style={{ outline: "none", border: "none" }}
              />
            </Tabs>

            {/* Content */}
            <div className='h-full'>
              {currentTab === 0 ? (
                <div>
                  <ProjectDetails
                    formRef={formRef}
                    specsError={specsError}
                    dbsError={dbsError}
                    addProjectMutation={addProjectMutation}
                    uploadSpecsMutation={uploadSpecsMutation}
                    uploadDbMutation={uploadDbMutation}
                  />
                </div>
              ) : (
                <div className='h-80 pt-4 mb-4'>
                  <InviteCollaborators
                    handleChange={handleCollaboratorsChange}
                    collaborators={projectDetails?.collaborators}
                    addProjectMutation={addProjectMutation}
                  />
                </div>
              )}
            </div>

            {projectDetailsError && (
              <p className='text-overline2 text-accent-red my-2'>
                {projectDetailsError?.message}
              </p>
            )}

            {uploadSpecsError && (
              <p className='text-overline2 text-accent-red my-2'>
                {`Failed to upload specs - ${uploadSpecsError?.message}`}
              </p>
            )}

            {uploadDbsError && (
              <p className='text-overline2 text-accent-red my-2'>
                {`Failed to upload dbs - ${uploadDbsError?.message}`}
              </p>
            )}

            {matchAiError && (
              <p className='text-overline2 text-accent-red my-2'>
                {matchAiError?.message}
              </p>
            )}

            {/* Bottom section */}
            <div className='border-t-2 border-neutral-gray7 flex flex-row items-center justify-end pt-4'>
              {currentTab === 1 ? (
                <TextButton
                  onClick={() => {
                    handleDone();
                  }}
                  classes='flex-1 -ml-4 text-brand-secondary'
                >
                  Skip for now
                </TextButton>
              ) : null}

              <TextButton
                onClick={() => {
                  if (currentTab === 0) {
                    onClose();
                  } else {
                    setTab(0);
                  }
                }}
                classes='mr-3'
              >
                {currentTab === 0 ? "Cancel" : "Back"}
              </TextButton>

              <PrimaryButton
                onClick={() => {
                  if (currentTab === 0) {
                    handleNext();
                  } else {
                    handleDone();
                  }
                }}
              >
                {currentTab === 0 ? "Next" : "Done"}
              </PrimaryButton>
            </div>
          </>
        )}

      {isUploadingProjectDetails && (
        <div className='my-7'>
          <LoaderWithMessage message='Creating new project' contained />
        </div>
      )}

      {isUploadingSpecs && (
        <div className='my-7'>
          <LoaderWithMessage message='Uploading spec files' contained />
        </div>
      )}

      {isUploadingDbs && (
        <div className='my-7'>
          <LoaderWithMessage message='Uploading database files' contained />
        </div>
      )}

      {isMatchingAi && (
        <div className='my-7'>
          <LoaderWithMessage
            message='Running AI Matcher for the uploaded files'
            contained
          />
        </div>
      )}
    </div>
  );
};

export default AddProject;
