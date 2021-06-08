import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "@material-ui/core";
import { useRecoilState } from "recoil";
import _ from "lodash";
import { useParams } from "react-router";
import AddIcon from "@material-ui/icons/Add";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import Headers from "../Headers/Headers";
import PathParams from "../PathParams/PathParams";
import QueryParams from "../QueryParams/QueryParams";
import FormData from "../FormData/FormData";
import operationAtom from "../../operationAtom";
import Body from "../Body/Body";
import TabLabel from "../../../shared/components/TabLabel";
import { useGetOperationResponse } from "../../operationRequestQuery";
import LoaderWithMessage from "../../../shared/components/LoaderWithMessage";
import AppIcon from "../../../shared/components/AppIcon";
import Colors from "../../../shared/colors";
import classNames from "classnames";

const Response = () => {
  const [currentTab, setTab] = useState(0);
  const [operationState, setOperationState] = useRecoilState(operationAtom);
  const [selectedResponseCode, setSelectedResponseCode] = useState(
    operationState?.operationResponse[0]?.responseCode ?? 200
  );
  const { id: projectId } = useParams();
  const {
    isLoading: isLoadingOperationResponse,
    data: operationData,
    mutate: getOperationDetails,
  } = useGetOperationResponse();

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
        const clonedResponseBody = _.cloneDeep(operationData.responseBody);

        // clonedResponseBody.headers = operationData?.responseBody?.headers.map(
        //   (header) => {
        //     return {
        //       ...header,
        //       possibleValues: header.possibleValues.reduce((acc, curr) => {
        //         if (acc) {
        //           return acc + ", " + curr;
        //         }
        //         return curr;
        //       }, ""),
        //     };
        //   }
        // );

        // clonedOperationState.operationResponse = {
        //   ...clonedResponseBody,
        // };

        return clonedOperationState;
      });
    }
  }, [operationData]);

  const addNewResponseCode = () => {};

  if (isLoadingOperationResponse) {
    return (
      <div className='mt-24'>
        <LoaderWithMessage message={"Fetching details"} contained />
      </div>
    );
  }

  return (
    <div>
      <div className='border-b-2 m-3 h-full'>
        <div className='flex flex-row w-min mb-2'>
          {operationState?.operationResponse?.map((item, index) => {
            return (
              <div
                className={classNames(
                  "p-1 pl-2 pr-2 flex flex-row items-center cursor-pointer",
                  {
                    "rounded-l-md": index === 0,

                    "bg-brand-primary":
                      item.responseCode === selectedResponseCode,
                    "border-2": item.responseCode !== selectedResponseCode,
                  },
                  "border-r-0"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setSelectedResponseCode(item.responseCode);
                }}
              >
                <p
                  className={classNames("text-overline2", {
                    "text-white": item.responseCode === selectedResponseCode,
                    "text-neutral-gray4":
                      item.responseCode !== selectedResponseCode,
                  })}
                >
                  {item.responseCode}
                </p>

                {item.responseCode !== 200 &&
                  item.responseCode === selectedResponseCode && (
                    <div className='ml-1 flex flex-row items-center'>
                      <AppIcon>
                        <MoreVertIcon
                          style={{ fontSize: "18px", color: "white" }}
                        />
                      </AppIcon>
                    </div>
                  )}
              </div>
            );
          })}

          <div className='p-1 pl-2 pr-2  flex flex-row items-center rounded-r-md border-2'>
            <AppIcon>
              <AddIcon
                style={{ fontSize: "18px", color: Colors.neutral.gray5 }}
              />
            </AppIcon>
          </div>
        </div>

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
            label={<TabLabel label={"Response Body"} />}
            style={{
              outline: "none",
            }}
          />
        </Tabs>
      </div>

      {currentTab === 0 && <Headers request={false} />}
      {currentTab === 1 && <Body request={false} />}
    </div>
  );
};

export default Response;
