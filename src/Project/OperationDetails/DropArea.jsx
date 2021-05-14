import React from "react";
import { useDrop } from "react-dnd";

const DropArea = ({ children }) => {
  const [collectedProps, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: "BOX",
    drop: (item, monitor) => {
      console.log("item", item);
    },
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div ref={drop} role={"Dustbin"}>
      Drag a box here
    </div>
  );
};

export default DropArea;
