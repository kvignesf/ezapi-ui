import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "@material-ui/core";
import { useRecoilValue, useRecoilState } from "recoil";
import _ from "lodash";
import { useParams } from "react-router";

import Headers from "../Headers/Headers";
import PathParams from "../PathParams/PathParams";
import QueryParams from "../QueryParams/QueryParams";
import FormData from "../FormData/FormData";
import operationAtom from "../../operationAtom";
import Body from "../Body/Body";
import TabLabel from "../../../shared/components/TabLabel";
import LoaderWithMessage from "../../../shared/components/LoaderWithMessage";

const Request = ({
  getDetailsMutation: { isLoading: isLoadingOperationRequest },
}) => {
  const [currentTab, setTab] = useState(0);
  const operationState = useRecoilValue(operationAtom);

  if (isLoadingOperationRequest) {
    return (
      <div className='mt-24'>
        <LoaderWithMessage message={"Fetching details"} contained />
      </div>
    );
  }

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
              label={<TabLabel label={"Request Body"} />}
              style={{
                outline: "none",
              }}
            />
          )}
        </Tabs>
      </div>

      {currentTab === 0 && <Headers request={true} />}
      {currentTab === 1 && <FormData request={true} />}
      {currentTab === 2 && <PathParams request={true} />}
      {currentTab === 3 && <QueryParams request={true} />}
      {currentTab === 4 && <Body request={true} />}
    </div>
  );
};

export default Request;
