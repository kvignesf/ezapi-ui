import React, { useRef } from "react";
import { useSetRecoilState } from "recoil";
import _ from "lodash";
import { Field, ErrorMessage, Form, Formik } from "formik";
import { TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import * as Yup from "yup";

import operationAtom from "../../operationAtom";
import AppIcon from "../../../shared/components/AppIcon";
import {
  TextButton,
  PrimaryButton,
} from "../../../shared/components/AppButton";

const ChangeTableName = ({ labelItem, request, responseCode, onClose }) => {
  const formRef = useRef(null);
  const setOperationDetails = useSetRecoilState(operationAtom);

  const onTableNameUpdate = ({ name }) => {
    setOperationDetails((operationDetails) => {
      if (request) {
        const index = operationDetails.operationRequest.body.findIndex(
          (x) => x.name === labelItem?.name
        );
        if (index !== -1) {
          const newOperationDetails = _.cloneDeep(operationDetails);
          const clonedTableData = _.cloneDeep(labelItem);

          clonedTableData.customName = name;
          newOperationDetails.operationRequest.body[index] = clonedTableData;

          return newOperationDetails;
        }
      } else {
        const responseData = operationDetails?.operationResponse?.find(
          (item) => item.responseCode === responseCode
        );
        const responseIndex = operationDetails?.operationResponse?.findIndex(
          (item) => item.responseCode === responseCode
        );

        const existingBodyIndex = responseData?.body?.findIndex(
          (body) => body.name === labelItem.name
        );

        if (existingBodyIndex >= 0 && responseData && responseIndex >= 0) {
          const clonedOperationDetails = _.cloneDeep(operationDetails);
          const clonedResponseData = _.cloneDeep(responseData);
          const clonedTableData = _.cloneDeep(labelItem);

          clonedTableData.customName = name;
          clonedResponseData.body[existingBodyIndex] = clonedTableData;

          clonedOperationDetails.operationResponse[responseIndex] =
            clonedResponseData;

          return clonedOperationDetails;
        }
      }

      return operationDetails;
    });
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
        <p className='text-subtitle2'>Edit Table Name</p>
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
            name: labelItem?.customName ?? labelItem?.name ?? "",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required("Please fill this field"),
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

export default ChangeTableName;
