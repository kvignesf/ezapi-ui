import React, { useState } from "react";
import SortableList from "react-sortable-dnd-list";

import DraggableItem from "./DraggableItem";

const Schema = (props) => {
  const [items, setItems] = useState([
    { id: 1, name: "name" },
    { id: 2, name: "age" },
    { id: 3, name: "sex" },
  ]);

  return (
    <div {...props}>
      <p>Schema</p>
    </div>
  );
};

export default Schema;
