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
import Headers from "./Headers/Headers";

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

const Request = () => {
  const [currentTab, setTab] = useState(0);

  return (
    <div>
      <div className='border-b-2 m-3'>
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
            label='Headers'
            style={{
              outline: "none",
            }}
          />

          <Tab
            label='FormData'
            style={{
              outline: "none",
            }}
          />
          <Tab
            label='Path Params'
            style={{
              outline: "none",
            }}
          />
          <Tab
            label='Query Params'
            style={{
              outline: "none",
            }}
          />
          <Tab
            label='Request Body'
            style={{
              outline: "none",
            }}
          />
        </Tabs>
      </div>

      {currentTab === 0 ? <Headers /> : null}
    </div>
  );
};

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
  //   if (!id) {
  //     return null;
  //   }

  return (
    <div className={`border-t-2 ${className}`} {...props}>
      {resource && path && operation && (
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
                label='Request'
                classes={{ root: tabClasses.tab }}
                style={{
                  borderRight: `2px solid ${Colors.neutral.gray6}`,
                  outline: "none",
                }}
              />

              <Tab
                label='Response'
                classes={{ root: tabClasses.tab }}
                style={{
                  outline: "none",
                  borderRight: `2px solid ${Colors.neutral.gray6}`,
                }}
              />
            </Tabs>

            <div className='flex-1 flex flex-row pr-2 bg-neutral-gray7 items-center justify-end'>
              <p className='text-overline2 text-neutral-gray4'>
                {`${resource?.resourceName} / ${path?.pathName} / ${operation?.operationName}`}
              </p>
            </div>
          </div>

          {currentTab === 0 ? <div>Request</div> : <div>Response</div>}
        </>
      )}
    </div>
  );
};

export default OperationDetails;
