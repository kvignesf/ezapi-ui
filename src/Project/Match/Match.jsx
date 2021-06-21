import { Tab, Tabs } from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/Add";
import { Dialog } from "@material-ui/core";

import Schema from "./Schema";
import schemaAtom from "../../shared/atom/schemaAtom";
import AppIcon from "../../shared/components/AppIcon";
import classNames from "classnames";
import { isArray } from "../../shared/utils";
import TabLabel from "../../shared/components/TabLabel";
import Parameters from "./Parameters/Parameters";
import Colors from "../../shared/colors";
import AddOrEditParameter from "./Parameters/AddOrEditParameter/AddOrEditParameter";
import Database from "./Database/Database";
import tableAtom from "../../shared/atom/tableAtom";

const Match = (props) => {
  const [currentTab, setTab] = useState(0);
  const [schemaState, setSchemaState] = useRecoilState(schemaAtom);
  const resetSchemaState = useResetRecoilState(schemaAtom);
  const [tableState, setTableState] = useRecoilState(tableAtom);
  const resetTableState = useResetRecoilState(tableAtom);
  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });

  const showAddParameterDialog = () => {
    setDialog({
      show: true,
      type: "add-parameter",
    });
  };

  const handleCloseDialog = () => {
    setDialog({
      show: false,
      data: null,
    });
  };

  return (
    <div className='flex-1 relative h-full' {...props}>
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
        {dialog?.type === "add-parameter" && (
          <AddOrEditParameter onClose={handleCloseDialog} />
        )}
      </Dialog>

      <div
        className={classNames("flex justify-between items-center border-b-2", {
          "p-3": schemaState?.selected && !_.isEmpty(schemaState?.selected),
        })}
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
                      {tableState?.selected?.table}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Tabs
              value={currentTab}
              onChange={(_, index) => {
                setTab(index);
                resetSchemaState();
              }}
              aria-label='schema tabs'
              indicatorColor='primary'
              textColor='primary'
            >
              <Tab
                label={<TabLabel label={"Schema"} />}
                style={{ outline: "none", border: "none" }}
              />
              <Tab
                label={<TabLabel label={"Parameters"} />}
                style={{ outline: "none", border: "none" }}
              />
              <Tab
                label={<TabLabel label={"Database"} />}
                style={{ outline: "none", border: "none" }}
              />
            </Tabs>
          )}
        </div>

        {currentTab === 1 && (
          <div
            className='flex flex-row items-center cursor-pointer hover:opacity-80 mr-4 border-1 rounded-md border-brand-secondary px-2 py-2'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              showAddParameterDialog();
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

        <div className='text-overline2 mr-2'>Search</div>
      </div>

      <div className='h-full'>
        {currentTab === 0 ? (
          <Schema />
        ) : currentTab === 1 ? (
          <Parameters />
        ) : currentTab === 2 ? (
          <Database />
        ) : null}
      </div>
    </div>
  );
};

export default Match;
