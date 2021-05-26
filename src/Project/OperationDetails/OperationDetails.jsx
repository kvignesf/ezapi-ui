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
import { useRecoilValue } from "recoil";
import operationAtom from "../operationAtom";

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

  return (
    <div className={`border-t-2 ${className}`} {...props}>
      {operationState?.resource &&
        operationState?.path &&
        operationState?.operation && (
          <>
            <div className='flex flex-row'>
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
                  label={
                    <span className='text-overline2 capitalize'>Request</span>
                  }
                  classes={{ root: tabClasses.tab }}
                  style={{
                    borderRight: `2px solid ${Colors.neutral.gray6}`,
                    outline: "none",
                  }}
                />

                <Tab
                  label={
                    <span className='text-overline2 capitalize'>Response</span>
                  }
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
              <div>
                <Request />
              </div>
            ) : (
              <div>Response</div>
            )}
          </>
        )}
    </div>
  );
};

export default OperationDetails;
