import React, { useState } from "react";
import { Tab, Tabs } from "@material-ui/core";
import { useRecoilValue } from "recoil";

import Headers from "../Headers/Headers";
import PathParams from "../PathParams/PathParams";
import QueryParams from "../QueryParams/QueryParams";
import FormData from "../FormData/FormData";
import operationAtom from "../../operationAtom";

const Request = () => {
  const [currentTab, setTab] = useState(0);
  const operationState = useRecoilValue(operationAtom);

  console.log("operationState.operation", operationState.operation);
  return (
    <div>
      <div className='border-b-2 m-3 h-full'>
        <Tabs
          value={currentTab}
          onChange={(_, index) => {
            setTab(index);
          }}
          aria-label='add project tabs'
          indicatorColor='primary'
          textColor='primary'
          style={{ width: "min-content" }}
        >
          <Tab
            label={<span className='text-overline2 capitalize'>Headers</span>}
            style={{
              outline: "none",
            }}
          />

          <Tab
            label={<span className='text-overline2 capitalize'>FormData</span>}
            style={{
              outline: "none",
            }}
          />
          <Tab
            label={
              <span className='text-overline2 capitalize'>Path Params</span>
            }
            style={{
              outline: "none",
            }}
          />
          <Tab
            label={
              <span className='text-overline2 capitalize'>QueryParams</span>
            }
            style={{
              outline: "none",
            }}
          />
          {operationState?.operation?.operationType?.toLowerCase() !==
            "get" && (
            <Tab
              label={
                <span className='text-overline2 capitalize'>Request Body</span>
              }
              style={{
                outline: "none",
              }}
            />
          )}
        </Tabs>
      </div>

      {currentTab === 0 && <Headers />}
      {currentTab === 1 && <FormData />}
      {currentTab === 2 && <QueryParams />}
      {currentTab === 3 && <PathParams />}
    </div>
  );
};

export default Request;
