import React, { useState } from "react";
import {
  AppBar,
  IconButton,
  Tab,
  Tabs,
  MuiThemeProvider,
  makeStyles,
} from "@material-ui/core";
import Colors from "../../shared/colors";
import Request from "./Request/Request";
import Response from "./Response/Response";
import { useRecoilValue } from "recoil";
import operationAtom from "../operationAtom";
import { useGetOperationRequest } from "../operationRequestQuery";
import TabLabel from "../../shared/components/TabLabel";

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
  const tabsClasses = tabsStyles();
  const tabClasses = tabStyles();
  const [currentTab, setTab] = useState(0);
  const operationState = useRecoilValue(operationAtom);
  // const { isLoading: isFetchingOperationRequest } = useGetOperationRequest(
  //   operationState?.operation?.operationId
  // );

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
                <Request />
              </div>
            ) : (
              <div className='h-full'>
                <Response />
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default OperationDetails;
