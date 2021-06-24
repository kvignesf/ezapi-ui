import React, { useState, useEffect, useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { CircularProgress } from "@material-ui/core";
import _ from "lodash";
import debounce from "lodash.debounce";
import DeleteIcon from "@material-ui/icons/Delete";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import Scrollbar from "react-smooth-scrollbar";
import ReactHoverObserver from "react-hover-observer";
import { useParams } from "react-router";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
  Dialog,
  Fade,
  makeStyles,
  Menu,
  MenuItem,
} from "@material-ui/core/index";

import DropArea from "../DropArea";
import operationAtom from "../../operationAtom";
import {
  isAttribute,
  isSchema,
  isArray,
  useWindowSize,
  isObject,
  isDatabase,
  isColumn,
  useGetParentName,
} from "../../../shared/utils";
import AppIcon from "../../../shared/components/AppIcon";
import AttributeIcon from "../../../static/images/attribute.svg";
import SchemaIcon from "../../../static/images/schema-icon.svg";
import ColumnIcon from "../../../static/images/column-icon.svg";
import TableIcon from "../../../static/images/table-icon.svg";
import { useGetSubSchema, useGetTableData } from "./requestBodyQueries";
import DragAndDropMessage from "../../../shared/components/DragAndDropMessage";
import ChangeTableName from "./ChangeTableName";

const Body = ({ request = true, responseCode }) => {
  let [operationData, setOperationDetails] = useRecoilState(operationAtom);
  const { height, width } = useWindowSize();
  const { fetch: fetchParentName } = useGetParentName();

  const itemDropped = (item) => {
    if (
      (isSchema(item) ||
        isDatabase(item) ||
        isAttribute(item) ||
        isColumn(item)) &&
      !isObject(item) &&
      !isArray(item)
    ) {
      setOperationDetails((operationDetails) => {
        if (request) {
          if (
            !operationDetails.operationRequest.body.find(
              (x) => x.name === item.name
            )
          ) {
            const newOperationDetails = _.cloneDeep(operationDetails);
            const clonedItem = _.cloneDeep(item);

            clonedItem.schemaName = fetchParentName(clonedItem) ?? "global";

            newOperationDetails.operationRequest.body.push(clonedItem);

            return newOperationDetails;
          }
        } else {
          const responseData = getResponseData(operationDetails);
          const responseIndex = getResponseIndex(operationDetails);

          const existingBodyIndex = responseData?.body?.findIndex(
            (body) => body.name === item.name
          );

          if (existingBodyIndex === -1 && responseData && responseIndex >= 0) {
            const clonedOperationDetails = _.cloneDeep(operationDetails);
            const clonedResponseData = _.cloneDeep(responseData);
            const clonedItem = _.cloneDeep(item);

            clonedItem.schemaName = fetchParentName(clonedItem) ?? "global";

            clonedResponseData.body.push(clonedItem);

            clonedOperationDetails.operationResponse[responseIndex] =
              clonedResponseData;

            return clonedOperationDetails;
          }
        }
        return operationDetails;
      });
    }
  };

  const getResponseData = (operation) => {
    return operation?.operationResponse?.find(
      (item) => item.responseCode === responseCode
    );
  };

  const getResponseIndex = (operation) => {
    return operation?.operationResponse?.findIndex(
      (item) => item.responseCode === responseCode
    );
  };

  return (
    <DropArea onItemDropped={itemDropped}>
      <div className='h-full flex flex-col'>
        <div className='flex flex-row p-2 border-t-2 border-b-2 bg-neutral-gray8 mb-1/2'>
          <p className='w-1/3 ml-3 text-overline2 text-neutral-gray4 uppercase font-bold'>
            Schema
          </p>
          <p
            className='w-1/3 text-overline2 uppercase text-neutral-gray4 font-bold'
            style={{ marginLeft: "28px" }}
          >
            Data Type
          </p>
          <p className='w-1/3 text-overline2 uppercase text-neutral-gray4 font-bold'>
            Required
          </p>
        </div>

        {request && !_.isEmpty(operationData?.operationRequest?.body) && (
          <div className='h-full flex-1'>
            <Scrollbar
              alwaysShowTracks={true}
              style={{
                maxHeight:
                  height > 790
                    ? "26vh"
                    : height > 770
                    ? "22vh"
                    : height > 600
                    ? "18vh"
                    : "13vh",
              }}
            >
              <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
              >
                {operationData?.operationRequest?.body.map((item) => {
                  let clonedRef;

                  if (isSchema(item) || isDatabase(item)) {
                    clonedRef = _.cloneDeep(item);

                    if (!clonedRef.hasOwnProperty("data")) {
                      clonedRef["data"] = [];
                    }
                  }

                  return (
                    <BodyItem
                      key={item.name}
                      itemRef={clonedRef ?? item}
                      request={request}
                      responseCode={responseCode}
                    />
                  );
                })}
              </TreeView>
            </Scrollbar>
          </div>
        )}

        {!request && !_.isEmpty(getResponseData(operationData)?.body) && (
          <div className='h-full flex-1'>
            <Scrollbar
              alwaysShowTracks={true}
              style={{
                maxHeight:
                  height > 790
                    ? "26vh"
                    : height > 770
                    ? "22vh"
                    : height > 600
                    ? "18vh"
                    : "13vh",
              }}
            >
              <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
              >
                {getResponseData(operationData)?.body.map((item) => {
                  let clonedRef;

                  if (isSchema(item) || isDatabase(item)) {
                    clonedRef = _.cloneDeep(item);

                    if (!clonedRef.hasOwnProperty("data")) {
                      clonedRef["data"] = [];
                    }
                  }

                  return (
                    <BodyItem
                      key={item.name}
                      itemRef={clonedRef ?? item}
                      request={request}
                      responseCode={responseCode}
                    />
                  );
                })}
              </TreeView>
            </Scrollbar>
          </div>
        )}

        {request && _.isEmpty(operationData?.operationRequest?.body) && (
          <div className='border-dashed p-3 bg-neutral-gray7 rounded-md border-2 m-2 flex flex-row justify-center'>
            <DragAndDropMessage isSchemaAllowed />
          </div>
        )}

        {!request && _.isEmpty(getResponseData(operationData)?.body) && (
          <div className='border-dashed p-3 bg-neutral-gray7 rounded-md border-2 m-2 flex flex-row justify-center'>
            <DragAndDropMessage isSchemaAllowed />
          </div>
        )}
      </div>
    </DropArea>
  );
};

