import React from "react";
import Scrollbar from "react-smooth-scrollbar";
import { useRecoilValue } from "recoil";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

import operationAtom from "../../operationAtom";
import AppIcon from "../../../shared/components/AppIcon";
import DraggableSchemaMatchItem from "../DraggableSchemaMatchItem";
import { operationAtomWithMiddleware } from "../../../shared/utils";

const NoMatch = ({ items, onItemClick }) => {
  const operationState = useRecoilValue(operationAtomWithMiddleware);

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row justify-between'>
        <p className='text-overline2 mb-2'>No Match</p>
        <p className='text-overline2'>{items?.length}</p>
      </div>

      {items && (
        <Scrollbar>
          <div
            style={{
              height: !operationState?.operationIndex
                ? `calc(100vh - 180px)`
                : null,
              maxHeight: operationState?.operationIndex
                ? `calc(50vh - 150px)`
                : null,
            }}
          >
            {items?.map((item, index) => {
              return (
                <DraggableSchemaMatchItem
                  key={index}
                  index={index}
                  item={item}
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();

                    onItemClick(item);
                  }}
                />
              );
            })}
          </div>
        </Scrollbar>
      )}
    </div>
  );
};

export default NoMatch;
