import React, { useState } from "react";
import SortableList from "react-sortable-dnd-list";

import DraggableItem from "./DraggableItem";

const Match = (props) => {
  const [items, setItems] = useState([
    { id: 1, name: "name" },
    { id: 2, name: "age" },
    { id: 3, name: "sex" },
  ]);

  return (
    <div {...props}>
      <SortableList
        className='list'
        itemComponent={(item) => <DraggableItem item={item.children} />}
        value={items}
        onChange={setItems}
      />
    </div>
  );
};

export default Match;
