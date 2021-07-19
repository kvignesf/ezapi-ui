import React, { useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import _ from "lodash";
import { Field, ErrorMessage, Form, Formik } from "formik";
import { TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import * as Yup from "yup";

import operationAtom from "../operationAtom";
import AppIcon from "../../shared/components/AppIcon";
import { TextButton, PrimaryButton } from "../../shared/components/AppButton";
import { isDatabase } from "../../shared/utils";
import apiNameSchema from "../../shared/schemas/apiNameSchema";
import EnterKeyCaptureInput from "../../shared/components/EnterKeyCaptureInput";

const ChangeColumnName = ({
  labelItem,
  isNameTaken,
  renameColumn,
  onClose,
}) => {
  const formRef = useRef(null);
  const [error, setError] = useState(null);

  const onTableNameUpdate = ({ name }) => {
    if (isNameTaken(labelItem, name)) {
      setError("Table/Column with this name already exists");
      return;
    }
    renameColumn(labelItem, name);
  };

  return (
    <div
      className='flex flex-col'
      onClick={(e) => {
        e?.preventDefault();
        e?.stopPropagation();
      }}
    >
      <div className='flex flex-row p-4 justify-between border-b-1'>
        <p className='text-subtitle2'>Edit Column Name</p>
        <AppIcon
          onClick={(e) => {
            e?.preventDefault();
            e?.stopPropagation();

            onClose();
          }}
        >
          <CloseIcon />
        </AppIcon>
      </div>

      <div className='p-4'>
        <Formik
          initialValues={{
            name: labelItem?.name ?? "",
          }}
          validationSchema={Yup.object().shape({
            name: apiNameSchema("Column Name is required"),
          })}
          innerRef={formRef}
          onSubmit={onTableNameUpdate}
        >
          {({ errors, touched }) => (
            <Form>
              <EnterKeyCaptureInput />

              <Field
                id='name'
                name='name'
                fullWidth
                color='primary'
                variant='outlined'
                error={touched.name && Boolean(errors.name)}
                helperText={<ErrorMessage name='name' />}
                onKeyUp={(e) => {
                  if (error) {
                    setError(null);
                  }
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
      </div>

      {error && (
        <p className='text-overline2 text-accent-red m-4 mt-0'>{error}</p>
      )}

      <div className='border-t-1 p-4 flex flex-row justify-end'>
        <TextButton
          onClick={(e) => {
            e?.preventDefault();
            e?.stopPropagation();

            onClose();
          }}
        >
          Cancel
        </TextButton>
        <PrimaryButton
          onClick={(e) => {
            formRef.current.submitForm();
          }}
        >
          Save
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ChangeColumnName;
