import React from "react";
import { useDrag } from "react-dnd";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import classNames from "classnames";

import AppIcon from "../../shared/components/AppIcon";
import Colors from "../../shared/colors";
import AttributeIcon from "../../static/images/attribute.svg";
import SchemaIcon from "../../static/images/schema-icon.svg";

const DraggableMatchItem = ({ index, type, matchType, item, ...rest }) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: "BOX",
    item: item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragPreview}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: type === "ref" || type === "array" ? "pointer" : null,
      }}
      {...rest}
    >
      <div role='Handle' ref={drag}>
        <div
          key={index}
          className='p-2 mb-2 rounded-md bg-white flex flex-row items-center'
        >
          <AppIcon className='mr-1 opacity-50'>
            <DragIndicatorIcon
              className='cursor-move'
              style={{ height: "1.25rem" }}
            />
          </AppIcon>

          <img
            className='mr-2'
            src={
              type === "ref" || type === "array" ? SchemaIcon : AttributeIcon
            }
            style={{ width: "24px", height: "24px" }}
          />

          <p className='flex-1 text-overline3 mr-2 overflow-ellipsis'>
            {item?.name} {type === "array" ? " [ ]" : ""}
          </p>

          <div
            className={classNames(" w-12 max-w-3 h-6 rounded-sm", {
              "bg-brand-green": matchType === "full_match",
              "bg-score-yellow": matchType === "partial_match",
              "bg-score-red": matchType === "no_match",
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default DraggableMatchItem;
