import React from "react";
import { IconButton } from "@material-ui/core";

const AppIcon = ({ children, style, ...rest }) => {
  return (
    <IconButton
      disableTouchRipple
      style={{
        padding: 0,
        margin: 0,
        border: "none",
        outline: "none",
        ...style,
      }}
      {...rest}
    >
      {children}
    </IconButton>
  );
};
export default AppIcon;
