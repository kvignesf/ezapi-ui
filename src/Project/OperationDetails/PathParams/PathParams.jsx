import React, { useState, useCallback, useEffect } from "react";
import { useRecoilState, useGetRecoilValueInfo_UNSTABLE } from "recoil";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import _ from "lodash";
import debounce from "lodash.debounce";

import DropArea from "../DropArea";
import operationAtom from "../../operationAtom";
import {
  isAttribute,
  isSchema,
  isArray,
  isObject,
  useWindowSize,
  isColumn,
  useGetParentName,
} from "../../../shared/utils";
import DragAndDropMessage from "../../../shared/components/DragAndDropMessage";
import Row from "../Row";
import schemaAtom from "../../../shared/atom/schemaAtom";
import tableAtom from "../../../shared/atom/tableAtom";

const PathParams = ({ request }) => {
  const [operationDetails, setOperationDetails] = useRecoilState(operationAtom);
  const { height, width } = useWindowSize();
  const getRecoilValueInfo = useGetRecoilValueInfo_UNSTABLE();
  const { fetch: fetchParentName } = useGetParentName();

  const fetchParentSchemaName = () => {
    const { loadable: schemaAtomLoadable } = getRecoilValueInfo(schemaAtom);
    const schemaDetails = schemaAtomLoadable?.contents;

    if (
      schemaDetails &&
      schemaDetails?.selected &&
      !_.isEmpty(schemaDetails?.selected)
    ) {
      const value = schemaDetails?.selected
        ?.slice()
        ?.reverse()
        ?.find((item) => isSchema(item));

      return value?.name;
    }

    return null;
  };

  const fetchParentTableName = () => {
    const { loadable: tableAtomLoadable } = getRecoilValueInfo(tableAtom);
    const tableDetails = tableAtomLoadable?.contents;

    if (
      tableDetails &&
      tableDetails?.selected &&
      !_.isEmpty(tableDetails?.selected)
    ) {
      return tableDetails?.selected?.name;
    }
    return null;
  };

  const itemDropped = (item) => {
    if (
      (isAttribute(item) || isColumn(item)) &&
      !isArray(item) &&
      !isSchema(item) &&
      !isObject(item)
    ) {
      setOperationDetails((operationDetails) => {
        if (request) {
          if (
            !operationDetails.operationRequest.pathParams.find(
              (x) => x.name === item.name
            )
          ) {
            const newOperationDetails = _.cloneDeep(operationDetails);
            const clonedItem = _.cloneDeep(item);

            clonedItem.schemaName = fetchParentName(clonedItem) ?? "global";

            newOperationDetails.operationRequest.pathParams.push(clonedItem);
            return newOperationDetails;
          }
        } else {
          if (
            !operationDetails.operationResponse.pathParams.find(
              (x) => x.name === item.name
            )
          ) {
            const newOperationDetails = _.cloneDeep(operationDetails);
            const clonedItem = _.cloneDeep(item);

            clonedItem.schemaName = fetchParentName(clonedItem) ?? "global";
            newOperationDetails.operationResponse.pathParams.push(clonedItem);

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
          const index = operationDetails.operationRequest.pathParams.findIndex(
            (x) => x.name === item.name
          );

          if (index !== -1) {
            const newOperationDetails = _.cloneDeep(operationDetails);

            newOperationDetails.operationRequest.pathParams.splice(index, 1);

            return newOperationDetails;
          }
        } else {
          const index = operationDetails.operationResponse.pathParams.findIndex(
            (x) => x.name === item.name
          );

          if (index !== -1) {
            const newOperationDetails = _.cloneDeep(operationDetails);

            newOperationDetails.operationResponse.pathParams.splice(index, 1);

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
          let foundItem = operationDetails.operationRequest.pathParams.find(
            (x) => x.name === item.name
          );
          let foundItemIndex =
            operationDetails.operationRequest.pathParams.findIndex(
              (x) => x.name === item.name
            );

          if (foundItem) {
            const clonedFoundItem = _.cloneDeep(foundItem);
            const clonedOperationDetails = _.cloneDeep(operationDetails);

            clonedFoundItem.description = value;
            clonedOperationDetails.operationRequest.pathParams[foundItemIndex] =
              clonedFoundItem;

            return clonedOperationDetails;
          }
        } else {
          let foundItem = operationDetails.operationResponse.pathParams.find(
            (x) => x.name === item.name
          );
          let foundItemIndex =
            operationDetails.operationResponse.pathParams.findIndex(
              (x) => x.name === item.name
            );

          if (foundItem) {
            const clonedFoundItem = _.cloneDeep(foundItem);
            const clonedOperationDetails = _.cloneDeep(operationDetails);

            clonedFoundItem.description = value;
            clonedOperationDetails.operationResponse.pathParams[
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
      let foundItem = operationDetails.operationRequest.pathParams.find(
        (x) => x.name === item.name
      );
      let foundItemIndex =
        operationDetails.operationRequest.pathParams.findIndex(
          (x) => x.name === item.name
        );

      if (foundItem) {
        const clonedFoundItem = _.cloneDeep(foundItem);
        const clonedOperationDetails = _.cloneDeep(operationDetails);

        clonedFoundItem.required = value;
        clonedOperationDetails.operationRequest.pathParams[foundItemIndex] =
          clonedFoundItem;

        return clonedOperationDetails;
      }
      return operationDetails;
    });
  };

  return (
    <DropArea
      onItemDropped={(item) => {
        itemDropped(item);
      }}
    >
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
            !_.isEmpty(operationDetails?.operationRequest?.pathParams) && (
              <TableBody className='w-full max-h-6'>
                {operationDetails?.operationRequest?.pathParams?.map((row) => {
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
            !_.isEmpty(operationDetails?.operationResponse?.pathParams) && (
              <TableBody className='w-full max-h-6'>
                {operationDetails?.operationResponse?.pathParams?.map((row) => {
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
        </Table>
      </TableContainer>

      {request && _.isEmpty(operationDetails?.operationRequest?.pathParams) && (
        <div className='border-dashed p-3 bg-neutral-gray7 rounded-md border-2 m-2 flex flex-row justify-center'>
          <DragAndDropMessage isAttributeAllowed />
        </div>
      )}

      {!request && _.isEmpty(operationDetails?.operationResponse?.pathParams) && (
        <div className='border-dashed p-3 bg-neutral-gray7 rounded-md border-2 m-2 flex flex-row justify-center'>
          <DragAndDropMessage isAttributeAllowed />
        </div>
      )}
    </DropArea>
  );
};

export default PathParams;
