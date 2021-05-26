import React, { useState } from "react";
import { Tab, Tabs } from "@material-ui/core";

import Headers from "../Headers/Headers";

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
          <Tab
            label={
              <span className='text-overline2 capitalize'>Request Body</span>
            }
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

export default Request;
