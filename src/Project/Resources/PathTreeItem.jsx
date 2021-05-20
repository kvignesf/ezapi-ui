import React, { useState } from "react";
import ReactHoverObserver from "react-hover-observer";
import AddIcon from "@material-ui/icons/Add";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Fade, Menu, MenuItem, Dialog, TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { ErrorMessage, Field, Form, Formik } from "formik";

import ApiMethod, { Method } from "../../shared/components/ApiMethod";
import AppIcon from "../../shared/components/AppIcon";
import StyledTreeItem from "./StyledTreeItem";
import Colors from "../../shared/colors";
import AddOrEditPath from "./AddOrEditPath";
import AddOrEditOperation from "./AddOrEditOperation";
import DeletePath from "./DeletePath";

const PathTreeItem = ({
  nodeId,
  resourceId,
  path,
  children,
  resetSelectedOperation,
  ...rest
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [dialog, setDialog] = useState({
    show: false,
    data: null,
    type: null,
  });

  const handleMenuClick = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    setMenuAnchor(event?.currentTarget);
  };

  const handleAddOperationClick = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    resetSelectedOperation();
    setDialog({
      show: true,
      type: "add-operation",
    });
  };

  const handleEditClick = () => {
    setDialog({
      show: true,
      type: "edit-path",
    });
  };

  const handleDeleteClick = () => {
    setDialog({
      show: true,
      type: "delete-path",
    });
  };

  const handleCloseDialog = () => {
    setDialog({
      show: false,
      data: null,
      type: null,
    });
  };

  return (
    <div {...rest}>
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby='dashboard-dialog'
        open={dialog?.show ?? false}
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
      >
        {dialog?.type === "add-operation" && (
          <AddOrEditOperation
            onClose={handleCloseDialog}
            title='Add Operation'
            pathId={path?.pathId}
            resourceId={resourceId}
            operation={{}}
          />
        )}

        {dialog?.type === "edit-path" && (
          <AddOrEditPath
            onClose={handleCloseDialog}
            title='Edit Path'
            resourceId={resourceId}
            path={path}
          />
        )}

        {dialog?.type === "delete-path" && (
          <DeletePath
            resourceId={resourceId}
            onClose={handleCloseDialog}
            path={path}
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
                  <p className='rounded-sm border-2 border-neutral-gray1 px-1 mr-1 h-5 text-xs'>
                    /
                  </p>
                  <p className='text-overline2 overflow-hidden whitespace-nowrap overflow-ellipsis w-30'>
                    {path?.pathName}
                  </p>
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
            {children ? (
              children
            ) : (
              <div className='my-1 ml-1 flex flex-row items-center'>
                <p className='text-overline3 text-neutral-gray3 mr-1'>
                  This path is empty.
                  <span
                    className='text-overline3 text-brand-secondary cursor-pointer ml-1 hover:opacity-80'
                    onClick={handleAddOperationClick}
                  >
                    Add Operation
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

export default PathTreeItem;
