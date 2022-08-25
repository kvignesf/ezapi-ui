import React, { useState, useRef, useEffect } from "react";
import {
  AppBar,
  IconButton,
  Tab,
  Tabs,
  MuiThemeProvider,
} from "@material-ui/core";
// import EzapiLogo from "../shared/components/EzapiLogo";
import { ReactComponent as Logo } from "../static/images/logo/connectoLogo.svg";
import Button from "@mui/material/Button";
import CloseIcon from "@material-ui/icons/Close";
import { useRecoilState } from "recoil";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import routes from "../shared/routes";
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
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [isDesign, setIsDesign] = useState(null);
  // const [isDesign, setIsDesign] = useState(true);
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [inviteCollabsErrorMssg, setInviteCollabsErrorMssg] = useState(false);

  const loggedInUserId = getUserId();

  const [specsError, setSpecsError] = useState(null);
  const [dbsError, setDbsError] = useState(null);
  const [isProjectNameEmpty, setIsProjectNameEmpty] = useState(false);
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

  const prevFormRef = useRef();

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
      if (formRef.current.isValid) {
        if (
          (currentTab === 0 && !_.isEmpty(projectDetails?.name)) ||
          (currentTab === 1 && connectDatabaseTab === 0) ||
          (currentTab === 1 &&
            connectDatabaseTab === 1 &&
            !_.isEmpty(projectDetails?.dbType))
        ) {
          setTab(currentTab + 1);
        }
      }
      // if (
      //   formRef.current.isValid &&
      //   !_.isEmpty(projectDetails?.name) &&
      //   currentTab === 0
      // ) {
      //   setTab(currentTab + 1);
      //   console.log("##",formRef);

      // }
      //  else if (currentTab === 1 &&
      //   connectDatabaseTab === 1) {
      //   formRef.current.handleSubmit();
      //   setTab(currentTab + 1);
      // }
    }
  };

  const handleSkipForNow = () => {
    setInviteCollabsErrorMssg(false);
    resetCreateProjectApi();
    resetUploadDbsApi();
    resetUploadSpecsApi();
    exportDBSchemaApi();
    resetAiMatcherApi();

    if (_.isEmpty(projectDetails?.name)) {
      setTab(0);
      setIsProjectNameEmpty(true);
      if (formRef.current) {
        formRef.current.handleSubmit();
      }

      return;
    } else if (
      _.isEmpty(projectDetails?.dbs) &&
      (_.isEmpty(projectDetails?.host) ||
        _.isEmpty(projectDetails?.port) ||
        _.isEmpty(projectDetails?.username) ||
        _.isEmpty(projectDetails?.password) ||
        _.isEmpty(projectDetails?.database) ||
        _.isEmpty(projectDetails?.type))
    ) {
      setErrorDisplay(true);
    } else {
      uploadProjectData({
        name: projectDetails?.name,
        invitees: projectDetails?.collaborators?.map((collaborator) => {
          return {
            email: collaborator,
          };
        }),
        isDesign: isDesign,
      });
    }
  };

  const handleDone = () => {
    setErrorDisplay(false);

    if (projectDetails.collaborators.length < 1) {
      setInviteCollabsErrorMssg(true);
    } else {
      setInviteCollabsErrorMssg(false);
      resetCreateProjectApi();
      resetUploadDbsApi();
      resetUploadSpecsApi();
      exportDBSchemaApi();
      resetAiMatcherApi();

      if (_.isEmpty(projectDetails?.name)) {
        setTab(0);
        setIsProjectNameEmpty(true);
        if (formRef.current) {
          formRef.current.handleSubmit();
        }

        return;
      } else if (
        _.isEmpty(projectDetails?.dbs) &&
        (_.isEmpty(projectDetails?.host) ||
          _.isEmpty(projectDetails?.port) ||
          _.isEmpty(projectDetails?.username) ||
          _.isEmpty(projectDetails?.password) ||
          _.isEmpty(projectDetails?.database) ||
          _.isEmpty(projectDetails?.type))
      ) {
        setErrorDisplay(true);
      } else {
        uploadProjectData({
          name: projectDetails?.name,
          invitees: projectDetails?.collaborators?.map((collaborator) => {
            return {
              email: collaborator,
            };
          }),
          isDesign: isDesign,
        });
      }
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
        test: true,
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
      <Button color='secondary' size='small' onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={handleClose}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  );

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

  useEffect(() => {
    prevFormRef.current = projectDetails.collaborators;
  }, [projectDetails.collaborators]);

  var showCollabsError = true;

  if (
    prevFormRef.current &&
    prevFormRef.current.length > projectDetails.collaborators.length
  ) {
    showCollabsError = false;
    // setShowCollabsErrorMssg(false);
  }

  return (
    <>
      {isDesign != null && (
        <div className='p-4'>
          <div className='flex flex-row items-center justify-between mb-3'>
            {isDesign ? (
              <h5>Create New API Project</h5>
            ) : (
              <h5>Test API Project</h5>
            )}

            {!isUploadingProjectDetails &&
              !isUploadingDbs &&
              !isUploadingSpecs &&
              !isMatchingAi &&
              !isUploadingCredentials &&
              !isUploadingProjectKey &&
              !isUploadingProjectCertificate &&
              !isUploadingProjectCACertificate &&
              !isExportingDb && (
                <AppIcon aria-label='close' onClick={onClose}>
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
                  aria-label='add project tabs'
                  indicatorColor='primary'
                  textColor='primary'
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
                    <div className='h-80'>
                      <ProjectDetails
                        formRef={formRef}
                        specsError={specsError}
                        dbsError={dbsError}
                        isProjectNameEmpty={isProjectNameEmpty}
                        addProjectMutation={addProjectMutation}
                        uploadSpecsMutation={uploadSpecsMutation}
                        uploadDbMutation={uploadDbMutation}
                        aiMatcherMutation={aiMatcherMutation}
                      />
                    </div>
                  ) : currentTab === 1 ? (
                    <div className='h-80'>
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
                    <div className='h-80'>
                      <InviteCollaborators
                        handleChange={handleCollaboratorsChange}
                        collaborators={projectDetails?.collaborators}
                        addProjectMutation={addProjectMutation}
                      />
                    </div>
                  )}
                </div>

                {showCollabsError && projectDetailsError && (
                  <p className='text-overline2 text-accent-red my-2'>
                    {projectDetailsError?.response?.data?.message}
                  </p>
                )}

                {errorDisplay && currentTab === 2 && (
                  <p className='text-overline2 text-accent-red my-2'>
                    Please upload atleast one of the following - ddl file or
                    dbconnection
                  </p>
                )}

                {inviteCollabsErrorMssg && (
                  <p className='text-overline2 text-accent-red my-2'>
                    Please enter atleast one collaborator to create Project
                  </p>
                )}

                {dbConnectionTestError && (
                  <p className='text-overline2 text-accent-red my-2'>
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
                      severity='success'
                      sx={{ width: "100%" }}
                    >
                      Db connection is successful
                    </Alert>
                  </Snackbar>
                )}

                {exportDBError && (
                  <p className='text-overline2 text-accent-red my-2'>
                    {`Failed to export db - ${exportDBError?.message}`}
                  </p>
                )}
                {uploadProjectKeyError && (
                  <p className='text-overline2 text-accent-red my-2'>
                    {`Failed to upload key - ${uploadProjectKeyError?.message}`}
                  </p>
                )}
                {uploadProjectCertificateError && (
                  <p className='text-overline2 text-accent-red my-2'>
                    {`Failed to upload certificate - ${uploadProjectCertificateError?.message}`}
                  </p>
                )}
                {uploadProjectCACertificateError && (
                  <p className='text-overline2 text-accent-red my-2'>
                    {`Failed to upload caCertificate - ${uploadProjectCACertificateError?.message}`}
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
                  {currentTab === 2 ? (
                    <TextButton
                      onClick={() => {
                        handleSkipForNow();
                      }}
                      classes='flex-1 -ml-4 text-brand-secondary'
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
                        if (formRef.current) {
                          formRef.current.handleSubmit();
                          if (
                            formRef.current.isValid &&
                            !_.isEmpty(projectDetails?.host) &&
                            !_.isEmpty(projectDetails?.port) &&
                            !_.isEmpty(projectDetails?.username) &&
                            !_.isEmpty(projectDetails?.database) &&
                            !_.isEmpty(projectDetails?.type)
                          ) {
                            databaseConnectionTest();
                          }
                        }
                      } else {
                        setTab(1);
                      }
                    }}
                    classes='mr-3'
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
                      } else if (
                        prevFormRef.current.length >
                        projectDetails.collaborators.length
                      ) {
                        // setShowCollabsErrorMssg(false);
                        handleDone();
                      } else if (
                        projectDetailsError?.response?.data?.errorType ==
                          "PROJECTS_LIMIT_EXHAUSTED" ||
                        projectDetailsError?.response?.data?.errorType ==
                          "TRIAL_PERIOD_EXPIRED" ||
                        (projectDetailsError?.response?.data?.errorType ==
                          "COLLABRATOR_LIMIT_REACHED" &&
                          showCollabsError)
                      ) {
                        history.push(routes.pricing);
                        onClose();
                      } else {
                        handleDone();
                      }
                    }}
                  >
                    {currentTab === 0 || currentTab === 1
                      ? "Next"
                      : prevFormRef.current.length >
                        projectDetails.collaborators.length
                      ? "Done"
                      : projectDetailsError?.response?.data?.errorType ==
                          "PROJECTS_LIMIT_EXHAUSTED" ||
                        projectDetailsError?.response?.data?.errorType ==
                          "TRIAL_PERIOD_EXPIRED" ||
                        projectDetailsError?.response?.data?.errorType ==
                          "COLLABRATOR_LIMIT_REACHED"
                      ? "Upgrade"
                      : "Done"}
                  </PrimaryButton>
                </div>
              </>
            )}

          {isUploadingCredentials && (
            <div className='my-7'>
              <LoaderWithMessage message='Connecting to Database' contained />
            </div>
          )}

          {isUploadingProjectDetails && (
            <div className='my-7'>
              <LoaderWithMessage message='Creating new project' contained />
            </div>
          )}

          {isUploadingSpecs && (
            <div className='my-7'>
              <LoaderWithMessage message='Uploading Spec' contained />
            </div>
          )}

          {isUploadingDbs && (
            <div className='my-7'>
              <LoaderWithMessage message='Uploading DDL' contained />
            </div>
          )}

          {isUploadingProjectKey && (
            <div className='my-7'>
              <LoaderWithMessage
                message='Using Connection KeyCredentials'
                contained
              />
            </div>
          )}
          {isUploadingProjectCertificate && (
            <div className='my-7'>
              <LoaderWithMessage
                message='Using Connection CertCredentials'
                contained
              />
            </div>
          )}
          {isUploadingProjectCACertificate && (
            <div className='my-7'>
              <LoaderWithMessage
                message='Using Connection RootCertCredentials'
                contained
              />
            </div>
          )}
          {isExportingDb && (
            <div className='my-7'>
              <LoaderWithMessage message='Scanning Schemas' contained />
            </div>
          )}

          {isMatchingAi && (
            <div className='my-7'>
              <LoaderWithMessage message='Running AI Matcher' contained />
            </div>
          )}
        </div>
      )}
      {isDesign == null && (
        <div className='p-4'>
          <div className='flex flex-row items-center justify-between mb-3'>
            {<h5>Create API Project</h5>}

            <AppIcon aria-label='close' onClick={onClose}>
              <CloseIcon />
            </AppIcon>
          </div>{" "}
          <div className='flex justify-center py-4'>
            <Logo alt='conektto logo' className=' w-28 h-28' />
          </div>
          <div className='flex justify-center p-2 px-36'>
            <PrimaryButton
              onClick={() => {
                setIsDesign(true);
              }}
              classes='flex-1 -ml-4 text-brand-secondary'
            >
              Design Studio
            </PrimaryButton>
          </div>
          <div className='flex justify-center p-2 px-36'>
            <PrimaryButton
              onClick={() => {
                setIsDesign(false);
              }}
              classes='flex-1 -ml-4 text-brand-secondary'
            >
              Test Studio
            </PrimaryButton>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProject;
