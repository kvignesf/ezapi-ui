import React, { useState, useCallback } from "react";
import { useRecoilState, useGetRecoilValueInfo_UNSTABLE } from "recoil";
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

import DropArea from "../DropArea";
import operationAtom from "../../operationAtom";
import {
  isAttribute,
  isSchema,
  isArray,
  useWindowSize,
  isObject,
  useParentSchemaNameFetcher,
} from "../../../shared/utils";
import AppIcon from "../../../shared/components/AppIcon";
import DragAndDropMessage from "../../../shared/components/DragAndDropMessage";
import Row from "../Row";
import schemaAtom from "../../../shared/atom/schemaAtom";

const QueryParams = ({ request = true }) => {
  let [operationDetails, setOperationDetails] = useRecoilState(operationAtom);
  // const getRecoilValueInfo = useGetRecoilValueInfo_UNSTABLE();
  const { height, width } = useWindowSize();

  // const fetchParentSchema = () => {
  //   const { loadable } = getRecoilValueInfo(schemaAtom);
  //   const schemaDetails = loadable?.contents;

  //   if (
  //     schemaDetails &&
  //     schemaDetails?.selected &&
  //     !_.isEmpty(schemaDetails?.selected)
  //   ) {
  //     const value = schemaDetails?.selected
  //       ?.slice()
  //       ?.reverse()
  //       ?.find((item) => isSchema(item));

  //     return value;
  //   }
  //   return null;
  // };

  const itemDropped = (item) => {
    if (
      isAttribute(item) &&
      !isArray(item) &&
      !isSchema(item) &&
      !isObject(item)
    ) {
      setOperationDetails((operationDetails) => {
        if (request) {
          if (
            !operationDetails.operationRequest.queryParams.find(
              (x) => x.name === item.name
            )
          ) {
            const newOperationDetails = _.cloneDeep(operationDetails);

            newOperationDetails.operationRequest.queryParams.push({
              name: item?.name,
              type: item?.type,
              required: item?.required,
              description: item?.description,
              // schemaName: fetchParentSchema()?.name ?? "global",
            });

            return newOperationDetails;
          }
        } else {
          if (
            !operationDetails.operationResponse.queryParams.find(
              (x) => x.name === item.name
            )
          ) {
            const newOperationDetails = _.cloneDeep(operationDetails);

            newOperationDetails.operationResponse.queryParams.push({
              name: item?.name,
              type: item?.type,
              required: item?.required,
              description: item?.description,
              // schemaName: fetchParentSchema()?.name ?? "global",
            });

            return newOperationDetails;
          }
        }
        return operationDetails;
      });
    }
  };

  const itemDeleted = (item) => {
    if (
      isAttribute(item) &&
      !isArray(item) &&
      !isSchema(item) &&
      !isObject(item)
    ) {
      setOperationDetails((operationDetails) => {
        if (request) {
          const index = operationDetails.operationRequest.queryParams.findIndex(
            (x) => x.name === item.name
          );

          if (index !== -1) {
            const newOperationDetails = _.cloneDeep(operationDetails);

            newOperationDetails.operationRequest.queryParams.splice(index, 1);

            return newOperationDetails;
          }
        } else {
          const index =
            operationDetails.operationResponse.queryParams.findIndex(
              (x) => x.name === item.name
            );

          if (index !== -1) {
            const newOperationDetails = _.cloneDeep(operationDetails);

            newOperationDetails.operationResponse.queryParams.splice(index, 1);

            return newOperationDetails;
          }
        }

        return operationDetails;
      });
    }
  };

  const onDescriptionUpdate = useCallback(
    debounce((item, value) => {
      setOperationDetails((operationDetails) => {
        if (request) {
          let foundItem = operationDetails.operationRequest.queryParams.find(
            (x) => x.name === item.name
          );
          let foundItemIndex =
            operationDetails.operationRequest.queryParams.findIndex(
              (x) => x.name === item.name
            );

          if (foundItem) {
            const clonedFoundItem = _.cloneDeep(foundItem);
            const clonedOperationDetails = _.cloneDeep(operationDetails);

            clonedFoundItem.description = value;
            clonedOperationDetails.operationRequest.queryParams[
              foundItemIndex
            ] = clonedFoundItem;

            return clonedOperationDetails;
          }
        } else {
          let foundItem = operationDetails.operationResponse.queryParams.find(
            (x) => x.name === item.name
          );
          let foundItemIndex =
            operationDetails.operationResponse.queryParams.findIndex(
              (x) => x.name === item.name
            );

          if (foundItem) {
            const clonedFoundItem = _.cloneDeep(foundItem);
            const clonedOperationDetails = _.cloneDeep(operationDetails);

            clonedFoundItem.description = value;
            clonedOperationDetails.operationResponse.queryParams[
              foundItemIndex
            ] = clonedFoundItem;

            return clonedOperationDetails;
          }
        }

        return operationDetails;
      });
    }, 300),
    [] // will be created only once initially
  );

  const onRequiredUpdate = (item, value) => {
    setOperationDetails((operationDetails) => {
      let foundItem = operationDetails.operationRequest.queryParams.find(
        (x) => x.name === item.name
      );
      let foundItemIndex =
        operationDetails.operationRequest.queryParams.findIndex(
          (x) => x.name === item.name
        );

      if (foundItem) {
        const clonedFoundItem = _.cloneDeep(foundItem);
        const clonedOperationDetails = _.cloneDeep(operationDetails);

        clonedFoundItem.required = value;
        clonedOperationDetails.operationRequest.queryParams[foundItemIndex] =
          clonedFoundItem;

        return clonedOperationDetails;
      }
      return operationDetails;
    });
  };

  return (
    <DropArea onItemDropped={itemDropped}>
      <TableContainer
        style={{
          maxHeight: height > 750 ? "30vh" : height > 600 ? "26vh" : "23vh",
        }}
      >
        <Table
          stickyHeader
          aria-label='simple table'
          className='border-t-2 border-b-2'
        >
          <TableHead className='border-t-2 border-b-2 w-full'>
            <TableRow>
              <TableCell align='left' style={{ padding: "0.5rem" }}>
                <p className='text-overline2 text-neutral-gray4'>ATTRIBUTE</p>
              </TableCell>
              <TableCell align='left' style={{ padding: "0" }}>
                <p className='text-overline2 text-neutral-gray4'>DATA TYPE</p>
              </TableCell>
              <TableCell align='left' style={{ padding: "0" }}>
                <p className='text-overline2 text-neutral-gray4'>DESCRIPTION</p>
              </TableCell>
              <TableCell align='left' style={{ padding: "0" }}>
                <p className='text-overline2 text-neutral-gray4'>REQUIRED</p>
              </TableCell>
              <TableCell align='left' style={{ padding: "0" }}></TableCell>
            </TableRow>
          </TableHead>

          {request &&
            !_.isEmpty(operationDetails?.operationRequest?.queryParams) && (
              <TableBody className='w-full max-h-6'>
                {operationDetails?.operationRequest?.queryParams?.map((row) => {
                  return (
                    <Row
                      row={row}
                      onItemDelete={itemDeleted}
                      onDescriptionUpdate={(item, value) => {
                        onDescriptionUpdate(item, value);
                      }}
                      onRequiredUpdate={(item, value) => {
                        onRequiredUpdate(item, value);
                      }}
                    />
                  );
                })}
              </TableBody>
            )}

          {!request &&
            !_.isEmpty(operationDetails?.operationResponse?.queryParams) && (
              <TableBody className='w-full max-h-6'>
                {operationDetails?.operationResponse?.queryParams?.map(
                  (row) => {
                    return (
                      <Row
                        row={row}
                        onItemDelete={itemDeleted}
                        onDescriptionUpdate={(item, value) => {
                          onDescriptionUpdate(item, value);
                        }}
                        onRequiredUpdate={(item, value) => {
                          onRequiredUpdate(item, value);
                        }}
                      />
                    );
                  }
                )}
              </TableBody>
            )}
        </Table>
      </TableContainer>

      {request && _.isEmpty(operationDetails?.operationRequest?.queryParams) && (
        <div className='border-dashed p-3 bg-neutral-gray7 rounded-md border-2 m-2 flex flex-row justify-center'>
          <DragAndDropMessage isAttributeAllowed />
        </div>
      )}

      {!request && _.isEmpty(operationDetails?.operationResponse?.queryParams) && (
        <div className='border-dashed p-3 bg-neutral-gray7 rounded-md border-2 m-2 flex flex-row justify-center'>
          <DragAndDropMessage isAttributeAllowed />
        </div>
      )}
    </DropArea>
  );
};

export default QueryParams;
