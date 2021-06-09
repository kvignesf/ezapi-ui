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
} from "./Match/Schema/schemaAtom";
import { endpoint } from "../shared/network/client";
import {
  useSyncOperationRequest,
  useSyncOperationResponse,
} from "./operationRequestQuery";
import TabLabel from "../shared/components/TabLabel";

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
  } = useFetchProjectDetails(projectId);
  const [currentTab, setCurrentTab] = useState(0);
  const [operationState, setOperationState] = useRecoilState(operationAtom);
  const setSchemaState = useSetRecoilState(schemaAtom);
  const {
    isLoading: isSyncingOperationRequest,
    isSuccess: isSyncOperationRequestSuccess,
    error: syncOperationRequestError,
    mutate: syncOperationRequest,
  } = useSyncOperationRequest();

  const {
    isLoading: isSyncingOperationResponse,
    isSuccess: isSyncOperationResponseSuccess,
    error: syncOperationResponseError,
    mutate: syncOperationResponse,
  } = useSyncOperationResponse();

  useEffect(() => {
    if (projectDetails && projectDetails?.status !== "IN_PROGRESS") {
      history.replace(endpoint.projects);
    }
  }, [projectDetails]);

  const saveOperationRequest = () => {
    const clonedRequest = _.cloneDeep(operationState?.operationRequest);
    let operationRequest = {};

    operationRequest["headers"] = [];
    operationRequest["pathParams"] = [];
    operationRequest["queryParams"] = [];
    operationRequest["formData"] = [];
    operationRequest["body"] = [];

    if (clonedRequest?.headers && !_.isEmpty(clonedRequest?.headers)) {
      operationRequest.headers = clonedRequest?.headers?.map((header) => {
        let clonedHeader = _.cloneDeep(header);

        clonedHeader.required =
          header?.required === true || header?.required === "true"
            ? true
            : false;

        clonedHeader.possibleValues =
          header?.possibleValues?.split(",").map((item) => {
            return item.trim(" ");
          }) ?? [];

        return clonedHeader;
      });
    }

    if (clonedRequest?.queryParams && !_.isEmpty(clonedRequest?.queryParams)) {
      operationRequest.queryParams = clonedRequest?.pathParams?.map((item) => {
        let clonedItem = _.cloneDeep(item);

        clonedItem.required =
          item?.required === true || item?.required === "true" ? true : false;

        return clonedItem;
      });
    }

    if (clonedRequest?.pathParams && !_.isEmpty(clonedRequest?.pathParams)) {
      operationRequest.pathParams = clonedRequest?.pathParams?.map((item) => {
        let clonedItem = _.cloneDeep(item);

        clonedItem.required =
          item?.required === true || item?.required === "true" ? true : false;

        return clonedItem;
      });
    }

    if (clonedRequest?.formData && !_.isEmpty(clonedRequest?.formData)) {
      operationRequest.formData = clonedRequest?.formData?.map((item) => {
        let clonedItem = _.cloneDeep(item);

        clonedItem.required =
          item?.required === true || item?.required === "true" ? true : false;

        return clonedItem;
      });
    }

    if (clonedRequest?.body && !_.isEmpty(clonedRequest?.body)) {
      operationRequest.body = clonedRequest?.body?.map((item) => {
        let newItem = {};

        newItem.required =
          item?.required === true || item?.required === "true" ? true : false;

        newItem.name = item?.name;
        newItem.type = item?.type;
        newItem.ref = item?.ref;

        return newItem;
      });
    }

    syncOperationRequest({
      projectId,
      operationId: operationState?.operation?.operationId,
      pathId: operationState?.path?.pathId,
      resourceId: operationState?.resource?.resourceId,
      ...operationRequest,
    });
  };

  const saveOperationResponse = () => {
    const clonedOperationResponse = _.cloneDeep(
      operationState?.operationResponse
    );
    let operationResponse = [];

    clonedOperationResponse?.forEach((response) => {
      const clonedResponse = _.cloneDeep(response);

      if (clonedResponse?.headers && !_.isEmpty(clonedResponse?.headers)) {
        clonedResponse.headers = clonedResponse?.headers?.map((header) => {
          let clonedHeader = _.cloneDeep(header);

          clonedHeader.required =
            header?.required === true || header?.required === "true"
              ? true
              : false;

          clonedHeader.possibleValues =
            header?.possibleValues?.split(",").map((item) => {
              return item.trim(" ");
            }) ?? [];

          return clonedHeader;
        });
      }

      if (clonedResponse?.body && !_.isEmpty(clonedResponse?.body)) {
        clonedResponse.body = clonedResponse?.body?.map((item) => {
          let newItem = {};

          newItem.required =
            item?.required === true || item?.required === "true" ? true : false;

          newItem.name = item?.name;
          newItem.type = item?.type;
          newItem.ref = item?.ref;

          return newItem;
        });
      }

      operationResponse.push(clonedResponse);
    });

    syncOperationResponse({
      projectId,
      operationId: operationState?.operation?.operationId,
      pathId: operationState?.path?.pathId,
      resourceId: operationState?.resource?.resourceId,
      content: operationResponse,
    });
  };

  const saveProject = () => {
    saveOperationRequest();

    saveOperationResponse();
  };

  return (
    <>
      <Dialog
        aria-labelledby='save-operation-dialog'
        open={isSyncingOperationRequest || isSyncingOperationResponse}
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
        disableBackdropClick
      >
        <div className='p-6'>
          <div className='w-full flex flex-row items-center'>
            <p className='text-overline mr-3'>
              {isSyncingOperationRequest
                ? "Saving Operation Request"
                : "Saving Operation Response"}
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

            <PrimaryButton classes='mr-3'>Publish</PrimaryButton>

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
