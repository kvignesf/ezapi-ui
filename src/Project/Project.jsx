import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { CircularProgress, Dialog, Tab, Tabs } from "@material-ui/core";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useResetRecoilState, useRecoilState, useSetRecoilState } from "recoil";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { ClassNames } from "@emotion/react";
import classNames from "classnames";
import _ from "lodash";

import AppIcon from "../shared/components/AppIcon";
import { useFetchProjectDetails } from "./projectQueries";
import { OutlineButton, PrimaryButton } from "../shared/components/AppButton";
import InitialsAvatar from "../shared/components/InitialsAvatar";
import { getFirstName, getLastName } from "../shared/storage";
import AddOrEditResource from "./Resources/AddOrEditResource";
import Resources from "./Resources/Resources";
import Match from "./Match";
import OperationDetails from "./OperationDetails";
import operationAtom, {
  defaultState as operationAtomDefaultState,
} from "./operationAtom";
import schemaAtom, {
  defaultState as schemaAtomDefaultState,
} from "../shared/atom/schemaAtom";
import { endpoint } from "../shared/network/client";
import { useSyncOperation } from "../shared/query/operationDetailsQuery";
import { usePublishProject } from "./projectQueries";
import TabLabel from "../shared/components/TabLabel";
import {
  generateSyncOperationRequestRequest,
  generateSyncOperationResponseRequest,
} from "../shared/utils";

const Project = () => {
  const resetOperationState = useResetRecoilState(operationAtom);
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
  const [operationState, setOperationState] = useRecoilState(operationAtom);
  const setSchemaState = useSetRecoilState(schemaAtom);
  const {
    isLoading: isSyncingOperation,
    isSuccess: isSyncOperationSuccess,
    error: syncOperationError,
    mutate: syncOperation,
  } = useSyncOperation();
  const {
    isLoading: isPublishingProject,
    isSuccess: isPublishProjectSuccess,
    error: publishProjectError,
    mutate: publish,
  } = usePublishProject();

  useEffect(() => {
    if (projectDetails && projectDetails?.status !== "IN_PROGRESS") {
      history.replace(endpoint.projects);
    }
  }, [projectDetails]);

  const saveProject = () => {
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
  };

  const publishProject = () => {
    publish({ projectId });
  };

  return (
    <>
      <Dialog
        aria-labelledby='save-operation-dialog'
        open={isSyncingOperation || isPublishingProject}
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
        disableBackdropClick
      >
        <div className='p-6'>
          <div className='w-full flex flex-row items-center'>
            <p className='text-overline mr-3'>
              {isSyncingOperation
                ? "Saving Operation"
                : isPublishingProject
                ? "Publishing project"
                : null}
            </p>
            <CircularProgress style={{ width: "20px", height: "20px" }} />
          </div>
        </div>
      </Dialog>

      <DndProvider backend={HTML5Backend}>
        <header className='px-2 border-b-2 flex flex-row items-center bg-white'>
          <div className='flex flex-row py-2 items-center'>
            <AppIcon
              style={{ marginRight: "1rem" }}
              onClick={(event) => {
                event?.preventDefault();
                event?.stopPropagation();

                setOperationState(operationAtomDefaultState);
                setSchemaState(schemaAtomDefaultState);

                history.goBack();
              }}
            >
              <ArrowBackIcon />
            </AppIcon>

            <p className='text-overline1'>{projectDetails?.projectName}</p>

            <div className='ml-4'>
              <AppIcon
                onClick={(e) => {
                  e?.preventDefault();
                  e?.stopPropagation();

                  saveProject();
                }}
              >
                <CloudUploadIcon style={{ color: "lightblue" }} />
              </AppIcon>
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
            <OutlineButton classes='mr-3'>Invite</OutlineButton>

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

            <InitialsAvatar firstName={firstName} lastName={lastName} />
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
                    resetOperationState();
                  } else if (index !== operationState.operationIndex) {
                    const cloned = _.cloneDeep(operationState);
                    cloned.operation = operation;
                    cloned.resource = resource;
                    cloned.path = path;
                    cloned.operationIndex = index;

                    setOperationState(cloned);
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
                <Match />
              </div>

              {operationState.resource &&
                operationState.path &&
                operationState.operation && (
                  <div
                    className={classNames({
                      "h-1/2": operationState.operationIndex !== null,
                    })}
                  >
                    <OperationDetails />
                  </div>
                )}
            </section>
          </div>
        )}
      </DndProvider>
    </>
  );
};

export default Project;
