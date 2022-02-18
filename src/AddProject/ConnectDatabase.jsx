import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  TextField,
  MenuItem,
  OutlinedInput,
  Grid,
  Tab,
  Tabs,
} from "@material-ui/core";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// import TabsUnstyled from '@mui/base/TabsUnstyled';
// import TabsListUnstyled from '@mui/base/TabUnstyled';
// import TabUnstyled from '@mui/base/TabUnstyled';
// import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { useRecoilState } from "recoil";
import { Field, ErrorMessage, Form, Formik } from "formik";
import debounce from "lodash.debounce";
import { useFilePicker } from "use-file-picker";
import _ from "lodash";
import CloseIcon from "@material-ui/icons/Close";
import Scrollbar from "react-smooth-scrollbar";
import * as Yup from "yup";

import projectAtom from "./projectAtom";
import { PrimaryButton } from "../shared/components/AppButton";
import AppIcon from "../shared/components/AppIcon";
import apiNameSchema from "../shared/schemas/apiNameSchema";
import EnterKeyCaptureInput from "../shared/components/EnterKeyCaptureInput";
import InviteCollaborators from "../shared/components/InviteCollaborators";
import TabLabel from "../shared/components/TabLabel";
import Messages from "../shared/messages";
import { withStyles } from "@material-ui/core/styles";
import { useDatabaseConnection } from "./addProjectQuery";

