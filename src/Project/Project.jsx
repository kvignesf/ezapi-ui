import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  CircularProgress,
  Dialog,
  Tab,
  Tabs,
  Tooltip,
} from "@material-ui/core";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  useResetRecoilState,
  useRecoilState,
  useSetRecoilState,
  useGetRecoilValueInfo_UNSTABLE,
} from "recoil";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { ClassNames } from "@emotion/react";
import classNames from "classnames";
import _ from "lodash";
import CloseIcon from "@material-ui/icons/Close";
import { Fade, Menu, MenuItem } from "@material-ui/core/index";

import AppIcon from "../shared/components/AppIcon";
import { useFetchProjectDetails } from "./projectQueries";
import { OutlineButton, PrimaryButton } from "../shared/components/AppButton";
import InitialsAvatar from "../shared/components/InitialsAvatar";
import {
  getFirstName,
  getLastName,
  getUserId,
  getEmailId,
} from "../shared/storage";
import AddOrEditResource from "./Resources/AddOrEditResource";
import Resources from "./Resources/Resources";
import Match from "./Match";
import OperationDetails from "./OperationDetails";
import { useSyncOperation } from "../shared/query/operationDetailsQuery";
import { useSubmitProject } from "./projectQueries";
import TabLabel from "../shared/components/TabLabel";
import {
  generateSyncOperationRequestRequest,
  generateSyncOperationResponseRequest,
  operationAtomWithMiddleware,
  canEdit,
} from "../shared/utils";
import tableAtom from "../shared/atom/tableAtom";
import schemaAtom from "../shared/atom/schemaAtom";
import operationAtom from "./operationAtom";
import Colors from "../shared/colors";
import routes, { generateRoute } from "../shared/routes";
import { useLogout } from "../shared/query/authQueries";
import SaveOperationWarning from "./SaveOperationWarning";
import OperationErrorsDialog from "./OperationErrorsDialog";
import UserRoleProvider from "./UserRoleContext";
import PublishProjectMessage from "./PublishProjectMessage";
import VerifyProjectError from "./VerifyProjectError";
import ProjectVerificationErrors from "./ProjectVerificationErrors";
import ModifyCollaborators from "../ModifyCollaborators/ModifyCollaborators";
import RepublishInfo from "./RepublishInfo";
import ProfileMenu from "../shared/components/ProfileMenu";
import EzapiLogo from "../shared/components/EzapiLogo";
import EzapiFooter from "../shared/components/EzapiFooter";
import Scrollbar from "react-smooth-scrollbar";

