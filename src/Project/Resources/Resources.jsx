import React, { useState } from "react";
import TreeView from "@material-ui/lab/TreeView";
import { makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import AddIcon from "@material-ui/icons/Add";
import { Dialog } from "@material-ui/core";
import _ from "lodash";

import AppIcon from "../../shared/components/AppIcon";
import { Method } from "../../shared/components/ApiMethod";
import EmptyState from "../../static/images/empty-state.svg";
import AddOrEditResource from "./AddOrEditResource";
import ResourceTreeItem from "./ResourcesTreeItem";
import PathTreeItem from "./PathTreeItem";
import OperationTreeItem from "./OperationTreeItem";
import { PrimaryButton } from "../../shared/components/AppButton";
import Colors from "../../shared/colors";

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const Resources = ({ resources, ...props }) => {
  const classes = useStyles();
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
          />
        )}
      </Dialog>

      <div className='flex flex-row justify-between items-center my-2 mx-2'>
        <p className='text-overline2'>Resources</p>

        <AppIcon
          style={{ padding: "0", margin: "0" }}
          onClick={showAddResourceDialog}
        >
          <AddIcon style={{ fontSize: "18px", color: "black" }} />
        </AppIcon>
      </div>

      {/* {!_.isEmpty(resources) ? ( */}
      {true ? (
        <TreeView
          className={classes.root}
          defaultCollapseIcon={
            <ArrowDropDownIcon style={{ color: Colors.neutral.gray3 }} />
          }
          defaultExpandIcon={
            <ArrowRightIcon style={{ color: Colors.neutral.gray3 }} />
          }
          style={{ pointerEvents: "auto" }}
        >
          <ResourceTreeItem nodeId='1'>
            <PathTreeItem nodeId='2'>
              <OperationTreeItem nodeId='3' type={Method.get} />
              <OperationTreeItem nodeId='4' type={Method.post} />
              <OperationTreeItem nodeId='5' type={Method.put} />
              <OperationTreeItem nodeId='6' type={Method.delete} />
            </PathTreeItem>
          </ResourceTreeItem>

          <ResourceTreeItem nodeId='7'>
            <PathTreeItem nodeId='8'>
              <OperationTreeItem nodeId='9' type={Method.get} />
              <OperationTreeItem nodeId='10' type={Method.get} />
              <OperationTreeItem nodeId='11' type={Method.get} />
            </PathTreeItem>
          </ResourceTreeItem>
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