const ConnectDatabase = ({
  formRef,
  specsError,
  dbsError,
  addProjectMutation,
  uploadSpecsMutation,
  uploadDbMutation,
  aiMatcherMutation,
  activeTab,
  handleTabChange,
}) => {
  const [projectDetails, setProjectDetails] = useRecoilState(projectAtom);

  const debouncedSetDatabase = useCallback(
    debounce((nextValue) => {
      resetProjectApiState();

      setProjectDetails((currProjectDetails) => {
        return {
          ...currProjectDetails,
          database: nextValue,
        };
      });
    }, 300),
    [] // will be created only once initially
  );

  const debouncedSetHost = useCallback(
    debounce((nextValue) => {
      resetProjectApiState();

      setProjectDetails((currProjectDetails) => {
        return {
          ...currProjectDetails,
          host: nextValue,
        };
      });
    }, 300),
    [] // will be created only once initially
  );

  const debouncedSetPort = useCallback(
    debounce((nextValue) => {
      resetProjectApiState();

      setProjectDetails((currProjectDetails) => {
        return {
          ...currProjectDetails,
          port: nextValue,
        };
      });
    }, 300),
    [] // will be created only once initially
  );

  const debouncedSetUsername = useCallback(
    debounce((nextValue) => {
      resetProjectApiState();

      setProjectDetails((currProjectDetails) => {
        return {
          ...currProjectDetails,
          username: nextValue,
        };
      });
    }, 300),
    [] // will be created only once initially
  );
  const debouncedSetPassword = useCallback(
    debounce((nextValue) => {
      resetProjectApiState();

      setProjectDetails((currProjectDetails) => {
        return {
          ...currProjectDetails,
          password: nextValue,
        };
      });
    }, 300),
    [] // will be created only once initially
  );

  const debouncedSetDbType = useCallback(
    debounce((nextValue) => {
      resetProjectApiState();

      setProjectDetails((currProjectDetails) => {
        return {
          ...currProjectDetails,
          dbType: nextValue,
        };
      });
    }, 300),
    [] // will be created only once initially
  );

  const debouncedSetType = useCallback(
    debounce((nextValue) => {
      resetProjectApiState();

      setProjectDetails((currProjectDetails) => {
        return {
          ...currProjectDetails,
          type: nextValue,
        };
      });
    }, 300),
    [] // will be created only once initially
  );

  const resetProjectApiState = () => {
    addProjectMutation?.reset();
    uploadSpecsMutation?.reset();
    uploadDbMutation?.reset();
    aiMatcherMutation?.reset();
  };

  const handleOnSpecsPick = (pickedSpecs) => {
    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);

      pickedSpecs.forEach((pickedSpec) => {
        if (
          !_.find(
            updatedProjectDetails.specs,
            (existingSpec) => existingSpec.name === pickedSpec.name
          )
        ) {
          if (!updatedProjectDetails.specs) {
            updatedProjectDetails.specs = [];
          }

          updatedProjectDetails.specs.push(pickedSpec);
        }
      });

      return updatedProjectDetails;
    });

    resetProjectApiState();
  };

  const handleOnDbsPick = (pickedDbs) => {
    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);

      pickedDbs.forEach((pickedDb) => {
        if (
          !_.find(
            updatedProjectDetails.dbs,
            (existingDb) => existingDb.name === pickedDb.name
          )
        ) {
          if (!updatedProjectDetails.dbs) {
            updatedProjectDetails.dbs = [];
          }

          updatedProjectDetails.dbs.push(pickedDb);
        }
      });

      return updatedProjectDetails;
    });

    resetProjectApiState();
  };

  const removeSelectedSpec = (filename) => {
    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);

      updatedProjectDetails.specs = _.filter(
        updatedProjectDetails.specs,
        (spec) => {
          return spec.name !== filename;
        }
      );

      return updatedProjectDetails;
    });

    resetProjectApiState();
  };

  const removeSelectedDb = (filename) => {
    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);

      updatedProjectDetails.dbs = _.filter(updatedProjectDetails.dbs, (db) => {
        return db.name !== filename;
      });

      return updatedProjectDetails;
    });

    resetProjectApiState();
  };

  const CustomTab = withStyles({
    root: {
      backgroundColor: "white",
      borderRadius: "10px",
      width: "100%",
    },
    selected: {
      color: "white",
      backgroundColor: "#24a0ed",
      borderRadius: "10px",
    },
  })(Tab);

  const CustomTabs = withStyles({
    root: {
      border: "1px solid #d2d2d2",
      borderRadius: "10px",
    },
  })(Tabs);

  return (
    <div className="p-4" style={{ height: "350px" }}>
      <Scrollbar className="max-h-60" alwaysShowTracks={true}>
        <>
          <CustomTabs
            value={activeTab}
            onChange={(_, index) => {
              handleTabChange(index);
            }}
            aria-label="add project tabs"
            indicatorColor="white"
            // textColor="primary"
            centered
          >
            <CustomTab
              label={<TabLabel label={"Connect"} />}
              style={{ outline: "none", border: "none" }}
            />
            <CustomTab
              label={<TabLabel label={"Upload"} />}
              style={{ outline: "none", border: "none" }}
            />
          </CustomTabs>

          {/* Content */}
          <div>
            {activeTab === 0 ? (
              <div className="mt-6 mb-6">
                <p className="text-mediumLabel mb-2">Server Type</p>
                <Formik
                  initialValues={{
                    type: projectDetails?.type ?? "",
                    host: projectDetails?.host ?? "",
                    port: projectDetails?.port ?? "",
                    database: projectDetails?.database ?? "",
                    username: "",
                    password: "",
                  }}
                  validationSchema={Yup.object().shape({
                    // name: apiNameSchema(Messages.NAME_REQUIRED),
                    host: Yup.string().required("host is required."),
                    port: Yup.string().required("port is required."),
                    database: Yup.string().required("database is required."),
                    username: Yup.string().required("username is required."),
                    password: Yup.string().required("password is required."),
                  })}
                  innerRef={formRef}
                >
                  {({
                    errors,
                    touched,
                    values,
                    submitForm,
                    validateForm,
                    handleChange,
                    handleBlur,
                    setErrors,
                  }) => (
                    <Form>
                      <Grid container spacing={2}>
                        {/* <Field
                        id='name'
                        name='serverType'
                        fullWidth
                        color='primary'
                        error={touched.name && Boolean(errors.name)}
                        helperText={<ErrorMessage name='name' />}
                        onKeyUp={(e) => {
                          const { value } = e.target;
                          debouncedSetName(value);
                        }}
                        variant='outlined'
                        inputProps={{ maxLength: 24 }}
                        // disabled={addProjectMutation?.isSuccess}
                        as={Select}
                      /> */}
                        <Grid item xs={12}>
                          <select
                            name="type"
                            value={values.type}
                            // color = "primary"
                            onChange={handleChange}
                            onBlur={(e) => {
                              debouncedSetType(values.type);
                            }}
                            variant="outlined"
                            style = {{border: "1px solid #d2d2d2", height: '60px', borderRadius: '4px', width : '100%', color: 'primary', backgroundColor: '#ffffff'}}
                          >
                            <option value="" label="Select db type"/>
                            <option value="mysql" label="MySQL"/>
                            <option value="mssql" label="SQL Server"/>
                            <option value="mongo" label="Mongo"/>
                            <option value="postgres" label="Postgres"/>
                          </select>
                          {/* <Field
                            name="servername"
                            component={CustomizedSelectForFormik}
                          >
                            <MenuItem value="mysql">MySQL</MenuItem>
                            <MenuItem value="mssql">SQL Server</MenuItem>
                            <MenuItem value="mongo">Mongo</MenuItem>
                            <MenuItem value="postgres">Postgres</MenuItem>
                          </Field> */}
                        </Grid>
                        <Grid item xs={6}>
                          <p className="text-mediumLabel mb-2">Host</p>
                          <Field
                            id="host"
                            name="host"
                            fullWidth
                            color="primary"
                            placeholder="127.0.0.1"
                            error={touched.host && Boolean(errors.host)}
                            helperText={<ErrorMessage name="host" />}
                            onKeyUp={(e) => {
                              const { value } = e.target;
                              debouncedSetHost(value);
                            }}
                            variant="outlined"
                            inputProps={{ maxLength: 24 }}
                            // disabled={addProjectMutation?.isSuccess}
                            as={TextField}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <p className="text-mediumLabel mb-2">Port</p>
                          <Field
                            id="port"
                            name="port"
                            fullWidth
                            color="primary"
                            placeholder="7744"
                            error={touched.port && Boolean(errors.port)}
                            helperText={<ErrorMessage name="port" />}
                            onKeyUp={(e) => {
                              const { value } = e.target;
                              debouncedSetPort(value);
                            }}
                            variant="outlined"
                            inputProps={{ maxLength: 24 }}
                            // disabled={addProjectMutation?.isSuccess}
                            as={TextField}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <p className="text-mediumLabel mb-2">Username</p>
                          <Field
                            id="username"
                            name="username"
                            fullWidth
                            color="primary"
                            error={touched.username && Boolean(errors.username)}
                            helperText={<ErrorMessage name="username" />}
                            onKeyUp={(e) => {
                              const { value } = e.target;
                              debouncedSetUsername(value);
                            }}
                            variant="outlined"
                            inputProps={{ maxLength: 24 }}
                            // disabled={addProjectMutation?.isSuccess}
                            as={TextField}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <p className="text-mediumLabel mb-2">Password</p>
                          <Field
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="off"
                            fullWidth
                            color="primary"
                            error={touched.password && Boolean(errors.password)}
                            helperText={<ErrorMessage name="password" />}
                            onKeyUp={(e) => {
                              const { value } = e.target;
                              debouncedSetPassword(value);
                            }}
                            variant="outlined"
                            inputProps={{ maxLength: 24 }}
                            // disabled={addProjectMutation?.isSuccess}
                            as={TextField}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <p className="text-mediumLabel mb-2">Database</p>
                          <Field
                            id="database"
                            name="database"
                            fullWidth
                            color="primary"
                            error={touched.database && Boolean(errors.database)}
                            helperText={<ErrorMessage name="database" />}
                            onKeyUp={(e) => {
                              const { value } = e.target;
                              debouncedSetDatabase(value);
                            }}
                            variant="outlined"
                            inputProps={{ maxLength: 24 }}
                            // disabled={addProjectMutation?.isSuccess}
                            as={TextField}
                          />
                        </Grid>
                        {/* <Grid item xl={12}>
                          <p className="text-mediumLabel mb-2">ssl</p>
                          <Field
                            id="name"
                            name="name"
                            fullWidth
                            color="primary"
                            error={touched.name && Boolean(errors.name)}
                            helperText={<ErrorMessage name="name" />}
                            onKeyUp={(e) => {
                              const { value } = e.target;
                              debouncedSetName(value);
                            }}
                            variant="outlined"
                            inputProps={{ maxLength: 24 }}
                            // disabled={addProjectMutation?.isSuccess}
                            as={TextField}
                          />
                        </Grid> */}
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </div>
            ) : (
              <div className="h-80 pt-4 mb-4">
                <Formik 
                initialValues={{
                  dbType: projectDetails?.dbType ?? ""
                }}

                innerRef={formRef}>
                {({
                    errors,
                    touched,
                    values,
                    submitForm,
                    validateForm,
                    handleChange,
                    handleBlur,
                    setErrors,
                  }) => (
                  <Form>
                    <div className="mb-3">
                      <Grid item xs={12}>
                        <select
                          name="dbType"
                          value={values.dbType}
                          // color = "primary"
                          onChange={handleChange}
                          onBlur={(e) => {
                            debouncedSetDbType(values.dbType);
                          }}
                          variant="outlined"
                          style = {{border: "1px solid #d2d2d2", height: '60px', marginBottom: '10px', borderRadius: '4px', width : '100%', color: 'primary', backgroundColor: '#ffffff'}}
                        >
                          <option value="" label="Select db type"/>
                          <option value="mysql" label="MySQL"/>
                          <option value="mssql" label="SQL Server"/>
                          <option value="mongo" label="Mongo"/>
                          <option value="postgres" label="Postgres"/>
                        </select>
                      </Grid>
                      <Grid item xs={12}>
                        <p className="text-mediumLabel mb-2">
                          Connect DB{" "}
                          <span>
                            <InfoOutlinedIcon />
                          </span>
                        </p>
                        <input
                          id="dbs"
                          type="file"
                          accept=".sql"
                          multiple
                          hidden
                          onChange={(e) => {
                            handleOnDbsPick(Array.from(e.target.files));
                            e.target.value = "";
                          }}
                        />
                        <label
                          for="dbs"
                          className="bg-brand-secondary rounded-md px-4 py-2
            text-white text-mediumLabel hover:opacity-90"
                        >
                          Upload DDL
                        </label>
                      </Grid>

                      {/* Connected Dbs */}
                      {!_.isEmpty(projectDetails?.dbs) ? (
                        <div className="mt-3">
                          <Scrollbar
                            className="max-h-24"
                            alwaysShowTracks={true}
                          >
                            <ul>
                              {projectDetails?.dbs?.map((file) => {
                                return (
                                  <li key={file.name}>
                                    <div className="rounded-md border bg-neutral-gray7 p-2 mb-2 flex flex-row items-center justify-between">
                                      <p className="text-overline2">
                                        {file.name}{" "}
                                        {Math.round(file.size / 1024)} KB
                                      </p>
                                      <AppIcon
                                        aria-label="remove"
                                        onClick={() => {
                                          removeSelectedDb(file.name);
                                        }}
                                        style={{
                                          width: "18px",
                                          height: "18px",
                                        }}
                                      >
                                        <CloseIcon />
                                      </AppIcon>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </Scrollbar>
                        </div>
                      ) : null}

                      {_.isEmpty(projectDetails?.dbs) &&
                        _.isEmpty(projectDetails?.specs) &&
                        !_.isEmpty(dbsError) && (
                          <p className="text-accent-red text-overline2 mt-2">
                            {dbsError}
                          </p>
                        )}
                    </div>
                  </Form>
                )}
                </Formik>
              </div>
            )}
          </div>
        </>
      </Scrollbar>
    </div>
  );
};

// const CustomizedSelectForFormik = ({ children, form, field }) => {
//   const { name, value } = field;
//   const { setFieldValue } = form;

//   return (
//     <Select
//       name={name}
//       value={value}
//       input={<OutlinedInput />}
//       label={name}
//       style={{ width: "100%" }}
//       onChange={(e) => {
//         setFieldValue(name, e.target.value);
//       }}
//     >
//       {children}
//     </Select>
//   );
// };

export default ConnectDatabase;
