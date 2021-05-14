import React, { useState } from "react";
import ReactHoverObserver from "react-hover-observer";
import AddIcon from "@material-ui/icons/Add";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import { Dialog, Fade, Menu, MenuItem, TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { ErrorMessage, Field, Form, Formik } from "formik";

import ApiMethod, { Method } from "../../shared/components/ApiMethod";
import AppIcon from "../../shared/components/AppIcon";
import StyledTreeItem from "./StyledTreeItem";
import Colors from "../../shared/colors";
import AddOrEditPath from "./AddOrEditPath";
import AddOrEditResource from "./AddOrEditResource";

const ResourceTreeItem = ({ nodeId, resource, children, ...rest }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [dialog, setDialog] = useState({
    show: false,
    data: null,
    type: null,
  });

  const handleMenuClick = (event) => {
    event?.preventDefault();
    setMenuAnchor(event?.currentTarget);
  };

  const handleAddPathClick = (event) => {
    event?.preventDefault();
    setDialog({
      show: true,
      type: "add-path",
    });
  };

  const handleEditClick = () => {
    setDialog({
      show: true,
      type: "edit-resource",
    });
  };

  const handleDeleteClick = () => {};

  const handleCloseDialog = () => {
    setDialog({
      show: false,
      data: null,
      type: null,
    });
  };

  return (
    <div>
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby='dashboard-dialog'
        open={dialog?.show ?? false}
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
      >
        {dialog?.type === "add-path" && (
          <AddOrEditPath
            onClose={handleCloseDialog}
            title='Add Path'
            path={{}}
          />
        )}

        {dialog?.type === "edit-resource" && (
          <AddOrEditResource
            onClose={handleCloseDialog}
            title='Edit Resource'
            resource={{}}
          />
        )}
      </Dialog>

      <ReactHoverObserver shouldDecorateChildren={false}>
        {({ isHovering }) => (
          <StyledTreeItem
            nodeId={nodeId}
            label={
              <div className='flex flex-row items-center py-1 pr-1 h-8'>
                <div className='flex flex-row flex-1 items-center'>
                  <AppIcon style={{ marginRight: "0.5rem" }}>
                    <FolderOpenIcon
                      style={{ fontSize: "18px", color: Colors.neutral.gray1 }}
                    />
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
            {children ? (
              children
            ) : (
              <div className='my-1 ml-1 flex flex-row items-center'>
                <p className='text-overline3 text-neutral-gray3 mr-1'>
                  This resource is empty.
                  <span
                    className='text-overline3 text-brand-secondary cursor-pointer ml-1 hover:opacity-80'
                    onClick={handleAddPathClick}
                  >
                    Add Path
                  </span>
                </p>
              </div>
            )}
          </StyledTreeItem>
        )}
      </ReactHoverObserver>
    </div>
  );
};

export default ResourceTreeItem;
