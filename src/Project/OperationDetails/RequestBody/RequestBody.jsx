import React, { useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { TextField } from "@material-ui/core";
import _ from "lodash";
import DeleteIcon from "@material-ui/icons/Delete";
import { Field, ErrorMessage, Form, Formik } from "formik";
import debounce from "lodash.debounce";
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
} from "../../../shared/utils";
import AppIcon from "../../../shared/components/AppIcon";
import AttributeIcon from "../../../static/images/attribute.svg";
import SchemaIcon from "../../../static/images/schema-icon.svg";
import { useGetSubSchema } from "../../Match/Schema/schemaQueries";

const RequestBody = () => {
  let [operationDetails, setOperationDetails] = useRecoilState(operationAtom);
  const { height, width } = useWindowSize();
  const {
    isLoading: isLoadingSubSchema,
    error: getSubSchemasError,
    data: subSchemaData,
    mutate: getSubSchema,
    reset: resetSubSchemaData,
    isIdle: isGetSubSchemaIdle,
  } = useGetSubSchema();

  const itemDropped = (item) => {
    if (isSchema(item) && !isArray(item) && !isAttribute(item)) {
      setOperationDetails((operationDetails) => {
        if (
          !operationDetails.operationRequest.body.find(
            (x) => x.name === item.name
          )
        ) {
          const newOperationDetails = _.cloneDeep(operationDetails);

          newOperationDetails.operationRequest.body.push(item);

          return newOperationDetails;
        }
        return operationDetails;
      });
    }
  };

  const itemDeleted = (item) => {
    if (isSchema(item) && !isArray(item) && !isAttribute(item)) {
      setOperationDetails((operationDetails) => {
        const index = operationDetails.operationRequest.body.findIndex(
          (x) => x.name === item.name
        );
        if (index !== -1) {
          const newOperationDetails = _.cloneDeep(operationDetails);

          newOperationDetails.operationRequest.body.splice(index, 1);

          return newOperationDetails;
        }

        return operationDetails;
      });
    }
  };

  const onSubSchemaClick = (item) => {
    console.log("item", item);
  };

  return (
    <DropArea onItemDropped={itemDropped}>
      <div className='h-full flex flex-col'>
        <div className='flex flex-row p-2 border-t-2 border-b-2 bg-neutral-gray8 mb-2'>
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

        {!_.isEmpty(operationDetails?.operationRequest?.body) && (
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
                  return (
                    <SchemaItem
                      schema={item}
                      deleteSchema={itemDeleted}
                      onSubSchemaClick={onSubSchemaClick}
                    />
                  );
                })}
              </TreeView>
            </Scrollbar>
          </div>
        )}

        {_.isEmpty(operationDetails?.operationRequest?.body) && (
          <div className='border-dashed p-3 bg-neutral-gray7 rounded-md border-2 m-2 flex flex-row justify-center'>
            <p className='text-overline3'>
              Drag and Drop
              <span className='text-brand-primary ml-1'>Schema</span> here
            </p>
          </div>
        )}
      </div>
    </DropArea>
  );
};

let treeIndex = 1;

const SchemaItem = ({ schema, deleteSchema, onSubSchemaClick }) => {
  const getTreeItems = (currentRef) => {
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

              <p className='text-overline2'>
                {currentRef?.name}
                {isArray(currentRef) && " [ ]"}
              </p>
            </div>
          </div>
        }
      >
        {currentRef?.attributes?.map((attribute) => {
          return (
            <TreeItem
              key={treeIndex++}
              nodeId={treeIndex++}
              label={
                <div className='flex flex-row p-1 justify-between border-b-2'>
                  <div className='flex flex-row items-center justify-start w-1/3'>
                    <img
                      src={AttributeIcon}
                      alt='ezapi logo'
                      className='bg-white mr-2'
                      style={{
                        height: "24px",
                        width: "24px",
                      }}
                    />

                    <p className='text-overline2'>{attribute?.name}</p>
                  </div>

                  <div className='w-1/3'>
                    <p>{attribute?.type}</p>
                  </div>

                  <div className='w-1/3'>
                    <p>{attribute?.required}</p>
                  </div>
                </div>
              }
            />
          );
        })}

        {currentRef?.refs?.map((ref) => {
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

                    <p className='text-overline2'>
                      {ref?.name}
                      {isArray(ref) && " [ ]"}
                    </p>
                  </div>
                </div>
              }
              onClick={(e) => {
                e?.preventDefault();
                e?.stopPropagation();

                onSubSchemaClick(ref);
              }}
            >
              {getTreeItems(ref)}
            </TreeItem>
          );
        })}
      </TreeItem>
    );
  };

  return (
    <TreeItem
      key={treeIndex++}
      nodeId={treeIndex++}
      label={<Label schema={schema} />}
      selected={2}
    >
      {schema?.attributes?.map((attribute) => {
        return (
          <TreeItem
            key={treeIndex++}
            nodeId={treeIndex++}
            label={
              <div className='flex flex-row p-1 justify-between border-b-2'>
                <div className='flex flex-row items-center justify-start w-1/3'>
                  <img
                    src={AttributeIcon}
                    alt='ezapi logo'
                    className='bg-white mr-2'
                    style={{
                      height: "24px",
                      width: "24px",
                    }}
                  />

                  <p className='text-overline2'>{attribute?.name}</p>
                </div>

                <div className='w-1/3'>
                  <p>{attribute?.type}</p>
                </div>

                <div className='w-1/3'>
                  <p>{attribute?.required}</p>
                </div>
              </div>
            }
          />
        );
      })}

      {schema?.refs?.map((ref) => getTreeItems(ref))}
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
                className='bg-white mr-2'
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

export default RequestBody;
