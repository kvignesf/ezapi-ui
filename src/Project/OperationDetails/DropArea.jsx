import React from "react";
import { useDrop } from "react-dnd";

const DropArea = ({ children, onItemDropped, ...rest }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "drag_item",
    drop: (item, monitor) => {
      onItemDropped(item);
    },
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div ref={drop} style={{ opacity: isOver ? 0.6 : 1 }} {...rest}>
      {children}
    </div>
  );
};

export default DropArea;
