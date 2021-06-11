import React, { useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { TextField } from "@material-ui/core";
import _ from "lodash";
import DeleteIcon from "@material-ui/icons/Delete";
import { Field, ErrorMessage, Form, Formik } from "formik";
import AppIcon from "../../shared/components/AppIcon";

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

      <TableCell align='left' style={{ width: "150px", padding: "0px" }}>
        {row?.required ? "Yes" : "No"}
      </TableCell>

      {onPossibleValuesUpdate && (
        <TableCell
          align='left'
          style={{
            width: "150px",
            padding: "0px",
            paddingTop: "4px",
            paddingBottom: "4px",
            paddingRight: "16px",
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
                  id='possibleValues'
                  name='possibleValues'
                  fullWidth
                  color='primary'
                  variant='outlined'
                  error={
                    touched.possibleValues && Boolean(errors.possibleValues)
                  }
                  helperText={<ErrorMessage name='possibleValues' />}
                  onKeyUp={(e) => {
                    const { value } = e.target;
                    onPossibleValuesUpdate(row, value);
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
      )}

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

export default Row;
