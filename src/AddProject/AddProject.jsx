import React, { useState, useRef } from "react";
import {
  AppBar,
  IconButton,
  Tab,
  Tabs,
  MuiThemeProvider,
} from "@material-ui/core";
import Button from "@mui/material/Button";
import CloseIcon from "@material-ui/icons/Close";
import { useRecoilState } from "recoil";
import _ from "lodash";

import AppIcon from "../shared/components/AppIcon";
import { PrimaryButton, TextButton } from "../shared/components/AppButton";
import LoaderWithMessage from "../shared/components/LoaderWithMessage";
import { isEmailValid } from "../shared/utils";
import ProjectDetails from "./ProjectDetails";
import ConnectDatabase from "./ConnectDatabase";
import InviteCollaborators from "../shared/components/InviteCollaborators";
import projectAtom from "./projectAtom";
import {
  useDatabaseConnection,
  useAddProject,
  useUploadProjectDbs,
  useUploadProjectFile,
  useUploadProjectSpecs,
  useExportDBSchema,
  useUploadProjectCertificate,
  useUploadProjectCACertificate,
} from "./addProjectQuery";
import { getApiError } from "../shared/utils";
import TabLabel from "../shared/components/TabLabel";
import Messages from "../shared/messages";

import client, { endpoint } from "../shared/network/client";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { getUserId } from "../shared/storage";


