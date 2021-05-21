import { Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import Schema from "./Schema";

const Match = (props) => {
  const [currentTab, setTab] = useState(0);

  return (
    <div className='flex-1 relative h-full' {...props}>
      <div className='flex justify-between items-center border-b-2'>
        <Tabs
          value={currentTab}
          onChange={(_, index) => {
            setTab(index);
          }}
          aria-label='schema tabs'
          indicatorColor='primary'
          textColor='primary'
        >
          <Tab
            label={<span className='text-overline2 capitalize'>Schema</span>}
            style={{ outline: "none", border: "none" }}
          />
          <Tab
            label={<span className='text-overline2 capitalize'>Parameter</span>}
            style={{ outline: "none", border: "none" }}
          />
          <Tab
            label={<span className='text-overline2 capitalize'>Database</span>}
            style={{ outline: "none", border: "none" }}
          />
        </Tabs>

        <div className='text-overline2 mr-2'>Search</div>
      </div>

      <div className='h-full'>{currentTab === 0 && <Schema />}</div>
    </div>
  );
};

export default Match;
