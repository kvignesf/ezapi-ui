import React, { useRef } from "react";
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

const ChangeColumnName = ({ labelItem, renameColumn, onClose }) => {
  const formRef = useRef(null);

  const onTableNameUpdate = ({ name }) => {
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
            name: Yup.string()
              .required("Please fill this field")
              .matches(
                `^(?=[a-zA-Z0-9-_]*$)`,
                "Only - and _ are allowed as special characters"
              ),
          })}
          innerRef={formRef}
          onSubmit={onTableNameUpdate}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                id='name'
                name='name'
                fullWidth
                color='primary'
                variant='outlined'
                error={touched.name && Boolean(errors.name)}
                helperText={<ErrorMessage name='name' />}
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
