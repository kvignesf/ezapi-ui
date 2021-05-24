import React, { useState } from "react";
import ReactHoverObserver from "react-hover-observer";
import AddIcon from "@material-ui/icons/Add";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Dialog, Fade, Menu, MenuItem } from "@material-ui/core";

import ApiMethod, { Method } from "../../shared/components/ApiMethod";
import AppIcon from "../../shared/components/AppIcon";
import StyledTreeItem from "./StyledTreeItem";
import Colors from "../../shared/colors";
import AddOrEditOperation from "./AddOrEditOperation";
import AddOrEditPath from "./AddOrEditPath";
import DeleteOperation from "./DeleteOperation";

const OperationTreeItem = ({
  nodeId,
  resourceId,
  pathId,
  type,
  operation,
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

  const handleEditClick = () => {
    resetSelectedOperation();
    setDialog({
      show: true,
      type: "edit-operation",
    });
  };

  const handleDeleteClick = () => {
    resetSelectedOperation();
    setDialog({
      show: true,
      type: "delete-operation",
    });
  };

  const handleCloseDialog = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
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
        {dialog?.type === "edit-operation" && (
          <AddOrEditOperation
            onClose={handleCloseDialog}
            title='Edit Operation'
            pathId={pathId}
            resourceId={resourceId}
            operation={operation}
          />
        )}

        {dialog?.type === "delete-operation" && (
          <DeleteOperation
            onClose={handleCloseDialog}
            pathId={pathId}
            resourceId={resourceId}
            operation={operation}
          />
        )}
      </Dialog>

      <ReactHoverObserver shouldDecorateChildren={false}>
        {({ isHovering }) => (
          <StyledTreeItem
            nodeId={nodeId}
            label={
              <div className='flex flex-row items-center pr-1 h-6'>
                <div className='flex flex-row flex-1 items-center'>
                  <ApiMethod type={type} style={{ marginRight: "0.5rem" }} />

                  <p className='text-overline2 overflow-hidden whitespace-nowrap overflow-ellipsis w-16'>
                    {operation?.operationName}
                  </p>
                </div>

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
                    event?.stopPropagation();
                    setMenuAnchor(null);
                  }}
                  TransitionComponent={Fade}
                  style={{ borderRadius: "1rem", zIndex: "100" }}
                >
                  <MenuItem
                    onClick={(event) => {
                      event?.preventDefault();
                      event?.stopPropagation();
                      setMenuAnchor(null);
                      handleEditClick();
                    }}
                  >
                    Edit
                  </MenuItem>

                  <MenuItem
                    onClick={(event) => {
                      event?.preventDefault();
                      event?.stopPropagation();
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
    </div>
  );
};

export default OperationTreeItem;
