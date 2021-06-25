import React, { useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Field, ErrorMessage, Form, Formik } from "formik";
import { Checkbox } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import _ from "lodash";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
  Dialog,
  Fade,
  makeStyles,
  Menu,
  MenuItem,
} from "@material-ui/core/index";

import AppIcon from "../../shared/components/AppIcon";
import Colors from "../../shared/colors";
import { isAttribute, isColumn } from "../../shared/utils";
import ChangeColumnName from "./ChangeColumnName";

const Row = ({
  row,
  onItemDelete,
  onDescriptionUpdate,
  onPossibleValuesUpdate,
  onRequiredUpdate,
  onNameUpdate,
}) => {
  const [isHovering, setHovering] = useState(false);
  const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = useState(false);
  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });

  const showColumnNameChangeDialog = () => {
    setDialog({
      show: true,
      type: "rename-column",
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
    <>
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby='column-dialog'
        open={dialog?.show ?? false}
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
        disableBackdropClick
      >
        {dialog?.type === "rename-column" && (
          <ChangeColumnName
            labelItem={row}
            renameColumn={(column, name) => {
              handleCloseDialog();
              onNameUpdate(column, name);
            }}
            onClose={handleCloseDialog}
          />
        )}
      </Dialog>

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
          <Checkbox
            checked={row?.required}
            onChange={(event) => {
              onRequiredUpdate(row, event?.target?.checked ?? false);
            }}
            style={{
              color: Colors.brand.secondary,
              padding: "0",
            }}
          />
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
            <>
              <AppIcon
                style={{ padding: "0px" }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (isAttribute(row)) {
                    onItemDelete(row);
                  } else if (isColumn(row)) {
                    handleOptionsClick(e);
                  }
                }}
              >
                {isAttribute(row) ? (
                  <DeleteIcon style={{ width: "20px", height: "20px" }} />
                ) : isColumn(row) ? (
                  <MoreVertIcon style={{ width: "20px", height: "20px" }} />
                ) : null}
              </AppIcon>

              <Menu
                id='row-menu'
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

                    showColumnNameChangeDialog();
                  }}
                >
                  <p className='text-overline2'>Rename</p>
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOptionsMenuAnchorEl(null);

                    onItemDelete(row);
                  }}
                >
                  <p className='text-overline2 text-accent-red'>Delete</p>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <div style={{ width: "20px", height: "21px" }}></div>
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
