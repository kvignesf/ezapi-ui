import React, { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { CircularProgress } from "@material-ui/core";
import _ from "lodash";
import DeleteIcon from "@material-ui/icons/Delete";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import Scrollbar from "react-smooth-scrollbar";
import ReactHoverObserver from "react-hover-observer";

import DropArea from "../DropArea";
import operationAtom from "../../operationAtom";
import {
  isAttribute,
  isSchema,
  isArray,
  useWindowSize,
  isObject,
} from "../../../shared/utils";
import AppIcon from "../../../shared/components/AppIcon";
import AttributeIcon from "../../../static/images/attribute.svg";
import SchemaIcon from "../../../static/images/schema-icon.svg";
import { useGetSubSchema } from "./requestBodyQueries";
import { useParams } from "react-router";
import DragAndDropMessage from "../../../shared/components/DragAndDropMessage";

const Body = ({ request = true }) => {
  let [operationDetails, setOperationDetails] = useRecoilState(operationAtom);
  const { height, width } = useWindowSize();

  const itemDropped = (item) => {
    if (isSchema(item) && !isObject(item) && !isArray(item)) {
      setOperationDetails((operationDetails) => {
        if (request) {
          if (
            !operationDetails.operationRequest.body.find(
              (x) => x.name === item.name
            )
          ) {
            const newOperationDetails = _.cloneDeep(operationDetails);

            newOperationDetails.operationRequest.body.push(item);

            return newOperationDetails;
          }
        } else {
          if (
            !operationDetails.operationResponse.body.find(
              (x) => x.name === item.name
            )
          ) {
            const newOperationDetails = _.cloneDeep(operationDetails);

            newOperationDetails.operationResponse.body.push(item);

            return newOperationDetails;
          }
        }
        return operationDetails;
      });
    }
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

        {request && !_.isEmpty(operationDetails?.operationRequest?.body) && (
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
                {operationDetails?.operationRequest?.body.map((item) => {
                  const clonedRef = _.cloneDeep(item);

                  if (!clonedRef.hasOwnProperty("data")) {
                    clonedRef["data"] = [];
                  }

                  return <SchemaItem schema={clonedRef} request={request} />;
                })}
              </TreeView>
            </Scrollbar>
          </div>
        )}

        {!request && !_.isEmpty(operationDetails?.operationResponse?.body) && (
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
                {operationDetails?.operationResponse?.body.map((item) => {
                  const clonedRef = _.cloneDeep(item);

                  if (!clonedRef.hasOwnProperty("data")) {
                    clonedRef["data"] = [];
                  }

                  return <SchemaItem schema={clonedRef} request={request} />;
                })}
              </TreeView>
            </Scrollbar>
          </div>
        )}

        {request && _.isEmpty(operationDetails?.operationRequest?.body) && (
          <div className='border-dashed p-3 bg-neutral-gray7 rounded-md border-2 m-2 flex flex-row justify-center'>
            <DragAndDropMessage isSchemaAllowed />
          </div>
        )}

        {!request && _.isEmpty(operationDetails?.operationResponse?.body) && (
          <div className='border-dashed p-3 bg-neutral-gray7 rounded-md border-2 m-2 flex flex-row justify-center'>
            <DragAndDropMessage isSchemaAllowed />
          </div>
        )}
      </div>
    </DropArea>
  );
};

let treeIndex = 1;

const SubSchemaTreeItems = ({ currentRef: some }) => {
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
    console.log("subSchemaRef", subSchemaRef);
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

          return <SubSchemaTreeItems currentRef={clonedRef} />;
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

const SchemaItem = ({ request = true, schema: currSchema }) => {
  const [schema, setSchema] = useState(currSchema);
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

      if (isSchema(schema) || isArray(schema) || isObject(schema)) {
        for (let index = 0; index < itemsToConsider.length; index++) {
          const element = itemsToConsider[index];
          schema.data.push(element);
        }
        const clonedClonedRef = _.cloneDeep(schema);

        setSchema(clonedClonedRef);
      }
    }
  }, [subSchemaData]);

  const deleteSchema = (item) => {
    if (isSchema(item) && !isArray(item) && !isObject(item)) {
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
          const index = operationDetails.operationResponse.body.findIndex(
            (x) => x.name === item.name
          );
          if (index !== -1) {
            const newOperationDetails = _.cloneDeep(operationDetails);

            newOperationDetails.operationResponse.body.splice(index, 1);

            return newOperationDetails;
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

  return (
    <TreeItem
      key={treeIndex++}
      nodeId={treeIndex++}
      label={<Label schema={schema} deleteSchema={deleteSchema} />}
      onLabelClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        getSchemaData(schema);
      }}
      onIconClick={(e) => {
        getSchemaData(schema);
      }}
    >
      {schema?.data?.map((ref) => {
        if (isSchema(ref) || isArray(ref) || isObject(ref)) {
          const clonedRef = _.cloneDeep(ref);

          if (!clonedRef.hasOwnProperty("data")) {
            clonedRef["data"] = [];
          }

          if (!clonedRef.hasOwnProperty("isLoaded")) {
            clonedRef["isLoaded"] = false;
          }

          return <SubSchemaTreeItems currentRef={clonedRef} />;
        } else if (isAttribute(ref)) {
          return (
            <TreeItem
              key={treeIndex++}
              nodeId={treeIndex++}
              label={
                <div className='flex flex-row p-1 justify-between items-center border-b-2'>
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

const Label = ({ schema, deleteSchema }) => {
  return (
    <ReactHoverObserver>
      {({ isHovering }) => {
        return (
          <div className='flex flex-row p-1 justify-between border-b-2'>
            <div className='flex flex-row items-center justify-start w-1/3'>
              <img
                src={SchemaIcon}
                alt='ezapi logo'
                className='bg-white mr-4'
                style={{ height: "24px", width: "24px" }}
              />

              <p className='text-overline2'>{schema?.name}</p>
            </div>

            {isHovering && (
              <AppIcon
                onClick={(ev) => {
                  ev?.preventDefault();
                  ev?.stopPropagation();

                  deleteSchema(schema);
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

export default Body;
