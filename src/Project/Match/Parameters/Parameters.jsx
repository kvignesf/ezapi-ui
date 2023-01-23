import React, { useState } from "react";
import _ from "lodash";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
import { useCanEdit } from "../../../shared/utils";
import AddOrEditParameter from "./AddOrEditParameter/AddOrEditParameter";
import { useGetParameters } from "./parametersQuery";
import { useRecoilValue } from "recoil";
import DeleteParameter from "./DeleteParameter/DeleteParameter";
import { useDrag } from "react-dnd";
import { operationAtomWithMiddleware } from "../../../shared/utils";

const Parameters = () => {
  const { projectId } = useParams();
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
  const operationState = useRecoilValue(operationAtomWithMiddleware);

  const canEdit = useCanEdit();


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
        {dialog?.type === "add-parameter" && canEdit() && (
          <AddOrEditParameter onClose={handleCloseDialog} />
        )}
      </Dialog>

      <div className='m-4 h-full mb-16'>
        <div
          className='bg-neutral-gray7 mt-14 p-4 rounded-md flex flex-col'
          style={{ height: `calc(100% - 80px)` }}
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

          
          <div className='flex-1 flex flex-col'>
            <div className='flex flex-row justify-start bg-neutral-gray6 rounded-md p-1 py-2 mb-2'>
              <p className='flex-1 text-smallLabel ml-7 text-neutral-gray2 uppercase'>
                Attribute
              </p>
              <p className='flex-1 text-smallLabel uppercase text-neutral-gray2'>
                Data Type
              </p>
              <p className='flex-1 text-smallLabel uppercase text-neutral-gray2'>
                Possible Values
              </p>
              <p className='flex-1'>
                <p style = {{marginRight:"24px"}}className = "text-center uppercase text-neutral-gray2 text-smallLabel">Required</p>
              </p>
              <p className='flex-1 text-smallLabel uppercase text-neutral-gray2'>
                Description
              </p>
              <div className='w-12'></div>
            </div>
            {parameters && parameters?.data && !_.isEmpty(parameters?.data) ?(
            <Scrollbar
              style={{
                height: !operationState?.operationIndex
                  ? `calc(100vh - 210px)`
                  : null,
                maxHeight: operationState?.operationIndex
                  ? `calc(50vh - 210px)`
                  : null,
              }}
            >
              {parameters?.data?.map((param) => {
                //console.log("eachParam:",param);
                return <ParamRow param={param} />;
              })}
              <AddOrEditParameter onClose={handleCloseDialog} />
            </Scrollbar>):(
              <Scrollbar
              style={{
                height: !operationState?.operationIndex
                  ? `calc(100vh - 210px)`
                  : null,
                maxHeight: operationState?.operationIndex
                  ? `calc(50vh - 210px)`
                  : null,
              }}
            >
              <AddOrEditParameter onClose={handleCloseDialog} />
            </Scrollbar>
            )}


          </div>
          
        </div>
      </div>
    </>
  );
};

const ParamRow = ({ param }) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "drag_item",
      item: param,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [param]
  );
  const [editParameter, setEditParameter] = useState(false);
  
  //console.log("editPar:",editParameter);
  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });
  const canEdit = useCanEdit();

  const showEditParameterDialog = () => {
    if (canEdit()) {
      // setDialog({
      //   show: true,
      //   type: "edit-parameter",
      // });
    }
  };

  const showDeleteParameterDialog = () => {
    if (canEdit()) {
      setDialog({
        show: true,
        type: "delete-parameter",
      });
    }
  };

  const handleCloseDialog = () => {
    setDialog({
      show: false,
      data: null,
    });
  };
  
  const handleEditParameter = () => {
    setEditParameter(false);
  };
  //console.log("check:",param);
  return (
    <div
      ref={canEdit() ? drag : null}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: canEdit() ? "pointer" : "default",
      }}
    >
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
          {dialog?.type === "delete-parameter" && canEdit() && (
            <DeleteParameter onClose={handleCloseDialog} parameter={param} />
          )}
        </Dialog>
        {(editParameter && canEdit())?(
          <AddOrEditParameter stopEdit = {handleEditParameter} onClose={handleCloseDialog} parameter={param}/>
        ):(
          <div
            key={param.name}
            className='bg-white mb-1 rounded-md flex flex-row p-1 py-1 items-center'
          >
            <AppIcon className='mr-1 opacity-50'>
              <DragIndicatorIcon
                className={"cursor-move"}
                style={{ height: "1.25rem" }}
              />
            </AppIcon>
            <p className='flex-1 ml-1 text-overline2'>{param?.name}</p>
            <p className='flex-1 text-overline2'>{param?.type}</p>
            <p className='flex-1 text-overline2'>
              {param.possibleValues?.reduce((acc, curr) => {
                if (!_.isEmpty(acc)) {
                  return acc + ", " + curr;
                }
                return curr;
              }, "")}
            </p>
            <p className='flex-1'>
            <p style = {{marginRight:"29px"}} className = "text-center text-overline2 mr-2">
              {param?.required ? "Yes" : "No"}
              </p>
            </p>
            <p className='flex-1 text-overline2'>{param?.description}</p>  
            <div className='w-12 h-8 flex flex-row pt-1'>
              <AppIcon 
                className='mr-1'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditParameter(true);
                  
                }}>
              <EditIcon
                className={"cursor-pointer"}
                style={{ height: "1.25rem", color: "#c72c71" }}
              />
            </AppIcon>
            <AppIcon
              className='mr-1'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                showDeleteParameterDialog();
              }}
            >
              <DeleteIcon
                className={"cursor-pointer"}
                style={{ marginLeft: "5px", height: "1.25rem", color: "#c72c71"}}
              />
            </AppIcon>    
            </div>
          </div>)}
      </>
    </div>
  );
};

export default Parameters;
