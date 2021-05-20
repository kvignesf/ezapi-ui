import React, { useState } from "react";
import TreeView from "@material-ui/lab/TreeView";
import { makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import AddIcon from "@material-ui/icons/Add";
import { CircularProgress, Dialog } from "@material-ui/core";
import _ from "lodash";

import AppIcon from "../../shared/components/AppIcon";
import { Method } from "../../shared/components/ApiMethod";
import EmptyState from "../../static/images/empty-state.svg";
import AddOrEditResource from "./AddOrEditResource";
import ResourceTreeItem from "./ResourcesTreeItem";
import PathTreeItem from "./PathTreeItem";
import OperationTreeItem from "./OperationTreeItem";
import { PrimaryButton } from "../../shared/components/AppButton";
import LoaderWithMessage from "../../shared/components/LoaderWithMessage";
import ErrorWithMessage from "../../shared/components/ErrorWithMessage";
import Colors from "../../shared/colors";
import { useGetResources } from "./resourcesQuery";

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const Resources = ({
  projectId,
  selectedIndex,
  onOperationSelect,
  ...props
}) => {
  const classes = useStyles();
  const {
    isLoading: isLoadingResources,
    data: resources,
    isFetching: isLoadingResourcesBg,
    error: getResourcesError,
  } = useGetResources(projectId, {
    refetchOnWindowFocus: false,
  });
  let treeNodeIndex = 1;
  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });

  const showAddResourceDialog = () => {
    setDialog({
      show: true,
      type: "add-resource",
    });
  };

  const handleCloseDialog = () => {
    setDialog({
      show: false,
      type: null,
      data: null,
    });
  };

  if (isLoadingResources) {
    return (
      <LoaderWithMessage
        message='Fetching resources'
        contained
        className='h-full'
      />
    );
  }

  const resetSelectedOperation = () => {
    onOperationSelect(null, null, null, null);
  };

  if (getResourcesError) {
    return (
      <ErrorWithMessage
        message='Failed to load the resources'
        contained
        className='h-full'
      />
    );
  }

  return (
    <div {...props}>
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby='project-dialog'
        open={dialog?.show ?? false}
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
        disableBackdropClick
      >
        {dialog?.type === "add-resource" && (
          <AddOrEditResource
            title='Create Resource'
            onClose={handleCloseDialog}
            projectId={projectId}
            resource={{}}
          />
        )}
      </Dialog>

      <div className='flex flex-row justify-between items-center my-2 mx-2'>
        <p className='text-overline2 flex-1'>Resources</p>

        {isLoadingResourcesBg && (
          <CircularProgress size='16px' className='mr-2' />
        )}

        <AppIcon
          style={{ padding: "0", margin: "0" }}
          onClick={showAddResourceDialog}
        >
          <AddIcon style={{ fontSize: "18px", color: "black" }} />
        </AppIcon>
      </div>

      {!_.isEmpty(resources) ? (
        // {true ? (
        <TreeView
          className={classes.root}
          defaultCollapseIcon={
            <ArrowDropDownIcon style={{ color: Colors.neutral.gray3 }} />
          }
          defaultExpandIcon={
            <ArrowRightIcon style={{ color: Colors.neutral.gray3 }} />
          }
          style={{ pointerEvents: "auto" }}
          selected={selectedIndex}
        >
          {resources?.map((resource, resourceIndex) => {
            const resourceNodeIndex = treeNodeIndex++;

            return (
              <ResourceTreeItem
                key={resourceNodeIndex}
                nodeId={resourceNodeIndex}
                resource={resource}
                resetSelectedOperation={() => {
                  console.log("ResourceTreeItem resetSelectedOperation");
                  resetSelectedOperation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("ResourceTreeItem onClick");
                  resetSelectedOperation();
                }}
              >
                {resource?.path && !_.isEmpty(resource?.path)
                  ? resource?.path?.map((path, pathIndex) => {
                      const pathNodeId = treeNodeIndex++;

                      return (
                        <PathTreeItem
                          key={pathNodeId}
                          nodeId={pathNodeId}
                          resourceId={resource?.resourceId}
                          path={path}
                          resetSelectedOperation={() => {
                            console.log("PathTreeItem resetSelectedOperation");
                            resetSelectedOperation();
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("PathTreeItem onClick");
                            resetSelectedOperation();
                          }}
                        >
                          {path?.operations && !_.isEmpty(path?.operations)
                            ? path?.operations?.map(
                                (operation, operationIndex) => {
                                  const operationNodeId = treeNodeIndex++;

                                  return (
                                    <OperationTreeItem
                                      key={operationNodeId}
                                      nodeId={operationNodeId}
                                      resourceId={resource?.resourceId}
                                      pathId={path?.pathId}
                                      type={operation?.operationType}
                                      operation={operation}
                                      resetSelectedOperation={() => {
                                        console.log(
                                          "OperationTreeItem resetSelectedOperation"
                                        );
                                        resetSelectedOperation();
                                      }}
                                      onClick={(e) => {
                                        console.log(
                                          "OperationTreeItem onClick"
                                        );
                                        e.stopPropagation();
                                        onOperationSelect(
                                          operationNodeId,
                                          resource,
                                          path,
                                          operation
                                        );
                                      }}
                                    />
                                  );
                                }
                              )
                            : null}
                        </PathTreeItem>
                      );
                    })
                  : null}
              </ResourceTreeItem>
            );
          })}
        </TreeView>
      ) : (
        <div className='flex-1 justify-center flex flex-col items-center'>
          <img
            src={EmptyState}
            className='mb-1'
            style={{ height: "120px", width: "120px" }}
          />

          <p className='text-overline2 mb-5'>You don’t have any resource</p>

          <PrimaryButton onClick={showAddResourceDialog}>
            Create Resource
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export default Resources;
