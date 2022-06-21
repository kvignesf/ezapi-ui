import React, { useRef, useState } from "react";
import { useParams } from "react-router";
import CloseIcon from "@material-ui/icons/Close";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import AddIcon from "@material-ui/icons/Add";
import {
  CircularProgress,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@material-ui/core";
import { useRecoilState } from "recoil";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import AppIcon from "../../../../shared/components/AppIcon";
import {
  useAddCustomParameter,
  useEditCustomParameter,
} from "./modifyCustomParameterQueries";
import addCustomParameterSchema from "./customParameterSchema";
import TabLabel from "../../../../shared/components/TabLabel";
import Constants from "../../../../shared/constants";
import {
  PrimaryButton,
  TextButton,
} from "../../../../shared/components/AppButton";
import tablesDataAtom from "../../../../shared/atom/tablesDataAtom";
import { useEffect } from "react";
import Colors from "../../../../shared/colors";

const AddOrEditCustomParameter = ({ parameter, onClose }) => {
  const formRef = useRef(null);
  const { projectId } = useParams();
  const [currentTab, setTab] = useState(0);
  const [tablesDataState, setTablesDataState] = useRecoilState(tablesDataAtom);
  const [columns, setColumns] = useState([]);
  const initialFilters = {
    filters: parameter?.filters ?? [
      {
        columnName: "",
        conditionKey: "",
        value: "",
      },
    ],
  }

  const temp = {
    columnName: "",
    conditionKey: "",
    value: "",
  }

  useEffect(() => {
    if (parameter?.tableName) {
      let table = tablesDataState.find(
        (item) => item.name === parameter?.tableName
      );
    
      setColumns(table.selectedColumns);
    }
  }, [parameter, tablesDataState])

  const {
    isLoading: isAddingCustomParameter,
    isSuccess: isAddSuccess,
    error: addCustomParamError,
    mutate: addCustomParam,
    reset: resetAddCustomParam,
  } = useAddCustomParameter();



  const {
    isLoading: isEditingCustomParameter,
    isSuccess: isEditCustomSuccess,
    error: editCustomParamError,
    mutate: editCustomParam,
    reset: resetEditCustomParam,
  } = useEditCustomParameter();

  // const debouncedSetType = useCallback(
  //   debounce((nextValue) => {
  //     resetMutationState();

  //     setProjectDetails((currProjectDetails) => {
  //       return {
  //         ...currProjectDetails,
  //         type: nextValue,
  //       };
  //     });
  //   }, 300),
  //   [] // will be created only once initially
  // );

  const handleSubmit = (values) => {
    if (parameter) {
      editCustomParam({
        projectId,
        id: parameter?.id,
        ...values,
      });
      return;
    }
    addCustomParam({
      projectId,
      ...values,
    });

    
  };

  const resetMutationState = () => {
    if (parameter) {
      if (
        isEditingCustomParameter ||
        isEditCustomSuccess ||
        editCustomParamError
      ) {
        resetEditCustomParam();
      }
      return;
    }

    if (isAddingCustomParameter || isAddSuccess || addCustomParamError) {
      resetAddCustomParam();
    }
  };

  if (isAddSuccess || isEditCustomSuccess) {
    onClose();
    return null;
  }

  const handleNext = () => {

   
    if (formRef.current?.values) {
      const { name, type } = formRef.current?.values;

      if (name.length === 0 || type.length === 0)
        formRef.current.validateForm();
      else if (name && type && currentTab !== 2) setTab(currentTab + 1);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="p-4 flex flex-row justify-between border-b-1">
        <p className="text-subtitle1">
          {parameter ? "Edit Parameter" : "Add Parameter"}
        </p>
        {!isAddingCustomParameter && !isEditCustomSuccess && (
          <AppIcon
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              onClose();
            }}
          >
            <CloseIcon />
          </AppIcon>
        )}
      </div>
      <div>
        <Tabs
          value={currentTab}
          onChange={(_, index) => {
            setTab(index);
          }}
          aria-label="add custom parameter tabs"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            label={<TabLabel label={"Naming"} />}
            style={{ outline: "none", border: "none" }}
          />
          <Tab
            label={<TabLabel label={"Result"} />}
            style={{ outline: "none", border: "none" }}
          />
          <Tab
            label={<TabLabel label={"Filter"} />}
            style={{ outline: "none", border: "none" }}
          />
        </Tabs>

        <div className="p-4">
          {currentTab === 0 ? (
            <div className="h-80">
              <Formik
                initialValues={{
                  name: parameter?.name ?? "",
                  type: parameter?.type ?? "",
                  tableName: parameter?.tableName ?? "",
                  columnName: parameter?.columnName ?? "",
                  functionName: parameter?.functionName ?? "",
                  filters: parameter?.filters ?? initialFilters.filters
                }}
                validationSchema={addCustomParameterSchema}
                innerRef={formRef}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, values, handleChange, handleBlur }) => (
                  <Form>
                    <div className="mb-4">
                      <p className="text-overline2 mb-2">Attribute Name</p>
                      <Field
                        id="name"
                        name="name"
                        style={{ height: "48px" }}
                        fullWidth
                        color="primary"
                        variant="outlined"
                        disabled={
                          isAddingCustomParameter || isEditingCustomParameter
                        }
                        error={touched.name && Boolean(errors.name)}
                        helperText={<ErrorMessage name="attribute" />}
                        onKeyUp={(e) => {
                          resetMutationState();
                        }}
                        inputProps={{
                          style: {
                            height: "6px",
                          },
                        }}
                        as={TextField}
                      />
                      {errors?.name && (
                        <p
                          className="py-1"
                          style={{
                            fontSize: "0.75rem",
                            marginLeft: "1rem",
                            color: "#f44336",
                          }}
                        >
                          {errors?.name}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-overline2 mb-2">Type</p>
                      <Field
                        id="type"
                        name="type"
                        style={{ height: "48px" }}
                        fullWidth
                        color="primary"
                        variant="outlined"
                        disabled={
                          isAddingCustomParameter || isEditingCustomParameter
                        }
                        error={touched.type && Boolean(errors.type)}
                        helperText={<ErrorMessage name="type" />}
                        onKeyUp={(e) => {
                          resetMutationState();
                        }}
                        handleChange={(e) => {
                          handleChange(e);
                        }}
                        as={(value) => {
                          return (
                            <div className="flex flex-col">
                              <Select
                                labelId="label type"
                                id="type ID"
                                variant="outlined"
                                className="w-full"
                                {...value}
                              >
                                {Constants.customParameterDataTypes.map(
                                  (type) => {
                                    var upCaseType =
                                      type.charAt(0).toUpperCase() +
                                      type.slice(1);
                                    return (
                                      <MenuItem value={type}>
                                        {upCaseType}
                                      </MenuItem>
                                    );
                                  }
                                )}
                              </Select>
                              {value?.error && (
                                <p
                                  className="py-1"
                                  style={{
                                    fontSize: "0.75rem",
                                    marginLeft: "1rem",
                                    color: "#f44336",
                                  }}
                                >
                                  {errors?.type}
                                </p>
                              )}
                            </div>
                          );
                        }}
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          ) : currentTab === 1 ? (
            <div className="h-80">
              <Formik
                initialValues={{
                  name: parameter?.name ?? "",
                  type: parameter?.type ?? "",
                  tableName: parameter?.tableName ?? "",
                  columnName: parameter?.columnName ?? "",
                  functionName: parameter?.functionName ?? "",
                  filters: parameter?.filters ?? initialFilters.filters
                }}
                validationSchema={addCustomParameterSchema}
                innerRef={formRef}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, values, handleChange, handleBlur }) => (
                  <Form>
                    <div className="mb-4">
                      <p className="text-overline2 mb-2">Table Name</p>
                      <Field
                        id="tableName"
                        name="tableName"
                        style={{ height: "48px" }}
                        fullWidth
                        color="primary"
                        variant="outlined"
                        disabled={
                          isAddingCustomParameter || isEditingCustomParameter
                        }
                        error={touched.tableName && Boolean(errors.tableName)}
                        helperText={<ErrorMessage name="tableName" />}
                        onKeyUp={(e) => {
                          resetMutationState();
                        }}
                        onChange={(e) => {
                          handleChange(e);
                          let tableName = e.target.value;
                         
                          let table = tablesDataState.find(
                            (item) => item.name === tableName
                          );
                         
                          setColumns(table.selectedColumns);
                        }}
                        as={(value) => {
                          return (
                            <div className="flex flex-col">
                              <Select
                                labelId="label tableName"
                                id="tableName"
                                variant="outlined"
                                className="w-full"
                                {...value}
                              >
                                {tablesDataState?.map((table) => {
                                  return (
                                    <MenuItem value={table.name}>
                                      {table.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                              {value?.error && (
                                <p
                                  className="py-1"
                                  style={{
                                    fontSize: "0.75rem",
                                    marginLeft: "1rem",
                                    color: "#f44336",
                                  }}
                                >
                                  {errors?.tableName}
                                </p>
                              )}
                            </div>
                          );
                        }}
                      />
                    </div>
                    <div className="mb-4">
                      <p className="text-overline2 mb-2">Column Name</p>
                      <Field
                        id="columnName"
                        name="columnName"
                        style={{ height: "48px" }}
                        fullWidth
                        color="primary"
                        variant="outlined"
                        disabled={
                          isAddingCustomParameter || isEditingCustomParameter
                        }
                        error={touched.columnName && Boolean(errors.columnName)}
                        helperText={<ErrorMessage name="columnName" />}
                        onKeyUp={(e) => {
                          resetMutationState();
                        }}
                        as={(value) => {
                          return (
                            <div className="flex flex-col">
                              <Select
                                labelId="columnName"
                                id="columnName"
                                variant="outlined"
                                className="w-full"
                                {...value}
                              >
                                {columns.map((column) => {
                                  return (
                                    <MenuItem value={column.name}>
                                      {column.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                              {value?.error && (
                                <p
                                  className="py-1"
                                  style={{
                                    fontSize: "0.75rem",
                                    marginLeft: "1rem",
                                    color: "#f44336",
                                  }}
                                >
                                  {errors?.columnName}
                                </p>
                              )}
                            </div>
                          );
                        }}
                      />
                    </div>
                    <div className="mb-4">
                      <p className="text-overline2 mb-2">Function</p>
                      <Field
                        id="functionName"
                        name="functionName"
                        style={{ height: "48px" }}
                        fullWidth
                        color="primary"
                        variant="outlined"
                        disabled={
                          isAddingCustomParameter || isEditingCustomParameter
                        }
                        error={
                          touched.functionName && Boolean(errors.functionName)
                        }
                        helperText={<ErrorMessage name="attribute" />}
                        onKeyUp={(e) => {
                          resetMutationState();
                        }}
                        inputProps={{
                          style: {
                            height: "6px",
                          },
                        }}
                        as={(value) => {
                          return (
                            <div className="flex flex-col">
                              <Select
                                labelId="functionName-label"
                                id="functionName-select"
                                variant="outlined"
                                className="w-full"
                                {...value}
                              >
                                {formRef.current?.values?.type &&
                                  Constants.customParameterFunctionTypes[formRef.current?.values?.type]
                                    .map((type) => {
                                      var upCaseType =
                                        type.charAt(0).toUpperCase() +
                                        type.slice(1);
                                      return (
                                        <MenuItem value={type}>
                                          {upCaseType}
                                        </MenuItem>
                                      );
                                    })}
                              </Select>
                              {value?.error && (
                                <p
                                  className="py-1"
                                  style={{
                                    fontSize: "0.75rem",
                                    marginLeft: "1rem",
                                    color: "#f44336",
                                  }}
                                >
                                  {errors?.functionName}
                                </p>
                              )}
                            </div>
                          );
                        }}
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          ) : (
            <div className="h-80 overflow-auto">
              <Formik
                initialValues={{
                  name: parameter?.name ?? "",
                  type: parameter?.type ?? "",
                  tableName: parameter?.tableName ?? "",
                  columnName: parameter?.columnName ?? "",
                  functionName: parameter?.functionName ?? "",
                  filters: parameter?.filters ?? initialFilters.filters
                }}
                validationSchema={addCustomParameterSchema}
                innerRef={formRef}
                enableReinitialize={false}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, values, handleChange, handleBlur }) => (
                  <Form>
                    <div className="mb-4">
                      <div className="flex flex-row ml-6">
                        <div>Where</div>
                        <div className="w-full ml-6 mr-14">
                          <p className="text-overline2 mb-2">Table Name</p>
                          <Field
                            id="tableName"
                            name="tableName"
                            style={{ height: "48px" }}
                            fullWidth
                            color="primary"
                            variant="outlined"
                            disabled={true}
                            inputProps={{
                              style: {
                                height: "6px",
                              },
                            }}
                            as={TextField}
                          />
                        </div>
                        {/* <div className='ml-5'>
                        <AppIcon
                            style={{ padding: "0px" }}
                          >
                            <MoreVertIcon
                              style={{ width: "20px", height: "min-content" }}
                            />
                        </AppIcon>
                       </div> */}
                      </div>
                      <FieldArray name="filters">
                        {({ remove, push }) => (
                          <>
                            <div>
                              {values.filters &&
                                values.filters.length > 0 &&
                                values.filters.map((filter, index) => (
                                  <div key={index} className="ml-24 mr-14 mts-2">
                                    <div className="mb-4">
                                      <p className="text-overline2 mb-1">
                                        Column Name
                                      </p>
                                      <Field
                                        id={`filters.${index}.columnName`}
                                        name={`filters.${index}.columnName`}
                                        style={{ height: "48px" }}
                                        fullWidth
                                        handleChange={handleChange}
                                        color="primary"
                                        variant="outlined"
                                        disabled={
                                          isAddingCustomParameter ||
                                          isEditingCustomParameter
                                        }
                                        error={
                                          touched.columnName &&
                                          Boolean(errors.columnName)
                                        }
                                        helperText={
                                          <ErrorMessage name="columnName" />
                                        }
                                        onKeyUp={(e) => {
                                          resetMutationState();
                                        }}
                                        as={(value) => {
                                          return (
                                            <div className="flex flex-col">
                                              <Select
                                                labelId={`filters.${index}.columnName`}
                                                id={`filters.${index}.columnName`}
                                                variant="outlined"
                                                className="w-full"
                                                {...value}
                                              >
                                                {columns.map((column) => {
                                                  return (
                                                    <MenuItem
                                                      value={column.name}
                                                    >
                                                      {column.name}
                                                    </MenuItem>
                                                  );
                                                })}
                                              </Select>
                                              {value?.error && (
                                                <p
                                                  className="py-1"
                                                  style={{
                                                    fontSize: "0.75rem",
                                                    marginLeft: "1rem",
                                                    color: "#f44336",
                                                  }}
                                                >
                                                  {errors?.columnName}
                                                </p>
                                              )}
                                            </div>
                                          );
                                        }}
                                      />
                                    </div>
                                    <div className="flex flex-row">
                                      <div className="mr-4">
                                        <p className="text-overline2 mb-1">Condition Key</p>
                                        <Field
                                          id={`filters.${index}.conditionKey`}
                                          name={`filters.${index}.conditionKey`}
                                          style={{ height: "44px" }}
                                          fullWidth
                                          color="primary"
                                          variant="outlined"
                                          handleChange={handleChange}
                                          // disabled={isAddingCustomParameter || isEditingCustomParameter}
                                          // error={touched.name && Boolean(errors.name)}
                                          helperText={
                                            <ErrorMessage name="attribute" />
                                          }
                                          // onKeyUp={(e) => {
                                          //   resetMutationState();
                                          // }}

                                          as={(value) => {
                                            return (
                                              <div className="flex flex-col">
                                                <Select
                                                  labelId={`select.${index}.conditionKey`}
                                                  id={`select.${index}.conditionKey`}
                                                  variant="outlined"
                                                  className="w-full"
                                                  {...value}
                                                >
                                                  {Constants.customParametersConditionKeys.map(
                                                    (key) => {
                                                      return (
                                                        <MenuItem value={key}>
                                                          {key}
                                                        </MenuItem>
                                                      );
                                                    }
                                                  )}
                                                </Select>
                                                {value?.error && (
                                                  <p
                                                    className="py-1"
                                                    style={{
                                                      fontSize: "0.75rem",
                                                      marginLeft: "1rem",
                                                      color: "#f44336",
                                                    }}
                                                  >
                                                    {errors?.type}
                                                  </p>
                                                )}
                                              </div>
                                            );
                                          }}
                                        />
                                      </div>
                                      <div className="ml-4">
                                        <p className="text-overline2 mb-1">Value</p>
                                        <Field
                                          id={`filters.${index}.value`}
                                          name={`filters.${index}.value`}
                                          style={{ height: "48px" }}
                                          fullWidth
                                          color="primary"
                                          variant="outlined"
                                          // disabled={isAddingCustomParameter || isEditingCustomParameter}
                                          // error={touched.name && Boolean(errors.name)}
                                          helperText={
                                            <ErrorMessage name="attribute" />
                                          }
                                          // onKeyUp={(e) => {
                                          //   resetMutationState();
                                          // }}
                                          inputProps={{
                                            style: {
                                              height: "6px",
                                            },
                                          }}
                                          as={TextField}
                                        />
                                      </div>
                                    </div>
                                    <div className="mt-4">
                                      <button className="cursor-pointer mt-4 float-right" onClick={() => { remove(index) }}>Delete</button>
                                    </div>
                                  </div>
                                ))}

                            </div>
                            <div className='float-right flex flex-row items-center cursor-pointer hover:opacity-80 mr-14 mt-2 border-1 rounded-md border-brand-secondary px-2 py-2'
                              onClick={() => { push(temp) }}>
                              <AppIcon
                                size='20px'
                                color={Colors.brand.secondary}
                                style={{ marginRight: "0.5rem" }}
                              >
                                <AddIcon style={{ fontSize: "20px" }} />
                              </AppIcon>
                              <p className='text-overline2 text-brand-secondary'>Add</p>
                            </div>
                          </>
                        )}
                      </FieldArray>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
        {addCustomParamError && (
          <p className='text-accent-red text-overline2'>
            {addCustomParamError?.response?.data?.message}
          </p>
        )}

        {editCustomParamError && (
          <p className='text-accent-red text-overline2'>
            {editCustomParamError?.message}
          </p>
        )}
      </div>
      <div className="border-t-1 p-4 flex flex-row justify-end items-center">
        {!isAddingCustomParameter && !isEditingCustomParameter ? (<>
          <TextButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
          >
            Cancel
          </TextButton>
          <PrimaryButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (currentTab !== 2) {
                handleNext();
              } else {
                formRef.current.submitForm()
              }
            }}
          >
            {currentTab === 2 ? "Done" : "Next"}
          </PrimaryButton>
        </>) :
          <CircularProgress
            style={{
              width: "24px",
              height: "24px",
              color: Colors.brand.secondary,
            }}
          />
        }
      </div>
    </div>
  );
};

export default AddOrEditCustomParameter;
