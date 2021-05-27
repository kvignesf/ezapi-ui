import React, { useState, useCallback } from "react";
import { Droppable } from "react-drag-and-drop";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles, TextField } from "@material-ui/core";
import _ from "lodash";
import produce from "immer";
import ReactHoverObserver from "react-hover-observer";
import DeleteIcon from "@material-ui/icons/Delete";
import { Field, ErrorMessage, Form, Formik } from "formik";
import debounce from "lodash.debounce";

import DropArea from "../DropArea";
import operationAtom from "../../operationAtom";
import { isAttribute, isSchema, isArray } from "../../../shared/utils";
import AppIcon from "../../../shared/components/AppIcon";

const Headers = () => {
  let [operationDetails, setOperationDetails] = useRecoilState(operationAtom);

  const itemDropped = (item) => {
    if (isAttribute(item) && !isArray(item) && !isSchema(item)) {
      setOperationDetails((operationDetails) => {
        if (
          !operationDetails.operationRequest.headers.find(
            (x) => x.name === item.name
          )
        ) {
          const newOperationDetails = _.cloneDeep(operationDetails);

          newOperationDetails.operationRequest.headers.push({
            name: item?.name,
            type: item?.type,
            required: item?.required,
            description: item?.description,
            possibleValues: item?.possibleValues,
          });

          return newOperationDetails;
        }
        return operationDetails;
      });
    }
  };

  const itemDeleted = (item) => {
    if (isAttribute(item) && !isArray(item) && !isSchema(item)) {
      setOperationDetails((operationDetails) => {
        const index = operationDetails.operationRequest.headers.findIndex(
          (x) => x.name === item.name
        );

        if (index !== -1) {
          const newOperationDetails = _.cloneDeep(operationDetails);

          newOperationDetails.operationRequest.headers.splice(index, 1);

          return newOperationDetails;
        }

        return operationDetails;
      });
    }
  };

  const onDescriptionUpdate = useCallback(
    debounce((item, value) => {
      setOperationDetails((operationDetails) => {
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

        return operationDetails;
      });
    }, 300),
    [] // will be created only once initially
  );

  const onPossibleValuesUpdate = useCallback(
    debounce((item, value) => {
      setOperationDetails((operationDetails) => {
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

        return operationDetails;
      });
    }, 300),
    [] // will be created only once initially
  );

  return (
    <DropArea onItemDropped={itemDropped}>
      <TableContainer>
        <Table aria-label='simple table' className='border-t-2 border-b-2'>
          <TableHead className='border-t-2 border-b-2'>
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

          {!_.isEmpty(operationDetails?.operationRequest?.headers) && (
            <TableBody className='w-full'>
              {operationDetails?.operationRequest?.headers?.map((row) => {
                return (
                  <Row
                    row={row}
                    onItemDelete={itemDeleted}
                    onDescriptionUpdate={(item, value) => {
                      onDescriptionUpdate(item, value);
                    }}
                    onPossibleValuesUpdate={(item, value) => {
                      onPossibleValuesUpdate(item, value);
                    }}
                  />
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {_.isEmpty(operationDetails?.operationRequest?.headers) && (
        <div className='border-dashed p-3 bg-neutral-gray7 rounded-md border-2 m-2 flex flex-row justify-center'>
          <p className='text-overline3'>
            Drag and Drop <span className='text-brand-primary'>Schema</span> or
            <span className='text-brand-secondary'>Attribute</span> here
          </p>
        </div>
      )}
    </DropArea>
  );
};

const Row = ({
  row,
  onItemDelete,
  onDescriptionUpdate,
  onPossibleValuesUpdate,
}) => {
  const [isHovering, setHovering] = useState(false);

  return (
    <TableRow
      key={row.name}
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
    >
      <TableCell align='left' style={{ width: "150px", padding: "8px" }}>
        {row.name}
      </TableCell>
      <TableCell align='left' style={{ width: "150px", padding: "0px" }}>
        {row.type}
      </TableCell>
      <TableCell align='left' style={{ width: "150px", padding: "0px" }}>
        <Formik
          initialValues={{
            name: row.description ?? "",
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                id='name'
                name='name'
                fullWidth
                color='primary'
                error={touched.name && Boolean(errors.name)}
                helperText={<ErrorMessage name='name' />}
                onKeyUp={(e) => {
                  const { value } = e.target;
                  onDescriptionUpdate(row, value);
                }}
                as={TextField}
              />
            </Form>
          )}
        </Formik>
      </TableCell>
      <TableCell
        align='left'
        style={{ width: "150px", padding: "0px" }}
      ></TableCell>
      <TableCell
        align='left'
        style={{
          width: "150px",
          padding: "0px",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        <Formik
          initialValues={{
            possibleValues: row.possibleValues ?? "",
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                id='name'
                name='name'
                fullWidth
                color='primary'
                error={touched.name && Boolean(errors.name)}
                helperText={<ErrorMessage name='name' />}
                onKeyUp={(e) => {
                  const { value } = e.target;
                  onPossibleValuesUpdate(row, value);
                }}
                as={TextField}
              />
            </Form>
          )}
        </Formik>
      </TableCell>
      <TableCell align='center' style={{ width: "150px", padding: "0px" }}>
        {isHovering ? (
          <AppIcon
            style={{ padding: "0px" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onItemDelete(row);
            }}
          >
            <DeleteIcon style={{ width: "20px", height: "20px" }} />
          </AppIcon>
        ) : (
          <div style={{ width: "20px", height: "21px" }}></div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default Headers;
