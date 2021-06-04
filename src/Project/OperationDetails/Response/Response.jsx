import React, { useState } from "react";
import { Tab, Tabs } from "@material-ui/core";
import { useRecoilValue } from "recoil";

import Headers from "../Headers/Headers";
import PathParams from "../PathParams/PathParams";
import QueryParams from "../QueryParams/QueryParams";
import FormData from "../FormData/FormData";
import operationAtom from "../../operationAtom";
import Body from "../Body/Body";
import TabLabel from "../../../shared/components/TabLabel";

const Response = () => {
  const [currentTab, setTab] = useState(0);
  const operationState = useRecoilValue(operationAtom);

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
            label={<TabLabel label={"Headers"} />}
            style={{
              outline: "none",
            }}
          />

          <Tab
            label={<TabLabel label={"Form Data"} />}
            style={{
              outline: "none",
            }}
          />
          <Tab
            label={<TabLabel label={"Path Params"} />}
            style={{
              outline: "none",
            }}
          />
          <Tab
            label={<TabLabel label={"Query Params"} />}
            style={{
              outline: "none",
            }}
          />
          {operationState?.operation?.operationType?.toLowerCase() !==
            "get" && (
            <Tab
              label={<TabLabel label={"Response Body"} />}
              style={{
                outline: "none",
              }}
            />
          )}
        </Tabs>
      </div>

      {currentTab === 0 && <Headers request={false} />}
      {currentTab === 1 && <FormData request={false} />}
      {currentTab === 2 && <QueryParams request={false} />}
      {currentTab === 3 && <PathParams request={false} />}
      {currentTab === 4 && <Body request={false} />}
    </div>
  );
};

export default Response;
