import React from "react";

import FullMatch from "./FullMatch";
import PartialMatch from "./PartialMatch";
import NoMatch from "./NoMatch";

const Schema = () => {
  return (
    <div className='mx-4 py-4'>
      <div className='flex flex-row gap-x-5 justify-center'>
        <div className='flex-1 bg-neutral-gray7 rounded-md p-2'>
          <FullMatch />
        </div>

        <div className='flex-1 h-fit bg-neutral-gray7 rounded-md p-2 '>
          <PartialMatch />
        </div>

        <div className='flex-1 h-fit  bg-neutral-gray7 rounded-md p-2'>
          <NoMatch />
        </div>
      </div>
    </div>
  );
};

export default Schema;
