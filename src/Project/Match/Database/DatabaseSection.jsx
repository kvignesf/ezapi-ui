import React from "react";
import Scrollbar from "react-smooth-scrollbar";
import { useRecoilValue } from "recoil";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

import operationAtom from "../../operationAtom";
import AppIcon from "../../../shared/components/AppIcon";
import DraggableDatabaseItem from "./DraggableDatabaseItem";
import {
  isAttribute,
  isDatabase,
  operationAtomWithMiddleware,
} from "../../../shared/utils";
import _ from "lodash";

const DatabaseSection = ({ items, onItemClick, section }) => {
  const operationState = useRecoilValue(operationAtomWithMiddleware);

  const isItemsTypeTable = () => {
    if (items && !_.isEmpty(items)) {
      const firstItem = items[0];

      return isDatabase(firstItem);
    }
    return null;
  };

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row justify-between'>
        <p className='text-overline2 mb-2'>
          {isItemsTypeTable() === null
            ? "-"
            : isItemsTypeTable()
            ? "Tables"
            : "Columns"}
        </p>
        <p className='text-overline2'>{items?.length}</p>
      </div>

      {items && (
        <Scrollbar>
          <div
            style={{
              height:
                !operationState?.operationIndex && items?.length > 0
                  ? `calc(100vh - 230px)`
                  : null,
              maxHeight: operationState?.operationIndex
                ? `calc(50vh - 180px)`
                : null,
            }}
          >
            {items?.map((item, index) => {
              return (
                <DraggableDatabaseItem
                  index={index}
                  item={item}
                  section={section}
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

export default DatabaseSection;
