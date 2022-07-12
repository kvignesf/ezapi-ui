import React, { useState } from "react";
import { useDrag } from "react-dnd";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import classNames from "classnames";
import { Drawer } from "@material-ui/core";
import _ from "lodash";

import AppIcon from "../../../shared/components/AppIcon";
import Colors from "../../../shared/colors";
import AttributeIcon from "../../../static/images/attribute.svg";
import TableIcon from "../../../static/images/table-icon.svg";
import ColumnIcon from "../../../static/images/column-icon.svg";
import autoGenrateIcon from "../../../static/images/auto-generate.svg";
import {
  isArray,
  isAttribute,
  isColumn,
  isDatabase,
  isObject,
  isSchema,
  isStoredProcedure,
  useCanEdit,
} from "../../../shared/utils";

const StoredProcedureItem = ({
  index,
  section,
  item,
  primaryKey,
  onItemClick2,
}) => {
  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "drag_item",
      item: item,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [item]
  );
  const canEdit = useCanEdit();

  return (
    <div
      // ref={canEdit() ? drag : null}
      style={{
        backgroundColor: "white",
        opacity: isDragging ? 0.5 : 1,
      }}
      className='p-2 mb-2 rounded-md flex flex-row items-center'
      onClick={(e) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (section == 0) {
          onItemClick2(item);
        }
      }}
    >
      <img
        className='mr-2'
        src={TableIcon}
        style={{ width: "24px", height: "24px" }}
      />

      <p className='flex-1 text-overline3 mr-2 overflow-ellipsis'>
        {section == 0 ? item?.storedProcedure : item?.name}
      </p>
    </div>
  );
};

export default StoredProcedureItem;
