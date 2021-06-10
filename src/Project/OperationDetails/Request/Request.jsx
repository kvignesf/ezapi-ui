import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "@material-ui/core";
import { useRecoilState } from "recoil";
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
import { useGetOperationRequest } from "../../operationRequestQuery";

const Request = () => {
  const [currentTab, setTab] = useState(0);
  const { id: projectId } = useParams();
  const [operationState, setOperationState] = useRecoilState(operationAtom);
  const {
    isLoading: isLoadingOperationRequest,
    data: operationData,
    mutate: getOperationDetails,
  } = useGetOperationRequest();

  useEffect(() => {
    if (operationState?.operationIndex && operationState?.operation) {
      getOperationDetails({
        operationId: operationState.operation.operationId,
        pathId: operationState.path.pathId,
        resourceId: operationState.resource.resourceId,
        projectId: projectId,
      });
    }
  }, []);

  useEffect(() => {
    if (operationData) {
      setOperationState((operationState) => {
        const clonedOperationState = _.cloneDeep(operationState);
        const clonedRequestBody = _.cloneDeep(operationData.requestBody);

        clonedRequestBody.headers = operationData.requestBody.headers.map(
          (header) => {
            return {
              ...header,
              possibleValues: header.possibleValues.reduce((acc, curr) => {
                if (acc) {
                  return acc + ", " + curr;
                }
                return curr;
              }, ""),
            };
          }
        );

        clonedOperationState.operationRequest = {
          ...clonedRequestBody,
        };

        return clonedOperationState;
      });
    }
  }, [operationData]);

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
