import { Tab, Tabs } from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import Schema from "./Schema";
import schemaAtom from "./Schema/schemaAtom";
import AppIcon from "../../shared/components/AppIcon";
import classNames from "classnames";
import { isArray } from "../../shared/utils";

const Match = (props) => {
  const [currentTab, setTab] = useState(0);
  const [schemaState, setSchemaState] = useRecoilState(schemaAtom);

  return (
    <div className='flex-1 relative h-full' {...props}>
      <div
        className={classNames("flex justify-between items-center border-b-2", {
          "p-3": schemaState?.selected && !_.isEmpty(schemaState?.selected),
        })}
      >
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
                        const itemIndex = updatedSchemaState.selected.findIndex(
                          (item) => item?.name === schema?.name
                        );

                        if (itemIndex >= 0) {
                          updatedSchemaState.selected = _.cloneDeep(
                            updatedSchemaState.selected.slice(0, itemIndex + 1)
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
        ) : (
          <Tabs
            value={currentTab}
            onChange={(_, index) => {
              setTab(index);
            }}
            aria-label='schema tabs'
            indicatorColor='primary'
            textColor='primary'
          >
            <Tab
              label={<span className='text-overline2 capitalize'>Schema</span>}
              style={{ outline: "none", border: "none" }}
            />
            <Tab
              label={
                <span className='text-overline2 capitalize'>Parameter</span>
              }
              style={{ outline: "none", border: "none" }}
            />
            <Tab
              label={
                <span className='text-overline2 capitalize'>Database</span>
              }
              style={{ outline: "none", border: "none" }}
            />
          </Tabs>
        )}

        <div className='text-overline2 mr-2'>Search</div>
      </div>

      <div className='h-full'>{currentTab === 0 && <Schema />}</div>
    </div>
  );
};

export default Match;
