import React, { useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
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
  useWindowSize,
  isObject,
  useParentSchemaNameFetcher,
} from "../../../shared/utils";
import DragAndDropMessage from "../../../shared/components/DragAndDropMessage";
import Row from "../Row";

const Headers = ({ request = true, responseCode }) => {
  let [operationData, setOperationDetails] = useRecoilState(operationAtom);
  const { height, width } = useWindowSize();

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
            !operationDetails.operationRequest.headers.find(
              (x) => x.name === item.name
            )
          ) {
            const newOperationDetails = _.cloneDeep(operationDetails);
            const clonedItem = _.cloneDeep(item);

            newOperationDetails.operationRequest.headers.push(clonedItem);

            return newOperationDetails;
          }
          return operationDetails;
        } else {
          const responseData = getResponseData(operationDetails);
          const responseIndex = getResponseIndex(operationDetails);

          const existingHeaderIndex = responseData?.headers?.findIndex(
            (header) => header.name === item.name
          );

          if (
            existingHeaderIndex === -1 &&
            responseData &&
            responseIndex >= 0
          ) {
            const clonedOperationDetails = _.cloneDeep(operationDetails);
            const clonedResponseData = _.cloneDeep(responseData);
            const clonedItem = _.cloneDeep(item);

            clonedResponseData.headers.push(clonedItem);

            clonedOperationDetails.operationResponse[responseIndex] =
              clonedResponseData;

            return clonedOperationDetails;
          }

          return operationDetails;
        }
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
          const index = operationDetails.operationRequest.headers.findIndex(
            (x) => x.name === item.name
          );

          if (index !== -1) {
            const newOperationDetails = _.cloneDeep(operationDetails);

            newOperationDetails.operationRequest.headers.splice(index, 1);

            return newOperationDetails;
          }

          return operationDetails;
        } else {
          const responseData = getResponseData(operationDetails);
          const responseIndex = getResponseIndex(operationDetails);
          const headerIndex = responseData.headers.findIndex(
            (header) => header.name === item.name
          );

          if (responseData && responseIndex >= 0) {
            const clonedOperationDetails = _.cloneDeep(operationDetails);
            const clonedResponseData = _.cloneDeep(responseData);

            clonedResponseData.headers.splice(headerIndex, 1);
            clonedOperationDetails.operationResponse[responseIndex] =
              clonedResponseData;

            return clonedOperationDetails;
          }

          return operationDetails;
        }
      });
    }
  };

  const onDescriptionUpdate = useCallback(
    debounce((item, value) => {
      setOperationDetails((operationDetails) => {
        if (request) {
          let foundItem = operationDetails.operationRequest.headers.find(
            (x) => x.name === item.name
          );
          let foundItemIndex =
            operationDetails.operationRequest.headers.findIndex(
              (x) => x.name === item.name
            );

          if (foundItem) {
            const clonedFoundItem = _.cloneDeep(foundItem);
            const clonedOperationDetails = _.cloneDeep(operationDetails);

            clonedFoundItem.description = value;
            clonedOperationDetails.operationRequest.headers[foundItemIndex] =
              clonedFoundItem;

            return clonedOperationDetails;
          }
        } else {
          const responseData = getResponseData(operationDetails);
          const responseIndex = getResponseIndex(operationDetails);

          let foundItem = responseData.headers.find(
            (x) => x.name === item.name
          );
          let foundItemIndex = responseData.headers.findIndex(
            (x) => x.name === item.name
          );

          if (foundItem) {
            const clonedFoundItem = _.cloneDeep(foundItem);
            const clonedOperationDetails = _.cloneDeep(operationDetails);
            const clonedResponseData = _.cloneDeep(responseData);

            clonedFoundItem.description = value;
            clonedResponseData.headers[foundItemIndex] = clonedFoundItem;

            clonedOperationDetails.operationResponse[responseIndex] =
              clonedResponseData;

            return clonedOperationDetails;
          }
        }
        return operationDetails;
      });
    }, 300),
    [] // will be created only once initially
  );

  const onPossibleValuesUpdate = useCallback(
    debounce((item, value) => {
      setOperationDetails((operationDetails) => {
        if (request) {
          let foundItem = operationDetails.operationRequest.headers.find(
            (x) => x.name === item.name
          );
          let foundItemIndex =
            operationDetails.operationRequest.headers.findIndex(
              (x) => x.name === item.name
            );

          if (foundItem) {
            const clonedFoundItem = _.cloneDeep(foundItem);
            const clonedOperationDetails = _.cloneDeep(operationDetails);

            clonedFoundItem.possibleValues = value;
            clonedOperationDetails.operationRequest.headers[foundItemIndex] =
              clonedFoundItem;

            return clonedOperationDetails;
          }
        } else {
          const responseData = getResponseData(operationDetails);
          const responseIndex = getResponseIndex(operationDetails);

          let foundItem = responseData.headers.find(
            (x) => x.name === item.name
          );
          let foundItemIndex = responseData.headers.findIndex(
            (x) => x.name === item.name
          );

          if (foundItem) {
            const clonedFoundItem = _.cloneDeep(foundItem);
            const clonedOperationDetails = _.cloneDeep(operationDetails);
            const clonedResponseData = _.cloneDeep(responseData);

            clonedFoundItem.possibleValues = value;
            clonedResponseData.headers[foundItemIndex] = clonedFoundItem;

            clonedOperationDetails.operationResponse[responseIndex] =
              clonedResponseData;

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
      if (request) {
        let foundItem = operationDetails.operationRequest.headers.find(
          (x) => x.name === item.name
        );
        let foundItemIndex =
          operationDetails.operationRequest.headers.findIndex(
            (x) => x.name === item.name
          );

        if (foundItem) {
          const clonedFoundItem = _.cloneDeep(foundItem);
          const clonedOperationDetails = _.cloneDeep(operationDetails);

          clonedFoundItem.required = value;
          clonedOperationDetails.operationRequest.headers[foundItemIndex] =
            clonedFoundItem;

          return clonedOperationDetails;
        }
      } else {
        const responseData = getResponseData(operationDetails);
        const responseIndex = getResponseIndex(operationDetails);

        let foundItem = responseData.headers.find((x) => x.name === item.name);
        let foundItemIndex = responseData.headers.findIndex(
          (x) => x.name === item.name
        );

        if (foundItem) {
          const clonedFoundItem = _.cloneDeep(foundItem);
          const clonedOperationDetails = _.cloneDeep(operationDetails);
          const clonedResponseData = _.cloneDeep(responseData);

          clonedFoundItem.required = value;

          clonedResponseData.headers[foundItemIndex] = clonedFoundItem;
          clonedOperationDetails.operationResponse[responseIndex] =
            clonedResponseData;

          return clonedOperationDetails;
        }
      }
      return operationDetails;
    });
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
              <TableCell align='left' style={{ padding: "0" }}>
                <p className='text-overline2 text-neutral-gray4'>
                  POSSIBLE VALUES
                </p>
              </TableCell>
              <TableCell align='left' style={{ padding: "0" }}></TableCell>
            </TableRow>
          </TableHead>

          {request && !_.isEmpty(operationData?.operationRequest?.headers) && (
            <TableBody className='w-full max-h-6'>
              {operationData?.operationRequest?.headers?.map((row) => {
                return (
                  <Row
                    key={row?.name}
                    row={row}
                    onItemDelete={itemDeleted}
                    onDescriptionUpdate={(item, value) => {
                      onDescriptionUpdate(item, value);
                    }}
                    onPossibleValuesUpdate={(item, value) => {
                      onPossibleValuesUpdate(item, value);
                    }}
                    onRequiredUpdate={(item, value) => {
                      onRequiredUpdate(item, value);
                    }}
                  />
                );
              })}
            </TableBody>
          )}

          {!request && !_.isEmpty(getResponseData(operationData).headers) && (
            <TableBody className='w-full max-h-6'>
              {getResponseData(operationData).headers?.map((row) => {
                return (
                  <Row
                    key={row?.name}
                    row={row}
                    onItemDelete={itemDeleted}
                    onDescriptionUpdate={(item, value) => {
                      onDescriptionUpdate(item, value);
                    }}
                    onPossibleValuesUpdate={(item, value) => {
                      onPossibleValuesUpdate(item, value);
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

      {request && _.isEmpty(operationData?.operationRequest?.headers) && (
        <div className='border-dashed p-3 bg-neutral-gray7 rounded-md border-2 m-2 flex flex-row justify-center'>
          <DragAndDropMessage isAttributeAllowed />
        </div>
      )}

      {!request && _.isEmpty(getResponseData(operationData)?.headers) && (
        <div className='border-dashed p-3 bg-neutral-gray7 rounded-md border-2 m-2 flex flex-row justify-center'>
          <DragAndDropMessage isAttributeAllowed />
        </div>
      )}
    </DropArea>
  );
};

export default Headers;
