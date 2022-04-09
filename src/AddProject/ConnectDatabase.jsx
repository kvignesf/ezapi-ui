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
import { useUserProfile, usePricingData} from "./addProjectQuery";
import client, { endpoint } from '../shared/network/client';
import { queries } from '../shared/network/queryClient';

import { useQuery } from 'react-query';
import { array } from "yup";

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
  
//   const pricingData = async () => {
//     const { data } = await client.get(endpoint.products2);
  
//     return data;
//   };
  
//   const userProfile = async () => {
//     try {
//       const { data } = await client.get(endpoint.userProfile);
//       return data;
//     } catch (error) {
//       // throw getApiError(error);
//     }
//   };

//  const usePricingData = () => {
//     return useQuery([queries.products], pricingData, {
//       refetchOnWindowFocus: false,
//       fetchPolicy: "no-cache", 
//     });
//   };
  
//  const useUserProfile = () => {
//     return useQuery([queries.userProfile], userProfile, {
//       refetchOnWindowFocus: false,
//       fetchPolicy: "no-cache", 
//     });
//   };
  
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

  const handleOnKeysPick = (pickedKeys) => {
    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);
      console.log("enterd into fuinction",updatedProjectDetails);
      pickedKeys.forEach((pickedKey) => {
        if (
          !_.find(
            updatedProjectDetails.keys,
            (existingKey) => existingKey.name === pickedKey.name
          )
        ) {
          if (!updatedProjectDetails.keys) {
            console.log("manojjj")
            updatedProjectDetails.keys = [];
          }
          console.log("prani",updatedProjectDetails.keys);
          console.log(pickedKey);
          updatedProjectDetails?.keys?.push(pickedKey);
          console.log("prani_updated",updatedProjectDetails.keys);
        }
      });

      return updatedProjectDetails;
    });

    resetProjectApiState();
  };

  const handleOnCertificatesPick = (pickedCertificates) => {
    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);
      console.log("enterd into fuinction",updatedProjectDetails);
      pickedCertificates.forEach((pickedCertificate) => {
        if (
          !_.find(
            updatedProjectDetails.certificates,
            (existingCertificate) => existingCertificate.name === pickedCertificate.name
          )
        ) {
          if (!updatedProjectDetails.certificates) {
            console.log("manojjj")
            updatedProjectDetails.certificates = [];
          }
          console.log("prani",updatedProjectDetails.certificates);
          console.log(pickedCertificate);
          updatedProjectDetails?.certificates?.push(pickedCertificate);
          console.log("prani_updated",updatedProjectDetails.certificates);
        }
      });

      return updatedProjectDetails;
    });

    resetProjectApiState();
  };

  const handleOnCACertificatesPick = (pickedCACertificates) => {
    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);
      console.log("enterd into fuinction",updatedProjectDetails);
      pickedCACertificates.forEach((pickedCACertificate) => {
        if (
          !_.find(
            updatedProjectDetails.caCertificates,
            (existingCACertificate) => existingCACertificate.name === pickedCACertificate.name
          )
        ) {
          if (!updatedProjectDetails.caCertificates) {
            console.log("manojjj")
            updatedProjectDetails.caCertificates = [];
          }
          console.log("prani",updatedProjectDetails.caCertificates);
          console.log(pickedCACertificate);
          updatedProjectDetails?.caCertificates?.push(pickedCACertificate);
          console.log("prani_updated",updatedProjectDetails.caCertificates);
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

  const removeSelectedKey = (filename) => {
    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);

      updatedProjectDetails.keys = _.filter(
        updatedProjectDetails.keys,
        (key) => {
          return key.name !== filename;
        }
      );

      return updatedProjectDetails;
    });

    resetProjectApiState();
  };

  const removeSelectedCertificate = (filename) => {
    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);

      updatedProjectDetails.certificates = _.filter(
        updatedProjectDetails.certificates,
        (certificate) => {
          return certificate.name !== filename;
        }
      );

      return updatedProjectDetails;
    });

    resetProjectApiState();
  };

  const removeSelectedCACertificate = (filename) => {
    setProjectDetails((currProjectDetails) => {
      const updatedProjectDetails = _.cloneDeep(currProjectDetails);

      updatedProjectDetails.caCertificates = _.filter(
        updatedProjectDetails.caCertificates,
        (caCertificate) => {
          return caCertificate.name !== filename;
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

  const databaseTypes = [
    { value: "mysql", label: "MySQL", check: "my_sql"},
    { value: "mssql", label: "SQL Server", check: "ms_sql"},
    { value: "postgres", label: "Postgres", check: "postgres" },
  ];

  // const { data: pricing_data } = usePricingData();
  // const { data: userProfile_data } = useUserProfile();
  // const connectors = pricing_data["products"].filter((item)=> item["stripe_product_id"] == userProfile_data["subscribed_plan"])[0]["connectors"]

  return (
    <div className="p-4" style={{ height: "300px", overflowY: "scroll" }}>
      {/* <Scrollbar className="max-h-60" alwaysShowTracks={true}> */}
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
                  username: projectDetails?.username ?? "",
                  password: projectDetails?.password ?? "",
                  toggle: false,
                }}
                validationSchema={Yup.object().shape({
                  // name: apiNameSchema(Messages.NAME_REQUIRED),
                  host: Yup.string().required("host is required."),
                  port: Yup.string().required("port is required."),
                  database: Yup.string().required("database is required."),
                  username: Yup.string().required("username is required."),
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
                          style={{
                            border: "1px solid #d2d2d2",
                            height: "60px",
                            borderRadius: "4px",
                            width: "100%",
                            color: "primary",
                            backgroundColor: "#ffffff",
                          }}
                          
                        >
                          <option  value="" label="Select db type"/>
                          <option  value="mysql" label="MySQL"/>
                          <option  value="mssql" label="SQL Server"/>
                          <option  value="postgres" label="Postgres"/>

                          {/* {databaseTypes?.filter((item)=>  connectors[item.check] ).map((item)=>{
                            return <option  value={item.value} label={item.label}/>
                          })} */}
                        </select>
                        
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
                          inputProps={{ maxLength: 55 }}
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
                          inputProps={{ maxLength: 55 }}
                          // disabled={addProjectMutation?.isSuccess}
                          as={TextField}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <label>
                          <Field type="checkbox" name="toggle" />
                          {" Over SSL"}
                        </label>
                        {values.toggle ? (
                          <>
                            <div className="mb-6">
                              <p className="text-mediumLabel mb-2">
                                Upload Key
                              </p>
                              <input
                                id="keys"
                                type="file"
                                accept=".key,.pem"
                                multiple
                                hidden
                                onChange={(e) => {
                                  console.log("entered into Onchange")
                                  handleOnKeysPick(Array.from(e.target.files));
                                  e.target.value = "";
                                }}
                              />
                              <label
                                for="keys"
                                className="bg-brand-secondary rounded-md px-4 py-2 text-white text-mediumLabel hover:opacity-90"
                              >
                                Upload
                              </label>

                              {/* Spec list */}
                              {!_.isEmpty(projectDetails?.keys) ? (
                                <div className="mt-3">
                                  <Scrollbar
                                    className="max-h-24"
                                    alwaysShowTracks={true}
                                  >
                                    <ul>
                                      {projectDetails?.keys?.map((file) => {
                                        return (
                                          <li key={file.name}>
                                            <div className="rounded-md border bg-neutral-gray7 p-2 mb-2 flex flex-row items-center justify-between">
                                              <p className="text-overline2">
                                                {file.name}{" "}
                                                {Math.round(file.size / 1024)}{" "}
                                                KB
                                              </p>
                                              <AppIcon
                                                aria-label="remove"
                                                onClick={() => {
                                                  removeSelectedKey(file.name);
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
                                !_.isEmpty(specsError) && (
                                  <p className="text-accent-red text-overline2 mt-2">
                                    {specsError}
                                  </p>
                                )}
                            </div>
                            <div className="mb-6">
                              <p className="text-mediumLabel mb-2">
                                Upload Certificate
                              </p>
                              <input
                                id="certificates"
                                type="file"
                                accept=".pem,.crt"
                                multiple
                                hidden
                                onChange={(e) => {
                                  handleOnCertificatesPick(Array.from(e.target.files));
                                  e.target.value = "";
                                }}
                              />
                              <label
                                for="certificates"
                                className="bg-brand-secondary rounded-md px-4 py-2 text-white text-mediumLabel hover:opacity-90"
                              >
                                Upload
                              </label>

                              {/* Spec list */}
                              {!_.isEmpty(projectDetails?.certificates) ? (
                                <div className="mt-3">
                                  <Scrollbar
                                    className="max-h-24"
                                    alwaysShowTracks={true}
                                  >
                                    <ul>
                                      {projectDetails?.certificates?.map((file) => {
                                        return (
                                          <li key={file.name}>
                                            <div className="rounded-md border bg-neutral-gray7 p-2 mb-2 flex flex-row items-center justify-between">
                                              <p className="text-overline2">
                                                {file.name}{" "}
                                                {Math.round(file.size / 1024)}{" "}
                                                KB
                                              </p>
                                              <AppIcon
                                                aria-label="remove"
                                                onClick={() => {
                                                  removeSelectedCertificate(file.name);
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
                                !_.isEmpty(specsError) && (
                                  <p className="text-accent-red text-overline2 mt-2">
                                    {specsError}
                                  </p>
                                )}
                            </div>
                            <div className="mb-6">
                              <p className="text-mediumLabel mb-2">
                                Upload CA Certificate
                              </p>
                              <input
                                id="caCertificates"
                                type="file"
                                accept=".pem,.crt"
                                multiple
                                hidden
                                onChange={(e) => {
                                  handleOnCACertificatesPick(Array.from(e.target.files));
                                  e.target.value = "";
                                }}
                              />
                              <label
                                for="caCertificates"
                                className="bg-brand-secondary rounded-md px-4 py-2 text-white text-mediumLabel hover:opacity-90"
                              >
                                Upload
                              </label>

                              {/* Spec list */}
                              {!_.isEmpty(projectDetails?.caCertificates) ? (
                                <div className="mt-3">
                                  <Scrollbar
                                    className="max-h-24"
                                    alwaysShowTracks={true}
                                  >
                                    <ul>
                                      {projectDetails?.caCertificates?.map((file) => {
                                        return (
                                          <li key={file.name}>
                                            <div className="rounded-md border bg-neutral-gray7 p-2 mb-2 flex flex-row items-center justify-between">
                                              <p className="text-overline2">
                                                {file.name}{" "}
                                                {Math.round(file.size / 1024)}{" "}
                                                KB
                                              </p>
                                              <AppIcon
                                                aria-label="remove"
                                                onClick={() => {
                                                  removeSelectedCACertificate(file.name);
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
                                !_.isEmpty(specsError) && (
                                  <p className="text-accent-red text-overline2 mt-2">
                                    {specsError}
                                  </p>
                                )}
                            </div>
                          </>
                        ) : (
                          ""
                        )}
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
                  dbType: projectDetails?.dbType ?? "",
                }}
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
                          style={{
                            border: "1px solid #d2d2d2",
                            height: "60px",
                            marginBottom: "10px",
                            borderRadius: "4px",
                            width: "100%",
                            color: "primary",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <option value="" label="Select db type" />
                          <option value="mysql" label="MySQL" />
                          <option value="mssql" label="SQL Server" />
                          <option value="mongo" label="Mongo" />
                          <option value="postgres" label="Postgres" />
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
      {/* </Scrollbar> */}
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
