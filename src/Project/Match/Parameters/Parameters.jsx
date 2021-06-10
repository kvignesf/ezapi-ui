import React, { useState } from "react";
import _ from "lodash";
import AddIcon from "@material-ui/icons/Add";
import {
  CircularProgress,
  Dialog,
  Fade,
  Menu,
  MenuItem,
} from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useParams } from "react-router";
import Scrollbar from "react-smooth-scrollbar";

import EmptyParameters from "../../../static/images/empty-parameters.svg";
import { OutlineButton } from "../../../shared/components/AppButton";
import AppIcon from "../../../shared/components/AppIcon";
import Colors from "../../../shared/colors";
import AddParameter from "./AddParameter/AddParameter";
import { useGetParameters } from "./parametersQuery";
import operationAtom from "../../operationAtom";
import { useRecoilValue } from "recoil";

const Parameters = () => {
  const { id: projectId } = useParams();
  const {
    isLoading: isFetchingParameters,
    data: parameters,
    error: getParametersError,
  } = useGetParameters(projectId, {
    refetchOnWindowFocus: false,
  });
  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });
  const operationState = useRecoilValue(operationAtom);

  const showAddParameterDialog = () => {
    setDialog({
      show: true,
      type: "add-parameter",
    });
  };

  const handleCloseDialog = () => {
    setDialog({
      show: false,
      data: null,
    });
  };

  return (
    <>
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby='dashboard-dialog'
        open={dialog?.show ?? false}
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
        disableBackdropClick
      >
        {dialog?.type === "add-parameter" && (
          <AddParameter onClose={handleCloseDialog} />
        )}
      </Dialog>

      <div className='m-4 h-full mb-16'>
        <div
          className='bg-neutral-gray7 p-4 rounded-md flex flex-col'
          style={{ height: `calc(100% - 85px)` }}
        >
          {isFetchingParameters && (
            <div className='flex-1 flex flex-col items-center justify-center'>
              <CircularProgress
                style={{
                  width: "28px",
                  height: "28px",
                  color: Colors.brand.secondary,
                  marginBottom: "2rem",
                }}
              />
              <p className='text-overline2'>Fetching data</p>
            </div>
          )}

          {getParametersError && (
            <div className='flex-1 flex flex-col items-center justify-center'>
              <p className='text-overline2'>{getParametersError?.message}</p>
            </div>
          )}

          {parameters && parameters?.data && !_.isEmpty(parameters?.data) ? (
            <div className='flex-1 flex flex-col'>
              <div className='flex flex-row justify-start bg-neutral-gray6 rounded-md p-1 mb-1'>
                <p className='flex-1 text-overline2 ml-7'>Attribute</p>
                <p className='flex-1 text-overline2'>Data Type</p>
                <p className='flex-1 text-overline2'>Description</p>
                <p className='flex-1 text-overline2'>Required</p>
                <p className='flex-1 text-overline2'>Possible Values</p>
                <div className='w-8'></div>
              </div>

              <Scrollbar
                style={{
                  height: !operationState?.operationIndex ? "h-full" : null,
                  maxHeight: operationState?.operationIndex
                    ? `calc(50vh - 180px)`
                    : null,
                }}
              >
                {parameters?.data?.map((param) => {
                  return <ParamRow param={param} />;
                })}
              </Scrollbar>
            </div>
          ) : (
            !isFetchingParameters &&
            !getParametersError && (
              <div className='flex-1 flex flex-col items-center justify-center'>
                <img
                  src={EmptyParameters}
                  style={{
                    width: "110px",
                    height: "110px",
                  }}
                />
                <p className='text-overline2 mb-3'>
                  You don’t have any parameter
                </p>

                <OutlineButton
                  style={{
                    borderColor: Colors.brand.secondary,
                    borderWidth: "1px",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    showAddParameterDialog();
                  }}
                >
                  <div className='flex flex-row items-center'>
                    <AppIcon
                      size='20px'
                      color={Colors.brand.secondary}
                      style={{ marginRight: "0.5rem" }}
                    >
                      <AddIcon style={{ fontSize: "20px" }} />
                    </AppIcon>
                    <p className='text-overline2 text-brand-secondary'>
                      Add Parameter
                    </p>
                  </div>
                </OutlineButton>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

const ParamRow = ({ param }) => {
  const [isHovering, setHovering] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(false);

  return (
    <div
      key={param.name}
      onMouseEnter={(e) => {
        e?.preventDefault();
        e?.stopPropagation();

        setHovering(true);
      }}
      onMouseLeave={(e) => {
        e?.preventDefault();
        e?.stopPropagation();

        setHovering(false);
      }}
      className='bg-white mb-1 rounded-md flex flex-row p-1 py-1 items-center'
    >
      <AppIcon className='mr-1 opacity-50'>
        <DragIndicatorIcon
          className={"cursor-move"}
          style={{ height: "1.25rem" }}
        />
      </AppIcon>
      <p className='flex-1 ml-1 text-overline2'>{param.name}</p>
      <p className='flex-1 text-overline2'>{param.type}</p>
      <p className='flex-1 text-overline2'>{param.description}</p>
      <p className='flex-1 text-overline2'>{param.isRequired ? "Yes" : "No"}</p>
      <p className='flex-1 text-overline2'>
        {param.possibleValues?.reduce((acc, curr) => {
          if (!_.isEmpty(acc)) {
            return acc + ", " + curr;
          }
          return curr;
        }, "")}
      </p>

      <div className='w-8 h-8'>
        {isHovering ? (
          <AppIcon
            style={{ padding: "0px" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setMenuAnchorEl(e.currentTarget);
            }}
          >
            <MoreVertIcon style={{ width: "20px", height: "min-content" }} />
          </AppIcon>
        ) : (
          <div style={{ width: "20px", height: "min-content" }}></div>
        )}
      </div>

      <Menu
        id='param-menu'
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={() => {
          setMenuAnchorEl(null);
        }}
        TransitionComponent={Fade}
        style={{ borderRadius: "1rem", zIndex: "100" }}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchorEl(null);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchorEl(null);
          }}
          style={{ color: Colors.accent.red }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Parameters;
