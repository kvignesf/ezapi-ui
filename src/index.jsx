import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
    {/* <div
      id='master'
      style={{ background: "yellow" }}
      onMouseEnter={(event) => {
        console.log("event.target.id", event.target.id);
        if (event.target.id === "master") {
          console.log("master", event);
        }
      }}
    >
      master
      <div
        id='parent'
        style={{ padding: "24px", background: "red" }}
        onMouseEnter={(event) => {
          if (event.target.id === "parent") {
            console.log("parent", event);
          }
        }}
      >
        parent
        <div
          id='child'
          style={{ padding: "24px", background: "green" }}
          onMouseEnter={(event) => {
            if (event.target.id === "child") {
              console.log("child", event);
            }
          }}
        >
          child
        </div>
      </div>
    </div> */}
  </React.StrictMode>,
  document.getElementById("root")
);