let treeIndex = 1;

// This can either be a schema or table
const BodyItem = ({ request = true, responseCode, itemRef }) => {
  console.log("itemRef", itemRef);
  const [bodyItem, setItem] = useState(itemRef);
  const setOperationDetails = useSetRecoilState(operationAtom);
  const { id: projectId } = useParams();
  const {
    isLoading: isLoadingSubSchema,
    error: getSubSchemasError,
    data: subSchemaData,
    mutate: getSubSchema,
    reset: resetSubSchemaData,
    variables: subSchemaRequest,
  } = useGetSubSchema();
  const {
    isLoading: isLoadingTableData,
    data: tableData,
    mutate: getTable,
  } = useGetTableData();

  useEffect(() => {
    if (subSchemaData) {
      let itemsToConsider = [];

      if (
        subSchemaData?.nSchemaArray &&
        !_.isEmpty(subSchemaData?.nSchemaArray)
      ) {
        itemsToConsider = subSchemaData?.nSchemaArray[0].data;
      } else if (subSchemaData?.data && !_.isEmpty(subSchemaData?.data)) {
        itemsToConsider = subSchemaData?.data;
      }

      if (isSchema(bodyItem) || isArray(bodyItem) || isObject(bodyItem)) {
        for (let index = 0; index < itemsToConsider.length; index++) {
          const element = itemsToConsider[index];
          bodyItem.data.push(element);
        }
        const clonedClonedRef = _.cloneDeep(bodyItem);

        setItem(clonedClonedRef);
      }
    }
  }, [subSchemaData]);

  useEffect(() => {
    if (tableData) {
      setItem(tableData);
    }
  }, [tableData]);

  useEffect(() => {
    setItem(itemRef);
  }, [itemRef]);

  const deleteItem = (item) => {
    if (
      (isSchema(item) || isColumn(item) || isAttribute(item)) &&
      !isArray(item) &&
      !isObject(item)
    ) {
      setOperationDetails((operationDetails) => {
        if (request) {
          const index = operationDetails.operationRequest.body.findIndex(
            (x) => x.name === item.name
          );
          if (index !== -1) {
            const newOperationDetails = _.cloneDeep(operationDetails);

            newOperationDetails.operationRequest.body.splice(index, 1);

            return newOperationDetails;
          }
        } else {
          const responseData = operationDetails?.operationResponse?.find(
            (item) => item.responseCode === responseCode
          );
          const responseIndex = operationDetails?.operationResponse?.findIndex(
            (item) => item.responseCode === responseCode
          );

          const existingBodyIndex = responseData?.body?.findIndex(
            (body) => body.name === item.name
          );

          if (existingBodyIndex >= 0 && responseData && responseIndex >= 0) {
            const clonedOperationDetails = _.cloneDeep(operationDetails);
            const clonedResponseData = _.cloneDeep(responseData);

            clonedResponseData.body.splice(existingBodyIndex, 1);

            clonedOperationDetails.operationResponse[responseIndex] =
              clonedResponseData;

            return clonedOperationDetails;
          }
        }

        return operationDetails;
      });
    }
  };

  const getSchemaData = (schemaRef) => {
    if (!isLoadingSubSchema && _.isEmpty(schemaRef.data)) {
      getSubSchema({
        projectId,
        name: schemaRef?.name,
        type: schemaRef?.type,
        ref: schemaRef?.ref,
      });
    }
  };

  const getTableData = (tableRef) => {
    if (!isLoadingTableData && _.isEmpty(tableRef.data)) {
      getTable({
        projectId,
        ref: tableRef?.name,
      });
    }
  };

  const onItemClick = () => {
    if (isDatabase(bodyItem)) {
      getTableData(bodyItem);
    } else if (isSchema(bodyItem)) {
      getSchemaData(bodyItem);
    }
  };

  if (isAttribute(bodyItem)) {
    return (
      <AttributeLabel
        labelItem={bodyItem}
        deleteItem={deleteItem}
        request={request}
        responseCode={responseCode}
      />
    );
  }

  if (isColumn(bodyItem)) {
    return (
      <ColumnLabel
        labelItem={bodyItem}
        deleteItem={deleteItem}
        request={request}
        responseCode={responseCode}
      />
    );
  }

  return (
    <TreeItem
      key={treeIndex++}
      nodeId={treeIndex++}
      label={
        isDatabase(bodyItem) ? (
          <DatabaseLabel
            labelItem={bodyItem}
            deleteItem={deleteItem}
            request={request}
            responseCode={responseCode}
          />
        ) : isSchema(bodyItem) ? (
          <SchemaLabel
            labelItem={bodyItem}
            deleteItem={deleteItem}
            request={request}
            responseCode={responseCode}
          />
        ) : null
      }
      onLabelClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        onItemClick();
      }}
      onIconClick={(e) => {
        onItemClick();
      }}
    >
      {bodyItem?.data?.map((ref) => {
        if (isSchema(ref) || isArray(ref) || isObject(ref)) {
          const clonedRef = _.cloneDeep(ref);

          if (!clonedRef.hasOwnProperty("data")) {
            clonedRef["data"] = [];
          }

          if (!clonedRef.hasOwnProperty("isLoaded")) {
            clonedRef["isLoaded"] = false;
          }

          return <BodySubTreeItems currentRef={clonedRef} />;
        } else if (isAttribute(ref) || isColumn(ref)) {
          return (
            <TreeItem
              key={treeIndex++}
              nodeId={treeIndex++}
              label={
                <div className='flex flex-row p-1 justify-between items-center border-b-2'>
                  <div className='flex flex-row items-center justify-start flex-1'>
                    <img
                      src={
                        isDatabase(bodyItem)
                          ? ColumnIcon
                          : isSchema(bodyItem)
                          ? AttributeIcon
                          : null
                      }
                      alt='ezapi logo'
                      className='bg-white mr-2'
                      style={{
                        height: "24px",
                        width: "24px",
                      }}
                    />

                    <p className='text-overline2'>{ref?.name}</p>
                  </div>

                  <div className='flex-1'>
                    <p>{ref?.type}</p>
                  </div>

                  <div className='flex-1'>
                    <p>{ref?.required}</p>
                  </div>
                </div>
              }
            />
          );
        }
      })}
    </TreeItem>
  );
};

