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

import DropArea from "../DropArea";
import operationAtom from "../../operationAtom";
import {
  isAttribute,
  isSchema,
  isArray,
  useWindowSize,
} from "../../../shared/utils";
import AppIcon from "../../../shared/components/AppIcon";

const QueryParams = () => {
  let [operationDetails, setOperationDetails] = useRecoilState(operationAtom);
  const { height, width } = useWindowSize();

  const itemDropped = (item) => {
    if (isAttribute(item) && !isArray(item) && !isSchema(item)) {
      setOperationDetails((operationDetails) => {
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
        const index = operationDetails.operationRequest.queryParams.findIndex(
          (x) => x.name === item.name
        );

        if (index !== -1) {
          const newOperationDetails = _.cloneDeep(operationDetails);

          newOperationDetails.operationRequest.queryParams.splice(index, 1);

          return newOperationDetails;
        }

        return operationDetails;
      });
    }
  };

  const onDescriptionUpdate = useCallback(
    debounce((item, value) => {
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

          clonedFoundItem.description = value;
          clonedOperationDetails.operationRequest.queryParams[foundItemIndex] =
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

          {!_.isEmpty(operationDetails?.operationRequest?.queryParams) && (
            <TableBody className='w-full max-h-6'>
              {operationDetails?.operationRequest?.queryParams?.map((row) => {
                return (
                  <Row
                    row={row}
                    onItemDelete={itemDeleted}
                    onDescriptionUpdate={(item, value) => {
                      onDescriptionUpdate(item, value);
                    }}
                  />
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {_.isEmpty(operationDetails?.operationRequest?.queryParams) && (
        <div className='border-dashed p-3 bg-neutral-gray7 rounded-md border-2 m-2 flex flex-row justify-center'>
          <p className='text-overline3'>
            Drag and Drop
            <span className='text-brand-secondary ml-2'>Attribute</span> here
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
      <TableCell
        align='left'
        style={{ width: "150px", padding: "4px", paddingLeft: "8px" }}
      >
        {row.name}
      </TableCell>

      <TableCell align='left' style={{ width: "150px", padding: "0px" }}>
        {row.type}
      </TableCell>

      <TableCell
        align='left'
        style={{ width: "150px", padding: "0px", paddingRight: "16px" }}
      >
        <Formik
          initialValues={{
            description: row.description ?? "",
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                id='description'
                name='description'
                fullWidth
                color='primary'
                variant='outlined'
                error={touched.description && Boolean(errors.description)}
                helperText={<ErrorMessage name='description' />}
                onKeyUp={(e) => {
                  const { value } = e.target;
                  onDescriptionUpdate(row, value);
                }}
                inputProps={{
                  style: {
                    height: "6px",
                  },
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
        align='right'
        style={{ width: "20px", padding: "0px", paddingRight: "16px" }}
      >
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

export default QueryParams;
