import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { CircularProgress, Dialog, Tab, Tabs } from "@material-ui/core";
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
import { usePublishProject } from "./projectQueries";
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
import routes from "../shared/routes";
import { useLogout } from "../shared/query/authQueries";
import SaveOperationWarning from "./SaveOperationWarning";
import OperationErrorsDialog from "./OperationErrorsDialog";
import UserRoleProvider from "./UserRoleContext";

const Project = () => {
  const { id: projectId } = useParams();
  const history = useHistory();
  const firstName = getFirstName();
  const lastName = getLastName();
  const {
    isLoading: isFetchingProjectDetails,
    isSuccess: isProjectDetailsFetched,
    error: projectDetailsError,
    data: projectDetails,
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
    isLoading: isPublishingProject,
    isSuccess: isPublishProjectSuccess,
    data: publishProjectData,
    error: publishProjectError,
    mutate: publish,
    reset: resetPublishMutation,
  } = usePublishProject();
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

  useEffect(() => {
    if (canEdit(userRole)) {
      const interval = setInterval(() => {
        const { loadable: operationAtomLoadable } = getRecoilValueInfo(
          operationAtomWithMiddleware
        );
        const operationState = operationAtomLoadable?.contents;

        if (operationState?.isModified) {
          saveProject();
        }
      }, 6500);
      return () => clearInterval(interval);
    }
  }, [userRole]);

  useEffect(() => {
    resetProjectState();
  }, [projectId]);

  useEffect(() => {
    if (
      projectDetails?.status === "IN_PROGRESS" &&
      projectDetails?.status === "COMPLETE"
    ) {
      return;
    }

    // Get user role
    if (projectDetails?.members && !_.isEmpty(projectDetails?.members)) {
      const userEmail = getEmailId();
      const currentUserDetails = projectDetails?.members?.find(
        (member) => member?.email === userEmail
      );

      if (currentUserDetails?.role === "admin") {
        setRole(currentUserDetails?.role);
        return;
      }
    }

    history.goBack();
  }, [projectDetails]);

  useEffect(() => {
    if (projectDetailsError?.message === "no_access") {
      // No access
      history.goBack();
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

      if (dialog?.data === "with-nav") {
        navigateBack();
      }
    }
  }, [isSyncOperationSuccess]);

  const resetProjectState = () => {
    resetTableState();
    resetOperationState();
    resetSchemaState();
  };

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
        projectId,
        operationId: operationState?.operation?.operationId,
        pathId: operationState?.path?.pathId,
        resourceId: operationState?.resource?.resourceId,
        requestData: saveRequestApiRequest,
        responseData: saveResponseApiRequest,
      });
    }
  };

  const fetchOperationErrors = () => {
    const { loadable: operationAtomLoadable } = getRecoilValueInfo(
      operationAtomWithMiddleware
    );
    const operationState = operationAtomLoadable?.contents;

    const errors = [];

    // 200 Response should have response body section
    const response200 = operationState?.operationResponse?.find(
      (response) => response?.responseCode === 200
    );
    if (!response200?.body || _.isEmpty(response200?.body)) {
      errors.push("200 response must include a body section");
    }
    if (!response200?.description || _.isEmpty(response200?.description)) {
      errors.push("200 response must include suitable description");
    }

    return errors;
  };

  const publishProject = () => {
    if (canEdit(userRole)) {
      const errors = fetchOperationErrors();
      if (errors && !_.isEmpty(errors)) {
        showOperationErrorsDialog(errors);
      } else {
        const { loadable: operationAtomLoadable } = getRecoilValueInfo(
          operationAtomWithMiddleware
        );
        const operationState = operationAtomLoadable?.contents;

        if (operationState?.isModified) {
          showSaveOperationWarning("without-nav");
        } else {
          publish({ projectId });
        }
      }
    }
  };

  const closePublishProjectSuccess = () => {
    resetPublishMutation();
    history.goBack();
  };

  const handleProfileMenuClick = (event) => {
    setProfilemenuAnchorEl(event?.currentTarget);
  };

  const showSaveOperationWarning = (navigationFlag) => {
    setDialog({
      show: true,
      type: "save-operation-warning",
      data: navigationFlag,
    });
  };

  const showOperationErrorsDialog = (errors) => {
    if (errors && !_.isEmpty(errors)) {
      setDialog({
        show: true,
        type: "operation-errors",
        data: errors,
      });
    }
  };

  const handleCloseDialog = () => {
    setDialog({
      show: false,
      type: null,
      data: null,
    });
  };

  const navigateBack = () => {
    history.goBack();
  };

  return (
    <UserRoleProvider role={userRole}>
      <>
        <Dialog
          aria-labelledby='save-operation-dialog'
          open={isPublishingProject || publishProjectData || dialog?.show}
          fullWidth
          PaperProps={{
            style: { borderRadius: 8 },
          }}
          disableBackdropClick
        >
          {(isPublishingProject || isLoggingOut) && (
            <div className='p-6'>
              <div className='w-full flex flex-row items-center'>
                <p className='text-overline mr-3'>
                  {isPublishingProject
                    ? "Publishing project"
                    : isLoggingOut
                    ? "Logging out"
                    : null}
                </p>
                <CircularProgress style={{ width: "20px", height: "20px" }} />
              </div>
            </div>
          )}

          {(publishProjectData || publishProjectError) && (
            <div>
              <div className='p-4 flex flex-row justify-between border-b-1'>
                <p className='text-subtitle2'>
                  {publishProjectData?.success
                    ? "Publish Successful"
                    : "Publish Failure"}
                </p>
                <AppIcon
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();

                    if (publishProjectData?.success) {
                      closePublishProjectSuccess();
                    } else {
                      resetPublishMutation();
                    }
                  }}
                >
                  <CloseIcon />
                </AppIcon>
              </div>
              <div className='p-4 py-6'>
                {publishProjectData?.success ? (
                  <p className='text-overline2'>{`Project ${projectDetails?.projectName} successfully published. You can now download the specs and artifacts.`}</p>
                ) : (
                  <p className='text-overline2'>
                    {publishProjectData?.message}
                  </p>
                )}

                {publishProjectError && (
                  <p className='text-overline2'>
                    {publishProjectError?.message}
                  </p>
                )}
              </div>
              <div className='p-4 border-t-1 flex flex-row justify-end'>
                <PrimaryButton
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();

                    if (publishProjectData?.success) {
                      closePublishProjectSuccess();
                    } else {
                      resetPublishMutation();
                    }
                  }}
                >
                  Okay
                </PrimaryButton>
              </div>
            </div>
          )}

          {!isSyncingOperation &&
            dialog?.show &&
            dialog?.type === "save-operation-warning" && (
              <SaveOperationWarning
                onClose={handleCloseDialog}
                navigateBack={() => {
                  handleCloseDialog();

                  resetProjectState();

                  if (dialog?.data === "with-nav") {
                    navigateBack();
                  }
                }}
                saveProject={() => {
                  handleCloseDialog();
                  saveProject();
                }}
              />
            )}

          {dialog?.show && dialog?.type === "operation-errors" && (
            <OperationErrorsDialog
              onClose={handleCloseDialog}
              errors={dialog?.data}
            />
          )}
        </Dialog>

        <DndProvider backend={HTML5Backend}>
          <header className='px-2 border-b-2 flex flex-row items-center bg-white'>
            <div className='flex flex-row py-2 items-center'>
              <AppIcon
                style={{ marginRight: "1rem" }}
                onClick={(event) => {
                  event?.preventDefault();
                  event?.stopPropagation();

                  if (!operationState?.isModified) {
                    resetProjectState();
                    navigateBack();
                  } else {
                    showSaveOperationWarning("with-nav");
                  }
                }}
              >
                <ArrowBackIcon />
              </AppIcon>

              <p className='text-overline1'>{projectDetails?.projectName}</p>

              <div className='ml-4'>
                {!isSyncingOperation ? (
                  <AppIcon
                    onClick={(e) => {
                      e?.preventDefault();
                      e?.stopPropagation();

                      saveProject();
                    }}
                  >
                    <CloudUploadIcon style={{ color: "lightblue" }} />
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

                <Tab
                  label={<TabLabel label={"Visualize"} />}
                  style={{ outline: "none", border: "none" }}
                  disabled
                />
              </Tabs>
            </div>

            <div className='flex flex-row py-2'>
              {canEdit(userRole) && (
                <OutlineButton classes='mr-3'>Invite</OutlineButton>
              )}

              {canEdit(userRole) && (
                <PrimaryButton
                  classes='mr-3'
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();

                    publishProject();
                  }}
                >
                  Publish
                </PrimaryButton>
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

                <Menu
                  id='profile-menu'
                  anchorEl={profileMenuAnchorEl}
                  keepMounted
                  open={Boolean(profileMenuAnchorEl)}
                  onClose={() => {
                    setProfilemenuAnchorEl(null);
                  }}
                  TransitionComponent={Fade}
                  style={{ borderRadius: "1rem", zIndex: "100" }}
                >
                  <MenuItem
                    onClick={() => {
                      setProfilemenuAnchorEl(null);
                      logout();
                    }}
                    style={{ color: Colors.accent.red }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </header>

          {currentTab === 0 && (
            <div
              className='flex flex-row'
              style={{ height: `calc(100vh - 60px)` }}
            >
              <section
                className='w-1/5 border-r-2 h-full'
                style={{ minWidth: "220px", maxWidth: "300px" }}
              >
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
                      if (!operationState?.isModified) {
                        resetOperationState();
                      } else {
                        showSaveOperationWarning("without-nav");
                      }
                    } else if (index !== operationState.operationIndex) {
                      if (!operationState?.isModified) {
                        const cloned = _.cloneDeep(operationState);
                        cloned.operation = operation;
                        cloned.resource = resource;
                        cloned.path = path;
                        cloned.operationIndex = index;

                        setOperationState(cloned);
                      } else {
                        showSaveOperationWarning("without-nav");
                      }
                    }
                  }}
                />
              </section>

              <section className='w-full flex flex-col'>
                <div
                  className={classNames(`overflow-hidden`, {
                    "h-1/2": operationState.operationIndex,
                    "h-full": !operationState.operationIndex,
                  })}
                >
                  <Match projectType={projectDetails?.projectType} />
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
        </DndProvider>
      </>
    </UserRoleProvider>
  );
};

export default Project;
