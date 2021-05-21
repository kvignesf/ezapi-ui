import React from "react";
import Scrollbar from "react-smooth-scrollbar";
import { useRecoilValue } from "recoil";

import operationAtom from "../../operationAtom";

const FullMatch = () => {
  const operationState = useRecoilValue(operationAtom);

  console.log("operationState", operationState);
  return (
    <div className='flex flex-col'>
      <p className='text-overline2'>Full Match</p>

      <Scrollbar>
        <div
          style={{
            height: !operationState?.index ? "h-full" : null,
            maxHeight: operationState?.index ? `calc(50vh - 150px)` : null,
          }}
        ></div>
      </Scrollbar>
    </div>
  );
};

export default FullMatch;