const Project = () => {
  const { projectId } = useParams();
  const history = useHistory();
  const firstName = getFirstName();
  const lastName = getLastName();
  const {
    isLoading: isFetchingProjectDetails,
    isSuccess: isProjectDetailsFetched,
    error: projectDetailsError,
    data: projectDetails,
    remove: resetFetchProject,
  } = useFetchProjectDetails(projectId, { refetchOnWindowFocus: false });
  const [currentTab, setCurrentTab] = useState(0);
  const [operationState, setOperationState] = useRecoilState(
    operationAtomWithMiddleware
  );
  const {
    isLoading: isSyncingOperation,
    isSuccess: isSyncOperationSuccess,
    error: syncOperationError,
    mutate: syncOperation,
    reset: resetSyncOperationMutation,
  } = useSyncOperation();
  const {
    verifyProjectMutation: {
      isLoading: isVerifyingProject,
      isSuccess: isVerifyProjectSuccess,
      data: verifyProjectData,
      error: verifyProjectError,
      mutate: verify,
      reset: resetVerifyMutation,
    },
    publishProjectMutation: {
      isLoading: isPublishingProject,
      isSuccess: isPublishProjectSuccess,
      data: publishProjectData,
      error: publishProjectError,
      mutate: publish,
      reset: resetPublishMutation,
    },
  } = useSubmitProject(projectId);
  const resetSchemaState = useResetRecoilState(schemaAtom);
  const resetTableState = useResetRecoilState(tableAtom);
  const resetOperationState = useResetRecoilState(operationAtomWithMiddleware);
  const [profileMenuAnchorEl, setProfilemenuAnchorEl] = useState(false);
  const { isLoading: isLoggingOut, mutate: logout } = useLogout();
  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });
  const getRecoilValueInfo = useGetRecoilValueInfo_UNSTABLE();
  const [userRole, setRole] = useState(null);
  const [autoSyncIntervalId, setAutoSync] = useState(0);
  const [showUnsavedPopup, setUnsavedPopup] = useState(true);

  useEffect(() => {
    if (canEdit(userRole)) {
      startAutoSync();
    }
    return () => stopAutoSync();
  }, [userRole]);

  useEffect(() => {
    if (operationState?.isModified) {
      setUnsavedPopup(true);
    }
  }, [operationState?.isModified]);

  useEffect(() => {
    resetProjectState();
  }, [projectId]);

  useEffect(() => {
    if (projectDetails) {
      // Get user role
      if (projectDetails?.members && !_.isEmpty(projectDetails?.members)) {
        const userEmail = getEmailId();
        const currentUserDetails = projectDetails?.members?.find(
          (member) => member?.email === userEmail
        );

        setRole(currentUserDetails?.role);
      }

      if (
        projectDetails?.status?.toLowerCase() !== "in_progress" &&
        projectDetails?.status?.toLowerCase() !== "complete"
      ) {
        navigateBack();
      }
    }
  }, [projectDetails]);

  useEffect(() => {
    if (projectDetailsError?.message?.toLowerCase() === "no_access") {
      // No access
      navigateBack();
    }
  }, [projectDetailsError]);

  useEffect(() => {
    if (
      isSyncOperationSuccess &&
      dialog?.show &&
      dialog?.type === "save-operation-warning"
    ) {
      handleCloseDialog();

      resetSyncOperationMutation();

      // if (dialog?.data === "with-nav") {
      //   navigateBack();
      // }
    }
  }, [isSyncOperationSuccess]);

  const startAutoSync = () => {
    stopAutoSync();

    const id = setInterval(() => {
      const { loadable: operationAtomLoadable } = getRecoilValueInfo(
        operationAtomWithMiddleware
      );
      const operationState = operationAtomLoadable?.contents;

      if (operationState?.isModified) {
        saveProject();
      }
    }, 6500);

    setAutoSync(id);
  };

  const stopAutoSync = () => {
    if (autoSyncIntervalId) {
      clearInterval(autoSyncIntervalId);
      setAutoSync(0);
    }
  };

  const resetProjectState = () => {
    resetTableState();
    resetOperationState();
    resetSchemaState();
  };
  // console.log(operationState);
  const saveProject = () => {
    if (canEdit(userRole)) {
      const { loadable: operationAtomLoadable } = getRecoilValueInfo(
        operationAtomWithMiddleware
      );
      const operationState = operationAtomLoadable?.contents;

      const saveRequestApiRequest = generateSyncOperationRequestRequest(
        operationState?.operationRequest
      );
      const saveResponseApiRequest = generateSyncOperationResponseRequest(
        operationState?.operationResponse
      );

      syncOperation({
        projectId: operationState?.projectId,

        operationId: operationState?.operation?.operationId,
        pathId: operationState?.path?.pathId,
        resourceId: operationState?.resource?.resourceId,
        requestData: saveRequestApiRequest,
        responseData: saveResponseApiRequest,
      });
    }
  };

  const submitProject = () => {
    if (canEdit(userRole)) {
      const { loadable: operationAtomLoadable } = getRecoilValueInfo(
        operationAtomWithMiddleware
      );
      const operationState = operationAtomLoadable?.contents;

      if (operationState?.isModified) {
        showSaveOperationWarning();
      } else {
        resetPublishMutation();
        verify({ projectId });
      }
    }
  };

  const closePublishProjectSuccess = () => {
    resetPublishMutation();
    resetVerifyMutation();
    history.push({
      pathname: routes.projects,
      state: { allow: true },
    });
  };

  const handleProfileMenuClick = (event) => {
    setProfilemenuAnchorEl(event?.currentTarget);
  };

  const showSaveOperationWarning = (dontSaveAction) => {
    stopAutoSync();

    setDialog({
      show: true,
      type: "save-operation-warning",
      data: dontSaveAction,
    });
  };

  const handleCloseDialog = () => {
    if (dialog?.type === "save-operation-warning") {
      startAutoSync();
    }

    setDialog({
      show: false,
      type: null,
      data: null,
    });
  };

  const navigateBack = () => {
    resetSubmitProjectMutation();
    resetFetchProject();
    resetSyncOperationMutation();

    history.replace({
      pathname: routes.projects,
      state: { allow: true },
    });
    // history.goBack();
  };

  const resetSubmitProjectMutation = () => {
    resetPublishMutation();
    resetVerifyMutation();
  };

  const isProjectHavingErrors = () =>
    isVerifyProjectSuccess &&
    verifyProjectData?.response &&
    !_.isEmpty(verifyProjectData?.response);

  const handleInviteClick = () => {
    if (canEdit(userRole)) {
      setDialog({
        show: true,
        type: "members",
      });
    }
  };

  const isOperationSelected = () => {
    return (
      operationState?.operationIndex != null &&
      operationState?.operation != null &&
      operationState?.resource != null &&
      operationState?.path != null
    );
  };

  const isPublishLimitReached = () => {
    return (
      publishProjectError?.response?.data?.errorType === "PUBLISH_LIMIT_REACHED"
    );
  };

  const isFreePublishesExhausted = () => {
    return (
      publishProjectError?.response?.data?.errorType ===
      "FREE_PROJECTS_EXHAUSTED"
    );
  };

  const getPublishButtonText = () => {
    if (projectDetails?.publishCount === 0) {
      return "Publish";
    } else if (projectDetails?.publishCount > 0) {
      return "Republish";
    }

    return "Publish";
  };

  const canShowPublishCountStatus = () => {
    return projectDetails?.publishCount > 0 ?? false;
  };

  const showRepublishStatus = () => {
    setDialog({
      show: true,
      type: "republish-status",
      data: null,
    });
  };

  return (
    <UserRoleProvider role={userRole}>
      <>
        <Dialog
          aria-labelledby='save-operation-dialog'
          open={
            isPublishingProject ||
            isVerifyingProject ||
            publishProjectData ||
            publishProjectError ||
            verifyProjectError ||
            isProjectHavingErrors() ||
            dialog?.show
          }
          fullWidth
          PaperProps={{
            style: { borderRadius: 8 },
          }}
          disableBackdropClick
        >
          {(isPublishingProject || isVerifyingProject || isLoggingOut) && (
            <div className='p-6'>
              <div className='w-full flex flex-row items-center'>
                <p className='text-overline mr-3'>
                  {isPublishingProject
                    ? "Publishing project"
                    : isLoggingOut
                    ? "Logging out"
                    : isVerifyingProject
                    ? "Verifying Project"
                    : null}
                </p>
                <CircularProgress style={{ width: "20px", height: "20px" }} />
              </div>
            </div>
          )}

          {verifyProjectError && (
            <VerifyProjectError
              error={verifyProjectError}
              onClose={resetSubmitProjectMutation}
              onRetry={() => {
                verify({ projectId });
              }}
            />
          )}

          {isProjectHavingErrors() && (
            <ProjectVerificationErrors
              response={verifyProjectData?.response}
              onClose={resetSubmitProjectMutation}
            />
          )}

          {(publishProjectData || publishProjectError) && (
            <PublishProjectMessage
              publishProjectData={publishProjectData}
              publishProjectError={publishProjectError}
              project={projectDetails}
              onButtonClick={() => {
                if (publishProjectData?.success) {
                  closePublishProjectSuccess();
                } else {
                  resetSubmitProjectMutation();

                  if (isFreePublishesExhausted()) {
                    history.push(generateRoute(routes.payment, projectId));
                  } else if (isPublishLimitReached()) {
                    history.push(routes.contact);
                  }
                }
              }}
              onClose={() => {
                if (publishProjectData?.success) {
                  closePublishProjectSuccess();
                } else {
                  resetSubmitProjectMutation();
                }
              }}
            />
          )}

          {!isSyncingOperation &&
            dialog?.show &&
            dialog?.type === "save-operation-warning" && (
              <SaveOperationWarning
                onClose={handleCloseDialog}
                onDontSave={() => {
                  handleCloseDialog();
                  setUnsavedPopup(false);

                  if (dialog?.data === "reset_operation_state") {
                    resetProjectState();
                  }

                  // if (dialog?.data === "with-nav") {
                  //   navigateBack();
                  // }
                }}
                saveProject={() => {
                  if (dialog?.data === "reset_operation_state") {
                    resetProjectState();
                  }
                  handleCloseDialog();
                  saveProject();
                }}
              />
            )}

          {dialog?.type === "members" && (
            <ModifyCollaborators
              projectId={projectId}
              onClose={handleCloseDialog}
              invitedCollaborators={projectDetails?.members}
            />
          )}

          {dialog?.type === "republish-status" && (
            <RepublishInfo
              project={projectDetails}
              onClose={handleCloseDialog}
            />
          )}
        </Dialog>

        <DndProvider backend={HTML5Backend}>
          <header className='fixed top-0 w-full px-2 border-b-2 flex flex-row items-center bg-white z-50'>
            <div className='flex flex-row py-2 items-center'>
              <AppIcon
                style={{ marginRight: "1rem" }}
                onClick={(event) => {
                  event?.preventDefault();
                  event?.stopPropagation();

                  if (showUnsavedPopup && operationState?.isModified) {
                    showSaveOperationWarning();
                  } else {
                    resetProjectState();
                    navigateBack();
                  }
                }}
              >
                <ArrowBackIcon />
              </AppIcon>

              <p className='text-overline1 mr-3'>
                {projectDetails?.projectName}
              </p>

              <EzapiLogo />

              {canEdit(userRole) && isOperationSelected() && (
                <div className='ml-4'>
                  {!isSyncingOperation ? (
                    <AppIcon
                      onClick={(e) => {
                        e?.preventDefault();
                        e?.stopPropagation();

                        saveProject();
                      }}
                    >
                      <Tooltip title='Save changes'>
                        <CloudUploadIcon style={{ color: "lightblue" }} />
                      </Tooltip>
                    </AppIcon>
                  ) : (
                    <div className='flex flex-row items-center'>
                      <CircularProgress
                        style={{
                          width: "18px",
                          height: "18px",
                          marginRight: "0.5rem",
                        }}
                      />

                      <p className='text-overline2 opacity-60'>Saving ...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className='flex justify-center flex-1'>
              <Tabs
                value={currentTab}
                onChange={(_, index) => {}}
                aria-label='add project tabs'
                indicatorColor='primary'
                textColor='primary'
              >
                <Tab
                  label={<TabLabel label={"Design"} />}
                  style={{ outline: "none", border: "none" }}
                />

                {/* <Tab
                  label={<TabLabel label={"Visualize"} />}
                  style={{ outline: "none", border: "none" }}
                  disabled
                /> */}
              </Tabs>
            </div>

            <div className='flex flex-row py-2'>
              {canEdit(userRole) && (
                <OutlineButton classes='mr-3' onClick={handleInviteClick}>
                  Invite
                </OutlineButton>
              )}

              {canEdit(userRole) && (
                <PrimaryButton
                  classes={canShowPublishCountStatus() ? "" : "mr-3"}
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();

                    submitProject();
                  }}
                >
                  {getPublishButtonText()}
                </PrimaryButton>
              )}

              {canShowPublishCountStatus() && (
                <div
                  className='flex flex-col py-1 px-3 border-1 border-l-0 border-brand-secondary mr-3 justify-center cursor-pointer'
                  style={{
                    borderRadius: "4px",
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                  }}
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();

                    showRepublishStatus();
                  }}
                >
                  <p className='text-overline2 text-brand-secondary text-center'>{`${projectDetails?.publishCount} / ${projectDetails?.publishLimit}`}</p>
                </div>
              )}

              <div>
                <InitialsAvatar
                  firstName={firstName}
                  lastName={lastName}
                  className='cursor-pointer'
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();

                    handleProfileMenuClick(e);
                  }}
                />

                <ProfileMenu
                  onLogout={logout}
                  profileMenuAnchorEl={profileMenuAnchorEl}
                  setProfilemenuAnchorEl={setProfilemenuAnchorEl}
                />
              </div>
            </div>
          </header>

          {currentTab === 0 && (
            <div className='flex flex-row mt-14'>
              <section
                className='border-r-2'
                style={{
                  width: "300px",

                  height: `calc(100vh - 100px)`,
                }}
              >
                <Scrollbar style={{ height: `calc(100vh - 100px)` }}>
                  <Resources
                    className='h-full flex flex-col'
                    projectId={projectId}
                    selectedIndex={operationState.operationIndex}
                    onOperationSelect={(index, resource, path, operation) => {
                      if (
                        index === null &&
                        resource === null &&
                        path === null &&
                        operation === null
                      ) {
                        if (showUnsavedPopup && operationState?.isModified) {
                          showSaveOperationWarning("reset_operation_state");
                        } else {
                          resetOperationState();
                        }
                      } else if (index !== operationState.operationIndex) {
                        if (showUnsavedPopup && operationState?.isModified) {
                          showSaveOperationWarning("reset_operation_state");
                        } else {
                          // console.log(operationState);
                          const cloned = _.cloneDeep(operationState);
                          cloned.operation = operation;
                          cloned.resource = resource;
                          cloned.path = path;
                          cloned.operationIndex = index;

                          // console.log(cloned);

                          setOperationState(cloned);
                        }
                      }
                    }}
                  />
                </Scrollbar>
              </section>

              <section
                className='w-full flex flex-col'
                style={{ height: `calc(100vh - 112px)` }}
              >
                <div
                  className={classNames(``, {
                    "h-1/2": operationState.operationIndex,
                    "h-full": !operationState.operationIndex,
                  })}
                >
                  <Match
                    projectType={projectDetails?.projectType}
                    style={{ height: "100%" }}
                  />
                </div>

                {operationState.resource &&
                  operationState.path &&
                  operationState.operation && (
                    <div
                      className={classNames({
                        "h-1/2": operationState.operationIndex !== null,
                      })}
                    >
                      <OperationDetails
                        projectType={projectDetails?.projectType}
                      />
                    </div>
                  )}
              </section>
            </div>
          )}

          <EzapiFooter />
        </DndProvider>
      </>
    </UserRoleProvider>
  );
};

export default Project;
