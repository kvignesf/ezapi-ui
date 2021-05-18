import React from "react";
import { useDrop } from "react-dnd";

const DropArea = ({ children, onItemDropped }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: "BOX",
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
    <div ref={drop} role={"Dustbin"}>
      {children}
    </div>
  );
};

export default DropArea;
