import React, { useRef, useState } from "react";
import { useGetRecoilValueInfo_UNSTABLE, useSetRecoilState } from "recoil";
import _ from "lodash";
import { Field, ErrorMessage, Form, Formik } from "formik";
import { TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import * as Yup from "yup";

import AppIcon from "../../../shared/components/AppIcon";
import {
  TextButton,
  PrimaryButton,
} from "../../../shared/components/AppButton";
import { operationAtomWithMiddleware } from "../../../shared/utils";
import apiNameSchema from "../../../shared/schemas/apiNameSchema";
import EnterKeyCaptureInput from "../../../shared/components/EnterKeyCaptureInput";
import Messages from "../../../shared/messages";

const ChangeNameInsideArray = ({
  labelItem,
  request,
  responseCode,
  onClose,
  array,
  isColumn = false,
}) => {
  const formRef = useRef(null);
  const setOperationDetails = useSetRecoilState(operationAtomWithMiddleware);
  const getRecoilValueInfo = useGetRecoilValueInfo_UNSTABLE();
  const [error, setError] = useState(null);

  const isNameAlreadyExisting = (name) => {
    const { loadable: operationAtom } = getRecoilValueInfo(
      operationAtomWithMiddleware
    );

    const operationDetails = operationAtom?.contents;
    let nameExists = false;
    const newOperationDetails = _.cloneDeep(operationDetails);
    let data = request
      ? newOperationDetails.operationRequest
      : newOperationDetails.operationResponse;

    let responseData;
    if (request) {
      responseData = data;
    } else {
      const responseIndex = data?.findIndex(
        (item) => item.responseCode === responseCode
      );
      responseData = data[responseIndex];
    }

    const arrayIndex = responseData?.body?.findIndex(
      (body) => body.name === array.name
    );

    const obj = responseData.body[arrayIndex].items?.properties;
    let size = Object.keys(obj).length;

    for (let i = 0; i < size; i++) {
      if (Object.keys(obj)[i] === name) {
        nameExists = true;
      }
    }
    return nameExists;
  };

  const onTableNameUpdate = ({ name }) => {
    if (isNameAlreadyExisting(name)) {
      setError(Messages.TABLE_COLUMN_EXISTS);

      return;
    }

    setOperationDetails((operationDetails) => {
      const newOperationDetails = _.cloneDeep(operationDetails);
      let data = request
        ? newOperationDetails.operationRequest
        : newOperationDetails.operationResponse;

      let responseData;
      if (request) {
        responseData = data;
      } else {
        const responseIndex = data?.findIndex(
          (item) => item.responseCode === responseCode
        );
        responseData = data[responseIndex];
      }

      const arrayIndex = responseData?.body?.findIndex(
        (body) => body.name === array.name
      );

      const clonedTableData = _.cloneDeep(labelItem);
      clonedTableData.name = name;

      responseData.body[arrayIndex].items.properties[name] = clonedTableData;
      delete responseData.body[arrayIndex].items.properties[labelItem.name];
      return newOperationDetails;
    });
    onClose();
  };

  return (
    <div
      className="flex flex-col"
      onClick={(e) => {
        e?.preventDefault();
        e?.stopPropagation();
      }}
    >
      <div className="flex flex-row p-4 justify-between border-b-1">
        {isColumn ? (
          <p className="text-subtitle2">Edit Column Name</p>
        ) : (
          <p className="text-subtitle2">Edit Table Name</p>
        )}
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

      <div className="p-4">
        <Formik
          initialValues={{
            name: labelItem?.name ?? "",
          }}
          validationSchema={Yup.object().shape({
            name: apiNameSchema(Messages.NAME_REQUIRED),
          })}
          innerRef={formRef}
          onSubmit={onTableNameUpdate}
        >
          {({
            errors,
            touched,
            values,
            handleBlur,
            validateForm,
            setErrors,
            submitForm,
          }) => (
            <Form
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  handleBlur(e);
                  const errors = await validateForm(values);

                  if (!_.isEmpty(errors)) {
                    setErrors(errors);
                  } else {
                    submitForm();
                  }

                  e.preventDefault();
                }
              }}
            >
              <EnterKeyCaptureInput />

              <Field
                id="name"
                name="name"
                fullWidth
                color="primary"
                variant="outlined"
                error={touched.name && Boolean(errors.name)}
                helperText={<ErrorMessage name="name" />}
                onKeyUp={(event) => {
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
        <p className="text-overline2 text-accent-red m-4 mt-0">{error}</p>
      )}

      <div className="border-t-1 p-4 flex flex-row justify-end">
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

export default ChangeNameInsideArray;