// This is shown only for arrays, schemas, objects of a parent schema
const BodySubTreeItems = ({ currentRef: some }) => {
  const [currentRef, setCurrentRef] = useState(some);
  const { id: projectId } = useParams();
  const {
    isLoading: isLoadingSubSchema,
    error: getSubSchemasError,
    data: subSchemaData,
    mutate: getSubSchema,
    reset: resetSubSchemaData,
    variables: subSchemaRequest,
  } = useGetSubSchema();

  useEffect(() => {
    if (subSchemaData) {
      let itemsToConsider = [];

      if (
        subSchemaData?.nSchemaArray &&
        !_.isEmpty(subSchemaData?.nSchemaArray)
      ) {
        itemsToConsider = subSchemaData?.nSchemaArray;
      } else if (subSchemaData?.data && !_.isEmpty(subSchemaData?.data)) {
        itemsToConsider = subSchemaData?.data;
      }

      if (isSchema(currentRef) || isArray(currentRef) || isObject(currentRef)) {
        currentRef.isLoaded = true;

        for (let index = 0; index < itemsToConsider.length; index++) {
          const element = itemsToConsider[index];
          currentRef.data.push(element);
        }
        const clonedClonedRef = _.cloneDeep(currentRef);

        setCurrentRef(clonedClonedRef);
      }
    }
  }, [subSchemaData]);

  const getSubschemaData = (subSchemaRef) => {
    if (
      !isLoadingSubSchema &&
      !subSchemaRef.isLoaded &&
      _.isEmpty(subSchemaRef.data) &&
      !subSchemaRef?.is_child
    ) {
      getSubSchema({
        projectId,
        name: subSchemaRef?.name,
        type: subSchemaRef?.type,
        ref: subSchemaRef?.ref,
      });
    }
  };

  return (
    <TreeItem
      key={treeIndex++}
      nodeId={treeIndex++}
      label={
        <div className='flex flex-row p-1 justify-between border-b-2'>
          <div className='flex flex-row items-center justify-center'>
            <img
              src={SchemaIcon}
              alt='ezapi logo'
              className='bg-white mr-2'
              style={{
                height: "24px",
                width: "24px",
              }}
            />

            <div className='flex flex-row justify-between w-full items-center'>
              <p className='text-overline2 mr-4'>
                {currentRef?.name}
                {isArray(currentRef) && " [ ]"}
              </p>

              {isLoadingSubSchema && subSchemaRequest.ref === currentRef?.ref && (
                <CircularProgress
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      }
      onLabelClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        getSubschemaData(currentRef);
      }}
      onIconClick={(e) => {
        getSubschemaData(currentRef);
      }}
    >
      {currentRef.data.map((ref) => {
        if (isSchema(ref) || isArray(ref) || isObject(ref)) {
          const clonedRef = _.cloneDeep(ref);

          if (!clonedRef.hasOwnProperty("data")) {
            clonedRef["data"] = [];
          }

          if (!clonedRef.hasOwnProperty("isLoaded")) {
            clonedRef["isLoaded"] = false;
          }

          return <BodySubTreeItems currentRef={clonedRef} />;
        } else if (isAttribute(ref)) {
          return (
            <TreeItem
              key={treeIndex++}
              nodeId={treeIndex++}
              label={
                <div className='flex flex-row justify-between items-center p-1 border-b-2'>
                  <div className='flex flex-row items-center justify-start flex-1'>
                    <img
                      src={AttributeIcon}
                      alt='ezapi logo'
                      className='bg-white mr-2'
                      style={{
                        height: "24px",
                        width: "24px",
                      }}
                    />

                    <p className='text-overline2 '>{ref?.name}</p>
                  </div>

                  <div className='flex-1'>
                    <p>{ref?.type}</p>
                  </div>

                  <div className='flex-1'>
                    <p>{ref?.required}</p>
                  </div>
                </div>
              }
            />
          );
        }
      })}
    </TreeItem>
  );
};

