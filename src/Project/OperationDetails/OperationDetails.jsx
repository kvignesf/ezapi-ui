import React, { useState, useEffect } from "react";
import { Tab, Tabs, makeStyles } from "@material-ui/core";
import { useParams } from "react-router";
import _ from "lodash";
import { useRecoilState } from "recoil";

import Colors from "../../shared/colors";
import {
  parseGetOperationRequestResponse,
  parseGetOperationResponseResponse,
} from "../../shared/utils";
import Request from "./Request/Request";
import Response from "./Response/Response";
import operationAtom from "../operationAtom";
import {
  useGetOperationRequest,
  useGetOperationResponse,
} from "../../shared/query/operationDetailsQuery";
import TabLabel from "../../shared/components/TabLabel";
import Constants from "../../shared/constants";

const tabsStyles = makeStyles({
  indicator: {
    top: "0px",
  },
});

const tabStyles = makeStyles({
  tab: {
    background: Colors.neutral.gray7,
    "&.Mui-selected": {
      background: "white",
    },
  },
});

const OperationDetails = ({
  resource,
  path,
  operation,
  className,
  ...props
}) => {
  const { id: projectId } = useParams();
  const tabsClasses = tabsStyles();
  const tabClasses = tabStyles();
  const [currentTab, setTab] = useState(0);
  const [operationState, setOperationState] = useRecoilState(operationAtom);
  const getRequestMutation = useGetOperationRequest();
  const getResponseMutation = useGetOperationResponse();

  useEffect(() => {
    if (operationState?.operationIndex && operationState?.operation) {
      getRequestMutation.mutate({
        operationId: operationState.operation.operationId,
        pathId: operationState.path.pathId,
        resourceId: operationState.resource.resourceId,
        projectId: projectId,
      });

      getResponseMutation.mutate({
        operationId: operationState.operation.operationId,
        pathId: operationState.path.pathId,
        resourceId: operationState.resource.resourceId,
        projectId: projectId,
      });
    }
  }, []);

  useEffect(() => {
    if (getResponseMutation.data) {
      const operationData = getResponseMutation.data;

      setOperationState((operationState) => {
        const clonedOperationState = _.cloneDeep(operationState);
        let parsedOperationResponse = parseGetOperationResponseResponse(
          operationData?.responseBody
        );

        if (!parsedOperationResponse || _.isEmpty(parsedOperationResponse)) {
          parsedOperationResponse = [
            {
              responseCode: Constants.mandatoryResponseCode,
              headers: [],
              body: [],
            },
          ];
        }

        clonedOperationState.operationResponse = parsedOperationResponse;

        return clonedOperationState;
      });
    }
  }, [getResponseMutation?.data]);

  useEffect(() => {
    if (getRequestMutation.data) {
      const operationData = getRequestMutation.data;

      setOperationState((operationState) => {
        const clonedOperationState = _.cloneDeep(operationState);
        const parsedOperationRequest = parseGetOperationRequestResponse(
          operationData?.requestBody
        );

        clonedOperationState.operationRequest = parsedOperationRequest;

        return clonedOperationState;
      });
    }
  }, [getRequestMutation?.data]);

  return (
    <div className={`border-t-2 h-full ${className}`} {...props}>
      {operationState?.resource &&
        operationState?.path &&
        operationState?.operation && (
          <div>
            <div className='h-full flex flex-row'>
              <Tabs
                classes={{
                  indicator: tabsClasses.indicator,
                }}
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
                  label={<TabLabel label={"Request"} />}
                  classes={{ root: tabClasses.tab }}
                  style={{
                    borderRight: `2px solid ${Colors.neutral.gray6}`,
                    outline: "none",
                  }}
                />

                <Tab
                  label={<TabLabel label={"Response"} />}
                  classes={{ root: tabClasses.tab }}
                  style={{
                    outline: "none",
                    borderRight: `2px solid ${Colors.neutral.gray6}`,
                  }}
                />
              </Tabs>

              <div className='flex-1 flex flex-row pr-2 bg-neutral-gray7 items-center justify-end'>
                <p className='text-overline2 text-neutral-gray4'>
                  {`${operationState?.resource?.resourceName} / ${operationState?.path?.pathName} /`}
                </p>
                <span className='ml-1 text-overline2'>{`${operationState?.operation?.operationName}`}</span>
              </div>
            </div>

            {currentTab === 0 ? (
              <div className='h-full'>
                <Request getDetailsMutation={getRequestMutation} />
              </div>
            ) : (
              <div className='h-full'>
                <Response getDetailsMutation={getResponseMutation} />
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default OperationDetails;
