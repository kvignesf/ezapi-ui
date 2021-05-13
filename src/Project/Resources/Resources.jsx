import React, { useState } from "react";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import AddIcon from "@material-ui/icons/Add";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ReactHoverObserver from "react-hover-observer";

import AppIcon from "../../shared/components/AppIcon";
import Colors from "../../shared/colors";
import ApiMethod, { Method } from "../../shared/components/ApiMethod";

import { Dialog, Fade, Menu, MenuItem } from "@material-ui/core";
import AddOrEditResource from "../AddOrEditResource";
const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const StyledTreeItem = withStyles((theme) => ({
  selected: {
    "&:focus": {
      backgroundColor: "null",
    },
    "&:hover": {
      backgroundColor: "null",
    },
  },
  group: {
    marginLeft: 8,
    paddingLeft: 8,
    borderLeft: `1px solid ${Colors.neutral.gray5}`,
  },
}))((props) => <TreeItem style={{ marginTop: "0.5rem" }} {...props} />);

const ResourceTreeItem = ({ nodeId, resource, children, ...rest }) => {
  const [isHover, setIsHover] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuClick = (event) => {
    event?.preventDefault();
    setMenuAnchor(event?.currentTarget);
  };

  const handleAddPathClick = (event) => {
    event?.preventDefault();
  };

  const handleEditClick = () => {};

  const handleDeleteClick = () => {};

  return (
    <ReactHoverObserver shouldDecorateChildren={false}>
      {({ isHovering }) => (
        <StyledTreeItem
          nodeId={nodeId}
          label={
            <div className='flex flex-row items-center p-1'>
              <div className='flex flex-row flex-1 items-center'>
                <AppIcon style={{ marginRight: "0.5rem" }}>
                  <FolderOpenIcon style={{ color: Colors.neutral.gray1 }} />
                </AppIcon>
                <p className='text-overline2'>
                  {resource?.name ?? "something"}
                </p>
              </div>

              {isHovering && (
                <div>
                  <AppIcon
                    onClick={handleAddPathClick}
                    style={{ marginRight: "0.5rem" }}
                  >
                    <AddIcon
                      style={{
                        fontSize: "16px",
                        color: Colors.brand.secondary,
                      }}
                    />
                  </AppIcon>
                </div>
              )}

              {isHovering && (
                <div>
                  <AppIcon onClick={handleMenuClick}>
                    <MoreVertIcon
                      style={{
                        fontSize: "16px",
                        color: Colors.brand.secondary,
                      }}
                    />
                  </AppIcon>
                </div>
              )}

              <Menu
                id='path-menu'
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                anchorEl={menuAnchor}
                keepMounted
                open={Boolean(menuAnchor)}
                onClose={(event) => {
                  event?.preventDefault();
                  setMenuAnchor(null);
                }}
                TransitionComponent={Fade}
                style={{ borderRadius: "1rem", zIndex: "100" }}
              >
                <MenuItem
                  onClick={(event) => {
                    event?.preventDefault();
                    setMenuAnchor(null);
                    handleEditClick();
                  }}
                >
                  Edit
                </MenuItem>

                <MenuItem
                  onClick={(event) => {
                    event?.preventDefault();
                    setMenuAnchor(null);
                    handleDeleteClick();
                  }}
                  style={{ color: Colors.accent.red }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </div>
          }
        >
          {children}
        </StyledTreeItem>
      )}
    </ReactHoverObserver>
  );
};

const PathTreeItem = ({ nodeId, path, children, ...rest }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuClick = (event) => {
    event?.preventDefault();
    setMenuAnchor(event?.currentTarget);
  };

  const handleAddOperationClick = (event) => {
    event?.preventDefault();
  };

  const handleEditClick = () => {};

  const handleDeleteClick = () => {};

  return (
    <ReactHoverObserver shouldDecorateChildren={false}>
      {({ isHovering }) => (
        <StyledTreeItem
          nodeId={nodeId}
          label={
            <div className='flex flex-row items-center p-1 h-8'>
              <div className='flex flex-row flex-1 items-center'>
                <p className='rounded-sm border-2 border-neutral-gray1 px-1 mr-1 text-overline2'>
                  /
                </p>
                <p className='text-overline2'>{path?.name ?? "something"}</p>
              </div>

              {isHovering && (
                <div>
                  <AppIcon
                    onClick={handleAddOperationClick}
                    style={{ marginRight: "0.5rem" }}
                  >
                    <AddIcon
                      style={{
                        fontSize: "16px",
                        color: Colors.brand.secondary,
                      }}
                    />
                  </AppIcon>
                </div>
              )}

              {isHovering && (
                <div>
                  <AppIcon onClick={handleMenuClick}>
                    <MoreVertIcon
                      style={{
                        fontSize: "16px",
                        color: Colors.brand.secondary,
                      }}
                    />
                  </AppIcon>
                </div>
              )}

              <Menu
                id='resources-menu'
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                anchorEl={menuAnchor}
                keepMounted
                open={Boolean(menuAnchor)}
                onClose={(event) => {
                  event?.preventDefault();
                  setMenuAnchor(null);
                }}
                TransitionComponent={Fade}
                style={{ borderRadius: "1rem", zIndex: "100" }}
              >
                <MenuItem
                  onClick={(event) => {
                    event?.preventDefault();
                    setMenuAnchor(null);
                    handleEditClick();
                  }}
                >
                  Edit
                </MenuItem>

                <MenuItem
                  onClick={(event) => {
                    event?.preventDefault();
                    setMenuAnchor(null);
                    handleDeleteClick();
                  }}
                  style={{ color: Colors.accent.red }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </div>
          }
        >
          {children}
        </StyledTreeItem>
      )}
    </ReactHoverObserver>
  );
};

const OperationTreeItem = ({ nodeId, type, operation, ...rest }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuClick = (event) => {
    event?.preventDefault();
    setMenuAnchor(event?.currentTarget);
  };

  const handleAddOperationClick = (event) => {
    event?.preventDefault();
  };

  const handleEditClick = () => {};

  const handleDeleteClick = () => {};

  return (
    <ReactHoverObserver shouldDecorateChildren={false}>
      {({ isHovering }) => (
        <StyledTreeItem
          nodeId={nodeId}
          label={
            <div className='flex flex-row items-center p-1'>
              <div className='flex flex-row flex-1'>
                <ApiMethod
                  type={Method.delete}
                  style={{ marginRight: "0.5rem" }}
                />

                <p>pet</p>
              </div>

              {isHovering && (
                <div>
                  <AppIcon
                    onClick={handleAddOperationClick}
                    style={{ marginRight: "0.5rem" }}
                  >
                    <AddIcon
                      style={{
                        fontSize: "16px",
                        color: Colors.brand.secondary,
                      }}
                    />
                  </AppIcon>
                </div>
              )}

              {isHovering && (
                <div>
                  <AppIcon onClick={handleMenuClick}>
                    <MoreVertIcon
                      style={{
                        fontSize: "16px",
                        color: Colors.brand.secondary,
                      }}
                    />
                  </AppIcon>
                </div>
              )}

              <Menu
                id='resources-menu'
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                anchorEl={menuAnchor}
                keepMounted
                open={Boolean(menuAnchor)}
                onClose={(event) => {
                  event?.preventDefault();
                  setMenuAnchor(null);
                }}
                TransitionComponent={Fade}
                style={{ borderRadius: "1rem", zIndex: "100" }}
              >
                <MenuItem
                  onClick={(event) => {
                    event?.preventDefault();
                    setMenuAnchor(null);
                    handleEditClick();
                  }}
                >
                  Edit
                </MenuItem>

                <MenuItem
                  onClick={(event) => {
                    event?.preventDefault();
                    setMenuAnchor(null);
                    handleDeleteClick();
                  }}
                  style={{ color: Colors.accent.red }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </div>
          }
        />
      )}
    </ReactHoverObserver>
  );
};

const Resources = () => {
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
    <div>
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

      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        style={{ pointerEvents: "auto" }}
      >
        <ResourceTreeItem nodeId='1'>
          <PathTreeItem nodeId='2'>
            <OperationTreeItem nodeId='3' type={Method.get} />
            <OperationTreeItem nodeId='4' type={Method.get} />
            <OperationTreeItem nodeId='5' type={Method.get} />
          </PathTreeItem>
        </ResourceTreeItem>

        <ResourceTreeItem nodeId='6'>
          <PathTreeItem nodeId='7'>
            <OperationTreeItem nodeId='8' type={Method.get} />
            <OperationTreeItem nodeId='9' type={Method.get} />
            <OperationTreeItem nodeId='10' type={Method.get} />
          </PathTreeItem>
        </ResourceTreeItem>
      </TreeView>
    </div>
  );
};

export default Resources;