const DatabaseLabel = ({ labelItem, request, responseCode, deleteItem }) => {
  const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = useState(false);
  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });

  const showTableNameChangeDialog = () => {
    setDialog({
      show: true,
      type: "rename-table",
    });
  };

  const handleOptionsClick = (event) => {
    setOptionsMenuAnchorEl(event?.currentTarget);
  };

  const handleCloseDialog = () => {
    setDialog({
      show: false,
      data: null,
    });
  };

  return (
    <ReactHoverObserver>
      {({ isHovering }) => {
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
              {dialog?.type === "rename-table" && (
                <ChangeTableName
                  labelItem={labelItem}
                  request={request}
                  responseCode={responseCode}
                  onClose={handleCloseDialog}
                />
              )}
            </Dialog>

            <div className='flex flex-row p-1 justify-between items-center border-b-2'>
              <div className='flex flex-row items-center justify-start w-1/3'>
                <img
                  src={TableIcon}
                  alt='ezapi logo'
                  className='bg-white mr-4'
                  style={{ height: "24px", width: "24px" }}
                />

                {labelItem?.customName && !_.isEmpty(labelItem?.customName) ? (
                  <p className='text-overline2'>{labelItem?.customName}</p>
                ) : labelItem?.name && !_.isEmpty(labelItem?.name) ? (
                  <p className='text-overline2'>{labelItem?.name}</p>
                ) : null}
              </div>

              {isHovering && (
                <>
                  <AppIcon
                    onClick={(ev) => {
                      ev?.preventDefault();
                      ev?.stopPropagation();

                      handleOptionsClick(ev);
                    }}
                  >
                    <MoreVertIcon style={{ fontSize: "24px" }} />
                  </AppIcon>

                  <Menu
                    id='table-menu'
                    anchorEl={optionsMenuAnchorEl}
                    keepMounted
                    open={Boolean(optionsMenuAnchorEl)}
                    onClose={() => {
                      setOptionsMenuAnchorEl(null);
                    }}
                    TransitionComponent={Fade}
                    style={{ borderRadius: "1rem", zIndex: "100" }}
                  >
                    <MenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOptionsMenuAnchorEl(null);

                        showTableNameChangeDialog();
                      }}
                    >
                      <p className='text-overline2'>Rename</p>
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOptionsMenuAnchorEl(null);

                        deleteItem(labelItem);
                      }}
                    >
                      <p className='text-overline2 text-accent-red'>Delete</p>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </>
        );
      }}
    </ReactHoverObserver>
  );
};