const AddProject = ({ onClose, onSuccess }) => {
  const [currentTab, setTab] = useState(0);
  const [connectDatabaseTab, setConnectDatabaseTab] = useState(0);
  const [open, setOpen] = React.useState(false);
  const loggedInUserId = getUserId();

  const [specsError, setSpecsError] = useState(null);
  const [dbsError, setDbsError] = useState(null);
  const [projectDetails, setProjectDetails] = useRecoilState(projectAtom);

  const onAddProjectSuccess = (projectId) => {
    onSuccess(projectId);
  };

  const {
    addProjectMutation,
    uploadSpecsMutation,
    uploadDbMutation,
    aiMatcherMutation,
    exportDBSchemaMutation,
    dbConnectionTestMutation,
    caCertificateMutation,
    certificateMutation,
    keyMutation,
  } = useAddProject(onAddProjectSuccess);

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
    isLoading: isMatchingAi,
    error: matchAiError,
    isSuccess: matchAiSuccess,
    mutate: callAiMatcher,
    reset: resetAiMatcherApi,
  } = aiMatcherMutation;

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
      if (
        formRef.current.isValid &&
        !_.isEmpty(projectDetails?.name) &&
        currentTab === 0
      ) {
        setTab(currentTab + 1);
      } else if (currentTab === 1) {
        formRef.current.handleSubmit();
        setTab(currentTab + 1);
      }
    }
  };
  const handleDone = () => {
    resetCreateProjectApi();
    resetUploadDbsApi();
    resetUploadSpecsApi();
    exportDBSchemaApi();
    resetAiMatcherApi();

    if (
      _.isEmpty(projectDetails?.name) ||
      (_.isEmpty(projectDetails?.dbs) &&
        _.isEmpty(projectDetails?.specs) &&
        _.isEmpty(projectDetails?.host) &&
        _.isEmpty(projectDetails?.port) &&
        _.isEmpty(projectDetails?.username) &&
        _.isEmpty(projectDetails?.password) &&
        _.isEmpty(projectDetails?.database) &&
        _.isEmpty(projectDetails?.type))
    ) {
      setTab(0);
      if (formRef.current) {
        formRef.current.handleSubmit();
      }

      return;
    }

    uploadProjectData({
      name: projectDetails?.name,
      invitees: projectDetails?.collaborators?.map((collaborator) => {
        return {
          email: collaborator,
        };
      }),
    });
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

  const {
    mutate: testDatabase,
    isLoading: isUploadingCredentials,
    error: dbConnectionTestError,
    isSuccess: isDbConnectionSuccess,
    reset: dbConnectionTestApi,
  } = dbConnectionTestMutation;
  const {
    isLoading: isExportingDb,
    error: exportDBError,
    isSuccess: isExportDBSuccess,
    reset: exportDBSchemaApi,
  } = exportDBSchemaMutation;

  const {
    isLoading: isUploadingProjectKey,
    error: uploadProjectKeyError,
    isSuccess: isUploadProjectKeySuccess,
    reset: uploadKeyApi,
  } = keyMutation;

  const {
    isLoading: isUploadingProjectCertificate,
    error: uploadProjectCertificateError,
    isSuccess: isUploadProjectCertificateSuccess,
    reset: uploadCertificateApi,
  } = certificateMutation;

  const {
    isLoading: isUploadingProjectCACertificate,
    error: uploadProjectCACertificateError,
    isSuccess: isUploadProjectCACertificateSuccess,
    reset: uploadCaCertificateApi,
  } = caCertificateMutation;

  const databaseConnectionTest = () => {
    uploadKeyApi();
    uploadCertificateApi();
    uploadCaCertificateApi();
    dbConnectionTestApi();
    if (
      !_.isEmpty(projectDetails?.keys) &&
      !_.isEmpty(projectDetails?.certificates) &&
      !_.isEmpty(projectDetails?.caCertificates)
    ) {
      keyMutation.mutate({
        projectId: loggedInUserId,
        file: projectDetails?.keys[0],
        userId: loggedInUserId,
        test: true
      });
    } else {
      let payload = {
        host: projectDetails.host,
        port: projectDetails.port,
        username: projectDetails.username,
        password: projectDetails.password,
        database: projectDetails.database,
        type: projectDetails.type,
      };
      testDatabase(payload);
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <div className="p-4">
      <div className="flex flex-row items-center justify-between mb-3">
        <h5>Create New API Project</h5>

        {!isUploadingProjectDetails &&
          !isUploadingDbs &&
          !isUploadingSpecs &&
          !isMatchingAi &&
          !isUploadingCredentials &&
          !isUploadingProjectKey &&
          !isUploadingProjectCertificate &&
          !isUploadingProjectCACertificate &&
          !isExportingDb && (
            <AppIcon aria-label="close" onClick={onClose}>
              <CloseIcon />
            </AppIcon>
          )}
      </div>

      {!isUploadingProjectDetails &&
        !isUploadingDbs &&
        !isUploadingSpecs &&
        !isMatchingAi &&
        !isUploadingCredentials &&
        !isUploadingProjectKey &&
        !isUploadingProjectCertificate &&
        !isUploadingProjectCACertificate &&
        !isExportingDb && (
          <>
            <Tabs
              value={currentTab}
              onChange={(_, index) => {
                setTab(index);
              }}
              aria-label="add project tabs"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                label={<TabLabel label={"1. Create API"} />}
                style={{ outline: "none", border: "none" }}
              />
              <Tab
                label={<TabLabel label={"2. Connect Database"} />}
                style={{ outline: "none", border: "none" }}
              />
              <Tab
                label={<TabLabel label={"3. Invite Collaborators"} />}
                style={{ outline: "none", border: "none" }}
              />
            </Tabs>

            {/* Content */}
            <div>
              {currentTab === 0 ? (
                <div className="h-80">
                  <ProjectDetails
                    formRef={formRef}
                    specsError={specsError}
                    dbsError={dbsError}
                    addProjectMutation={addProjectMutation}
                    uploadSpecsMutation={uploadSpecsMutation}
                    uploadDbMutation={uploadDbMutation}
                    aiMatcherMutation={aiMatcherMutation}
                  />
                </div>
              ) : currentTab === 1 ? (
                <div className="h-80">
                  <ConnectDatabase
                    formRef={formRef}
                    specsError={specsError}
                    dbsError={dbsError}
                    addProjectMutation={addProjectMutation}
                    uploadSpecsMutation={uploadSpecsMutation}
                    uploadDbMutation={uploadDbMutation}
                    aiMatcherMutation={aiMatcherMutation}
                    activeTab={connectDatabaseTab}
                    handleTabChange={setConnectDatabaseTab}
                  />
                </div>
              ) : (
                <div className="h-80">
                  <InviteCollaborators
                    handleChange={handleCollaboratorsChange}
                    collaborators={projectDetails?.collaborators}
                    addProjectMutation={addProjectMutation}
                  />
                </div>
              )}
            </div>

            {projectDetailsError && (
              <p className="text-overline2 text-accent-red my-2">
                {projectDetailsError?.message}
              </p>
            )}

            {dbConnectionTestError && (
              <p className="text-overline2 text-accent-red my-2">
                {`Failed to connect Db - ${dbConnectionTestError?.message}`}
              </p>
            )}

            {isDbConnectionSuccess && (
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                action={action}
              >
                <Alert
                  onClose={handleClose}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  Db connection is successful
                </Alert>
              </Snackbar>
            )}

            {uploadSpecsError && (
              <p className="text-overline2 text-accent-red my-2">
                {`Failed to upload specs - ${uploadSpecsError?.message}`}
              </p>
            )}

            {uploadDbsError && (
              <p className="text-overline2 text-accent-red my-2">
                {`Failed to upload dbs - ${uploadDbsError?.message}`}
              </p>
            )}

            {matchAiError && (
              <p className="text-overline2 text-accent-red my-2">
                {matchAiError?.message}
              </p>
            )}

            {/* Bottom section */}
            <div className="border-t-2 border-neutral-gray7 flex flex-row items-center justify-end pt-4">
              {currentTab === 2 ? (
                <TextButton
                  onClick={() => {
                    handleDone();
                  }}
                  classes="flex-1 -ml-4 text-brand-secondary"
                >
                  Skip for now
                </TextButton>
              ) : null}

              <TextButton
                onClick={() => {
                  if (
                    currentTab === 0 ||
                    (currentTab === 1 && connectDatabaseTab === 1)
                  ) {
                    onClose();
                  } else if (currentTab === 1) {
                    handleClick();
                    databaseConnectionTest();
                  } else {
                    setTab(1);
                  }
                }}
                classes="mr-3"
              >
                {currentTab === 0
                  ? "Cancel"
                  : currentTab === 1
                  ? connectDatabaseTab === 0
                    ? "Test"
                    : "Cancel"
                  : "Back"}
              </TextButton>

              <PrimaryButton
                onClick={() => {
                  if (currentTab === 0 || currentTab === 1) {
                    handleNext();
                  } else {
                    handleDone();
                  }
                }}
              >
                {currentTab === 0 || currentTab === 1 ? "Next" : "Done"}
              </PrimaryButton>
            </div>
          </>
        )}

      {isUploadingCredentials && (
        <div className="my-7">
          <LoaderWithMessage message="Connecting to Database" contained />
        </div>
      )}

      {isUploadingProjectDetails && (
        <div className="my-7">
          <LoaderWithMessage message="Creating new project" contained />
        </div>
      )}

      {isUploadingSpecs && (
        <div className="my-7">
          <LoaderWithMessage message="Uploading spec files" contained />
        </div>
      )}

      {isUploadingDbs && (
        <div className="my-7">
          <LoaderWithMessage message="Uploading database files" contained />
        </div>
      )}

      {isUploadingProjectKey && (
        <div className="my-7">
          <LoaderWithMessage message="UploadingProjectKey" contained />
        </div>
      )}
      {isUploadingProjectCertificate && (
        <div className="my-7">
          <LoaderWithMessage message="UploadingProjectCertificate" contained />
        </div>
      )}
      {isUploadingProjectCACertificate && (
        <div className="my-7">
          <LoaderWithMessage
            message="UploadingProjectCACertificate"
            contained
          />
        </div>
      )}
      {isExportingDb && (
        <div className="my-7">
          <LoaderWithMessage message="ExportingDb " contained />
        </div>
      )}

      {isMatchingAi && (
        <div className="my-7">
          <LoaderWithMessage
            message="Running AI Matcher for the uploaded files"
            contained
          />
        </div>
      )}
    </div>
  );
};

export default AddProject;
