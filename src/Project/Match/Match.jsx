import { Tab, Tabs } from "@material-ui/core";
import _ from "lodash";
import React, { useState, useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/Add";
import { Dialog } from "@material-ui/core";

import Schema from "./Schema";
import schemaAtom from "../../shared/atom/schemaAtom";
import AppIcon from "../../shared/components/AppIcon";
import classNames from "classnames";
import {
  isArray,
  operationAtomWithMiddleware,
  useCanEdit,
} from "../../shared/utils";
import TabLabel from "../../shared/components/TabLabel";
import Parameters from "./Parameters/Parameters";
import Colors from "../../shared/colors";
import AddOrEditParameter from "./Parameters/AddOrEditParameter/AddOrEditParameter";
import Database from "./Database/Database";
import tableAtom from "../../shared/atom/tableAtom";
import CustomParameters from "./CustomParameters/CustomParameters";
import StoredProcedures from "./StoredProcedures/StoredProcedures";
import AddOrEditCustomParameter from "./CustomParameters/AddOrEditCustomParameter/AddOrEditCustomParameter";
import StoredProcedure from "./StoredProcedures/StoredProcedures";
import storedProcedureAtom from "../../shared/atom/storedProcedureAtom";

const Match = ({ projectType, ...props }) => {
  let [operationData, setOperationDetails] = useRecoilState(
    operationAtomWithMiddleware
  );
  const [currentTab, setTab] = useState(null);
  const [schemaState, setSchemaState] = useRecoilState(schemaAtom);
  const resetSchemaState = useResetRecoilState(schemaAtom);
  const [tableState, setTableState] = useRecoilState(tableAtom);
  const [storedProcedureState, setStoredProcedureState] =
    useRecoilState(storedProcedureAtom);
  const resetTableState = useResetRecoilState(tableAtom);
  const resetStoredProcedureState = useResetRecoilState(storedProcedureAtom);
  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });
  const canEdit = useCanEdit();
  const customParamENV = process.env.REACT_APP_FEATURE_CUSTOM_PARAMETER
    ? process.env.REACT_APP_FEATURE_CUSTOM_PARAMETER
    : "true";

  useEffect(() => {
    if (projectType === "schema" || projectType === "both") {
      setTab("schema");
    } else if (projectType === "db") {
      setTab("db");
    } else {
      setTab("param");
    }
  }, [projectType]);
  useEffect(() => {
    if (
      projectType === "db" &&
      operationData?.operation?.operationType?.toLowerCase() != "post"
    ) {
      setTab("db");
    }
  }, [operationData?.operation?.operationType]);

  const showAddParameterDialog = () => {
    if (canEdit()) {
      setDialog({
        show: true,
        type: "add-parameter",
      });
    }
  };

  const showAddCustomParameterDialog = () => {
    if (canEdit()) {
      setDialog({
        show: true,
        type: "add-custom-parameter",
      });
    }
  };

  const handleCloseDialog = () => {
    setDialog({
      show: false,
      data: null,
    });
  };

  return (
    <div className='flex-1 relative w-full' {...props}>
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby='match-dialog'
        open={dialog?.show ?? false}
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
        disableBackdropClick
      >
        {dialog?.type === "add-parameter" && canEdit() && (
          <AddOrEditParameter onClose={handleCloseDialog} />
        )}
        {dialog?.type === "add-custom-parameter" && canEdit() && (
          <AddOrEditCustomParameter onClose={handleCloseDialog} />
        )}
      </Dialog>

      <div
        className={classNames(
          "fixed top-0 mt-14 z-999 bg-white flex flex-row items-center border-b-2",
          {
            "p-3": schemaState?.selected && !_.isEmpty(schemaState?.selected),
          }
        )}
        style={{ width: `calc(100vw - 230px)` }}
      >
        <div className='flex-1'>
          {schemaState?.selected && !_.isEmpty(schemaState?.selected) ? (
            <div className='flex flex-row items-center'>
              <AppIcon
                style={{ marginRight: "0.5rem" }}
                onClick={(e) => {
                  e?.preventDefault();
                  e?.stopPropagation();

                  let updatedSchemaState = _.cloneDeep(schemaState);
                  updatedSchemaState?.selected?.pop();

                  setSchemaState(updatedSchemaState);
                }}
              >
                <ArrowBackIcon style={{ fontSize: "1.25rem" }} />
              </AppIcon>

              <div className='flex flex-row items-center'>
                <p
                  className='text-overline3 text-neutral-gray4 cursor-pointer hover:opacity-70'
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();

                    let updatedSchemaState = _.cloneDeep(schemaState);
                    updatedSchemaState.selected = [];

                    setSchemaState(updatedSchemaState);
                  }}
                >
                  Schemas
                </p>

                {schemaState?.selected?.map((schema, index) => {
                  return (
                    <div key={index} className='flex flex-row items-center'>
                      <p className='mx-1 text-neutral-gray3'> / </p>

                      <p
                        className={classNames(
                          "text-overline3 cursor-pointer hover:opacity-70",
                          {
                            "text-neutral-gray4":
                              index !== schemaState?.selected?.length - 1,
                          }
                        )}
                        onClick={(e) => {
                          e?.preventDefault();
                          e?.stopPropagation();

                          let updatedSchemaState = _.cloneDeep(schemaState);
                          const itemIndex =
                            updatedSchemaState.selected.findIndex(
                              (item) => item?.name === schema?.name
                            );

                          if (itemIndex >= 0) {
                            updatedSchemaState.selected = _.cloneDeep(
                              updatedSchemaState.selected.slice(
                                0,
                                itemIndex + 1
                              )
                            );
                          }

                          if (
                            updatedSchemaState?.selected?.length !==
                            schemaState?.selected?.length
                          ) {
                            setSchemaState(updatedSchemaState);
                          }
                        }}
                      >
                        {schema?.name} {isArray(schema) ? " [ ] " : null}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : tableState?.selected ? (
            <div className='flex flex-row items-center ml-3 py-3'>
              <AppIcon
                style={{ marginRight: "0.5rem" }}
                onClick={(e) => {
                  e?.preventDefault();
                  e?.stopPropagation();

                  resetTableState();
                }}
              >
                <ArrowBackIcon style={{ fontSize: "1.25rem" }} />
              </AppIcon>

              <div className='flex flex-row items-center'>
                <p
                  className='text-overline3 text-neutral-gray4 cursor-pointer hover:opacity-70'
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();

                    resetTableState();
                  }}
                >
                  Tables
                </p>

                {tableState?.selected && (
                  <div className='flex flex-row items-center'>
                    <p className='mx-1 text-neutral-gray3'> / </p>

                    <p
                      className={classNames(
                        "text-overline3 cursor-pointer hover:opacity-70"
                      )}
                    >
                      {tableState?.selected?.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : storedProcedureState?.selected ? (
            <div className='flex flex-row items-center ml-3 py-3'>
              <AppIcon
                style={{ marginRight: "0.5rem" }}
                onClick={(e) => {
                  e?.preventDefault();
                  e?.stopPropagation();

                  resetStoredProcedureState();
                }}
              >
                <ArrowBackIcon style={{ fontSize: "1.25rem" }} />
              </AppIcon>

              <div className='flex flex-row items-center'>
                <p
                  className='text-overline3 text-neutral-gray4 cursor-pointer hover:opacity-70'
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();

                    resetStoredProcedureState();
                  }}
                >
                  Stored Procedure
                </p>

                {storedProcedureState?.selected && (
                  <div className='flex flex-row items-center'>
                    <p className='mx-1 text-neutral-gray3'> / </p>

                    <p
                      className={classNames(
                        "text-overline3 cursor-pointer hover:opacity-70"
                      )}
                    >
                      {storedProcedureState?.selected?.storedProcedure}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Tabs
              value={currentTab}
              onChange={(_, value) => {
                setTab(value);
                resetSchemaState();
              }}
              aria-label='schema tabs'
              indicatorColor='primary'
              textColor='primary'
            >
              {(projectType === "schema" || projectType === "both") && (
                <Tab
                  label={<TabLabel label={"Schema"} />}
                  style={{ outline: "none", border: "none" }}
                  value={"schema"}
                />
              )}
              <Tab
                label={<TabLabel label={"Parameters"} />}
                style={{ outline: "none", border: "none" }}
                value={"param"}
              />
              {projectType === "db" && (
                <Tab
                  label={<TabLabel label={"Database"} />}
                  style={{ outline: "none", border: "none" }}
                  value={"db"}
                />
              )}
              {projectType === "db" && customParamENV === "true" && (
                <Tab
                  label={<TabLabel label={"Custom Parameter"} />}
                  style={{ outline: "none", border: "none" }}
                  value={"customParam"}
                />
              )}
              {projectType === "db" &&
                operationData?.operation?.operationType?.toLowerCase() ==
                  "post" && (
                  <Tab
                    label={<TabLabel label={"Stored Procedures"} />}
                    style={{ outline: "none", border: "none" }}
                    value={"storedProcedures"}
                  />
                )}
            </Tabs>
          )}
        </div>

        {(currentTab === "param" || currentTab === "customParam") && canEdit() && (
          <div
            className='flex flex-row items-center cursor-pointer hover:opacity-80 mr-8 border-1 rounded-md border-brand-secondary px-2 py-2'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (currentTab === "param") {
                showAddParameterDialog();
              }
              if (currentTab === "customParam") {
                showAddCustomParameterDialog();
              }
            }}
          >
            <AppIcon
              size='20px'
              color={Colors.brand.secondary}
              style={{ marginRight: "0.5rem" }}
            >
              <AddIcon style={{ fontSize: "20px" }} />
            </AppIcon>
            <p className='text-overline2 text-brand-secondary'>Add Parameter</p>
          </div>
        )}

        {/* <p className='w-28 text-overline2 mr-2'>Search</p> */}
      </div>

      <div className='mt-14 h-full'>
        {currentTab === "schema" ? (
          <Schema />
        ) : currentTab === "param" ? (
          <Parameters />
        ) : currentTab === "db" ? (
          <Database />
        ) : currentTab === "customParam" ? (
          <CustomParameters />
        ) : currentTab === "storedProcedures" ? (
          <StoredProcedures />
        ) : null}
      </div>
    </div>
  );
};

export default Match;