const SchemaLabel = ({ labelItem, deleteItem }) => {
  return (
    <ReactHoverObserver>
      {({ isHovering }) => {
        return (
          <div className='flex flex-row p-1 justify-between items-center border-b-2'>
            <div className='flex flex-row items-center justify-start w-1/3'>
              <img
                src={SchemaIcon}
                alt='ezapi logo'
                className='bg-white mr-4'
                style={{ height: "24px", width: "24px" }}
              />

              <p className='text-overline2'>{labelItem?.name}</p>
            </div>

            {isHovering && (
              <AppIcon
                onClick={(ev) => {
                  ev?.preventDefault();
                  ev?.stopPropagation();

                  deleteItem(labelItem);
                }}
              >
                <DeleteIcon />
              </AppIcon>
            )}
          </div>
        );
      }}
    </ReactHoverObserver>
  );
};

const AttributeLabel = ({ labelItem, deleteItem }) => {
  return (
    <ReactHoverObserver>
      {({ isHovering }) => {
        return (
          <div className='flex flex-row p-1 h-8 justify-between items-center border-b-2 ml-6'>
            <div className='flex flex-row items-center justify-start flex-1'>
              <div className='flex-1 flex flex-row'>
                <img
                  src={AttributeIcon}
                  alt='ezapi logo'
                  className='bg-white mr-4'
                  style={{ height: "24px", width: "24px" }}
                />

                <p className='text-overline2'>{labelItem?.name}</p>
              </div>

              <div className='flex-1 pl-10'>
                <p className='text-overline2'>{labelItem?.type}</p>
              </div>

              <div className='flex-1 pl-5'>
                <p className='text-overline2'>
                  {labelItem?.required ? "true" : "false"}
                </p>
              </div>
            </div>

            <div className='w-6'>
              {isHovering && (
                <AppIcon
                  onClick={(ev) => {
                    ev?.preventDefault();
                    ev?.stopPropagation();

                    deleteItem(labelItem);
                  }}
                >
                  <DeleteIcon />
                </AppIcon>
              )}
            </div>
          </div>
        );
      }}
    </ReactHoverObserver>
  );
};

const ColumnLabel = ({ labelItem, deleteItem }) => {
  return (
    <ReactHoverObserver>
      {({ isHovering }) => {
        return (
          <div className='flex flex-row p-1 h-8 justify-between items-center border-b-2 ml-6'>
            <div className='flex flex-row items-center justify-start flex-1'>
              <div className='flex-1 flex flex-row'>
                <img
                  src={ColumnIcon}
                  alt='ezapi logo'
                  className='bg-white mr-4'
                  style={{ height: "24px", width: "24px" }}
                />

                <p className='text-overline2'>{labelItem?.name}</p>
              </div>

              <div className='flex-1 pl-10'>
                <p className='text-overline2'>{labelItem?.type}</p>
              </div>

              <div className='flex-1 pl-5'>
                <p className='text-overline2'>
                  {labelItem?.required ? "true" : "false"}
                </p>
              </div>
            </div>

            <div className='w-6'>
              {isHovering && (
                <AppIcon
                  onClick={(ev) => {
                    ev?.preventDefault();
                    ev?.stopPropagation();

                    deleteItem(labelItem);
                  }}
                >
                  <DeleteIcon />
                </AppIcon>
              )}
            </div>
          </div>
        );
      }}
    </ReactHoverObserver>
  );
};

export default Body;
